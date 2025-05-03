import { createSignal } from "solid-js";
import logo from "./assets/logo.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

function App() {
  const [greetMsg, setGreetMsg] = createSignal("");
  const [name, setName] = createSignal("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke("greet", { name: name() }));
  }

  return (
    <main class="w-full flex items-center flex-col text-4xl">
      <h1 class="font-sans">Welcome to Tauri + Solid</h1>
      <h1 class="font-url">This is custom font from url</h1>
      <h1 class="font-imp">This is custom font from local</h1>
    </main>
  );
}

export default App;
