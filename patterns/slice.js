const KimoTracker = require('../models/kimoTracker');
const UserState = require('../models/userState');
const createWeeklySummary = require('./createWeeklySummary');
const updateUserState = require('./updateUserState');
const { kimoChannelID, kimoServerID, botLogChannelID, participantRoleID } = require('../ids.json');

module.exports = async (client) => {
    

        const currentDate = new Date();

        const KimoServer = await client.guilds.fetch(kimoServerID);
        const botLogChannel = KimoServer.channels.cache.get(botLogChannelID);

        await KimoServer.members.fetch();
        const members = await KimoServer.members.cache.filter(member => member.roles.cache.has(participantRoleID));

        await members.forEach( async member => {

            if (member.user.bot) return;

            const userData = await UserState.findOne ({ userID: member.user.id })
            if (userData.currentState === 'DEAD') return;

            if (userData) {
            const kimoTracker = await KimoTracker.findOne({serverId: kimoServerID});
            botLogChannel.send (`Slicing ${member}, changing state to ${userData.currentState} to ${staggerState(userData.currentState)}`, {"allowed_mentions": {"parse": []}})
            
            // if (staggerState(userData.currentState) === 'DEAD') {
                
            // }

            userData.currentState = staggerState(userData.currentState);
            console.log (kimoTracker.kimoActive);
            if (kimoTracker.kimoActive == false && userData.currentState == 'DEAD') 
            {
                userData.currentState = 'DANGER';
                botLogChannel.send (`Kimo Inactive. Death Cancelled.`, {"allowed_mentions": {"parse": []}})
            }
            userData.postedToday = false;
            await userData.save();

            }
            else {
                botLogChannel.send (`STARTING KIMO FOR ${member}, STATE SET TO DANGER`, {"allowed_mentions": {"parse": []}})
            }
            await updateUserState(member);

        });

        if (currentDate.getDay() === 6) {
            await createWeeklySummary(client);
        }


};

function staggerState(currentState) {

    if (currentState === 'SAFE') {
        return 'DANGER';
    } 
    else if (currentState === 'DANGER'){
        return 'DEAD';
    }

}