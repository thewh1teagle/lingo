use eyre::Result;

#[tauri::command]
pub fn translate(language: String, model_path: String) -> Result<String> {
    log::debug!("translate with {} {}", language, model_path);
    Ok(String::new())
}

#[tauri::command]
pub async fn download_model() -> Result<String> {
    log::debug!("download model");
    Ok(String::new())
}

#[tauri::command]
pub async fn get_model_path() -> Result<Option<String>> {
    log::debug!("get model path");
    Ok(None)
}
