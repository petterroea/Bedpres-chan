import * as Mongoose from "mongoose";

export const bedpresSchema = new Mongoose.Schema({
	source: String,
	id: Number,
	url: String,
	type: String,
	title: String,
	description: String,
	ingress: String,
	ingress_short: String,
	event_start: Date,
	registration_start: {
		type: Date,
		required: false
	},
	remindedServers: [String]
})

export interface IBedpres extends Mongoose.Document {
	source: string,
	id: number,
	url: string,
	type: String,
	title: string,
	description: string,
	ingress: string,
	ingress_short: string,
	event_start: Date,
	registration_start?: Date,
	remindedServers: string[]
}

export const Bedpres = Mongoose.model<IBedpres>('Bedpres', bedpresSchema)

