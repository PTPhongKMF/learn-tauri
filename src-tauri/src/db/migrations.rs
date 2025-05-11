use tauri_plugin_sql::{Migration, MigrationKind};

macro_rules! migration {
    ($ver:literal, $desc:literal, $file:literal, $kind:expr) => {
        Migration {
            version: $ver,
            description: $desc,
            sql: include_str!(concat!("./migrations/", $file)),
            kind: $kind,
        }
    };
}

/// Returns all migrations in order
pub fn get_migrations() -> Vec<Migration> {
    vec![
        migration!(1, "create person", "v1.sql", MigrationKind::Up),
        migration!(2, "create job", "v2.sql", MigrationKind::Up),
    ]
}

/// Returns the latest migration version
pub fn get_latest_version() -> i64 {
    // Get the last migration and return its version
    get_migrations()
        .last()
        .map(|migration| migration.version)
        .unwrap_or(0)
}
