export default {
  providers: [
    {
      domain: globalThis.process?.env?.CONVEX_SITE_URL,
      applicationID: "convex",
    },
  ],
};
