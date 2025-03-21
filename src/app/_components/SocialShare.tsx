import React from "react";
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
import { Popup } from "semantic-ui-react";

import { Blog } from "../_models/Blog";

const SocialShare: React.FC<{ blog: Blog }> = ({ blog }) => {
    return (
        <div className="ui center aligned segment">
            <h4 className="ui header">Share this blog</h4>
            <div className="inline">
                <Popup
                    trigger={
                        <EmailShareButton
                            url={window.location.href}
                            subject={`Check out this blog: ${blog.title}`}
                            body={`I found this blog interesting and thought you might like it too! Link to the blog: ${window.location.href}`}
                            className="ui button"
                        >
                            <EmailIcon size={32} round />
                        </EmailShareButton>
                    }
                    content="Share via Email"
                />

                <Popup
                    trigger={
                        <TwitterShareButton
                            url={window.location.href}
                            title={blog.title}
                            hashtags={[blog.category]}
                            className="ui button"
                        >
                            <XIcon size={32} round />
                        </TwitterShareButton>
                    }
                    content="Share on X"
                />

                <Popup
                    trigger={
                        <LinkedinShareButton
                            url={window.location.href}
                            title={blog.title}
                            summary={blog.summary}
                            source="Sanskar Agarwal's Blog"
                            className="ui button"
                        >
                            <LinkedinIcon size={32} round />
                        </LinkedinShareButton>
                    }
                    content="Share on LinkedIn"
                />
                <Popup
                    trigger={
                        <RedditShareButton
                            url={window.location.href}
                            title={blog.title}
                            className="ui button"
                        >
                            <RedditIcon size={32} round />
                        </RedditShareButton>
                    }
                    content="Share on Reddit"
                />
            </div>
        </div>
    );
};

export default SocialShare;
