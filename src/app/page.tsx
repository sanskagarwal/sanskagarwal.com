import Link from "next/link";
import React from "react";

const Home: React.FC = () => {
    return (
        <>
            <div className="flex flex-row">
                <div className="basis-1/2">
                    <h2 className="ui header">Software Engineer (Site WIP)</h2>
                    <p>
                        I am proficient in Full stack Web, Security & Software
                        Engineering in general and enjoy reading about
                        distributed systems and developing applications at
                        scale. Outside of work, I sometimes write stuff and
                        train for random marathons I signed up for months back.
                    </p>
                    <p>
                        Check out my blog <Link href="/blog">here</Link>
                    </p>
                </div>
                <div className="basis-1/2 grid grid-cols-2 grid-rows-2 place-items-center">
                    <div className="border-dashed row-start-1 row-end-1 col-start-1 col-end-1">
                        <h1>Hello</h1>
                    </div>
                    <div className="border-dashed row-start-1 row-end-1 col-start-2 col-end-2">
                        <h1>World</h1>
                    </div>
                    <div className="border-dashed row-start-2 row-end-2 col-start-2 col-end-2">
                        <h1>Hello</h1>
                    </div>
                    <div className="border-dashed row-start-2 row-end-2 col-start-1 col-end-1">
                        <h1>World</h1>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
