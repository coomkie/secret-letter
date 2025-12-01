import React from 'react';
import { RouterProvider } from "react-router-dom";
import './App.css';
import { router } from './routes';
import "./i18n";
import { UserProvider } from './utils/userContext';

function App() {
    return (
        <UserProvider>
            <RouterProvider router={router} />
        </UserProvider>
    );
}

export default App;
