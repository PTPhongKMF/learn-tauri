import { resolveResource } from "@tauri-apps/api/path";
import { getCurrentWindow } from "@tauri-apps/api/window";
import Database from "@tauri-apps/plugin-sql";
import { createEffect, createSignal, onCleanup } from "solid-js";

export const [db, setDb] = createSignal(null);

const Initialization = (props) => {
  createEffect(() => {
    async function setupDb() {
      const loadedDb = await Database.load("sqlite:" + await resolveResource("db/db1.0.db"));
      console.log(loadedDb);
      setDb(loadedDb);
    };

    setupDb();
  })

  createEffect(() => {
    let unlisten;

    async function setup() {
      unlisten = await getCurrentWindow().onCloseRequested(async (e) => {
        console.log("closing");
        await db().close();
        await getCurrentWindow().destroy();
      });
    };

    setup();

    onCleanup(() => {
      if (unlisten) unlisten();
    });
  });

  return (
    <>
      {props.children}
    </>
  );
}

export default Initialization;