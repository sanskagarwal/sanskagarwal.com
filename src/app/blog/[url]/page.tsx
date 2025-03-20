"use client";

import React, { useEffect } from "react";
import useSWR from "swr";
import { List } from "react-content-loader";
import {
    EmailIcon,
    EmailShareButton,
    LinkedinIcon,
    LinkedinShareButton,
    RedditIcon,
    RedditShareButton,
    TwitterShareButton,
    XIcon,
} from "react-share";
import readingTime from "reading-time";

import { fetcher } from "@/app/_dataprovider/ClientDataProvider";
import { Blog } from "@/app/_models/Blog";
import getHTML from "@/app/_utils/MarkdownToHTML";

type Params = {
    url: string;
};

// @ts-ignore
const insertScript = (id, parentElement) => {
    const script = window.document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.id = id;
    let url = window.location.origin + window.location.pathname;
    if (url.endsWith("/")) {
        url = url.slice(0, -1);
    }

    // Now the actual config and script-fetching function:
    script.innerHTML = `
    var remark_config = {
      host: "https://commento.sanskagarwal.com",
      site_id: "remark",
      url: "${url}",
      components: ["embed"],
      show_rss_subscription: false,
      no_footer: true
    };
    !function(e,n){for(var o=0;o<e.length;o++){var r=n.createElement("script"),c=".js",d=n.head||n.body;"noModule"in r?(r.type="module",c=".mjs"):r.async=!0,r.defer=!0,r.src=remark_config.host+"/web/"+e[o]+c,d.appendChild(r)}}(remark_config.components||["embed"],document);`;
    parentElement.appendChild(script);
};

// @ts-ignore
const removeScript = (id, parentElement) => {
    const script = window.document.getElementById(id);
    if (script) {
        parentElement.removeChild(script);
    }
};

const manageScript = () => {
    if (!window) {
        return;
    }
    const document = window.document;
    if (document.getElementById("remark42")) {
        insertScript("comments-script", document.body);
    }
    return () => removeScript("comments-script", document.body);
};

const recreateRemark42Instance = () => {
    if (!window) {
        return;
    }

    // @ts-ignore
    const remark42 = window.REMARK42;
    if (remark42) {
        remark42.destroy();

        // @ts-ignore
        remark42.createInstance(window.remark_config);
    }
};

const BlogPage: React.FC<{ params: Params }> = ({ params }) => {
    useEffect(() => {
        manageScript();
    }, []);

    useEffect(() => {
        recreateRemark42Instance();
    });

    const {
        data: blog,
        isLoading,
        error,
    } = useSWR<Blog>(`/api/blogs/${params.url}`, fetcher);

    return (
        <div className="grid grid-cols-6">
            <div
                className="py-4 bg-white md:col-start-2 md:col-span-4 col-span-6 px-5 md:px-10 lg:px-20 border-l border-r border-dotted
                    shadow-2xl md:shadow-lg"
            >
                {error && <div>Failed to load the blog.</div>}
                {isLoading && (
                    <div>
                        <List />
                        <br />
                        <List />
                    </div>
                )}
                {blog && (
                    <div>
                        <div className="ui text">
                            <h1 className="ui header">{blog.title}</h1>
                            <p className="ui text-gray-600">
                                {`${new Date(
                                    blog.published_at
                                ).toLocaleDateString(undefined, {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })} | ${readingTime(blog.content).text}`}
                            </p>
                            {getHTML(blog.content)}
                        </div>
                        <div className="ui center aligned segment">
                            <div className="inline">
                                <h4 className="ui header">Share this blog</h4>
                                <EmailShareButton
                                    url={window.location.href}
                                    subject={`Check out this blog: ${blog.title}`}
                                    body={`I found this blog interesting and thought you might like it too! Link to the blog: ${window.location.href}`}
                                    className="ui button"
                                >
                                    <EmailIcon size={32} round />
                                </EmailShareButton>
                                <TwitterShareButton
                                    url={window.location.href}
                                    title={blog.title}
                                    hashtags={[blog.category]}
                                    className="ui button"
                                >
                                    <XIcon size={32} round />
                                </TwitterShareButton>
                                <LinkedinShareButton
                                    url={window.location.href}
                                    title={blog.title}
                                    summary={blog.summary}
                                    source="Sanskar Agarwal's Blog"
                                    className="ui button"
                                >
                                    <LinkedinIcon size={32} round />
                                </LinkedinShareButton>
                                <RedditShareButton
                                    url={window.location.href}
                                    title={blog.title}
                                    className="ui button"
                                >
                                    <RedditIcon size={32} round />
                                </RedditShareButton>
                            </div>
                        </div>
                        <br />
                    </div>
                )}
                <div id="remark42"></div>
            </div>
        </div>
    );
};

export default BlogPage;
