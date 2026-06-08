import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
    ...nextCoreWebVitals,
    ...nextTypescript,
    {
        rules: {
            // These fire on intentional client-only patterns (syncing state from
            // window/media-query reads after hydration), which are safe here.
            "react-hooks/set-state-in-effect": "warn",
        },
    },
    {
        ignores: [".next/**", "node_modules/**"],
    },
];

export default eslintConfig;
