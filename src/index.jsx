/* @refresh reload */
import { render } from "solid-js/web";
import App from "./App";
import { Router, Route } from "@solidjs/router";
import Sqlite from "./pages/Sqlite";
import Fs from "./pages/Fs";
import Initialization from "./Initialization";
import ManipulateWebWin from "./pages/ManipulateWebWin";
import Deno from "./pages/Deno";
import SqliteMigrRust from "./pages/SqliteMigrRust";
import Solidjs from "./pages/Solidjs";

render(() => (
  <Router root={Initialization}>
    <Route path="/" component={App} />
    <Route path="/sqlite" component={Sqlite} />
    <Route path="/sqlitemigr" component={SqliteMigrRust} />
    <Route path="/fs" component={Fs} />
    <Route path="/multiwindow" component={ManipulateWebWin} />
    <Route path="/deno" component={Deno} />
    <Route path="/solidjs" component={Solidjs} />
  </Router>
), document.getElementById("root"));
