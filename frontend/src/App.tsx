import React from 'react';
import logo from './logo.svg';
import { RouterProvider } from "react-router-dom";
import './App.css';
import { router } from './routes';
import "./i18n";

function App() {
    return <RouterProvider router={router} />;
}

export default App;
