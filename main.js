const tmi = require('tmi.js');
const client = new tmi.Client({
	options: { debug: true, messagesLogLevel: "info" },
	connection: {
		reconnect: true,
		secure: true
	},
	identity: {
		username: process.env.BOT_USERNAME,
		password: process.env.BOT_TOKEN
	},
	channels: [ process.env.CHANNEL_NAME ]
});
client.connect().catch(console.error);
var deaths = 0;
var kills = 0;
const entries = {};
client.on('message', (channel, tags, message, self) => {
    if(self) return;
	// use these to define who can control the bot.
    const isBotOwner = tags.username === process.env.BOT_OWNER
    const isChannelMod = tags.username === process.env.CHANNEL_MOD || process.env.CHANNEL_MOD_TWO || process.env.CHANNEL_MOD_THREE;
    const isTrustedUser = tags.username === process.env.TRUSTED_USER_ONE || process.env.TRUSTED_USER_TWO || process.env.TRUSTED_USER_THREE;
    // Command available to all viewers used to enter the giveaway.
    if (message.toLowerCase() === '!enter') {
        entries[tags.username] = tags.username;
        client.say(channel, `@${tags.username}, successfully entered!`);
    } 
    // Command only available to mods of the channel to pick the winner of a giveaway.
    if (message.toLowerCase() === '!pickwinner' && isChannelMod)  {
        pickAWinner()
    }
    // Command only available to the bot owner to print the list of people entered into the giveaway in the console.
    if (message.toLowerCase() === '!entrylist' && isBotOwner) {
        console.log(entries)
    }
    // Command available to everyone, prints basic info about the bot.
    if (message.toLowerCase() === '!info') {
        client.say(channel, `JudyLad Chatbot - v0.0.7 - info - @${process.env.BOT_OWNER}`)
    } 
    // Function to pick giveaway winner so that the variables are forced to be reset.
    function pickAWinner() {
        entriesArr = Object.values(entries);
        randomNum = Math.floor(Math.random(0,entries.length) * entriesArr.
        length);
        winner = entriesArr[randomNum];
        client.say(channel, `@${winner} is the winner!`)
    } 
    // If the message sent by user is equal to "!forward" when set to all lowercase then we proceed with the actions in the command.
    if (message.toLowerCase() === '!forward') {
        // Code for robot would go here. 
        // Take death counter code as an example of how to make the command take input as that could be used to specify how far to go forward. 
        return
    }
    // Death counter code
    // Commands available to only trusted users to edit the death counter.
    if (message.startsWith("!deaths") && isTrustedUser) {
        var input = Number(message.split(' ')[1]);
        var input2 = String(message.split(' ')[1]);
        var RemOrAdd = input2.replace(/[0-9]/g, '');
        var finalRemOrAdd = RemOrAdd.replace(/\s+/g, '');
        if (finalRemOrAdd === '+') {
            deaths = deaths + (input)
            client.say(channel, `Added ${input} to deaths, total is now ${deaths}.`)
            console.log(`Deaths: ${deaths}`)
        } 
        else if (finalRemOrAdd === '-') {
            deaths = deaths - Math.abs(input)
            client.say(channel, `Removed ${input} from deaths, total is now ${deaths}.`)
            console.log(`Deaths: ${deaths}`)
        }
    } 
    // Command available to only trusted users to reset the death counter to 0.
    if (message.toLowerCase() === '!deaths reset' && isTrustedUser) {
        console.log(`Deaths: ${deaths}`)
        deaths = Math.abs(deaths) - Math.abs(deaths)
        client.say(channel, `Reset deaths to ${deaths}.`)
        console.log(`Deaths: ${deaths}`)
    } 
    // Command available to all viewers to display death counter.
    if (message.toLowerCase() === '!deaths') {
        client.say(channel, `Deaths: ${deaths}`)
        console.log(`Deaths: ${deaths}`)
    }
    // Kill counter code
    // Commands available to only trusted users to edit the kill counter.
    if (message.startsWith("!kills") && isTrustedUser) {
        var input = Number(message.split(' ')[1]);
        var input2 = String(message.split(' ')[1]);
        var RemOrAdd = input2.replace(/[0-9]/g, '');
        var finalRemOrAdd = RemOrAdd.replace(/\s+/g, '');
        if (finalRemOrAdd === '+') {
            kills = kills + (input)
            client.say(channel, `Added ${input} to kills, total is now ${kills}.`)
            console.log(`Kills: ${kills}`)
        } 
        else if (finalRemOrAdd === '-') {
            kills = kills - Math.abs(input)
            client.say(channel, `Removed ${input} from kills, total is now ${kills}.`)
            console.log(`Kills: ${kills}`)
        }
    } 
    // Command available to only trusted users to reset the kill counter to 0.
    if (message.toLowerCase() === '!kills reset' && isTrustedUser) {
        console.log(`Kills: ${kills}`)
        kills = Math.abs(kills) - Math.abs(kills)
        client.say(channel, `Reset kills to ${kills}.`)
        console.log(`Kills: ${kills}`)
    } 
    // Command available to all viewers to display kill counter.
    if (message.toLowerCase() === '!kills') {
        client.say(channel, `Kills: ${kills}`)
        console.log(`Kills: ${kills}`)
    }
});
