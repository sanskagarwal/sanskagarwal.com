"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaArrowRight, FaDownload } from "react-icons/fa6";
import { Constants } from "./_utils/Constants";

const Home: React.FC = () => {
    return (
        <div className="py-4 flex gap-10 flex-col h-3/6 xl:h-4/6 md:flex-row px-5 md:px-10 lg:px-16 xl:px-48">
            <div className="basis-1/2 justify-center text-center grid grid-cols-2 gap-4">
                <div className="self-end col-span-2">
                    <h1 className="text-3xl font-bold mb-4">
                        Software Engineer
                    </h1>
                    <p className="!text-lg !text-left">
                        I&apos;m a Full-Stack Web and Security Engineer
                        passionate about building scalable applications and
                        designing secure distributed systems.
                        <br />
                        Outside of work, I enjoy writing and occasionally
                        training for marathons I impulsively signed up for
                        months ago.
                    </p>
                </div>
                <div className="row-start-2 row-end-2 col-start-1 col-end-1 justify-self-end">
                    <Link
                        className="inline-flex items-center gap-2 px-6 py-2 rounded-md bg-teal-500 text-white font-semibold shadow hover:bg-teal-600 transition-colors"
                        href="/blog"
                    >
                        Blog
                        <FaArrowRight />
                    </Link>
                </div>
                <div className="row-start-2 row-end-2 col-start-2 col-end-2 justify-self-start">
                    <Link
                        className="inline-flex items-center gap-2 px-6 py-2 rounded-md bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-colors"
                        href={Constants.Resume_URI}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Resume
                        <FaDownload />
                    </Link>
                </div>
            </div>
            <div className="basis-1/2 justify-center text-center grid grid-cols-2 gap-4">
                <div className="border-dashed row-start-1 row-end-1 col-start-1 col-end-1 self-end justify-self-end">
                    <Image
                        src="/code.svg"
                        width={150}
                        height={150}
                        alt="Code"
                    />
                </div>
                <div className="border-dashed row-start-1 row-end-1 col-start-2 col-end-2 self-end justify-self-start">
                    <Image src="/gym.svg" width={100} height={100} alt="Gym" />
                </div>
                <div className="border-dashed row-start-2 row-end-2 col-start-2 col-end-2 self-start justify-self-start">
                    <Image
                        src="/marathon.svg"
                        width={80}
                        height={80}
                        alt="Marathon"
                    />
                </div>
                <div className="border-dashed row-start-2 row-end-2 col-start-1 col-end-1 self-start justify-self-end">
                    <Image
                        src="/library.svg"
                        width={50}
                        height={50}
                        alt="Library"
                    />
                </div>
            </div>
        </div>
    );
};

export default Home;
