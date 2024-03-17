const KimoTracker = require('../models/kimoTracker');
const UserState = require('../models/userState');
const createWeeklySummary = require('./createWeeklySummary');
const updateUserState = require('./updateUserState');
const { kimoChannelID, kimoServerID, botLogChannelID, participantGroup } = require('../ids.json');
const UserData = require('../models/userData');
const marketFairCreate = require('./marketFairCreate');
const { EmbedBuilder } = require('discord.js');
const getAllMessagesInChannelLastTwoDays = require('./getAllMessagesInChannelLastTwoDays');
const getAllMessagesInChannel = require('./getAllMessagesInChannel');

module.exports = async (client) => {
        
        const now = new Date();

        const KimoServer = await client.guilds.fetch(kimoServerID);

        if (participantGroup === 0) await channelLock (client);
        // adminWage(client);
        
        // dailyHighlight (client);
        setTimeout(() => {

            if (participantGroup === 0) channelUnLock (client);
            if (participantGroup === 1) {
                const whyAmIDead = KimoServer.channels.cache.get('1205110914215575562');
                whyAmIDead.send ({content: `YOU ARE DEAD <@&${'22'}>, ASK US QUESTIONS HERE OR GO TO THE LAST WORDS CHANNEL TO SAY YOUR GOOD BYES. YOU CAN ALSO USE /GIVE TO PASS ON YOUR SEASHELLS TO YOUR LOVED ONES.`});
                if (now.getDay() >= 5 && now.getDay() != 0) {
                    marketFairCreate(client, kimoChannelID);
                    marketFairCreate(client, '1207882126154932294');
                    marketFairCreate(client, '1209347683676852224');
                    marketFairCreate(client, '1202622607250296832');
                    marketFairCreate(client, '1202876942714544148');
                }
            }
        }, 60 * 1000 * 1);


};

async function channelLock (client) {
    // lock channel, timeout for 10mins, post quote, unlock.
    const KimoServer = await client.guilds.fetch(kimoServerID);
    const postDailyChannel = KimoServer.channels.cache.get('1193665461699739738');

    const PartARole = KimoServer.roles.cache.get('1202551817708507136');
    const PartBRole = KimoServer.roles.cache.get('1202876101005803531');

    postDailyChannel.permissionOverwrites.edit(PartARole, { SendMessages: false });
    postDailyChannel.permissionOverwrites.edit(PartBRole, { SendMessages: false });
    postDailyChannel.send('** Channel Lock Engaged 🔒**');

    const dailyquote = new EmbedBuilder()
    .setAuthor({
        name: "LOADING NEW DAY - eta 20mins",
        iconURL: "https://cdn.discordapp.com/attachments/1061965352755544084/1206958956275044352/93831206single-gear-cog-animation-1-2_1.gif?ex=65dde71f&is=65cb721f&hm=359511b92e9be2c9d730969f2eac22bf2bba081f97b4f2e6d8cfa2178e23bb05&",
    })
    .setDescription('```' + `${await getFortuneCookie(client)}` + '```');

    const message = await postDailyChannel.send ({content: '', embeds: [dailyquote] });
    //await postDailyChannel.send ({ embeds: [await RandomRefOfTheDayEmbed(client)]});
    //console.log(message);

    await dailyHighlight(client);

    // setTimeout(async () => {

    //     const membersWithDangerRole = await UserState.countDocuments({ currentState: 'DANGER' });
    //     const membersWithSafeRole = await UserState.countDocuments({ currentState: 'SAFE' });
    //     const membersWithDeadRole = await UserState.countDocuments({ currentState: 'DEAD' });
    
    //     const totalLiving = membersWithSafeRole + membersWithDangerRole;
    //     const totalDead = membersWithDeadRole;
    
    //     const embed = new EmbedBuilder()
    //         .setAuthor({
    //             name: "DAILY SUMMARY",
    //         })
    //         .setDescription(`ALIVE: ${totalLiving} \n DEAD: ${totalDead}`
    //         );
    
    //     postDailyChannel.send ({content: '', embeds: [embed] });
        
    // }, 60 * 1000 * 5);
}

async function dailyHighlight (client) {
    const KimoServer = await client.guilds.fetch(kimoServerID);
    const postDailyChannel = KimoServer.channels.cache.get('1193665461699739738');
    const randomMessage = await findRandomHighlightArt(client, postDailyChannel)

    console.log(randomMessage);
    const messageAuthorData = await UserData.findOne({ userID: randomMessage.author.id });
    
    const dailyHighlight = new EmbedBuilder()
    .setAuthor({
        name: "HIGHLIGHT OF THE DAY ⭐",
        url: randomMessage.url,
    })
    .setImage(await randomMessage.attachments.first().url)
    .setFooter({
        text: "Daily by " + messageAuthorData.socialLink,
    });

    messageAuthorData.money += 5;
    await messageAuthorData.save();

    await postDailyChannel.send ({content: '', embeds: [dailyHighlight] });
    await postDailyChannel.send ({ embeds: [await RandomRefOfTheDayEmbed(client)]});

}

