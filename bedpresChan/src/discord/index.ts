import { ACTIVATOR, TIMEZONE } from "../constants";
import { Bedpres, IBedpres } from "../models/bedpres";
import { DiscordServer } from "../models/server";

import { Client, Collection, Guild, MessageEmbed } from "discord.js";

import { BEDPRES_SOURCES } from "../bedpresSource";

import { wait } from "../utils";

const client = new Client();

import { ERROR_MESSAGES, MESSAGES } from "../strings";

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

if (typeof DISCORD_TOKEN === "undefined") {
  throw new Error("DISCORD_TOKEN environment variable must be set");
}

const shortenDescription = (description: string) => {
  return description.length < 2000
    ? description
    : description.substr(0, 2000) + "...";
};

type DiscordCommand = (msg, args: string[]) => Promise<void>;

//Commands
const COMMAND_LIST: Record<string, DiscordCommand> = {
  ping: async (msg, args: string[]) => {
    msg.reply("Pong!");
  },
  help: async (msg, args: string[]) => {
    if (msg.channel.type === "dm") {
      msg.reply(MESSAGES.HELP_PM);
    } else {
      msg.reply(MESSAGES.HELP);
    }
  },
  sources: async (msg, args: string[]) => {
    const list = Object.keys(BEDPRES_SOURCES)
      .map((source) => {
        return ` - \`${source}\`: ${BEDPRES_SOURCES[source].description}`;
      })
      .join("\n");
    msg.reply(`Bedpres sources: \n${list}`);
  },
  here: async (msg, args: string[]) => {
    if (args.length !== 2) {
      msg.reply(ERROR_MESSAGES.INVALID_HERE);
    } else {
      const subscriptionType = args[1];
      if (BEDPRES_SOURCES[subscriptionType] === undefined) {
        msg.reply(`Invalid source ${subscriptionType}`);
      } else {
        console.log(
          `Registering channel ${msg.channel.id} for guild ${msg.guild.id}`
        );
        let server = await DiscordServer.findOne({
          discordId: msg.guild.id,
        });
        if (server === null) {
          server = new DiscordServer({
            discordId: msg.guild.id,
            subscriptions: new Map(),
          });
        }
        server.subscriptions.set(subscriptionType, msg.channel.id);
        if (server.subscriptions.has(subscriptionType)) {
          msg.reply(MESSAGES.HERE_UPDATED);
        } else {
          msg.reply(MESSAGES.HERE_SUCCESS);
        }
        await server.save();
      }
    }
  },
  upcoming: async (msg, args: string[]) => {
    if (args.length !== 2) {
      msg.reply(ERROR_MESSAGES.INVALID_UPCOMING);
    } else {
      const events = await Bedpres.find();
      const now = new Date();
      if (args[1] === "event") {
        msg.reply(`Events within the next 5 days:`);
        for (const event of events) {
          //within now and 5 days in the future?
          if (
            event.event_start.getTime() <
              now.getTime() + 1000 * 60 * 60 * 24 * 5 &&
            event.event_start.getTime() > now.getTime()
          ) {
            await sendBedpres(msg.channel, event);
          }
        }
      } else if (args[1] === "sign-up") {
        msg.reply(`Signups within the next 5 days:`);
        for (const event of events) {
          //within now and 5 days in the future?
          if (
            event.registration_start !== null &&
            event.registration_start.getTime() <
              now.getTime() + 1000 * 60 * 60 * 24 * 5 &&
            event.registration_start.getTime() > now.getTime()
          ) {
            //TODO send bedpres
            await sendBedpres(msg.channel, event);
          }
        }
      } else {
        msg.reply(ERROR_MESSAGES.INVALID_UPCOMING);
      }
    }
  },
};

//Discord event handlers
client.on("ready", () => {
  console.log("Logged in");
});

client.on("message", async (msg) => {
  //DMs aren't supported at the moment
  console.log(
    `${msg.author.username}@${msg.author.discriminator}: ${msg.content}`
  );
  if (msg.author.id !== client.user.id) {
    if (msg.content.startsWith(ACTIVATOR)) {
      const args = msg.content.slice(ACTIVATOR.length).split(" ");
      if (args.length < 1) {
        await msg.reply(ERROR_MESSAGES.INVALID_COMMAND);
      } else {
        if (typeof COMMAND_LIST[args[0]] !== "undefined") {
          await COMMAND_LIST[args[0]](msg, args);
        } else {
          await msg.reply(ERROR_MESSAGES.UNKNOWN_COMMAND);
        }
      }
    } else {
      if (msg.channel.type === "dm") {
        await msg.reply(ERROR_MESSAGES.UNKNOWN_COMMAND);
      }
    }
  } else {
    console.log("My message");
  }
});

