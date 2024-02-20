const KimoTracker = require('../models/kimoTracker');
const { ActivityType } = require('discord.js');
const { participantGroup } = require('../ids.json');

module.exports = async (client) => {

    const result = await KimoTracker.findOne({ serverId: '1193663232041304134' });

    console.log ('cutoff clock');

    const millisecondsInDay = 24 * 60 * 60 * 1000;

    const currentDate = new Date();
    const nextUTCDay = new Date(currentDate.getTime() + millisecondsInDay);
    nextUTCDay.setHours(12);
    nextUTCDay.setMinutes(0);
    nextUTCDay.setSeconds(0);
    nextUTCDay.setDate(result.nextDate);

    const differenceMiliUTC = result.nextDate - currentDate.getTime();

    console.log (differenceMiliUTC);
    console.log (currentDate.getTime());
    console.log (nextUTCDay);

    const differenceSeconds = differenceMiliUTC / 1000;
    const differenceMinutes = Math.floor( differenceSeconds / 60);
    const differenceHours = Math.floor( differenceMinutes / 60);

    //console.log(nextUTCDay.getDay());

    // if (nextUTCDay.getDay() === 0 || nextUTCDay.getDay() === 1) {
    //     client.user.setPresence({
    //         activities: [{ name: `WEEKEND MODE`, type: ActivityType.Watching }],
    //         status: 'Online',
    //     });
    // }

    // else {
    if (participantGroup === 1) {
        client.user.setPresence({
        activities: [{ name: `${differenceMinutes} minutes Left`, type: ActivityType.Watching }],
        status: 'dnd',
        });
    }

    if (participantGroup === 0) {
        client.user.setPresence({
        activities: [{ name: `${differenceHours} Hours`, type: ActivityType.Watching }],
        status: 'dnd',
        });
    }
    // }

};
