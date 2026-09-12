import { defineApp } from "convex/server";
import resend from "@convex-dev/resend/convex.config";

const app = defineApp();
app.use(resend);
export default app;

export default {
  providers: [
    {
      domain: globalThis.process?.env?.CONVEX_SITE_URL,
      applicationID: "convex",
    },
  ],
};
