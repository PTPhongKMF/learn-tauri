import { A } from "@solidjs/router";
import { invoke } from "@tauri-apps/api/core";
import { resourceDir } from "@tauri-apps/api/path";
import { writeTextFile } from "@tauri-apps/plugin-fs";
import { createEffect, createSignal } from "solid-js";

const Fs = () => {
  const [info, setInfo] = createSignal("");

  const [appDir, setAppDir] = createSignal("");
  const [rescDir, setRescDir] = createSignal("");

  const [textfile, setTextfile] = createSignal("");

  const [error, setError] = createSignal("");

  createEffect(() => {
    async function setup() {
      try {
        const rescDir = await resourceDir();
        const appDir = await invoke("get_exe_dir");

        setAppDir(appDir);
        setRescDir(rescDir);
      } catch (err) {
        setError(err.message);
      }
    }

    setup();
  });

  async function handleCreateTextfileInResc() {
    try {
      await writeTextFile(rescDir() + "\\data\\text.txt", textfile());
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleCreateTextfileInApp() {
    try {
      await writeTextFile(appDir() + "\\text.txt", textfile());
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div class="w-full">
      <button class="mb-4 flex px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"><A href="/">Back</A></button>
      <div class="flex flex-col items-center">
        <p class="mt-6 text-sm font-mono italic text-red-600">{error()}</p>
        <h1 class="text-2xl">Testing file system CRUD - Tauri</h1>
        <p class="text-base font-mono">app location: {appDir()}</p>
        <p class="text-base font-mono">resource dir location: {rescDir()}</p>
        <p class="mt-6 text-sm font-mono italic">{info()}</p>
      </div>

      <div class="flex justify-around mt-8">
        <input class="border-2 border-blue-500 rounded-lg p-3 text-gray-800 placeholder-gray-400 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="text" value={textfile()} onInput={(e) => setTextfile(e.target.value)} />

        <div class="flex flex-col items-center">
          <button class="mb-4 flex px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={handleCreateTextfileInResc}>
            Create text file in resource folder
          </button>

          <button class="mb-4 flex px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={handleCreateTextfileInApp}>
            Create text file in app folder
          </button>
        </div>
      </div>
    </div>
  );
}

export default Fs;