#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use include_dir::{include_dir, Dir};
use serde::Serialize;
use std::{
    collections::HashSet,
    env, fs,
    path::{Path, PathBuf},
    process::Command,
    sync::Mutex,
};
use tauri::{ipc::Channel, AppHandle, State};
use tauri_plugin_updater::{Update, UpdaterExt};

struct PendingUpdate(Mutex<Option<Update>>);

static EMBEDDED_STANDARDS: Dir<'_> =
    include_dir!("$CARGO_MANIFEST_DIR/../node_modules/devcanon/.ai");

const ROOT_AGENTS: &str = r#"# Repository AI Instructions

The authoritative AI engineering standards for this repository are in [`.ai/AGENTS.md`](.ai/AGENTS.md).

Before planning or modifying code, read `.ai/AGENTS.md`, `.ai/project-rules.md`, and every standard relevant to the task. Existing repository conventions remain authoritative where the standards require local adaptation.
"#;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct StudioInfo {
    version: String,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct EditorInfo {
    id: &'static str,
    name: &'static str,
    available: bool,
}

struct EditorDefinition {
    id: &'static str,
    name: &'static str,
    command: &'static str,
    mac_app: &'static str,
}

const EDITORS: &[EditorDefinition] = &[
    EditorDefinition {
        id: "vscode",
        name: "Visual Studio Code",
        command: "code",
        mac_app: "Visual Studio Code",
    },
    EditorDefinition {
        id: "cursor",
        name: "Cursor",
        command: "cursor",
        mac_app: "Cursor",
    },
    EditorDefinition {
        id: "conductor",
        name: "Conductor",
        command: "conductor",
        mac_app: "Conductor",
    },
    EditorDefinition {
        id: "windsurf",
        name: "Windsurf",
        command: "windsurf",
        mac_app: "Windsurf",
    },
    EditorDefinition {
        id: "zed",
        name: "Zed",
        command: "zed",
        mac_app: "Zed",
    },
];

const SKIPPED_DISCOVERY_DIRECTORIES: &[&str] = &[
    ".cache",
    ".git",
    ".gradle",
    ".local",
    ".npm",
    ".rustup",
    ".Trash",
    ".yarn",
    "AppData",
    "Applications",
    "Library",
    "node_modules",
    "target",
];

fn discovery_home() -> Option<PathBuf> {
    env::var_os(if cfg!(windows) { "USERPROFILE" } else { "HOME" }).map(PathBuf::from)
}

fn command_path(command: &str) -> Option<PathBuf> {
    let path = env::var_os("PATH")?;
    let extensions: Vec<String> = if cfg!(windows) {
        env::var("PATHEXT")
            .unwrap_or_else(|_| ".EXE;.CMD;.BAT;.COM".to_string())
            .split(';')
            .map(str::to_lowercase)
            .collect()
    } else {
        vec![String::new()]
    };
    for directory in env::split_paths(&path) {
        for extension in &extensions {
            let candidate = directory.join(format!("{command}{extension}"));
            if candidate.is_file() {
                return Some(candidate);
            }
        }
    }
    None
}

#[cfg(target_os = "macos")]
fn mac_app_path(name: &str) -> Option<PathBuf> {
    let bundle = format!("{name}.app");
    let mut locations = vec![PathBuf::from("/Applications").join(&bundle)];
    if let Some(home) = discovery_home() {
        locations.push(home.join("Applications").join(&bundle));
    }
    locations.into_iter().find(|path| path.is_dir())
}

fn editor_available(editor: &EditorDefinition) -> bool {
    #[cfg(target_os = "macos")]
    if mac_app_path(editor.mac_app).is_some() {
        return true;
    }
    command_path(editor.command).is_some()
}

