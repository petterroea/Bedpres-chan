//https://github.com/dotkom/onlineweb4/blob/develop/apps/events/constants.py#L21
export enum EventType {
	SOSIALT = 1,
	BEDPRES = 2,
	KURS = 3,
	UTFLUKT = 4,
	EKSKURSJON = 5,
	INTERNT = 6,
	ANNET = 7,
	KJELLEREN = 8
}

export interface AttendanceExtra {
	id: number,
	choice: string,
	note: string|null
}

export interface AttendanceEvent {
	id: number,
    max_capacity: number,
    waitlist: boolean,
    guest_attendance: boolean,
    registration_start: string,
    registration_end: string,
    unattend_deadline: string,
    automatically_set_marks: boolean,
    rule_bundles: any[],
    number_on_waitlist: number,
    number_of_seats_taken: number,
    extras: AttendanceExtra[]
} 

export interface Event {
	absolute_url: string,
	attendance_event: AttendanceEvent|null,
	company_event: any[],
	description: string,
	event_start: string, //'2020-09-10T17:00:00+02:00'
	event_end: string, //'2020-09-10T22:00:00+02:00'
	event_type: EventType, //2
	id: number,
	image: string|null,
	ingress: string,
	ingress_short: string,
	location: string,
	slug: string,
	title: string,
	organizer_name: string,
	organizer: number

}

export interface EventResult {
	count: number,
	next: string|null,
	previous: string|null,
	results: Event[]
}
