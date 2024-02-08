const { EmbedBuilder } = require("discord.js");
const UserState = require("../models/userState");
const { kimoChannelID, kimoServerID, botLogChannelID } = require('../ids.json');

module.exports = async (client) => {

    const KimoServer = await client.guilds.fetch(kimoServerID);
    const kimoChannel = KimoServer.channels.cache.get(kimoChannelID);
    const botLogChannel = KimoServer.channels.cache.get(botLogChannelID);

    const membersWithDangerRole = await UserState.countDocuments({ currentState: 'DANGER' });
    const membersWithSafeRole = await UserState.countDocuments({ currentState: 'SAFE' });
    const membersWithDeadRole = await UserState.countDocuments({ currentState: 'DEAD' });

    const totalLiving = membersWithSafeRole + membersWithDangerRole;
    const totalDead = membersWithDeadRole;

    const embed = new EmbedBuilder()
        .setAuthor({
            name: "WEEKLY SUMMARY",
        })
        .setDescription(`ALIVE: ${totalLiving} \n DEAD: ${totalDead}`
        );

    kimoChannel.send ({content: 'SUMMARY', embeds: [embed] });
    botLogChannel.send ({content: 'SUMMARY', embeds: [embed] });

};
