import { createEffect, createSignal } from "solid-js";
import "./App.css";
import { getResourcePath, loadJpgImage, loadTextFile } from "./services/fs";

function App() {
  const [textFile, setTextFile] = createSignal("");
  const [img, setImg] = createSignal("");
  const [imgurl, setImgurl] = createSignal("");

  createEffect(async () => {
    try {
      const text = await loadTextFile("data/text/text.txt");
      const base64Img = await loadJpgImage("data/img.jpg");
      const imgurl = await getResourcePath("data/img.jpg");
  
      setTextFile(text);
      setImg(base64Img);
      setImgurl(imgurl);
    } catch (err) {
       setImgurl(err.message);
    }
  });

  return (
    <main class="w-full flex items-center flex-col text-2xl">
      <h1 class="font-sans">Welcome to Tauri + Solid</h1>
      <h1 class="font-url">This is custom font from url</h1>
      <h1 class="font-imp">This is custom font from local</h1>
      <h1 class="">This is testing image from local public</h1>
      <img class="img-banner rounded-md my-4" src="/imgs/landscape.jpg" alt="" />
      <h1 class="">This is testing display text.txt and img.jps from custom additional folder at root level, to test "resources" tauri.conf </h1>
      <p class="text-base">text.txt: <span class="text-sm font-mono">{ textFile() }</span></p>
      <img class="img-banner rounded-md my-4" src={img()} alt="" />
      <p class="text-sm font-mono italic">{imgurl()}</p>
      </main>
  );
}

export default App;
