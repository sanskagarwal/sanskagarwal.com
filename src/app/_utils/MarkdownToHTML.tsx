import React from "react";
import Markdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import remarkGfm from "remark-gfm";

import Mermaid from "./Mermaid";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

// atomOneDark ships a few token colors that fall below the WCAG AA 4.5:1
// threshold against its own #282c34 background (comments at 2.32, and the
// red token group at 4.38). Lighten just those so code blocks are legible.
const accessibleCodeStyle: typeof atomOneDark = {
    ...atomOneDark,
    "hljs-comment": { ...atomOneDark["hljs-comment"], color: "#929cad" },
    "hljs-quote": { ...atomOneDark["hljs-quote"], color: "#929cad" },
    "hljs-section": { ...atomOneDark["hljs-section"], color: "#e88e96" },
    "hljs-name": { ...atomOneDark["hljs-name"], color: "#e88e96" },
    "hljs-selector-tag": {
        ...atomOneDark["hljs-selector-tag"],
        color: "#e88e96",
    },
    "hljs-deletion": { ...atomOneDark["hljs-deletion"], color: "#e88e96" },
    "hljs-subst": { ...atomOneDark["hljs-subst"], color: "#e88e96" },
};

// Code blocks scroll horizontally (overflow-x: auto), so they must be reachable
// by keyboard alone. Rendering the <pre> with tabIndex={0} lets keyboard users
// focus and scroll the region (WCAG 2.1.1 / axe scrollable-region-focusable).
const FocusablePre: React.FC<React.HTMLAttributes<HTMLPreElement>> = ({
    children,
    ...props
}) => (
    <pre tabIndex={0} aria-label="Code block" {...props}>
        {children}
    </pre>
);

const getHTML = (content: string) => {
    return (
        <div className="blog-content">
            <Markdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                    a({ node, ...props }) {
                        return (
                            <a
                                target="_blank"
                                className="text-secondary underline hover:opacity-80"
                                {...props}
                            />
                        );
                    },
                    h1({ node, ...props }) {
                        return (
                            <h1
                                className="text-2xl sm:text-3xl font-bold mt-6 mb-3"
                                {...props}
                            />
                        );
                    },
                    h2({ node, ...props }) {
                        return (
                            <h2
                                className="text-2xl font-bold mt-5 mb-3"
                                {...props}
                            />
                        );
                    },
                    h3({ node, ...props }) {
                        return (
                            <h3
                                className="text-xl font-semibold mt-4 mb-2"
                                {...props}
                            />
                        );
                    },
                    h4({ node, ...props }) {
                        return (
                            <h4
                                className="text-lg font-semibold mt-4 mb-2"
                                {...props}
                            />
                        );
                    },
                    h5({ node, ...props }) {
                        return (
                            <h5
                                className="text-base font-semibold mt-3 mb-2"
                                {...props}
                            />
                        );
                    },
                    h6({ node, ...props }) {
                        return (
                            <h6
                                className="text-sm font-semibold mt-3 mb-2"
                                {...props}
                            />
                        );
                    },
                    img({ node, ...props }) {
                        return (
                            <span className="flex flex-col items-center text-center my-4">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    alt={props.alt}
                                    {...props}
                                    className="rounded-md border border-border max-w-full"
                                />
                                {props.title && (
                                    <span className="mt-2 text-sm text-muted-foreground">
                                        {props.title}
                                    </span>
                                )}
                            </span>
                        );
                    },
                    blockquote({ node, ...props }) {
                        return (
                            <blockquote
                                className="border-l-4 border-primary bg-accent text-accent-foreground p-3 my-3 rounded"
                                {...props}
                            />
                        );
                    },
                    ul({ node, ...props }) {
                        return (
                            <ul
                                className="list-disc ml-5 sm:ml-6 my-2"
                                {...props}
                            />
                        );
                    },
                    ol({ node, ...props }) {
                        return (
                            <ol
                                className="list-decimal ml-5 sm:ml-6 my-2"
                                {...props}
                            />
                        );
                    },
                    li({ node, ...props }) {
                        return <li className="my-1" {...props} />;
                    },
                    hr({ node, ...props }) {
                        return (
                            <hr
                                className="my-4 border-t border-border"
                                {...props}
                            />
                        );
                    },
                    pre({ node, children, ...props }) {
                        // Fenced code blocks (```lang) and mermaid diagrams
                        // already render their own block wrapper: the
                        // SyntaxHighlighter's <pre> (FocusablePre) or Mermaid's
                        // <div>. Adding another <pre> here would produce invalid
                        // <pre><pre> / <pre><div> nesting, so pass the child
                        // through untouched in that case.
                        const codeChild = node?.children?.find(
                            (child) =>
                                child.type === "element" &&
                                child.tagName === "code"
                        );
                        const codeClassName =
                            codeChild && codeChild.type === "element"
                                ? codeChild.properties?.className
                                : undefined;
                        const isFenced =
                            Array.isArray(codeClassName) &&
                            codeClassName.some(
                                (name) =>
                                    typeof name === "string" &&
                                    name.startsWith("language-")
                            );

                        if (isFenced) {
                            return <>{children}</>;
                        }

                        // Indented / unlabelled code blocks scroll too; keep
                        // them keyboard-focusable.
                        return (
                            <pre tabIndex={0} {...props}>
                                {children}
                            </pre>
                        );
                    },
                    table({ node, ...props }) {
                        return (
                            <div className="table-scroll">
                                <table
                                    className="w-full border-collapse"
                                    {...props}
                                />
                            </div>
                        );
                    },
                    code(props) {
                        const { children, className, node, ref, ...rest } =
                            props;
                        const match = /language-(\w+)/.exec(className || "");
                        const language = match ? match[1] : "";
                        const content = String(children).replace(/\n$/, "");

                        if (language === "mermaid") {
                            return <Mermaid>{content}</Mermaid>;
                        }

                        return match ? (
                            <SyntaxHighlighter
                                {...rest}
                                PreTag={FocusablePre}
                                language={language}
                                style={accessibleCodeStyle}
                                customStyle={{
                                    borderRadius: "0.5rem",
                                    padding: "1rem",
                                    margin: "1rem 0",
                                    fontSize: "0.875rem",
                                }}
                            >
                                {content}
                            </SyntaxHighlighter>
                        ) : (
                            <code {...rest} className={className}>
                                {content}
                            </code>
                        );
                    },
                }}
            >
                {content}
            </Markdown>
        </div>
    );
};

export default getHTML;
