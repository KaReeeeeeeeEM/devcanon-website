#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{
    fs,
    path::{Path, PathBuf},
    process::Command,
};

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
    let executable = if cfg!(windows) {
        "devcanon.cmd"
    } else {
        "devcanon"
    };
    let output = Command::new(executable)
        .args(["update", &project])
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
            "The update could not be completed.".into()
        } else {
            message
        })
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            choose_project,
            list_standards,
            read_standard,
            write_standard,
            update_standards
        ])
        .run(tauri::generate_context!())
        .expect("error while running Devcanon Studio");
}
