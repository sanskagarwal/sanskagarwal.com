import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
    ...nextCoreWebVitals,
    ...nextTypescript,
    {
        rules: {
            // These fire on intentional client-only patterns (syncing state from
            // window/media-query reads after hydration), which are safe here.
            // Genuine, unavoidable cases are disabled inline at the call site.
            "react-hooks/set-state-in-effect": "warn",
            // The `{ node, ...props }` render-prop pattern (react-markdown) and
            // `{ ref, ...rest }` destructuring intentionally peel off props to
            // drop them before spreading; don't flag those siblings as unused.
            "@typescript-eslint/no-unused-vars": [
                "warn",
                { ignoreRestSiblings: true },
            ],
        },
    },
    {
        ignores: [".next/**", "node_modules/**"],
    },
];

export default eslintConfig;
