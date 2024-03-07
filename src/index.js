require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');
const DiscordFunctions = require('./discordFunctions');
const discordCommands = require('./discordCommands');

// Create an instance of the DiscordFunctions class
const discordInstance = new DiscordFunctions();
const discordCommandsInstance = new discordCommands();

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
    const messageContent = message.content;
    if (!message.author.bot && (messageContent.split(' ')[0] === '-setGen' || messageContent.split(' ')[0] === '-sg')) {
        await discordCommandsInstance.setGen(message);

    }
    if (!message.author.bot && (messageContent.split(' ')[0] === '-setDate' || messageContent.split(' ')[0] === '-sd')) {
        await discordCommandsInstance.setDate(message);
    }
    if (!message.author.bot && (messageContent.split(' ')[0] === '-setChannel' || messageContent.split(' ')[0] === '-sc')) {
        await discordCommandsInstance.setChannel(message);
    }
    if (!message.author.bot && (messageContent === '-getServer' || messageContent === '-get')) {
        let returnMsg = await discordCommandsInstance.getServer(message);
        if (returnMsg) {
            message.reply(`announce channel is ${returnMsg.announceChannel},\n max gen is ${returnMsg.maxGen},\n max date is ${returnMsg.maxDate},\n seperate reply is ${returnMsg.toggleSeperateUserId}`);
        } else {
            message.reply(`Server data not found`);
        }
    }
    if (!message.author.bot && (messageContent.split(' ')[0] === '-toggleSeperateUserId' || messageContent.split(' ')[0] === '-toggle')) {
        await discordCommandsInstance.setSeperateReply(message);
    }
    if (!message.author.bot && (messageContent === '-deleteServer' || messageContent === '-ds')) {
        await discordCommandsInstance.deleteServer(message);
    }
    if (!message.author.bot && (messageContent === '-help' || messageContent === '-h')) {
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
                const loadedConfig = await discordCommandsInstance.getServer(newMessage);
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