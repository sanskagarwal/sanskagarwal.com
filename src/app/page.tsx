import Link from "next/link";
import React from "react";

const Home: React.FC = () => {
    return (
        <>
            <h1 className="ui header">(Work in Progress!) Sanskar Agarwal</h1>
            <h4 className="ui header">Software Engineer</h4>
            <p>
                I am proficient in Full stack Web, Security & Software
                Engineering in general and enjoy reading about distributed
                systems and developing applications at scale. Outside of work, I
                sometimes write stuff and train for random marathons I signed up
                for months back.
            </p>
            <p>Check out my blog <Link href="/blog">here</Link></p>
        </>
    );
};

export default Home;
