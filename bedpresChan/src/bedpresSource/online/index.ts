import axios from "axios";
import { BedpresSource } from "../";
import { ONLINEWEB_START_URL, USER_AGENT } from "../../constants";
import { Bedpres, IBedpres } from "../../models/bedpres";
import { onlinewebV2UrlFromV1, parseOwDateString, wait } from "../../utils";
import { EventResult, EventType } from "./types";

const MODULE_NAME = "Online";

const getEvents = async (url: string): Promise<EventResult> => {
  return (
    await axios({
      method: "GET",
      url,
      headers: { "User-Agent": USER_AGENT },
    })
  ).data;
};

const getEventTypeString = (t: EventType) => {
  switch (t) {
    case EventType.BEDPRES:
      return "bedpres";
      break;
    case EventType.KURS:
      return "kurs";
      break;
    case EventType.KJELLEREN:
      return "kjelleren";
      break;
    default:
      return "random-ass type event";
      break;
  }
};

export const OnlineBedpresFetcher: BedpresSource = {
  name: MODULE_NAME,
  description: "Linjeforeningen online",
  fetchNewBedpresses: async () => {
    const bedpresList: IBedpres[] = [];

    let worthLookingFurther = true;
    let currentUrl = ONLINEWEB_START_URL;

    while (worthLookingFurther) {
      console.log(`Fetching events for ${currentUrl}`);
      const eventResult: EventResult = await getEvents(currentUrl);
      console.log(
        `Result count: ${eventResult.results.length}. Total ${eventResult.count}`
      );

      worthLookingFurther = false;

      for (const event of eventResult.results) {
        const eventDate = parseOwDateString(event.event_start);

        const regStartObj = event.attendance_event?.registration_start;
        let regStart: Date = null;
        if (regStartObj !== undefined) {
          regStart = parseOwDateString(regStartObj);
        }

        const bedpres = new Bedpres({
          id: event.id,
          source: MODULE_NAME,
          url: onlinewebV2UrlFromV1(
            `http://online.ntnu.no${event.absolute_url}`
          ),
          title: event.title,
          type: getEventTypeString(event.event_type),
          description: event.description,
          ingress: event.ingress,
          ingress_short: event.ingress_short,
          event_start: eventDate,
          registrationReminderSent: false,
          remindedServers: [],
          registration_start: regStart,
        });
        bedpresList.push(bedpres);
        if (eventDate.getTime() > new Date().getTime())
          worthLookingFurther = true;
      }

      await wait(1000);

      if (eventResult.next !== null) {
        currentUrl = eventResult.next;
      } else {
        worthLookingFurther = false;
      }

      console.log("Done with iteration");
      await wait(1000);
    }
    console.log(
      "Ran out of iterations where we had at least one event ahead of our time."
    );

    return bedpresList;
  },
};
