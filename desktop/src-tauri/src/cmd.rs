use crate::{downloader::Downloader, unzip, TranslatorHandle};
use ct2rs::Translator;
use eyre::{eyre, ContextCompat, Result};
use std::{fs, path::PathBuf, time};
use tauri::{AppHandle, Emitter, Manager, State};
use tauri_plugin_shell::ShellExt;

#[tauri::command]
pub async fn translate(
    language: String,
    text: String,
    translator_handle: State<'_, TranslatorHandle>,
) -> Result<Vec<(String, Option<f32>)>> {
    log::debug!("translate with {} {}", language, text);
    let sources: Vec<String> = text.lines().map(String::from).collect();
    let target_prefixes = vec![vec![language]; sources.len()];
    let now = time::Instant::now();
    let t = translator_handle.lock().await;
    let t = t.as_ref().unwrap();
    let res = t
        .translate_batch_with_target_prefix(&sources, &target_prefixes, &Default::default(), None)
        .map_err(|e| eyre!("{:?}", e))?;
    let elapsed = now.elapsed();
    log::info!("Time taken: {:?}", elapsed);
    Ok(res)
}

#[tauri::command]
pub async fn download_model(app: AppHandle, url: String, filename: String) -> Result<String> {
    let local_data = app.path().app_local_data_dir()?;
    std::fs::create_dir_all(local_data.clone())?;
    log::debug!("download model from {}", url);
    let mut downloader = Downloader::new();

    let download_progress_callback = {
        let app_handle = app.clone();

        move |current: u64, total: u64| {
            let app_handle = app_handle.clone();

            // Update progress in background
            tauri::async_runtime::spawn(async move {
                let window = app_handle.get_webview_window("main").unwrap();
                let percentage = (current as f64 / total as f64) * 100.0;
                log::debug!("percentage: {}", percentage);
                if let Err(e) = window.emit("download_progress", (current, total)) {
                    log::error!("Failed to emit download progress: {}", e);
                }
            });
            // Return the abort signal immediately
            false
        }
    };

    let path = local_data.join(filename);

    log::debug!("download from {} to {}", url, path.display());
    downloader.download(&url, path.clone(), download_progress_callback).await?;
    log::debug!("done download");
    unzip::unzip(&path, Some(&local_data))?;
    fs::remove_file(path.clone())?;
    let stem = path.file_stem().context("stem")?;
    let folder = stem.to_str().context("tostr")?;
    Ok(folder.to_string())
}

#[tauri::command]
pub async fn get_model_path(app: AppHandle) -> Result<Option<PathBuf>> {
    log::debug!("get model path");
    let local_data = app.path().app_local_data_dir()?;
    let path = local_data.join("nllb-200-distilled-600M");
    if path.exists() {
        return Ok(Some(path));
    }
    Ok(None)
}

#[tauri::command]
pub async fn open_models_folder(app: AppHandle) -> Result<()> {
    let local_data = app.path().app_local_data_dir()?;
    app.shell().open(local_data.to_str().context("tostr")?, None)?;
    Ok(())
}

#[tauri::command]
pub async fn load_model(model_path: String, translator_handle: State<'_, TranslatorHandle>) -> Result<()> {
    let cfg = ct2rs::config::Config::default();
    let t = Translator::new(model_path, &cfg).map_err(|e| eyre!("{:?}", e))?;
    let mut translator_handle = translator_handle.lock().await;
    *translator_handle = Some(t);
    Ok(())
}
