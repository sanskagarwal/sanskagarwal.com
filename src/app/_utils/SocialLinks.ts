import {
    FaLinkedin,
    FaGithub,
    FaInstagram,
    FaGoodreadsG,
} from "react-icons/fa6";

import { NavLinks } from "../_models/NavLinks";

export const socialLinks: NavLinks[] = [
    {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/sanskar-agarwal/",
        icon: FaLinkedin,
        colorClass: "text-blue-700",
    },
    {
        name: "GitHub",
        url: "https://github.com/sanskagarwal",
        icon: FaGithub,
        colorClass: "text-foreground",
    },
    {
        name: "Instagram",
        url: "https://www.instagram.com/sansk.agarwal/",
        icon: FaInstagram,
        colorClass: "text-pink-500",
    },
    {
        name: "Goodreads",
        url: "https://www.goodreads.com/sanskagarwal",
        icon: FaGoodreadsG,
        colorClass: "text-yellow-600",
    },
];
