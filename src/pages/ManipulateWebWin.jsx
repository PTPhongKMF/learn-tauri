import { A } from "@solidjs/router";
import { getCurrentWebview, Webview } from "@tauri-apps/api/webview";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { getCurrentWindow, Window } from "@tauri-apps/api/window";
import { createResource, createSignal } from "solid-js";

const ManipulateWebWin = () => {
  let createdWindow;
  let createdWebview;

  const [info, setInfo] = createSignal("");

  const [error, setError] = createSignal("");

  const [text] = createResource(async () => {
    const res = await fetch("/txt/tauri-webview-window-diff.txt");
    return await res.text();
  });

  async function closeWindow() {
    console.log("Closing window");
    await getCurrentWindow().close();
  }

  async function closeWebview() {
    console.log("Closing webview");
    await getCurrentWebview().close();
  }

  function createWindow() {
    console.log("Creating window");

    try {
      createdWindow = new Window('my-label');
      console.log(createdWindow);
    } catch (err) {
      setError(err.message);
    }

    createdWindow.once('tauri://created', function () {
      console.log("Creating window success");
    });
    createdWindow.once('tauri://error', function (e) {
      console.log("Creating window failed");
      console.log(e);
    });
  }

  async function createWebview() {
    console.log("Creating webview");

    createdWebview = new Webview(createdWindow, 'my-label');
    console.log(createdWebview);

    createdWebview.once('tauri://created', function () {
      console.log("Creating webview success");
    });
    createdWebview.once('tauri://error', function (e) {
      console.log("Creating webview failed");
      console.log(e);
    });
  }

  async function createWebviewWindow() {
    const webview = new WebviewWindow('my-label');
    
    webview.once('tauri://created', function () {
      console.log("Creating webviewWindow success");
    });
    webview.once('tauri://error', function (e) {
      console.log("Creating webviewWindow failed");
      console.log(e);
    });
  }

  return (
    <div class="w-full">
      <button class="mb-4 flex px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"><A href="/">Back</A></button>
      <div class="flex flex-col items-center">
        <p class="mt-6 text-sm font-mono italic text-red-600">{error()}</p>
        <h1 class="text-2xl">Testing on Manipulate webview and window</h1>
        <p class="mt-6 text-sm font-mono italic">{info()}</p>
      </div>

      <div class="flex flex-col items-center">
        <div class="flex gap-8 mt-8">
          <button class="mb-4 flex px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={closeWindow}>
            Close this window
          </button>
          <button class="mb-4 flex px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={closeWebview} >
            Close this webview
          </button>
        </div>

        <div class="flex gap-8 mt-8">
          <button class="mb-4 flex px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={createWindow}>
            Create new window
          </button>
          <button class="mb-4 flex px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={createWebview} >
            Create new webview
          </button>
        </div>

        <div class="flex gap-8 mt-8">
          <button class="mb-4 flex px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={createWebviewWindow}>
            Create new webviewWindow
          </button>
        </div>

        <pre class="whitespace-pre-wrap bg-gray-100 p-4 rounded mt-2">
          {text.loading ? "Loading..." : text()}
        </pre>
      </div>
    </div>
  );
}

export default ManipulateWebWin;