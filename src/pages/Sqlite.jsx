import { A } from "@solidjs/router";
import { appConfigDir, BaseDirectory, resourceDir } from "@tauri-apps/api/path";
import { writeTextFile } from "@tauri-apps/plugin-fs";
import Database from "@tauri-apps/plugin-sql";
import { createEffect, createSignal } from "solid-js";
import { invoke } from "@tauri-apps/api/core";

const Sqlite = () => {
  const [info, setInfo] = createSignal("");
  

  const [personList, setPersonList] = createSignal([]);
  const [name, setName] = createSignal("");

  const [error, setError] = createSignal("")

  createEffect(async () => {
    try {
      // const db = await Database.load("sqlite:db1.0.db");
      const info = await appConfigDir();

      setInfo(info);
    } catch (err) {
      setError(err.message);
    }
  });

  return (
    <div class="w-full">
      <button class="mb-4 flex px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"><A href="/">Back</A></button>
      <div class="flex flex-col items-center">
        <p class="mt-6 text-sm font-mono italic text-red-600">{error()}</p>
        <h1 class="text-2xl">Testing Sqlite plugin - Tauri</h1>
        <p class="mt-6 text-sm font-mono italic">{info()}</p>
      </div>
    </div>
  );
}

export default Sqlite;