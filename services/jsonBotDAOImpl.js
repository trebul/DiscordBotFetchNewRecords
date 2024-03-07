const jsonDAO = require('./jsonDAO');
const fs = require('fs').promises;
class jsonBotDAOImpl extends jsonDAO {
    constructor(filepath) {
        super();
        this.filepath = filepath;
    }
    async addServer(record, server) {
        let redefinedObject = {
            announceChannel: record.announceChannel,
            maxGen: record.maxGen,
            maxDate: record.maxDate,
        }
        const data = await fs.readFile(this.filepath, 'utf-8');
        const json = JSON.parse(data);

        json[server] = redefinedObject;
        await fs.writeFile(this.filepath, JSON.stringify(json, null, 2));
    }
    async getServerData(server) {
        const data = await fs.readFile(this.filepath, 'utf-8');
        const json = JSON.parse(data);
        return json[server];
    }
    async updateServer(record, server) {
        const data = await fs.readFile(this.filepath, 'utf-8');
        const json = JSON.parse(data);
        json[server] = {
            ...json[server], // Spread existing properties
            ...record, // Spread properties from `record`
        };
        await fs.writeFile(this.filepath, JSON.stringify(json, null, 2));
    }
    async deleteServer(server) {
        const data = await fs.readFile(this.filepath, 'utf-8');
        const json = JSON.parse(data);

        delete json[server];

        await fs.writeFile(this.filepath, JSON.stringify(json, null, 2));
    }
}
module.exports = jsonBotDAOImpl;