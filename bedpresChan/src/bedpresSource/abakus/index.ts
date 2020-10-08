import axios from "axios";
import { BedpresSource } from "../";
import { ABAKUS_START_URL, USER_AGENT } from "../../constants";
import { Bedpres, IBedpres } from "../../models/bedpres";
import { parseOwDateString } from "../../utils";
import { EventResult, SingleEvent } from "./types";

const MODULE_NAME = "Abakus";

const getDateString = (date: Date) => {
  return `${date.getFullYear()}-${date
    .getMonth()
    .toString()
    .padStart(2, `0`)}-${date.getDate().toString().padStart(2, `0`)}`;
};

const getEvents = async (url: string): Promise<EventResult> => {
  const now = new Date();

  return (
    await axios({
      method: "GET",
      url: `${url}?date_after=${getDateString(now)}`,
      headers: { "User-Agent": USER_AGENT },
    })
  ).data;
};

const getEvent = async (url: string, id: number): Promise<SingleEvent> => {
  return (
    await axios({
      method: "GET",
      url: `${url}${id}/`,
      headers: { "User-Agent": USER_AGENT },
    })
  ).data;
};

export const AbakusBedpresFetcher: BedpresSource = {
  name: MODULE_NAME,
  description: "Linjeforeningen Abakus",
  fetchNewBedpresses: async () => {
    const bedpresList: IBedpres[] = [];

    console.log(`Fetching events for ${ABAKUS_START_URL}`);
    const eventResult: EventResult = await getEvents(ABAKUS_START_URL);
    console.log(`Result count: ${eventResult.results.length}`);

    for (const event of eventResult.results) {
      const eventData: SingleEvent = await getEvent(ABAKUS_START_URL, event.id);

      const eventDate = parseOwDateString(eventData.startTime);

      // Registration start date depends on pool
      // date: eventData.pools[0].activationDate
      // name of Pool: eventData.pools[0].name
      let regStartObj: string | undefined;
      for (const pool of eventData.pools) {
        for (const permissionGroup of pool.permissionGroups) {
          if (permissionGroup.name === "4. klasse Datateknologi") {
            regStartObj = pool.activationDate;
          }
        }
      }

      let regStart: Date = null;
      if (regStartObj !== undefined) {
        regStart = parseOwDateString(regStartObj);
      }

      const bedpres = new Bedpres({
        id: eventData.id,
        source: MODULE_NAME,
        url: `https://abakus.no/events/${eventData.id}`,
        title: eventData.title,
        type: eventData.eventType,
        description: eventData.description,
        ingress: eventData.text,
        ingress_short: eventData.text,
        event_start: eventDate,
        registrationReminderSent: false,
        remindedServers: [],
        registration_start: regStart,
      });
      bedpresList.push(bedpres);
    }

    return bedpresList;
  },
};
