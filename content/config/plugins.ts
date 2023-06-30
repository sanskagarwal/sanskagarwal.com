export default ({ env }) => {
    return {
        upload: {
            config: {
                provider: "strapi-provider-upload-azure-storage",
                providerOptions: {
                    account: env("STORAGE_ACCOUNT"),
                    accountKey: env("STORAGE_ACCOUNT_KEY"),
                    containerName: env("STORAGE_CONTAINER_NAME"),
                    defaultPath: "assets",
                    cdnBaseURL: env("STORAGE_CDN_URL"),
                },
            },
        },
    };
};
