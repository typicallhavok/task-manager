"use client";

import React from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import Navbar from "./components/Navbar";
import "./globals.css";

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <ThemeProvider>
                    <Navbar />
                    <main>{children}</main>
                </ThemeProvider>
            </body>
        </html>
    );
}