async function channelUnLock (client) {
    // lock channel, timeout for 10mins, post quote, unlock.
    const KimoServer = await client.guilds.fetch(kimoServerID);
    const postDailyChannel = KimoServer.channels.cache.get('1193665461699739738');

    const PartARole = KimoServer.roles.cache.get('1202551817708507136');
    const PartBRole = KimoServer.roles.cache.get('1202876101005803531');

    postDailyChannel.permissionOverwrites.edit(PartARole, { SendMessages: true });
    postDailyChannel.permissionOverwrites.edit(PartBRole, { SendMessages: true });
    postDailyChannel.send('Slicing Complete.');
    postDailyChannel.send('** Channel Lock Released 🔓 **');
    postDailyChannel.send('# NEW DAY 🌅');
}


async function getFortuneCookie(client) {

    const backRooms = client.guilds.cache.get('1063167135939039262');
    const cookieChannel = backRooms.channels.cache.get('1200757419454758953');

    const messages = await getAllMessagesInChannel(cookieChannel);

    const randomIndex = Math.floor(Math.random() * messages.length);

    const randomMessage = Array.from(messages)[randomIndex];

    return randomMessage.content;

  }

  async function findRandomHighlightArt(client, postDailyChannel) {

    const tracker = await KimoTracker.findOne({ serverId: '1193663232041304134' });
    console.log (tracker);
    const nextDateUtcMil = tracker.nextDate;
    const period = tracker.currentPeriodLength;
    const previousDateUtcMil = nextDateUtcMil - (period * 2);

    //const now = new Date(); // current time

		// const lastTwelveNoon = new Date();
		// lastTwelveNoon.setHours(12);
		// lastTwelveNoon.setTime(lastTwelveNoon.getTime() - (24 * 60 * 60 * 1000)); // subtract one day

    // const deadlineTracker = await Daily.findOne ({ serverID: kimoServerID });

    console.log('Last cut off was: ' + previousDateUtcMil);

    const messages = await getAllMessagesInChannelLastTwoDays(postDailyChannel)
    //console.log(messages);
        // Filter the messages by creation date
    let filteredMessages = messages.filter(msg => msg.createdAt.getTime() > previousDateUtcMil && msg.createdAt.getTime() < (nextDateUtcMil-(period * 1)));
    filteredMessages = filteredMessages.filter(msg => !msg.author.bot);
    console.log(filteredMessages);
    // console.log('Messages found is ' + filteredMessages.size); // Output the number of filtered messages
    
    //logging to admin reports channel.
    console.log('Woah I found ' + filteredMessages.length + ' kimo channel messages since last deadline\n**[Picking random highlight now.}]**');

    const randomIndex = Math.floor(Math.random() * filteredMessages.length);

    const randomMessage = Array.from(filteredMessages)[randomIndex];
    

    console.log(randomMessage);
    return randomMessage;

  }

  async function RandomRefOfTheDayEmbed(client) {


    const kimoServer = await client.guilds.fetch('1193663232041304134');
    const refChannel1 = kimoServer.channels.cache.get('1202622867863506945');
    

    const messages = await getAllMessagesInChannel(refChannel1);
    const randomIndex = Math.floor(Math.random() * messages.length);
    const randomMessage = Array.from(messages)[randomIndex];

    const attachment = randomMessage.attachments.first();

    console.log (randomMessage.embeds[0].data.description);
    console.log (randomMessage.embeds[0].data.footer.text);

    const text = randomMessage.embeds[0].data.description;
    const numbers = text.match(/\d+/g);
    const numbersString = numbers.join("");

    console.log(numbersString);

    const userData = await UserData.findOne({userID: numbersString});
    userData.money += 1;
    await userData.save();
    console.log (`rewarding ${numbersString} for fish`);

    const source = randomMessage.embeds[0].data.footer.text;
    const index = source.indexOf("SOURCE:") + "SOURCE: ".length;
    const result = source.substring(index);

    console.log (result);

    const highlight = new EmbedBuilder()
        .setAuthor({
            name: "ref of the day 💌",
            url: randomMessage.url,
        })
        .setDescription('```' + "Source:" + `${result}` + '```')
        .setThumbnail(`${attachment.url}`)
        .setFooter({
            text: `Submitted by ${userData.socialLink}`,
        });
    return highlight;

  }
