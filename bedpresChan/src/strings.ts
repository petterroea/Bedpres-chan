import { ACTIVATOR } from './constants'

export const ERROR_MESSAGES = {
    INVALID_COMMAND: `Invalid command. Type \`${ACTIVATOR} help\` for a list of commands`,
    UNKNOWN_COMMAND: `Unknown command. Type \`${ACTIVATOR} help\` for a list of commands`,
    INVALID_HERE: `Invalid use of \`${ACTIVATOR}here\` - remember to provide a \`source\`.`,
    INVALID_UPCOMING: `Invalid use of \`${ACTIVATOR}\`upcoming - remember to provide \`event\` or \`sign-up\``
}

export const MESSAGES = {
    GREETING: `Thank you for adding me to your server! Here's a short guide to get started:\n * \`!${ACTIVATOR} here\` to set a channel as the receiving channel for notifications, as well as bot interactions.`,
    GREETING_BACK: `Thanks for having me back! As a reminder, here's a short guide to get started:\n * \`!${ACTIVATOR} here\` to set a channel as the receiving channel for notifications, as well as bot interactions.`,
    HELP: `Help
 - \`${ACTIVATOR}help\` Shows this message
 - \`${ACTIVATOR}here <source>\` Sets the channel to receive bedpres notifications for this server. You must be an admin to use the command.
 - \`${ACTIVATOR}sources\` - lists the student clubs the bot is able to report bedpres from
 - \`${ACTIVATOR}upcoming <type>\` - lists upcoming events or sign-ups, depending on whether or not you provide \`event\` or \`sign-up\``,
    HELP_PM: `Help
 - \`${ACTIVATOR}help\` Shows this message
 - \`${ACTIVATOR}subscribe <source>\` subscribe or unsubscribe to notifications for bedpres from \`<source>\`. You must be an admin to use the command.
 - \`${ACTIVATOR}sources\` - lists the student clubs the bot is able to report bedpres from
 - \`${ACTIVATOR}upcoming <type>\` - lists upcoming events or sign-ups, depending on whether or not you provide \`event\` or \`sign-up\``,
    HERE_SUCCESS: `Success! This channel is now set up to receive bedpres subscriptions`,
    HERE_UPDATED: `Success! This discord server has now had its bedpres subscription channel updated`
}