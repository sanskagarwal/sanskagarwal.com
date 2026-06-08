import Markdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import remarkGfm from "remark-gfm";

import Mermaid from "./Mermaid";
import { atomOneLight } from "react-syntax-highlighter/dist/esm/styles/hljs";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

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
                                className="text-3xl font-bold mt-6 mb-3"
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
                            <p className="flex flex-col items-center text-center">
                                <img alt={props.alt} {...props} />
                                <span>{props.title}</span>
                            </p>
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
                            <ul className="list-disc ml-6 my-2" {...props} />
                        );
                    },
                    ol({ node, ...props }) {
                        return (
                            <ol
                                className="list-decimal ml-6 my-2"
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
                    table({ node, ...props }) {
                        return (
                            <table
                                className="w-full border-collapse my-4"
                                {...props}
                            />
                        );
                    },
                    code(props) {
                        const { children, className, node, ...rest } = props;
                        const match = /language-(\w+)/.exec(className || "");
                        const language = match ? match[1] : "";
                        const content = String(children).replace(/\n$/, "");

                        if (language === "mermaid") {
                            return <Mermaid>{content}</Mermaid>;
                        }

                        return match ? (
                            // @ts-expect-error style prop typing mismatch with react-syntax-highlighter
                            <SyntaxHighlighter
                                {...rest}
                                PreTag="div"
                                language={language}
                                style={atomOneLight}
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
