// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod cmd;
mod downloader;
mod unzip;

fn main() {
    env_logger::init();
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            cmd::translate,
            cmd::download_model,
            cmd::get_model_path,
            cmd::open_models_folder
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
