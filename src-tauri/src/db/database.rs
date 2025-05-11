use crate::db::migrations;

pub fn create_sql_plugin() -> tauri_plugin_sql::Builder {
    let migrations = migrations::get_migrations();
    
    tauri_plugin_sql::Builder::default()
        .add_migrations("sqlite:app.db", migrations)
}