import { IBedpres } from "../models/bedpres";

import { AbakusBedpresFetcher } from "./abakus";
import { OnlineBedpresFetcher } from "./online";

export interface BedpresSource {
  name: string;
  description: string;
  fetchNewBedpresses: () => Promise<IBedpres[]>;
}

export const BEDPRES_SOURCES = {
  Online: OnlineBedpresFetcher,
  Abakus: AbakusBedpresFetcher,
};
