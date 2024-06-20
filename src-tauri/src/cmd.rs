use eyre::Result;

#[tauri::command]
pub fn translate(language: String) -> Result<String> {
    log::debug!("translate with {}", language);
    Ok(String::new())
}

#[tauri::command]
pub async fn download_model() -> Result<()> {
    log::debug!("download model");
    Ok(())
}

#[tauri::command]
pub async fn get_model_path() -> Result<Option<String>> {
    log::debug!("get model path");
    Ok(None)
}
