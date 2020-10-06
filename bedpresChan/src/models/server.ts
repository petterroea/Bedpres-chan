import * as Mongoose from "mongoose";

const serverSchema = new Mongoose.Schema({
	discordId: String,
	interactionChannel: {
		type: String,
		required: false
    },
    subscriptions: {
		type: Map,
		of: String
	}
})

export interface IDiscordServer extends Mongoose.Document {
	discordId: string,
	subscriptions: Map<string, string>
}

export const DiscordServer = Mongoose.model<IDiscordServer>('Server', serverSchema)

