import { resolveResource } from "@tauri-apps/api/path";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import Database from "@tauri-apps/plugin-sql";
import { createEffect, createSignal, onCleanup } from "solid-js";

export const [db, setDb] = createSignal(null);

const Initialization = (props) => {
  createEffect(() => {
    async function setupDb() {
      const loadedDb = await Database.load("sqlite:" + await resolveResource("db/sqlite.db"));
      console.log(loadedDb);
      setDb(loadedDb);
    };

    setupDb();
  })

  createEffect(() => {
    let unlisten;

    async function setup() {
      unlisten = await getCurrentWebviewWindow().onCloseRequested(async (e) => {
        console.log("closing");
        if (db())
          await db().close();

        await getCurrentWebviewWindow().destroy();
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