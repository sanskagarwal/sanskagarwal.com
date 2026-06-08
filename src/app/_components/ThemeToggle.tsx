"use client";

import React, { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa6";

const ThemeToggle: React.FC = () => {
    const [dark, setDark] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setDark(document.documentElement.classList.contains("dark"));
        setMounted(true);
    }, []);

    const toggle = () => {
        const next = !dark;
        setDark(next);
        document.documentElement.classList.toggle("dark", next);
        try {
            localStorage.setItem("theme", next ? "dark" : "light");
        } catch {
            /* ignore */
        }
    };

    return (
        <button
            type="button"
            onClick={toggle}
            aria-label="Toggle theme"
            className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
        >
            {mounted && dark ? <FaSun /> : <FaMoon />}
        </button>
    );
};

export default ThemeToggle;
