const jsonBotDAOImpl = require('../services/jsonBotDAOImpl');
const jsonBotDAO = new jsonBotDAOImpl('./storedData.json');
class DiscordFunctions {
    // Add your discord functions here
    async fetchLeaderboard(leaderboard) { //, specifiedGen, specifiedTime
        let arrayOfLeaderboard = leaderboard.split('\n').map(lbCard => {
            let [gen, time, user] = lbCard.split(" • ");
            return { gen: parseInt(gen.split("•")[1].trim()), time: time.trim(), user: user.trim() };
        })
        let recentLeadeboard = arrayOfLeaderboard.filter(lbCard => lbCard.time.includes("m") && lbCard.gen < 100 || lbCard.time.includes("h") && lbCard.gen < 100);
        /*
        here can process the gens in future for now only this placeholder*/
        if (recentLeadeboard.length > 0)
            return recentLeadeboard;
        else return null;

    }
    async setGen(message) {
        let gen = message.content.split(' ')[1];
        await this.checkServer(message, gen, 'maxGen');
        message.reply(`Gen set to ${gen}`);
    }
    async setSeperateReply(message) {
        let reply = message.content.split(' ')[1];
        reply = reply.toLowerCase();
        const possibleReplies = ['yes', 'no', 'true', 'false', '1', '0'];
        if (possibleReplies.includes(reply)) {
            reply = reply === 'yes' || reply === 'true' || reply === '1' ? true : false;
            await this.checkServer(message, reply, 'toggleSeperateUserId');
            message.reply(`Reply set to ${reply}`);
            return;
        }
        message.reply('Please use yes/no/true/false/1/0');
    }
    async setDate(message) {
        let date = message.content.split(' ')[1];
        await this.checkServer(message, date, 'maxDate');
        message.reply(`Date set to ${date}`);
    }
    async setChannel(message) {
        let channel = message.content.split(' ')[1];
        await this.checkServer(message, channel, 'announceChannel');
        message.reply(`Channel set to ${channel}`);
    }
    async getServer(message) {
        let server = message.guild.id;
        let existingServer = await jsonBotDAO.getServerData(server);
        if (existingServer) {
            return existingServer;
        } else {
            return null;
        }
    }
    async deleteServer(message) {
        let server = message.guild.id;
        let existingServer = await jsonBotDAO.getServerData(server);
        if (existingServer) {
            await jsonBotDAO.deleteServer(server);
            message.reply(`Server config deleted`);
        } else {
            message.reply(`Server data not found`);
        }
    }
    async checkServer(message, value, type) {
        let server = message.guild.id;
        let existingServer = await jsonBotDAO.getServerData(server);
        if (existingServer) {
            let record = {
                [type]: value
            }
            await jsonBotDAO.updateServer(record, server);
        } else {
            let record = {
                [type]: value
            }
            await jsonBotDAO.addServer(record, server);
        }
    }
}
module.exports = DiscordFunctions;