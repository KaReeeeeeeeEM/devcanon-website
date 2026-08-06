#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::Serialize;
use std::{
    fs,
    path::{Path, PathBuf},
    process::Command,
    sync::Mutex,
};
use tauri::{ipc::Channel, AppHandle, State};
use tauri_plugin_updater::{Update, UpdaterExt};

struct PendingUpdate(Mutex<Option<Update>>);

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct StudioInfo {
    version: String,
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
fn studio_info(app: AppHandle) -> StudioInfo {
    StudioInfo {
        version: app.package_info().version.to_string(),
    }
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

#[tauri::command]
fn initialize_project() -> Result<Option<String>, String> {
    let Some(path) = rfd::FileDialog::new().pick_folder() else {
        return Ok(None);
    };
    let project = path.to_string_lossy().into_owned();
    run_devcanon("init", &project)?;
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
