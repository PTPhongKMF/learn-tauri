import { createEffect, createSignal } from "solid-js";
import "./App.css";
import { getResourcePath, loadJpgImage, loadTextFile } from "./services/fs";
import { A } from "@solidjs/router";
import { getTauriVersion, getVersion } from "@tauri-apps/api/app";
import { invoke } from "@tauri-apps/api/core";



function App() {
  const [tauriVer, setTauriVer] = createSignal("");
  const [appDir, setAppDir] = createSignal("");
  const [appVer, setAppVer] = createSignal("");

  const [textFile, setTextFile] = createSignal("");
  const [img, setImg] = createSignal("");
  const [imgurl, setImgurl] = createSignal("");

  const [error, setError] = createSignal("")

  createEffect(() => {
    async function setup() {
      try {
        const tauriVer = await getTauriVersion();
        const appVer = await getVersion();
        const appDir = await invoke("get_exe_dir");
        const text = await loadTextFile("data/text/text.txt");
        const base64Img = await loadJpgImage("data/img.jpg");
        const imgurl = await getResourcePath("data/img.jpg");

        setTauriVer(tauriVer);
        setAppVer(appVer);
        setAppDir(appDir);
        setTextFile(text);
        setImg(base64Img);
        setImgurl(imgurl);
      } catch (err) {
        setError(err.message);
      }
    }

    setup();
  });

  return (
    <main class="w-full flex items-center flex-col text-2xl p-4">
      <h1 class="font-sans">Welcome to Tauri + Solid</h1>
      <p class="text-base font-mono">Tauri ver: {tauriVer()} - App ver: {appVer()}</p>
      <p class="text-base font-mono">app location: {appDir()}</p>


      <h1 class="font-url">This is custom font from url</h1>
      <h1 class="font-imp">This is custom font from local</h1>
      <h1 class="">This is testing image from local public</h1>
      <img class="img-banner rounded-md my-4" src="/imgs/landscape.jpg" alt="" />
      <h1 class="">This is testing display text.txt and img.jps from custom additional folder at root level, to test "resources" tauri.conf </h1>
      <p class="text-base">text.txt: <span class="text-sm font-mono">{textFile()}</span></p>
      <img class="img-banner rounded-md my-4" src={img()} alt="" />
      <p class="text-sm font-mono italic">{imgurl()}</p>
      <p class="mt-6 text-sm font-mono italic text-red-600">{error()}</p>

      <div class="flex mt-8 justify-between gap-2">
        <button class="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          <A href="/sqlite">Test Sqlite</A>
        </button>
        <button class="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          <A href="/fs">Test file-system</A>
        </button> 
        <button class="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          <A href="/multiwindow">Test webview + window</A>
        </button>
      </div>

      <div class="flex mt-8 justify-between gap-2">
        <button class="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          <A href="/deno">Test Deno JSR</A>
        </button>
      </div>
    </main>
  );
}

export default App;
