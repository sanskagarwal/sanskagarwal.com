type ClassValue = string | number | null | false | undefined;

export const cn = (...classes: ClassValue[]): string =>
    classes.filter(Boolean).join(" ");
