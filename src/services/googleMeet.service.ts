/**
 * GoogleMeet Service
 */
import { calendar_v3 } from "googleapis";
import { createEvent, createBaseEvent } from "./calendarAdapter.service.js";
import { getAuthedClient } from "../auth/googleAuthBootstrap.js";

type eventType = calendar_v3.Schema$Event;

export const createMeeting = async (
  title: string,
  description: string,
  date: string,
  attendeeEmails: string[],
): Promise<calendar_v3.Schema$Event> => {
  const baseEvent = createBaseEvent(title, description, date);

  const event: eventType = {
    ...baseEvent,
    attendees: attendeeEmails.map((email) => ({ email })),
    conferenceData: {
      createRequest: {
        requestId: Math.random().toString(36).substring(7),
        conferenceSolutionKey: {
          type: "hangoutsMeet",
        },
      },
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 24 * 60 },
        { method: "popup", minutes: 10 },
      ],
    },
  };

  const authClient = getAuthedClient();

  return await createEvent(authClient, event);
};
