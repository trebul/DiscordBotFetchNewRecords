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
}
module.exports = DiscordFunctions;