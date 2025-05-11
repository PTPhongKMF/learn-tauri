use std::fs;
use tauri::AppHandle;
use serde::Deserialize;
use tempfile::TempDir;

// Define structures for bundled migrations
#[derive(Deserialize)]
struct BundledMigration {
    version: i64,
    description: String,
    sql: String,
}

#[derive(Deserialize)]
struct MigrationBundle {
    migrations: Vec<BundledMigration>,
}

/// Applies migrations from a bundled CBOR file
#[tauri::command]
pub async fn apply_migrations(
    _app_handle: AppHandle,   // Prefix with _ to silence unused variables warning (if use in the future, remove prefix)
    db_path: String, 
    migration_bundle: Vec<u8> // Binary CBOR data
) -> Result<i64, String> {
    // Parse the migration bundle
    let bundle: MigrationBundle = ciborium::de::from_reader(&migration_bundle[..])
        .map_err(|e| format!("Failed to parse CBOR migration bundle: {}", e))?;
    
    // Create a temporary directory for migration files
    let temp_dir = TempDir::new()
        .map_err(|e| format!("Failed to create temporary directory: {}", e))?;
    
    // Write each migration to a file in the temporary directory
    for migration in bundle.migrations {
        // Format filename according to SQLx conventions: {version}_{description}.sql
        let filename = format!("{:012}_{}.sql", migration.version, migration.description);
        let file_path = temp_dir.path().join(filename);
        
        fs::write(&file_path, migration.sql)
            .map_err(|e| format!("Failed to write migration file: {}", e))?;
    }
    
    // Connect to SQLite database
    let db_url = format!("sqlite:{}", db_path);
    let db = sqlx::SqlitePool::connect(&db_url)
        .await
        .map_err(|e| format!("Failed to connect to database: {}", e))?;
    
    // Create a migrator from the temporary directory containing migration files
    let migrator = sqlx::migrate::Migrator::new(temp_dir.path())
        .await
        .map_err(|e| format!("Failed to create migrator: {}", e))?;
    
    // Apply migrations
    migrator.run(&db)
        .await
        .map_err(|e| format!("Failed to apply migrations: {}", e))?;
    
    // After running migrations, get the current version
    let version_result: Result<Option<(i64,)>, sqlx::Error> = sqlx::query_as(
        "SELECT MAX(version) FROM _sqlx_migrations"
    )
    .fetch_optional(&db)
    .await;
    
    let version = match version_result {
        Ok(Some((version,))) => version,
        Ok(None) => 0,
        Err(e) => {
            db.close().await;
            return Err(format!("Error checking migration version after apply: {}", e));
        }
    };
    
    db.close().await;
    
    // The temporary directory will be automatically cleaned up when it goes out of scope
    
    Ok(version)
}