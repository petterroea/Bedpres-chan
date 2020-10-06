import { Bedpres, IBedpres } from '../models/bedpres'

import { OnlineBedpresFetcher } from './online'

export interface BedpresSource {
    name: string,
    description: string,
    fetchNewBedpresses: () => Promise<IBedpres[]>
}

export const BEDPRES_SOURCES = {
    Online: OnlineBedpresFetcher
}