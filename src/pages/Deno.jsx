import { createEffect, createSignal } from "solid-js";
import * as text from "https://esm.sh/jsr/@std/text@1.0.13";
import { appConfigDir } from "@tauri-apps/api/path";
import { A } from "@solidjs/router";

// { toCamelCase, toKebabCase, toPascalCase, toSnakeCase }
const Deno = () => {
  const [info, setInfo] = createSignal("");
  const [input, setInput] = createSignal("");
  const [newInput, setNewInput] = createSignal("");

  createEffect(() => {
    async function setup() {
      const info = await appConfigDir();

      setInfo(info);
    }

    setup();
  });

  return (
    <div class="w-full">
      <button class="mb-4 flex px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"><A href="/">Back</A></button>
      <div class="flex flex-col items-center">
        <h1 class="text-2xl">Testing Deno JSR import</h1>
        <p>appconfig dir: {info()}</p>
      </div>

      <div class="flex flex-col items-center mt-8">
        <input class="border-2 border-blue-500 rounded-lg p-3 text-gray-800 placeholder-gray-400 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="text" value={input()} onInput={(e) => setInput(e.target.value)} placeholder="Enter text" />
          <p class="text-3xl">current: {input()}</p>
          <p class="text-orange-400 text-4xl">changed: {newInput()}</p>
      </div>

      <div class="flex justify-around mt-8">
        <button class="mb-4 flex px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={() => setNewInput(toCamelCase(input()))}>
          To camelCase
        </button>
        <button class="mb-4 flex px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={() => setNewInput(toKebabCase(input()))}>
          To kebab-case
        </button>
        <button class="mb-4 flex px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={ () => setNewInput(toPascalCase(input()))}>
          To PascalCase
        </button>
        <button class="mb-4 flex px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={() => setNewInput(toSnakeCase(input()))}>
          To snake_case
        </button>
      </div>
    </div>
  );
}

export default Deno;