const { kimoChannelID, kimoServerID, botLogChannelID, kimoChannelDungeonID, deadRoleID, dangerRoleID } = require('../ids.json');
const { EmbedBuilder } = require('@discordjs/builders');
const getAllMessagesInChannel = require('./getAllMessagesInChannel');
const { ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
module.exports = async (client, channelId) => {

    const KimoServer = await client.guilds.fetch(kimoServerID);
    // const botLogChannel = KimoServer.channels.cache.get(botLogChannelID);
    const fleaMarket1 = KimoServer.channels.cache.get(channelId);

    console.log('create island fair');

    const dayPassButton = new ButtonBuilder ()
    .setCustomId('marketfareday')
    .setLabel('DAY PASS')
    .setStyle(ButtonStyle.Secondary);

    const weekendPassButton = new ButtonBuilder ()
    .setCustomId('marketfareweekend')
    .setLabel('WEEKEND PASS PASS')
    .setStyle(ButtonStyle.Success);

    const tipJar = new ButtonBuilder ()
    .setCustomId('tipjar')
    .setLabel('Tip Jar: 1 Shell')
    .setStyle(ButtonStyle.Danger);

    const powerRow = new ActionRowBuilder ()
    .addComponents(dayPassButton, weekendPassButton, tipJar)

    const embed = new EmbedBuilder()
    .setTitle("🍣 ISLAND MARKET FAIR 🎏")
    .setDescription("The weekend has arrived! Good job on collecting shells this week!\n**Visit the other island's flea market by purchasing a ticket below! 70% off!**\n```Day Fare: 8 shells\nWeekend Pass: 15 shells```")
    .setImage("https://cdn.discordapp.com/attachments/1200550297500659782/1213022597587935232/islandmarketstall.jpg?ex=65f3f654&is=65e18154&hm=808579ba2cc83213aa8c9d72703c11792545771622d00ba3f7c059f42836103c&")
    .setFooter({
      text: "tip jar donations goes directly to Jian Dao!",
    });      

    const messages = await fleaMarket1.messages.fetch();
    messages.forEach(message => {
      if (message.content === 'Kimo Festival') {
        message.delete();
      }
    });
  
    await fleaMarket1.send ({content: 'Kimo Festival', embeds: [embed], components: [powerRow]});

}