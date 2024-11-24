use ct2rs::{auto::Tokenizer, Translator};
use tokio::sync::Mutex;

mod cmd;
mod downloader;
mod unzip;

pub type TranslatorHandle = Mutex<Option<Translator<Tokenizer>>>;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    env_logger::init();
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
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
