// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use crate::frontend_actions::{check_meta_data_directory, export_csv, load_frontend_app_state, rename_directory, save_preferences, setup_backup};

mod models;
mod state;
mod paths;
mod file_store;
mod frontend_actions;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
      load_frontend_app_state,
      rename_directory,
      save_preferences,
      check_meta_data_directory,
      setup_backup,
      export_csv
    ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
