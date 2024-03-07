require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');
const DiscordFunctions = require('./discordFunctions');

// Create an instance of the DiscordFunctions class
const discordInstance = new DiscordFunctions();


const client = new Client({
    intents: [
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildMessageTyping
    ]
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
    //there has to be a better way to do this but i didnt think that far yet :D
    if (!message.author.bot && (message.content.startsWith('-setGen') || message.content.startsWith('-sg'))) {
        await discordInstance.setGen(message);

    }
    if (!message.author.bot && (message.content.startsWith('-setDate') || message.content.startsWith('-sd'))) {
        await discordInstance.setDate(message);
    }
    if (!message.author.bot && (message.content.startsWith('-setChannel') || message.content.startsWith('-sc'))) {
        await discordInstance.setChannel(message);
    }
    if (!message.author.bot && (message.content.startsWith('-getServer') || message.content.startsWith('-get'))) {
        let returnMsg = await discordInstance.getServer(message);
        if (returnMsg) {
            message.reply(`announce channel is ${returnMsg.announceChannel},\n max gen is ${returnMsg.maxGen},\n max date is ${returnMsg.maxDate},\n seperate reply is ${returnMsg.toggleSeperateUserId}`);
        } else {
            message.reply(`Server data not found`);
        }
    }
    if (!message.author.bot && (message.content.startsWith('-toggleSeperateUserId') || message.content.startsWith('-toggle'))) {
        await discordInstance.setSeperateReply(message);
    }
    if (!message.author.bot && (message.content.startsWith('-deleteServer') || message.content.startsWith('-ds'))) {
        await discordInstance.deleteServer(message);
    }
    if (!message.author.bot && (message.content.startsWith('-help') || message.content.startsWith('-h'))) {
        message.reply(`**-setGen or -sg** to set max gen \n **-setDate or -sd** to set max date range(not working yet) \n **-setChannel or -sc** set channel or it wont work \n **-getServer or -get** to get the config \n **-toggleSeperateUserId or -toggle** [yes/no/true/false/1/0] to set seperate reply of the user id for phone users \n **-deleteServer or -ds** to delete server config`);
    }
});
client.on('messageUpdate', async (oldMessage, newMessage) => {
    if (newMessage.author.bot) {
        // Check if the updated message is sent by a bot
        // You can also add other conditions to identify the specific bot

        // Check if the new message content is different from the old message content
        if (newMessage.embeds.length > 0) {

            if (newMessage.embeds[0].data.title === 'SOFI: CHARACTER LOOKUP (2D)') {
                const leaderboard = newMessage.embeds[0].data.description;
                //tbd
                // const dateLimit = '[1-9]{1,2}[h,m]';
                const loadedConfig = await discordInstance.getServer(newMessage);
                const fetchResults = await discordInstance.fetchLeaderboard(leaderboard);
                if (fetchResults) {
                    const charName = oldMessage.embeds[0].data.title;
                    fetchResults.forEach((spawn) => {
                        const spawnTime = spawn.time;
                        const spawnUser = spawn.user;
                        const spawnGen = spawn.gen;
                        console.log(`Spawn Time: ${spawnTime}, spawn Gen: ${spawnGen}, spawn Character: ${charName}, spawn User: ${spawnUser}`);
                        //check server id here
                        const loadedGen = loadedConfig?.maxGen;
                        //const loadedDate = loadedConfig[server].maxDate;
                        const loadedChannel = loadedConfig?.announceChannel;
                        const separate = loadedConfig?.toggleSeperateUserId;
                        const justUserId = spawnUser.substring(2, spawnUser.length - 1);
                        //if a channel is set then send the message to the channel
                        if (loadedChannel) {
                            const strippedChannel = loadedChannel.substring(2, loadedChannel.length - 1);
                            const channel = client.channels.cache.get(strippedChannel);
                            if (spawnGen <= loadedGen) {
                                channel.send(`Spawn Time: ${spawnTime}, spawn Gen: ${spawnGen}, spawn Character: ${charName}, spawn User: ${justUserId}`); // Send the message to the channel
                                if (separate) {
                                    channel.send(justUserId); //for phone user aka me haha
                                }
                            }
                            //if theres no gen set in config then i simply send all of it (default is 100)
                            else if (!loadedGen) {
                                channel.send(`Spawn Time: ${spawnTime}, spawn Gen: ${spawnGen}, spawn Character: ${charName}, spawn User: ${justUserId}`);
                                if (separate) {
                                    channel.send(justUserId);
                                }
                            }
                        }
                        else {
                            newMessage.reply('Please set the channel first');
                        }
                    });
                }
                else {
                    console.log('No matching cards found');
                }

            }
        }
    }
});

client.login(process.env.DISCORD_TOKEN);