client.on("guildCreate", async (guild) => {
  console.log("Joined a guild!");
  let server = await DiscordServer.findOne({
    discordId: guild.id,
  });
  if (server === undefined) {
    server = new DiscordServer({
      discordId: guild.id,
    });
    console.log("Never before seen guild");
    await server.save();
    await guild.systemChannel.send(MESSAGES.GREETING);
  } else {
    console.log("I'm back in a guild i have seen before");
    await guild.systemChannel.send(MESSAGES.GREETING_BACK);
  }
});

export const startDiscordBot = async () => {
  await client.login(DISCORD_TOKEN);
};

const sendBedpres = async (channel: any, bedpres: IBedpres, title?: string) => {
  const days = [
    `Sunday`,
    `Monday`,
    `Tuesday`,
    `Wednesday`,
    `Thursday`,
    `Friday`,
    `Saturday`,
  ];

  const regField = [];
  if (bedpres.registration_start) {
    const regStartStr = bedpres.registration_start.toLocaleString("nb-NO", {
      timeZone: TIMEZONE,
    });
    regField.push({
      name: "Registrerings-start",
      value: `${regStartStr} (${days[bedpres.registration_start.getDay()]})`,
    });
  }
  const dateField = bedpres.event_start.toLocaleString("nb-NO", {
    timeZone: TIMEZONE,
  });

  const exampleEmbed = new MessageEmbed()
    .setTitle(bedpres.title)
    .setURL(bedpres.url)
    .setDescription(shortenDescription(bedpres.description))
    .addFields([
      {
        name: "Dato",
        value: `${dateField} (${days[bedpres.event_start.getDay()]})`,
      },
      {
        name: "Type",
        value: bedpres.type,
      },
      /*{
                name: 'Arrangør',
                value: bedpres.organizer_name.toLowerCase(),
            },*/
      ...regField,
    ]);

  channel.send({
    content: title,
    embed: exampleEmbed,
  });
  await wait(700);
};

const broadcastBedpres = async (
  bedpres: IBedpres,
  title: string,
  except?: string[]
) => {
  let visitedList: string[] = [];
  if (except !== undefined && except.length !== 0) {
    visitedList = visitedList.concat(except);
  }

  await Promise.all(
    client.guilds.cache
      .filter(
        (guild: Guild, key: string, collection: Collection<string, Guild>) => {
          return except === undefined || !except.includes(guild.id);
        }
      )
      .map(async (guild: any) => {
        const server = await DiscordServer.findOne({
          discordId: guild.id,
        });
        if (server === null) {
          console.log(`I don't have any settings stored for ${guild.name}`);
        } else {
          console.log(`I know ${guild.name}`);
          if (server.subscriptions.has(bedpres.source)) {
            //Add this discord server as a place that has been notified
            if (!visitedList.includes(guild.id)) {
              console.log("Not visited!");
              visitedList.push(guild.id);
            }
            console.log(`new list: ${visitedList} len ${visitedList.length}`);

            const channel = await guild.channels.resolve(
              server.subscriptions.get(bedpres.source)
            );

            await sendBedpres(channel, bedpres, title);
          } else {
            console.log(
              `Server ${guild.name} doesn't have a subscription for ${
                bedpres.source
              }.\n\n${server.subscriptions.keys()}`
            );
          }
        }
      })
  );
  await wait(2000);

  return visitedList;
};

export const sendEventFoundMessage = async (bedpres: IBedpres) => {
  console.log(`New bedpres: ${bedpres.title}`);
  await broadcastBedpres(
    bedpres,
    `:warning: :warning: Ny ${bedpres.type} :warning: :warning:`
  );
};

export const sendEventChangedMessage = async (
  bedpres: IBedpres,
  fields: string[]
) => {
  console.log(`Changed bedpres: ${bedpres.title}`);
  await broadcastBedpres(
    bedpres,
    `:thinking: Et event har endret seg:  \n${fields.join(", ")}`
  );
};

export const sendRegistrationReminder = async (
  bedpres: IBedpres,
  remindedServers: string[]
): Promise<string[]> => {
  console.log(
    `Registration reminder: ${bedpres.title}. Reminded servers: ${bedpres.remindedServers}`
  );
  const reminded = await broadcastBedpres(
    bedpres,
    `:alarm_clock: :alarm_clock: Husk bedpres-påmelding i dag  ${bedpres.registration_start?.toLocaleTimeString(
      "nb-NO",
      { timeZone: TIMEZONE }
    )} :alarm_clock: :alarm_clock:`,
    remindedServers
  );
  return reminded;
};
