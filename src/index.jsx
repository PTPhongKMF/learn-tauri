/* @refresh reload */
import { render } from "solid-js/web";
import App from "./App";
import { Router, Route } from "@solidjs/router";
import Sqlite from "./pages/Sqlite";
import Fs from "./pages/Fs";

render(() => (
  <Router>
    <Route path="/" component={App} />
    <Route path="/sqlite" component={Sqlite} />
    <Route path="/fs" component={Fs} />
  </Router>
), document.getElementById("root"));
