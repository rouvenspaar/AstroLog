// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use commands::calibration::{analyze_calibration_frames, classify_calibration_frames};
use commands::gallery::{add_new_image, open_image};
use commands::image::get_date;
use commands::imaging_sessions::{export_csv, open_imaging_session};
use commands::preferences::{save_preferences, set_root_directory, setup_backup};
use commands::state::{add_close_lock, load_frontend_app_state, remove_close_lock, update_app_state_from_json};
use commands::utils::{open_browser, rename_directory};
use models::frontend::process::Process;
use models::state::AppState;
use std::env;
use std::sync::Mutex;
use tauri::{Emitter, Manager};
use crate::commands::equipment::{add_telescope, check_equipment_duplicate};
use crate::file_system::set_folder_invisible;

mod commands;
mod file_store;
mod image;
mod models;
pub mod file_system;

fn main() {
    let account_id = option_env!("ACCOUNT_ID")
        .expect("ACCOUNT_ID is not embedded in the binary")
        .to_string();
    let verify_key = option_env!("VERIFY_KEY")
        .expect("VERIFY_KEY is not embedded in the binary")
        .to_string();

    tauri::Builder::default()
        .setup(|app| {
            // init app_state
            let app_state = Mutex::new(AppState::new(app.handle()));

            // set .astrolog folder invisible on windows
            let mut dir = app_state.lock().unwrap().preferences.storage.root_directory.clone();
            dir.push(".astrolog");
            set_folder_invisible(&dir);

            // state management
            app.manage(app_state);

            Ok(())
        })
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                let state: tauri::State<Mutex<AppState>> = window.state();
                let lock_state = state.lock().unwrap();
                if lock_state.close_lock {
                    api.prevent_close();
                    window.emit("close_lock", ()).unwrap();
                }
            }
        })
        .plugin(tauri_plugin_window_state::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_keygen::Builder::new(&account_id, &verify_key).build())
        .invoke_handler(tauri::generate_handler![
            add_close_lock,
            add_new_image,
            add_telescope,
            analyze_calibration_frames,
            check_equipment_duplicate,
            classify_calibration_frames,
            export_csv,
            get_date,
            load_frontend_app_state,
            open_browser,
            open_image,
            open_imaging_session,
            remove_close_lock,
            rename_directory,
            save_preferences,
            set_root_directory,
            setup_backup,
            update_app_state_from_json,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
