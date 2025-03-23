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

import { ReadModel } from "../_models/ReadModel";

const SocialShare: React.FC<{ readModel: ReadModel }> = ({ readModel }) => {
    return (
        <div className="ui center aligned segment">
            <h4 className="ui header">Share this</h4>
            <div className="inline">
                <Popup
                    trigger={
                        <EmailShareButton
                            url={window.location.href}
                            subject={`Check out this read: ${readModel.title}`}
                            body={`I found this read interesting and thought you might like it too! Link: ${window.location.href}`}
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
                            title={readModel.title}
                            hashtags={[readModel.category]}
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
                            title={readModel.title}
                            summary={readModel.summary}
                            source="Sanskar's Website"
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
                            title={readModel.title}
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
