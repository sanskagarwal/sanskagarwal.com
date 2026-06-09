"use client";

import React, { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa6";

const ThemeToggle: React.FC = () => {
    const [dark, setDark] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Reads the theme the inline <head> script already applied to <html>;
        // this is only knowable client-side, so syncing state here is intended.
        // eslint-disable-next-line react-hooks/set-state-in-effect
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
            aria-label={
                mounted && dark
                    ? "Switch to light theme"
                    : "Switch to dark theme"
            }
            aria-pressed={mounted ? dark : undefined}
            title="Toggle theme"
            className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
        >
            {mounted && dark ? <FaSun /> : <FaMoon />}
        </button>
    );
};

export default ThemeToggle;
