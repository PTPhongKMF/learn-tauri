import { A } from "@solidjs/router";
import { appConfigDir, resolveResource } from "@tauri-apps/api/path";
import { createEffect, createSignal, For } from "solid-js";
import { db } from "../Initialization";

const Sqlite = () => {
  const [info, setInfo] = createSignal("");


  const [personList, setPersonList] = createSignal([]);
  const [name, setName] = createSignal("");

  const [error, setError] = createSignal("");

  async function fetchPerson() {
    const personList = await db().select("SELECT * from Person");

    setPersonList(personList);

    return personList;
  };

  createEffect(() => {
    async function setup() {
      try {
        const info = await resolveResource("db/db1.0.db");

        setInfo(info);
      } catch (err) {
        setError(err.message);
      }
    }

    setup();
  });

  createEffect(() => {
    fetchPerson();
  });

  async function handleAddPerson() {
    await db().execute("INSERT into Person (name) VALUES ($1)", [name()]);

    fetchPerson();
  }

  async function handleRemovePerson(id) {
    await db().execute("DELETE FROM Person WHERE id = $1", [id]);

    fetchPerson();
  }

  async function manualFetchPerson() {
    console.log(fetchPerson());
  }

  return (
    <div class="w-full">
      <button class="mb-4 flex px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"><A href="/">Back</A></button>
      <div class="flex flex-col items-center">
        <p class="mt-6 text-sm font-mono italic text-red-600">{error()}</p>
        <h1 class="text-2xl">Testing Sqlite plugin - Tauri</h1>
        <p class="mt-6 text-sm font-mono italic">{info()}</p>
      </div>

      <button class="mb-4 flex px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        onClick={manualFetchPerson}>
        Manual fetch person
      </button>

      <div class="flex justify-around mt-8">
        <input class="border-2 border-blue-500 rounded-lg p-3 text-gray-800 placeholder-gray-400 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="text" value={name()} onInput={(e) => setName(e.target.value)} placeholder="Enter the name to add to DB" />

        <button class="mb-4 flex px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={handleAddPerson}>
          Add person
        </button>
      </div>

      <div class="mt-8 flex justify-center mb-1">
        <table class="min-w-[20rem] table-auto border-collapse border border-gray-400">
          <thead>
            <tr>
              <th class="border border-gray-400 p-2">ID</th>
              <th class="border border-gray-400 p-2">Name</th>
              <th class="border border-gray-400 p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            <For each={personList()}>
              {(person) => (
                <tr>
                  <td class="border border-gray-400 p-2">{person.id}</td>
                  <td class="border border-gray-400 p-2">{person.name}</td>
                  <td class="border border-gray-400 p-2">
                    <button class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      onClick={() => { handleRemovePerson(person.id) }}>
                      Delete
                    </button>
                  </td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default Sqlite;