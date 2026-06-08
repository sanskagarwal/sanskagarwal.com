"use client";

import React from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";

import { cn } from "../../_utils/cn";

type RevealProps = {
    children: React.ReactNode;
    className?: string;
    /** Delay (seconds) before the animation starts. */
    delay?: number;
    /** Direction the element travels in from. */
    from?: "up" | "down" | "left" | "right" | "none";
    /** Render element. Defaults to a div. */
    as?: "div" | "section" | "li" | "article" | "span";
};

const OFFSET = 16;

const offsetFor = (from: NonNullable<RevealProps["from"]>) => {
    switch (from) {
        case "up":
            return { y: OFFSET };
        case "down":
            return { y: -OFFSET };
        case "left":
            return { x: OFFSET };
        case "right":
            return { x: -OFFSET };
        default:
            return {};
    }
};

/**
 * Fades (and optionally slides) its children into view once they scroll into
 * the viewport. Honors `prefers-reduced-motion` by rendering content statically.
 */
export const Reveal: React.FC<RevealProps> = ({
    children,
    className,
    delay = 0,
    from = "up",
    as = "div",
}) => {
    const reduceMotion = useReducedMotion();

    if (reduceMotion) {
        const Tag = as;
        return <Tag className={className}>{children}</Tag>;
    }

    const variants: Variants = {
        hidden: { opacity: 0, ...offsetFor(from) },
        visible: { opacity: 1, x: 0, y: 0 },
    };

    const MotionTag = motion[as];

    return (
        <MotionTag
            className={cn(className)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
            variants={variants}
        >
            {children}
        </MotionTag>
    );
};

export default Reveal;
