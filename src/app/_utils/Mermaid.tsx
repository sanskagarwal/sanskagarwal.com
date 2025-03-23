import mermaid from "mermaid";
import React, { useEffect } from "react";

mermaid.initialize({
    startOnLoad: true,
    theme: "default",
    securityLevel: "loose"
});

const Mermaid: React.FC<{ children: string }> = ({ children }) => {
    useEffect(() => {
        mermaid.contentLoaded();
    }, []);

    return (
        <div className="mermaid">
            {children}
        </div>
    );
}

export default Mermaid;
