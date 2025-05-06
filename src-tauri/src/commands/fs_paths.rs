use std::env;

#[tauri::command]
pub fn get_exe_dir() -> Result<String, String> {
    match env::current_exe() {
        Ok(path) => {
            if let Some(parent) = path.parent() {
                Ok(parent.to_string_lossy().to_string())
            } else {
                Err("Failed to get parent directory".to_string())
            }
        }
        Err(e) => Err(format!("Error getting executable path: {}", e)),
    }
}
