import { createEffect, createSignal, For } from "solid-js";
import { db, setDb } from "../Initialization";
import { A } from "@solidjs/router";

const SqliteMigrRust = () => {
  const [dbOpr, setDbOpr] = createSignal([]);


  createEffect(() => {
    async function setup() {
      db().close();
      setDb(null);
    }

    setup();
  })

  async function dbInit() {

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
          <p>#{index()}: {item}</p>
        )}
      </For>
    </main>
  );
}

export default SqliteMigrRust;