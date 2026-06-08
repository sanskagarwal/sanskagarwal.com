"use client";

import React, { useEffect, useRef, useState } from "react";

let initialized = false;

const Mermaid: React.FC<{ children: string }> = ({ children }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [svg, setSvg] = useState("");

    useEffect(() => {
        let cancelled = false;

        // Lazy-load the (heavy) mermaid library only when a diagram renders.
        (async () => {
            const mermaid = (await import("mermaid")).default;
            if (!initialized) {
                mermaid.initialize({
                    startOnLoad: false,
                    theme: "default",
                    securityLevel: "strict",
                });
                initialized = true;
            }
            try {
                const id = `mermaid-${Math.random().toString(36).slice(2)}`;
                const { svg: rendered } = await mermaid.render(id, children);
                if (!cancelled) setSvg(rendered);
            } catch {
                if (!cancelled) setSvg("");
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [children]);

    if (!svg) {
        return (
            <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
                {children}
            </pre>
        );
    }

    return (
        <div
            ref={ref}
            className="mermaid flex justify-center"
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    );
};

export default Mermaid;
