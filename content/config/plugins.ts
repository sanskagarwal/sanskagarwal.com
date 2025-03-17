export default ({ env }) => ({
  upload: {
    config: {
      provider: "strapi-provider-upload-azure-storage",
      providerOptions: {
        authType: env("STORAGE_AUTH_TYPE", "default"),
        account: env("STORAGE_ACCOUNT"),
        accountKey: env("STORAGE_ACCOUNT_KEY"), //either account key or sas token is enough to make authentication
        containerName: env("STORAGE_CONTAINER_NAME"),
        defaultPath: "assets",
        cdnBaseURL: env("STORAGE_CDN_URL"), // optional
      },
    },
  },
});
