import React from "react";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";
import { ReadModel } from "../_models/ReadModel";
import readingTime from "reading-time";
import getHTML from "../_utils/MarkdownToHTML";
import SocialShare from "./SocialShare";
import Remark42 from "./Remark42";
import ReadingShell from "./ReadingShell";
import { Badge } from "./ui/Badge";
import { Constants } from "../_utils/Constants";

const ReadComponent: React.FC<{
    readModel: ReadModel;
    backHref?: string;
    backLabel?: string;
    canonicalPath?: string;
}> = ({ readModel, backHref, backLabel, canonicalPath }) => {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: readModel.title,
        description: readModel.summary,
        datePublished: new Date(readModel.published_at).toISOString(),
        articleSection: readModel.category || undefined,
        author: {
            "@type": "Person",
            name: "Sanskar Agarwal",
            url: Constants.SITE_URI,
        },
        ...(canonicalPath
            ? { mainEntityOfPage: `${Constants.SITE_URI}${canonicalPath}` }
            : {}),
    };

    return (
        <ReadingShell>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {backHref && (
                <Link
                    href={backHref}
                    className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                    <FaArrowLeft className="text-xs" />
                    {backLabel ?? "Back"}
                </Link>
            )}
            <header className="mb-6 border-b border-border pb-6">
                {readModel.category && (
                    <Badge className="mb-3">{readModel.category}</Badge>
                )}
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                    {readModel.title}
                </h1>
                <p className="mt-3 text-sm text-muted-foreground">
                    {`${new Date(readModel.published_at).toLocaleDateString(
                        undefined,
                        {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        }
                    )} · ${readingTime(readModel.content).text}`}
                </p>
            </header>
            {getHTML(readModel.content)}
            <SocialShare readModel={readModel} />
            <Remark42 />
        </ReadingShell>
    );
};

export default ReadComponent;
