import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// vanilla js:

function oh(user) {
    let a = document.querySelector(".cad")
    console.log(a)
}

console.log(233)


// React:

import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ReactRoot from "./ReactRoot.jsx";

createRoot(document.getElementById('root')).render(
    <>
        <ReactRoot />
    </>,
)
