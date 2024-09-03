use std::{fs, io};
use std::path::PathBuf;
use std::process::Command;
use std::time::UNIX_EPOCH;
use chrono::{DateTime, Local};
use uuid::Uuid;
use crate::models::log::LogTableRow;
use crate::models::preferences::Preferences;
use crate::services::state::{FrontendAppState, get_app_state, get_readonly_app_state};
use crate::utils::paths::{APP_DATA_PATH, ROOT_DIRECTORY_PATH};
use webbrowser;
use crate::models::image::Image;

#[tauri::command]
pub fn load_frontend_app_state() -> String {
    let app_state = get_readonly_app_state();
    let preferences = app_state.preferences.clone();
    let imaging_session_list = &app_state.imaging_session_list;
    let image_list: Vec<Image> = app_state.image_list.clone();
    let mut log_data: Vec<LogTableRow> = vec![];

    for imaging_session in imaging_session_list {
        log_data.push(LogTableRow::new(imaging_session));
    }

    let data = FrontendAppState {
        preferences,
        log_data,
        image_list,
    };

    serde_json::to_string(&data).unwrap()
}

fn is_directory_empty(path: &PathBuf) -> io::Result<bool> {
    let mut entries = fs::read_dir(path)?;
    Ok(entries.next().is_none())
}

fn rename_folder_with_overwrite(old_path: &PathBuf, new_path: &PathBuf) -> io::Result<()> {
    if fs::metadata(new_path).is_ok() {
        fs::remove_dir_all(new_path)?;
    }
    fs::rename(old_path, new_path)
}

#[tauri::command]
pub fn rename_directory(origin: PathBuf, destination: PathBuf) -> bool {
    return match is_directory_empty(&destination) {
        Ok(true) => {
            return match rename_folder_with_overwrite(&origin, &destination) {
                Ok(..) => {
                    println!("ok");
                    true
                }
                Err(e) => {
                    println!("Error renaming folder: {}", e);
                    false
                }
            }
        }
        Ok(false) => {
            println!("dir not empty");
            false
        }
        Err(e) => {
            println!("error: {}", e);
            false
        }
    };
}

#[tauri::command]
pub fn check_meta_data_directory(path: String) {}

#[tauri::command]
pub fn setup_backup(path: String) {}

#[tauri::command]
pub fn save_preferences(preferences: Preferences) -> bool {
    get_app_state().preferences = preferences;
    return match Preferences::save(APP_DATA_PATH.clone()) {
        Ok(..) => {
            true
        }
        Err(e) => {
            // TODO: trigger modal
            false
        }
    };
}

#[tauri::command]
pub fn export_csv(path: PathBuf) {
    println!("{}", path.display());
} // TODO: implement

#[tauri::command]
pub fn open_browser(url: &str) -> bool {
    webbrowser::open(url).is_ok()
}

#[tauri::command]
pub fn add_new_image(image: Image) -> bool {
    let mut destination = ROOT_DIRECTORY_PATH.clone();
    destination.push("Gallery");
    destination.push(String::from(&image.title) + ".png");
    if let Some(parent) = destination.parent() {
        fs::create_dir_all(parent);
    }

    match fs::copy(image.path, &destination) {
        Ok(..) => {
            println!("ok");
        }
        Err(e) => {
            println!("Error: {}", e);
        }
    }

    let new_image = Image {
        title: image.title,
        path: destination,
        total_exposure: 300,
    };

    let mut image_list = get_readonly_app_state().image_list.clone();
    image_list.push(new_image);

    get_app_state().image_list = image_list.clone();

    match Image::save_list(PathBuf::from(&get_readonly_app_state().preferences.storage.root_directory)) {
        Ok(..) => {
            println!("saved")
        }
        Err(e) => {
            println!("Error: {}", e)
        }
    }

    true
}

#[tauri::command]
pub fn open_image(path: PathBuf) {
    open::that(path);
}

#[tauri::command]
pub fn open_imaging_session(id: Uuid) {
    let path = PathBuf::from(""); // TODO: finish

    #[cfg(target_os = "windows")]
    {
        let _ = Command::new("explorer")
            .arg(path)
            .status()
            .expect("Failed to open file explorer on Windows"); // TODO: error handling
    }

    #[cfg(target_os = "macos")]
    {
        let _ = Command::new("open")
            .arg(path)
            .status()
            .expect("Failed to open file explorer on macOS");
    }

    #[cfg(target_os = "linux")]
    {
        let _ = Command::new("xdg-open")
            .arg(path)
            .status()
            .expect("Failed to open file explorer on Linux");
    }

}

#[tauri::command]
pub fn analyze_images(paths: Vec<PathBuf>) -> String {
    let metadata = fs::metadata("D:\\2024-08-29\\LIGHT\\2024-08-29_23-50-07___300.00s_0000.nef").expect("errorrr");

    return if let Ok(creation_time) = metadata.created() {
        let duration_since_epoch = creation_time.duration_since(UNIX_EPOCH).unwrap();
        let datetime = DateTime::<Local>::from(UNIX_EPOCH + duration_since_epoch);
        datetime.to_rfc3339()
    } else {
        String::from("")
    }
}
