import React from "react";
import { createRoot } from "react-dom/client";

import Ballpit from "./Ballpit";

import "./styles.css";

const count = new URLSearchParams(window.location.search).get("count");

if (!count) alert("change the number of orbs by adding ?count=number to the url");

createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <Ballpit count={count || 25}/>
    </React.StrictMode>
);
