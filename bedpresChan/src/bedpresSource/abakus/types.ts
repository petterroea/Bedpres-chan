export enum EventType {
  COMPANY_PRESENTATION = "company_presentation",
  LUNCH_PRESENTATION = "lunch_presentation",
  ALTERNATIVE_PRESENTATION = "alternative_presentation",
  COURSE = "course",
  KID_EVENT = "kid_event",
  PARTY = "party",
  SOCIAL = "social",
  OTHER = "other",
  EVENT = "event",
}

enum EventStatusType {
  NORMAL = "NORMAL",
  INFINITE = "INFINITE",
  OPEN = "OPEN",
  TBA = "TBA",
}

interface Company {
  id: number;
  name: string;
  description: string;
  eventCount: number;
  joblistingCount: number;
  website: string;
  companyType: string;
  address: string;
  logo: string;
  thumbnail: string;
  active: boolean;
}

interface ResponsibleGroup {
  id: number;
  name: string;
  contactEmail: string;
}

interface AbakusUser {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  fullName: string;
  gender: string;
  profilePicture: string | null;
  internalEmailAddress: string;
}

interface PermissionGroups {
  id: number;
  name: string;
  description: string;
  contactEmail: string;
  parent: number;
  logo: string | null;
  type: string; // Maybe make Enum for it
  showBadge: boolean;
}

interface Pool {
  id: number;
  name: string;
  capacity: number;
  activationDate: string;
  permissionGroups: PermissionGroups[];
  registrationCount: number;
}

interface Tag {
  tag: string;
  usages: number;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  cover: string;
  eventType: EventType;
  eventStatusType: EventStatusType;
  location: string;
  startTime: string;
  endTime: string;
  thumbnail: string;
  totalCapacity: number;
  company: Company | null;
  registrationCount: number;
  tags: string[];
  activationTime: null;
  isAdmitted: boolean;
  survey: null | number;
}

export interface SingleEvent {
  id: number;
  title: string;
  description: string;
  cover: string;
  text: string;
  eventType: EventType;
  eventStatusType: EventStatusType;
  location: string;
  comments: string[]; // Might be wrong
  contentTarget: string;
  startTime: string;
  endTime: string;
  mergeTime: string | null;
  pools: Pool[];
  registrationCloseTime: string;
  registrationDeadlineHours: number;
  unregistrationDeadline: string;
  company: Company | null;
  responsibleGroup: ResponsibleGroup; // might be null?
  activeCapacity: number;
  feedbackDescription: string;
  feedbackRequired: boolean;
  isPriced: boolean;
  priceMember: number;
  priceGuest: number;
  useStripe: boolean;
  paymentDueDate: string | null;
  useCaptcha: boolean;
  waitingRegistrationCount: number;
  tags: Tag[];
  isMerged: boolean;
  heedPenalties: boolean;
  createdBy: AbakusUser;
  isAbakomOnly: boolean;
  registrationCount: number;
  survey: number | null;
  useConsent: boolean;
  youtubeUrl: string;
  price: number;
  activationTime: string | null;
  isAdmitted: boolean;
  spotsLeft: number | null;
  actionGrant: string[];
}

export interface EventResult {
  actionGrant: string[];
  results: Event[];
}
