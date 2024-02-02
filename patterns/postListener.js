const { Events, EmbedBuilder } = require('discord.js');
const UserState = require('../models/userState');
const updateUserState = require('./updateUserState');
const getAllMessagesInChannel = require('./getAllMessagesInChannel');
const messageDeletionTimer = 5;
const { kimoChannelID, kimoServerID, botLogChannelID, kimoChannelDungeonID } = require('../ids.json');

module.exports = async (client) => {

    console.log ('Listening for new posts');

    client.on(Events.MessageCreate, async (message) => {
        console.log ('new message detected');

        if (message.member.user.bot) return;

        if (message.channel.id != kimoChannelID && message.channel.id != kimoChannelDungeonID ) return;

        if (attachmentTest(message) != null) {

            const currentDate = new Date();
            
            message.react('✅');
            console.log ('valid post detected by user: '+ message.author.id );

            let result = await UserState.findOne({ userID: message.author.id });

            if (result) {
                if (result.currentState === 'DEAD') return;
                // update user

                if (result.postedToday == false) {

                    console.log ('havent posted today, creating daily fortune')
                    result.streak += 1;
                    // reply with daily quote.
                    const embed = new EmbedBuilder()
                    .setTitle("Daily Fortune")
                    .setDescription(await getFortuneCookie(client));

                    const response = await message.reply({content: `VALID POST: Your current streak is ${result.streak}`, embeds: [embed] })
                    setTimeout(() => {
                        response.delete();
                    }, 30 * 1000);
                }

                result.currentState = 'SAFE';
                result.lastPostTime = currentDate.getTime();
                result.postedToday = true;

                await result.save();

                updateUserState(message.member);
            }
            else {
                // create new

                result = new UserState({
                    userID: message.author.id,
                    currentState: 'SAFE',
                    lastPostTime: currentDate.getTime(),
                    streak: 1,
                    postedToday: true,
                })

                // reply with daily quote.

                const embed = new EmbedBuilder()
                .setTitle("Daily Fortune")
                .setDescription(await getFortuneCookie(client));

                const response = await message.reply({content: `VALID POST: Your current streak is ${result.streak}`, embeds: [embed] })
                setTimeout(() => {
                    response.delete();
                }, 30 * 1000);

                await result.save();
                updateUserState(message.member);
            }

            // logging
            const KimoServer = await client.guilds.fetch(kimoServerID);
            const botLogChannel = KimoServer.channels.cache.get(botLogChannelID);

            botLogChannel.send (`Valid image post detected by user ${message.member}, changing state to SAFE`, {"allowed_mentions": {"parse": []}})



        }
        
        else return;

    });

    function attachmentTest(message) {
        const imageExtensions = /\.(png|jpeg|jpg|jpg|webp|gif)/i;
    
        if (message.attachments.size > 0) {
            const attachment = message.attachments.first(); // Get the first attachment (usually the most recent one)
    
            // Regular expression to match image file extensions anywhere in the string
    
            if (imageExtensions.test(attachment.url)) {
                console.log('Valid image attachment found.');
                return attachment.url;
            }
            else {
                console.log('No valid image extension found in the attachment URL.');
                deleteMessageAndReply (message);
                return null;
            }
        }
        else if (message.content.startsWith('https://cdn.discordapp.com/attachments/')) {
    
            if (imageExtensions.test(message.content)) {
                console.log('Valid image attachment found. Link CDN Edition');
                return message.content;
    
            }
            else {
                console.log('No valid image extension found in the attachment URL.');
                deleteMessageAndReply (message);
                return null;
            }
        }
        else {
            deleteMessageAndReply (message);
            return null;
        }
    }
    
    async function deleteMessageAndReply(message) {
    
        const utcEpochTimestamp = Math.floor(Date.now() / 1000) + messageDeletionTimer;
    
        const response = await message.reply ({ content: 'Submission failed. Be sure it is uploaded or sent as a `https://cdn.discordapp.com/attachments/` Link\n' + `Self deleteing in <t:${utcEpochTimestamp}:R>`, ephemeral: true });
        setTimeout(() => {
    
            response.delete();
        }, messageDeletionTimer * 1000);
    
        message.delete();
    
    }

    async function getFortuneCookie(client) {

        const backRooms = client.guilds.cache.get('1063167135939039262');
        const cookieChannel = backRooms.channels.cache.get('1200757419454758953');
    
        const messages = await getAllMessagesInChannel(cookieChannel);
    
        const randomIndex = Math.floor(Math.random() * messages.length);
    
        const randomMessage = Array.from(messages)[randomIndex];
    
        return randomMessage.content;
    
      }

};