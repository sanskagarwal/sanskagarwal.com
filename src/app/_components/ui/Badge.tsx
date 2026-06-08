import React from "react";
import { cn } from "../../_utils/cn";

type Variant = "default" | "secondary" | "outline";

const variantClasses: Record<Variant, string> = {
    default: "bg-primary text-primary-foreground border-transparent",
    secondary: "bg-muted text-muted-foreground border-transparent",
    outline: "bg-transparent text-foreground border-border",
};

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
    variant?: Variant;
};

export const Badge: React.FC<BadgeProps> = ({
    className,
    variant = "default",
    ...props
}) => (
    <span
        className={cn(
            "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize",
            variantClasses[variant],
            className
        )}
        {...props}
    />
);
