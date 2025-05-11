import { A } from "@solidjs/router";
import { createSignal, For } from "solid-js";

const Solidjs = () => {
  const [list, setList] = createSignal(["zero", "one", "two", "three", "four", "five"]);
  const [input, setInput] = createSignal("");

  function handlePrepend() {
    setList([input(), ...list()]);
  }

  function handleAppend() {
    setList([...list(), input()]);
  }

  return (
    <main class="w-full p-4">
      <button class="mb-4 flex px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"><A href="/">Back</A></button>
      <div class="flex flex-col items-center">
        <h1 class="text-2xl">Testing SolidJS stuff</h1>
      </div>

      <div class="flex justify-around mt-8 gap-2">
        <input class="border-2 border-blue-500 rounded-lg p-3 text-gray-800 placeholder-gray-400 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="text" value={input()} onInput={(e) => setInput(e.target.value)} />

        <button class="mb-4 flex px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={handlePrepend}>
          Prepend
        </button>
        <button class="mb-4 flex px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={handleAppend}>
          Append
        </button>
      </div>

      <div class="mt-8">
        <For each={list()} fallback={<div>Loading...</div>}>
          {(item, index) => (
            <p>
              #{index()}: {item}
            </p>
          )}
        </For>
      </div>


    </main>
  );
}

export default Solidjs;