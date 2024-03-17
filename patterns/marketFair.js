const { Events, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const UserData = require('../models/userData');
const UserState = require('../models/userState');
const cooldowns = new Map();
const { kimoChannelID, kimoServerID, botLogChannelID, kimoChannelDungeonID, deadRoleID, dangerRoleID, safeRoleID } = require('../ids.json');
const Fare = require('../models/marketTracker');

module.exports = async (client) => {

  const KimoServer = await client.guilds.fetch('1193663232041304134');
  const botLogChannel = KimoServer.channels.cache.get('1202553664539983882');

  setInterval(async () => {

    // await KimoServer.members.fetch();
    const members = await KimoServer.members.cache.filter(member => member.roles.cache.has('1212820829344374834'));

    members.forEach(async passHolder => {

        // if (passHolder.roles.cache.get('1202749571957006348')) return;
        if (passHolder.bot) return;
        
        const result = await Fare.findOne({userId: passHolder.user.id});

        const now = new Date();

        if (now.getTime() > result.passExpireTime ) {
            await passHolder.roles.remove('1212820829344374834');
            botLogChannel.send(`${passHolder}'s market fare has expired!`);
        }

    });

    const result = await Fare.find();

    result.forEach(async element => {
      const now = new Date();

      const member = KimoServer.members.cache.get(element.userId);
      if (member) {
        if (now.getTime() < element.passExpireTime ) {
        if (!member.roles.cache.get('1212820829344374834')) {
          console.log (`ADDING PASS BACK FOR ${member.displayName}`);
          member.roles.add('1212820829344374834');
        }
        else {
          //console.log (`HAS PASS ${member.displayName}`);
        }
        }
      }
      
    });
    
}, 1000 * 5);

  // interval check and remove role if pass time etc.

    client.on(Events.InteractionCreate, async (interaction) => {

      if (!interaction.isButton()) return;

      if (!(interaction.customId === 'marketfareday' || interaction.customId === 'marketfareweekend' || interaction.customId === 'tipjar')) return;

      console.log ('buttonclick detected')

      let result = await Fare.findOne ({ userId : interaction.member.id });
      const userData = await UserData.findOne ({ userID: interaction.member.id });

      if (!result) {

        result = new Fare ({
          userId: interaction.member.id,
          originalGroup: userData.group,
        })
    
      }

      const now = new Date();
      console.log (now.getDay())

      if (interaction.customId === 'marketfareday') {

        if (now.getDay() <= 4 && now.getDay() != 0) return interaction.reply({ content: `It's not yet the weekend.`, ephemeral: true });
        if (now.getTime() < result.passExpireTime ) {
          interaction.member.roles.add('1212820829344374834');
          return interaction.reply ({ content: 'Your pass has yet to expire.', ephemeral: true});
        }
        

        // add two days to the database.

        const cost = 8;
        const userWallet = await UserData.findOne({ userID: interaction.member.id });
        if (userWallet.money < cost) return interaction.reply({ content: `Insufficient shells, you need ${cost} shells to obtain this pass.`, ephemeral: true });

        userWallet.money -= cost;
        await userWallet.save();

        await addMarketFareTime (interaction.member.id, 1000 * 60 * 60 * 24);

        await interaction.member.roles.add('1212820829344374834');

        interaction.reply({ content: `Pass Obtained! Expires <t:${Math.floor((new Date().getTime() + 1000 * 60 * 60 * 24)/1000)}:R>`, ephemeral: true });

        const jianDaoWallet = await UserData.findOne({ userID: '1202895682630066216' });
        jianDaoWallet.money += cost;
        await jianDaoWallet.save();
        
        // add fare role and add to data base.

      }

      if (interaction.customId === 'marketfareweekend') {

        if (now.getDay() <= 4 && now.getDay() != 0) return interaction.reply({ content: `It's not yet the weekend.`, ephemeral: true });
        if (now.getTime() < result.passExpireTime ) {
          interaction.member.roles.add('1212820829344374834');
          return interaction.reply ({ content: 'Your pass has yet to expire.', ephemeral: true});
        }
        // add 2 days to the database.

        const cost = 15;
        const userWallet = await UserData.findOne({ userID: interaction.member.id });
        if (userWallet.money < cost) return interaction.reply({ content: `Insufficient shells, you need ${cost} shells to obtain this pass.`, ephemeral: true });

        userWallet.money -= cost;
        await userWallet.save();

        await addMarketFareTime (interaction.member.id, 1000 * 60 * 60 * 48);

        await interaction.member.roles.add('1212820829344374834');

        interaction.reply({ content: `Pass Obtained! Expires <t:${Math.floor((new Date().getTime() + 1000 * 60 * 60 * 48)/1000)}:R>`, ephemeral: true });
        // add fare role and add to data base.

        const jianDaoWallet = await UserData.findOne({ userID: '1202895682630066216' });
        jianDaoWallet.money += cost;
        await jianDaoWallet.save();

      }

      if (interaction.customId === 'tipjar') {
        // tip jian dao

        const cost = 1;
        const userWallet = await UserData.findOne({ userID: interaction.member.id });
        if (userWallet.money < cost) return interaction.reply({ content: `Insufficient shells, you need ${cost} shells to tip.`, ephemeral: true });

        userWallet.money -= cost;
        await userWallet.save();

        // add tip to jian dao.

        interaction.reply({ content: `Thank you for the tip! - Jian Dao <a:megabounce:1212848470528884807>`, ephemeral: true });

        const jianDaoWallet = await UserData.findOne({ userID: '1202895682630066216' });
        jianDaoWallet.money += 1;
        await jianDaoWallet.save();

      }

      })
};

async function addMarketFareTime (userID, time) {

  let result = await Fare.findOne ({ userId : userID });
  const userData = await UserData.findOne ({ userID: userID});

  if (!result) {

    result = new Fare ({
      userId: userID,
      originalGroup: userData.group,
    })

  }

  const now = new Date();

  result.passExpireTime = now.getTime() + time;

  await result.save();

}
