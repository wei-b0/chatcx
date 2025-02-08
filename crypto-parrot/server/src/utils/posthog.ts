import { PostHog } from "posthog-node";
import dotenv from "dotenv";

dotenv.config();

const posthogClient = new PostHog(process.env.POSTHOG_API_KEY as string, {
  host: "https://us.i.posthog.com",
});

export const trackEvent = (
  userId: string,
  eventName: string,
  properties: Record<string, any> = {}
) => {
  posthogClient.capture({
    distinctId: userId,
    event: eventName,
    properties,
  });
};

export const identifyUser = (
  userId: string,
  properties: Record<string, any> = {}
) => {
  posthogClient.identify({
    distinctId: userId,
    properties,
  });
};

/**
 * Shut down the PostHog client (call this when your bot shuts down)
 */
export const shutdownPosthog = () => {
  posthogClient.shutdown();
};
