import { ensureDirSync } from "https://deno.land/std/fs/mod.ts";
import { join, dirname, basename, fromFileUrl } from "https://deno.land/std/path/mod.ts";
import { Encoder } from "cbor-x";

// Get current file's directory - handle Windows paths properly
const __dirname = fromFileUrl(new URL(".", import.meta.url).href);

// Paths - make sure they're normalized for the OS
const migrationsDir = join(__dirname, "..", "database", "migrations");
const outputDir = join(__dirname, "..", "database", "releases");
const jsonOutputPath = join(__dirname, "..", "database", "migrations.json");

// Log paths for debugging
console.log(`Current directory: ${__dirname}`);
console.log(`Migrations directory: ${migrationsDir}`);
console.log(`Output directory: ${outputDir}`);

// Ensure directories exist
try {
  ensureDirSync(outputDir);
  console.log(`Ensured output directory exists: ${outputDir}`);
} catch (error) {
  console.error(`Error creating directory: ${error.message}`);
  // Try creating with Deno.mkdirSync as fallback
  try {
    Deno.mkdirSync(outputDir, { recursive: true });
    console.log(`Created directory with fallback method: ${outputDir}`);
  } catch (err) {
    console.error(`Failed with fallback method too: ${err.message}`);
    Deno.exit(1);
  }
}

// Check if migrations directory exists
try {
  const migrationsInfo = Deno.statSync(migrationsDir);
  if (!migrationsInfo.isDirectory) {
    console.error(`Migrations path exists but is not a directory: ${migrationsDir}`);
    Deno.exit(1);
  }
} catch (error) {
  console.error(`Migrations directory does not exist: ${migrationsDir}`);
  console.error(`Please create the directory and add SQL migration files.`);
  Deno.exit(1);
}

// Get all SQL files from the migrations directory
console.log(`Reading SQL files from ${migrationsDir}...`);
const sqlFiles = [...Deno.readDirSync(migrationsDir)]
  .filter(entry => entry.isFile && entry.name.endsWith(".sql"))
  .map(entry => entry.name)
  .sort(); // Sort filenames to ensure proper migration order

if (sqlFiles.length === 0) {
  console.warn(`No SQL files found in ${migrationsDir}`);
  Deno.exit(0);
}

// Create migrations bundle
const migrations = sqlFiles.map(file => {
  const version = parseInt(basename(file, ".sql"), 10);
  const filePath = join(migrationsDir, file);
  const content = Deno.readTextFileSync(filePath);
  
  return {
    version: version,
    description: `migration v${version}`,
    sql: content
  };
});

// Create bundle object
const bundle = {
  migrations: migrations
};

// Save as JSON for visualization
Deno.writeTextFileSync(jsonOutputPath, JSON.stringify(bundle, null, 2));
console.log(`JSON visualization saved to ${jsonOutputPath}`);

// Save as CBOR using cbor-x
const encoder = new Encoder({
  // Set the structuredClone flag to false to ensure more standard CBOR output
  structuredClone: false,
  // Use standard map encoding rather than custom optimizations
  useRecords: false,
  // Use standard encoding for all data types
  mapsAsObjects: true
});
const cborData = encoder.encode(bundle);
const cborOutputPath = join(outputDir, "migrations");
Deno.writeFileSync(cborOutputPath, cborData);
console.log(`CBOR bundle saved to ${cborOutputPath}`);

console.log(`Successfully bundled ${migrations.length} SQL migration(s)`);
