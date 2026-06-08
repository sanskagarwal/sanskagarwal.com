import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
    FaArrowRight,
    FaDownload,
    FaPenToSquare,
    FaNoteSticky,
} from "react-icons/fa6";

import { Constants } from "./_utils/Constants";
import { socialLinks } from "./_utils/SocialLinks";
import { getBlogs } from "./_dataprovider/BlogDataProvider";
import { getNotes } from "./_dataprovider/NoteDataProvider";
import { Button } from "./_components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "./_components/ui/Card";
import { Badge } from "./_components/ui/Badge";

const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

export const revalidate = 3600;

const Home = async () => {
    const [blogs, notes] = await Promise.all([getBlogs(), getNotes()]);

    const recentBlogs = [...blogs]
        .sort(
            (a, b) =>
                new Date(b.published_at).getTime() -
                new Date(a.published_at).getTime()
        )
        .slice(0, 3);

    const recentNotes = [...notes]
        .sort(
            (a, b) =>
                new Date(b.published_at).getTime() -
                new Date(a.published_at).getTime()
        )
        .slice(0, 3);

    return (
        <div className="mx-auto w-full max-w-5xl px-5 py-12 md:px-8 lg:px-12">
            {/* Hero */}
            <section className="flex flex-col-reverse items-center gap-8 md:flex-row md:items-center md:justify-between">
                <div className="text-center md:text-left">
                    <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                        Software Engineer
                    </p>
                    <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">
                        Sanskar Agarwal
                    </h1>
                    <p className="mt-4 max-w-xl text-lg text-muted-foreground">
                        Full-Stack Web and Security Engineer passionate about
                        building scalable applications and designing secure
                        distributed systems. Outside of work, I enjoy writing
                        and occasionally training for marathons I impulsively
                        signed up for months ago.
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-3 md:justify-start">
                        <Link href="/blog">
                            <Button>
                                Read the Blog
                                <FaArrowRight />
                            </Button>
                        </Link>
                        <Link
                            href={Constants.Resume_URI}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button variant="secondary">
                                Resume
                                <FaDownload />
                            </Button>
                        </Link>
                    </div>
                    <div className="mt-6 flex justify-center gap-2 md:justify-start">
                        {socialLinks.map((social) => {
                            const Icon = social.icon;
                            return (
                                <a
                                    key={social.name}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.name}
                                    className="group flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card transition-colors hover:bg-accent"
                                >
                                    <Icon
                                        className={`${social.colorClass ?? ""} group-hover:!text-primary`}
                                    />
                                </a>
                            );
                        })}
                    </div>
                </div>
                <div className="shrink-0">
                    <Image
                        src="/me.png"
                        width={180}
                        height={180}
                        alt="Sanskar Agarwal"
                        className="rounded-full border border-border shadow-md"
                        priority
                    />
                </div>
            </section>

            {/* Recent posts */}
            <section className="mt-16">
                <div className="flex items-center justify-between">
                    <h2 className="flex items-center gap-2 text-2xl font-bold">
                        <FaPenToSquare className="text-primary" />
                        Latest Posts
                    </h2>
                    <Link
                        href="/blog"
                        className="text-sm font-semibold text-primary hover:underline"
                    >
                        View all
                    </Link>
                </div>
                {recentBlogs.length === 0 ? (
                    <p className="mt-4 text-muted-foreground">
                        No posts yet — check back soon.
                    </p>
                ) : (
                    <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {recentBlogs.map((blog) => (
                            <Link
                                key={blog.id.toString()}
                                href={`/blog/${blog.blog_url}`}
                                className="group"
                            >
                                <Card className="h-full transition-shadow group-hover:shadow-md">
                                    <CardHeader>
                                        <Badge className="w-fit">
                                            {blog.category}
                                        </Badge>
                                        <CardTitle className="group-hover:text-primary">
                                            {blog.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">
                                            {formatDate(blog.published_at)}
                                        </p>
                                        <p className="mt-2 line-clamp-3 text-sm">
                                            {blog.summary}
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </section>

            {/* Recent notes */}
            {recentNotes.length > 0 && (
                <section className="mt-16">
                    <div className="flex items-center justify-between">
                        <h2 className="flex items-center gap-2 text-2xl font-bold">
                            <FaNoteSticky className="text-primary" />
                            Latest Notes
                        </h2>
                        <Link
                            href="/notes"
                            className="text-sm font-semibold text-primary hover:underline"
                        >
                            View all
                        </Link>
                    </div>
                    <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {recentNotes.map((note) => (
                            <Link
                                key={note.id.toString()}
                                href={`/notes/${note.note_url}`}
                                className="group"
                            >
                                <Card className="h-full transition-shadow group-hover:shadow-md">
                                    <CardHeader>
                                        <Badge
                                            variant="secondary"
                                            className="w-fit"
                                        >
                                            {note.category}
                                        </Badge>
                                        <CardTitle className="group-hover:text-primary">
                                            {note.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">
                                            {formatDate(note.published_at)}
                                        </p>
                                        <p className="mt-2 line-clamp-3 text-sm">
                                            {note.summary}
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default Home;
