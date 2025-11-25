import React from "react";
import Footer from "../components/layout/Footer";
import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";

const DefaultLayout = () => {
    return (
        <div className="layout-container">
            <Header />
            <main className="content">
                <Outlet /> 
            </main>
            <Footer />
        </div>
    );
};

export default DefaultLayout;
