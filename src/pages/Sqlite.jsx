import { A } from "@solidjs/router";
import { createEffect, createSignal } from "solid-js";

const Sqlite = () => {
  const [personList, setPersonList] = createSignal([]);
  const [name, setName] = createSignal("");

  createEffect(async () => {

  })

  return (
    <>
    <button class="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"><A href="/">Back</A></button>
      <h1 class="flex items-center text-2xl">Testing Sqlite plugin - Tauri</h1>

    </>
  );
}

export default Sqlite;