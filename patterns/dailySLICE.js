const KimoTracker = require('../models/kimoTracker');
const slice = require('./slice');
const { kimoChannelID, kimoServerID, botLogChannelID, kimoChannelDungeonID } = require('../ids.json');
module.exports = async (client) => {

    console.log ('not yet time');

    const currentDate = new Date();
    const currentUTCHour = currentDate.getUTCHours();

    const result = await KimoTracker.findOne({ serverId: kimoServerID });
    // console.log (currentDate.getDay());
    
    if (result == null) return;

        // perform twelve o clock check
        if (currentUTCHour >= 12) {

            const KimoServer = await client.guilds.fetch(kimoServerID);
            const kimoChannel = KimoServer.channels.cache.get(kimoChannelDungeonID);
            const kimoChannelDungeon = KimoServer.channels.cache.get(dun);
            const botLogChannel = KimoServer.channels.cache.get(botLogChannelID);


            if (result.nextDate == 1 && currentDate.getDate() != 1 ) {
                return;
            }

            // paste twelve o clock find next date.

                if (currentDate.getDate() >= result.nextDate) {

                const millisecondsInDay = 24 * 60 * 60 * 1000;
                const nextUTCDay = new Date(currentDate.getTime() + millisecondsInDay);
                result.nextDate = nextUTCDay.getDate();

                await result.save();

                // skip if saturday or revive if sunday.

                botLogChannel.send('NEW DAY, SLICING...');
                kimoChannel.send ('NEW DAY, SLICING...');
                kimoChannelDungeon.send ('NEW DAY, SLICING...');

                slice(client);

            }
        }

};
