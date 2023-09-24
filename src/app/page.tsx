"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "semantic-ui-react";

const Home: React.FC = () => {
    return (
        <>
            <div className="flex gap-10 flex-col h-3/6 xl:h-4/6 md:flex-row xl:px-48 lg:px-16">
                <div className="basis-1/2 justify-center text-center flex flex-col">
                    <h1 className="ui header">Software Engineer</h1>
                    <p className="!text-lg !text-left">
                        I am proficient in Full stack Web, Security & Software
                        Engineering in general and enjoy reading about
                        distributed systems and developing applications at
                        scale. Outside of work, I sometimes write stuff and
                        train for random marathons I signed up for months back.
                    </p>
                    <br />
                    <p>
                        <Link
                            className="ui teal icon right labeled button"
                            href="/blog"
                        >
                            Blog
                            <Icon name="arrow right" />
                        </Link>
                    </p>
                </div>
                <div className="basis-1/2 grid grid-cols-2 grid-rows-2 gap-4">
                    <div className="border-dashed row-start-1 row-end-1 col-start-1 col-end-1 self-end justify-self-end">
                        <Image
                            src="/code.svg"
                            width={150}
                            height={150}
                            alt="Code"
                        />
                    </div>
                    <div className="border-dashed row-start-1 row-end-1 col-start-2 col-end-2 self-end justify-self-start">
                        <Image
                            src="/gym.svg"
                            width={100}
                            height={100}
                            alt="Gym"
                        />
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
        </>
    );
};

export default Home;
