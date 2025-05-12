import { createEffect, createSignal, For, onMount } from "solid-js";
import { db, setDb } from "../Initialization";
import { A } from "@solidjs/router";
import Database from "@tauri-apps/plugin-sql";
import { resolveResource } from "@tauri-apps/api/path";
import { invoke } from "@tauri-apps/api/core";

const SqliteMigrRust = () => {
  const [dbOpr, setDbOpr] = createSignal([]);


  onMount(() => {
    async function setup() {
      console.log(db());
      db() ? console.log("db is true") : console.log("db is false")

      if (db()) {
        const closeResult = await db().close();
        console.log(closeResult);

        console.log("still ran");
        setDb(null);
      }
    }

    setup();
  })

  function logging(log) {
    console.log(log);
    setDbOpr([log.toString(), ...dbOpr()]);
  }

  async function dbInit() {
    logging("Start connect to DB");
    const loadedDb = await Database.load("sqlite:" + await resolveResource("db/sqlite.db"));
    setDb(loadedDb);
    logging(db());
    logging("Done, connected to DB");

    logging("===================================================");

    logging("Apply WAL mode");
    const resultWAL = await db().execute("PRAGMA journal_mode = WAL;");
    logging(resultWAL);
    logging("Finish applied WAL mode");

    logging("Start apply migration from rust");
    const resultInvoke = await invoke("apply_migrations", {
      dbPath: await resolveResource("db/sqlite.db"),
      cborFilePath: await resolveResource("db/migrations")
    });
    logging("result from invoke: " + resultInvoke);
    logging("Done apply migration from rust");
  }

  return (
    <main class="w-full p-4">
      <button class="mb-4 flex px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"><A href="/">Back</A></button>
      <div class="flex flex-col items-center">
        <h1 class="text-2xl">Testing Sqlite plugin with migration and stuff from Rust</h1>
        <div class="flex mt-8 justify-between gap-2">
          <button class="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={dbInit}>
            Start check migration on rust side, connect to Sqlite, apply migration.
          </button>
        </div>
      </div>

      <h1 class="text-2xl mt-4">Operation status:</h1>
      <For each={dbOpr()}>
        {(item, index) => (
          <p>#{dbOpr().length - index()}: {item}</p>
        )}
      </For>
    </main>
  );
}

export default SqliteMigrRust;