fn discover_in(directory: &Path, projects: &mut HashSet<PathBuf>) {
    let Ok(entries) = fs::read_dir(directory) else {
        return;
    };
    for entry in entries.flatten() {
        let path = entry.path();
        let Ok(file_type) = entry.file_type() else {
            continue;
        };
        if !file_type.is_dir() || file_type.is_symlink() {
            continue;
        }
        if path.join(".ai").join("AGENTS.md").is_file() {
            projects.insert(path);
            continue;
        }
        let name = entry.file_name();
        let name = name.to_string_lossy();
        if SKIPPED_DISCOVERY_DIRECTORIES.contains(&name.as_ref()) {
            continue;
        }
        discover_in(&path, projects);
    }
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct UpdateInfo {
    version: String,
    current_version: String,
    notes: Option<String>,
    date: Option<String>,
}

#[derive(Clone, Serialize)]
#[serde(tag = "event", content = "data")]
enum DownloadEvent {
    #[serde(rename_all = "camelCase")]
    Started {
        content_length: Option<u64>,
    },
    #[serde(rename_all = "camelCase")]
    Progress {
        chunk_length: usize,
    },
    Finished,
}

fn handbook_root(project: &str) -> Result<PathBuf, String> {
    let project = PathBuf::from(project);
    let root = project.join(".ai");
    if !root.is_dir() {
        return Err(format!(
            "No .ai handbook was found in {}. Run devcanon init there first.",
            project.display()
        ));
    }
    Ok(root)
}

fn collect_markdown(root: &Path, directory: &Path, files: &mut Vec<String>) -> Result<(), String> {
    for entry in fs::read_dir(directory).map_err(|error| error.to_string())? {
        let path = entry.map_err(|error| error.to_string())?.path();
        if path.is_dir() {
            collect_markdown(root, &path, files)?;
        } else if path.extension().and_then(|value| value.to_str()) == Some("md") {
            files.push(
                path.strip_prefix(root)
                    .map_err(|error| error.to_string())?
                    .to_string_lossy()
                    .replace('\\', "/"),
            );
        }
    }
    Ok(())
}

fn standard_path(project: &str, relative: &str) -> Result<PathBuf, String> {
    if !relative.ends_with(".md") || relative.contains("..") || Path::new(relative).is_absolute() {
        return Err("Choose a Markdown standard from the handbook.".into());
    }
    let root = handbook_root(project)?;
    let path = root.join(relative);
    if !path.starts_with(&root) {
        return Err("That file is outside the handbook.".into());
    }
    Ok(path)
}

#[tauri::command]
fn choose_project() -> Option<String> {
    rfd::FileDialog::new()
        .pick_folder()
        .map(|path| path.to_string_lossy().into_owned())
}

#[tauri::command]
async fn discover_projects() -> Result<Vec<String>, String> {
    let home =
        discovery_home().ok_or_else(|| "Studio could not locate your home folder.".to_string())?;
    tauri::async_runtime::spawn_blocking(move || {
        let mut projects = HashSet::new();
        discover_in(&home, &mut projects);
        let mut projects: Vec<String> = projects
            .into_iter()
            .map(|path| path.to_string_lossy().into_owned())
            .collect();
        projects.sort_by_key(|path| path.to_lowercase());
        projects
    })
    .await
    .map_err(|error| format!("Project discovery could not finish: {error}"))
}

#[tauri::command]
fn studio_info(app: AppHandle) -> StudioInfo {
    StudioInfo {
        version: app.package_info().version.to_string(),
    }
}

#[tauri::command]
fn list_editors() -> Vec<EditorInfo> {
    EDITORS
        .iter()
        .map(|editor| EditorInfo {
            id: editor.id,
            name: editor.name,
            available: editor_available(editor),
        })
        .collect()
}

#[tauri::command]
fn open_in_editor(project: String, editor: String) -> Result<(), String> {
    let project = PathBuf::from(project);
    if !project.is_dir() {
        return Err("The selected project folder no longer exists.".to_string());
    }
    let definition = EDITORS
        .iter()
        .find(|candidate| candidate.id == editor)
        .ok_or_else(|| "Choose a supported code editor.".to_string())?;

    #[cfg(target_os = "macos")]
    if mac_app_path(definition.mac_app).is_some() {
        Command::new("open")
            .args(["-a", definition.mac_app])
            .arg(&project)
            .spawn()
            .map_err(|error| format!("Could not open {}: {error}", definition.name))?;
        return Ok(());
    }

    let executable = command_path(definition.command)
        .ok_or_else(|| format!("{} is not installed or available on PATH.", definition.name))?;
    Command::new(executable)
        .arg(&project)
        .spawn()
        .map_err(|error| format!("Could not open {}: {error}", definition.name))?;
    Ok(())
}

fn run_devcanon(command: &str, project: &str) -> Result<String, String> {
    let executable = if cfg!(windows) {
        "devcanon.cmd"
    } else {
        "devcanon"
    };
    let output = Command::new(executable)
        .args([command, project])
        .output()
        .map_err(|_| {
            "Devcanon CLI is not installed. Install it with: npm install --global devcanon"
                .to_string()
        })?;
    let message = String::from_utf8_lossy(if output.status.success() {
        &output.stdout
    } else {
        &output.stderr
    })
    .trim()
    .to_string();
    if output.status.success() {
        Ok(message)
    } else {
        Err(if message.is_empty() {
            format!("Devcanon {command} could not be completed.")
        } else {
            message
        })
    }
}

fn install_embedded_directory(source: &Dir<'_>, destination: &Path) -> Result<(), String> {
    fs::create_dir_all(destination)
        .map_err(|error| format!("Studio could not create {}: {error}", destination.display()))?;
    for file in source.files() {
        let name = file
            .path()
            .file_name()
            .ok_or_else(|| "A bundled standard has an invalid file name.".to_string())?;
        let target = destination.join(name);
        if !target.exists() {
            fs::write(&target, file.contents())
                .map_err(|error| format!("Studio could not write {}: {error}", target.display()))?;
        }
    }
    for directory in source.dirs() {
        let name = directory
            .path()
            .file_name()
            .ok_or_else(|| "A bundled standards folder has an invalid name.".to_string())?;
        install_embedded_directory(directory, &destination.join(name))?;
    }
    Ok(())
}

fn initialize_project_at(project: &Path) -> Result<(), String> {
    if project.parent().is_none() {
        return Err("Choose a project folder instead of the filesystem root.".to_string());
    }
    if !project.is_dir() {
        return Err(format!(
            "The selected project folder does not exist: {}",
            project.display()
        ));
    }
    install_embedded_directory(&EMBEDDED_STANDARDS, &project.join(".ai"))?;
    let root_agents = project.join("AGENTS.md");
    if !root_agents.exists() {
        fs::write(&root_agents, ROOT_AGENTS).map_err(|error| {
            format!(
                "Studio initialized the handbook but could not create {}: {error}",
                root_agents.display()
            )
        })?;
    }
    handbook_root(&project.to_string_lossy())?;
    Ok(())
}

#[tauri::command]
fn initialize_project() -> Result<Option<String>, String> {
    let Some(path) = rfd::FileDialog::new().pick_folder() else {
        return Ok(None);
    };
    let project = path.to_string_lossy().into_owned();
    initialize_project_at(&path)?;
    Ok(Some(project))
}

#[tauri::command]
fn list_standards(project: String) -> Result<Vec<String>, String> {
    let root = handbook_root(&project)?;
    let mut files = Vec::new();
    collect_markdown(&root, &root, &mut files)?;
    files.sort();
    Ok(files)
}

#[tauri::command]
fn read_standard(project: String, relative: String) -> Result<String, String> {
    fs::read_to_string(standard_path(&project, &relative)?).map_err(|error| error.to_string())
}

#[tauri::command]
fn write_standard(project: String, relative: String, contents: String) -> Result<(), String> {
    fs::write(standard_path(&project, &relative)?, contents).map_err(|error| error.to_string())
}

#[tauri::command]
fn update_standards(project: String) -> Result<String, String> {
    handbook_root(&project)?;
    run_devcanon("update", &project)
}

#[tauri::command]
async fn check_for_app_update(
    app: AppHandle,
    pending: State<'_, PendingUpdate>,
) -> Result<Option<UpdateInfo>, String> {
    let update = app
        .updater()
        .map_err(|error| error.to_string())?
        .check()
        .await
        .map_err(|error| error.to_string())?;
    let info = update.as_ref().map(|item| UpdateInfo {
        version: item.version.clone(),
        current_version: item.current_version.clone(),
        notes: item.body.clone(),
        date: item.date.map(|date| date.to_string()),
    });
    *pending
        .0
        .lock()
        .map_err(|_| "The update state is unavailable.".to_string())? = update;
    Ok(info)
}

#[tauri::command]
async fn install_app_update(
    app: AppHandle,
    pending: State<'_, PendingUpdate>,
    on_event: Channel<DownloadEvent>,
) -> Result<(), String> {
    let update = pending
        .0
        .lock()
        .map_err(|_| "The update state is unavailable.".to_string())?
        .take()
        .ok_or_else(|| "Check for an update before installing it.".to_string())?;
    let mut started = false;
    update
        .download_and_install(
            |chunk_length, content_length| {
                if !started {
                    let _ = on_event.send(DownloadEvent::Started { content_length });
                    started = true;
                }
                let _ = on_event.send(DownloadEvent::Progress { chunk_length });
            },
            || {
                let _ = on_event.send(DownloadEvent::Finished);
            },
        )
        .await
        .map_err(|error| error.to_string())?;
    app.restart();
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_updater::Builder::new().build())
        .manage(PendingUpdate(Mutex::new(None)))
        .invoke_handler(tauri::generate_handler![
            studio_info,
            list_editors,
            open_in_editor,
            discover_projects,
            choose_project,
            initialize_project,
            list_standards,
            read_standard,
            write_standard,
            update_standards,
            check_for_app_update,
            install_app_update
        ])
        .run(tauri::generate_context!())
        .expect("error while running Devcanon Studio");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn discovery_finds_handbooks_and_skips_dependency_trees() {
        let root = env::temp_dir().join(format!("devcanon-discovery-{}", std::process::id()));
        let project = root.join("work").join("my-project");
        let dependency = root.join("work").join("node_modules").join("not-a-project");
        fs::create_dir_all(project.join(".ai")).unwrap();
        fs::create_dir_all(dependency.join(".ai")).unwrap();
        fs::write(project.join(".ai").join("AGENTS.md"), "# Standards").unwrap();
        fs::write(dependency.join(".ai").join("AGENTS.md"), "# Ignore").unwrap();
        let mut projects = HashSet::new();
        discover_in(&root, &mut projects);
        assert!(projects.contains(&project));
        assert!(!projects.contains(&dependency));
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn new_project_initialization_installs_embedded_standards_without_overwriting() {
        let root = env::temp_dir().join(format!("devcanon-init-{}", std::process::id()));
        let project = root.join("new-project");
        fs::create_dir_all(&project).unwrap();
        fs::write(project.join("AGENTS.md"), "# Existing instructions").unwrap();

        initialize_project_at(&project).unwrap();

        assert!(project.join(".ai").join("AGENTS.md").is_file());
        assert!(project
            .join(".ai")
            .join("prompts")
            .join("crud.md")
            .is_file());
        assert_eq!(
            fs::read_to_string(project.join("AGENTS.md")).unwrap(),
            "# Existing instructions"
        );
        fs::remove_dir_all(root).unwrap();
    }
    #[test]
    fn editor_catalog_has_stable_unique_ids() {
        let ids: HashSet<&str> = EDITORS.iter().map(|editor| editor.id).collect();
        assert_eq!(ids.len(), EDITORS.len());
        assert!(ids.contains("vscode"));
        assert!(ids.contains("cursor"));
        assert!(ids.contains("conductor"));
    }
}
