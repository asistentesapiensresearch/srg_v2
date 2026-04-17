import { defineFunction, secret } from "@aws-amplify/backend";

export const sendEmail = defineFunction({
  name: "send-email",
  entry: "./handler.ts",
  resourceGroupName: "data",
  environment: {
    BREVO_API_KEY: secret("BREVO_API_KEY"),
    BREVO_SENDER_EMAIL: secret("BREVO_SENDER_EMAIL"),
    BREVO_SENDER_NAME: secret("BREVO_SENDER_NAME"),
  },
});