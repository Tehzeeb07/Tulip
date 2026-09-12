import { components } from "./_generated/api";
import { Resend } from "@convex-dev/resend";
import { action } from "./_generated/server";
import { v } from "convex/values";

export const resend = new Resend(components.resend, {});

export const sendCustomOrderRequest = action({
  args: {
    name: v.string(),
    email: v.string(),
    occasion: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    await resend.sendEmail(ctx, {
      from: "Tulip Consultations <onboarding@resend.dev>",
      to: "your-real-email@example.com", // replace with the email Tulip should receive requests at
      subject: `New consultation request — ${args.occasion}`,
      html: `
        <p><strong>Name:</strong> ${args.name}</p>
        <p><strong>Email:</strong> ${args.email}</p>
        <p><strong>Occasion:</strong> ${args.occasion}</p>
        <p><strong>Message:</strong></p>
        <p>${args.message}</p>
      `,
    });
  },
});