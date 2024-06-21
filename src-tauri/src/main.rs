// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use ct2rs::{auto::Tokenizer, Translator};
use tokio::sync::Mutex;

mod cmd;
mod downloader;
mod unzip;

pub type TranslatorHandle = Mutex<Option<Translator<Tokenizer>>>;

fn main() {
    env_logger::init();
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .manage(Mutex::new(None) as TranslatorHandle)
        .invoke_handler(tauri::generate_handler![
            cmd::translate,
            cmd::download_model,
            cmd::get_model_path,
            cmd::open_models_folder,
            cmd::load_model
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
