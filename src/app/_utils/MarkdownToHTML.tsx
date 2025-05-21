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
                                className="text-blue-600 visited:text-purple-600"
                                {...props}
                            />
                        );
                    },
                    h1({ node, ...props }) {
                        return <h1 className="ui header" {...props} />;
                    },
                    h2({ node, ...props }) {
                        return <h2 className="ui header" {...props} />;
                    },
                    h3({ node, ...props }) {
                        return <h3 className="ui header" {...props} />;
                    },
                    h4({ node, ...props }) {
                        return <h4 className="ui header" {...props} />;
                    },
                    h5({ node, ...props }) {
                        return <h5 className="ui header" {...props} />;
                    },
                    h6({ node, ...props }) {
                        return <h6 className="ui header" {...props} />;
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
                        // @ts-ignore
                        return <p className="ui message" {...props} />;
                    },
                    ul({ node, ...props }) {
                        return <ul className="ui list" {...props} />;
                    },
                    ol({ node, ...props }) {
                        return <ol className="ui ordered list" {...props} />;
                    },
                    li({ node, ...props }) {
                        return <li className="ui item" {...props} />;
                    },
                    hr({ node, ...props }) {
                        return <div className="ui divider" {...props} />;
                    },
                    table({ node, ...props }) {
                        return (
                            <table
                                className="ui selectable celled table"
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
                            // @ts-ignore
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
