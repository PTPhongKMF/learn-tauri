/* @refresh reload */
import { render } from "solid-js/web";
import App from "./App";
import { Router, Route } from "@solidjs/router";
import Sqlite from "./pages/Sqlite";
import Fs from "./pages/Fs";
import Initialization from "./Initialization";

render(() => (
  <Router root={Initialization}>
    <Route path="/" component={App} />
    <Route path="/sqlite" component={Sqlite} />
    <Route path="/fs" component={Fs} />
  </Router>
), document.getElementById("root"));
