// Require the necessary discord.js classes
const fs = require('fs');
const { Client, Events, GatewayIntentBits, ActivityType, PermissionsBitField } = require('discord.js');
const { token, mongourl } = require('./keys.json');
const { kimoChannelID, kimoServerID, botLogChannelID, participantRoleID } = require('./ids.json');
require('log-timestamp');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates] });

const mongoose = require('mongoose');

  mongoose.connect(mongourl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('connected to KimoMiniDB'))
    .catch((err) => console.log(err));

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'

const registerCommands = require ('./registerCommands');
const KimoTracker = require('./models/kimoTracker');
const postListener = require('./patterns/postListener');
const updateUserState = require('./patterns/updateUserState');
const dailySLICE = require('./patterns/dailySLICE');
const slice = require('./patterns/slice');
const UserState = require('./models/userState');
const CUTOFFCLOCK = require('./patterns/cutOffClock');
const createWeeklySummary = require('./patterns/createWeeklySummary');
registerCommands;

client.once(Events.ClientReady, async c => {

    const filter = {}; // An empty filter matches all documents
    const update = {
      $set: { postedToday: false },
    };

    const updateResult = await UserState.updateMany(filter, update);
    console.log(`Matched ${updateResult.matchedCount} documents and modified ${updateResult.modifiedCount} documents.`);

	console.log(`Ready! Logged in as ${c.user.tag}`);
  CUTOFFCLOCK(client);

  const KimoServer = await client.guilds.fetch(kimoServerID);
  const botLogChannel = KimoServer.channels.cache.get(botLogChannelID);
  // (await KimoServer.members.fetch ('865147754358767627')).roles.set(['1193249042696777869']);

  botLogChannel.send (`# I've awoken.`);

  postListener(client);
  dailySLICE(client);

  setInterval(() => {

    dailySLICE(client);
    CUTOFFCLOCK(client);
    
  }, 1000 * 10);


});

// new user join auto role
client.on(Events.GuildMemberAdd, async (member) => {
  // updateUserState(member);
});


//Regular Secret Commands 
//Check if user is also in the hell mart discord. Only work if so.
client.on(Events.MessageCreate, async (message) => {

  if (message.member.user.id != '865147754358767627') return;

  if (message.content.startsWith('!')) {
      console.log('commandDetected');
      // Extract the command and any arguments
      const args = message.content.slice(1).trim().split(/ +/);
      const command = args.shift().toLowerCase();
  
      // Check the command and respond
      if (command === 'createkimo') {
        console.log('createKimoDetected');

        const result = await KimoTracker.findOne({ serverId: message.guild.id });
        const currentDate = new Date();

        if (result) {
          message.reply ('Server Document Already Exists.');
          return;
        }
        else {
          const newKimoServer = new KimoTracker ({ 
            serverId: message.guild.id,
            currentDate: currentDate.getDay(),
            nextDate: currentDate.getDay(),
            kimoActive: false,
          })
          await newKimoServer.save();
          message.reply ('New Server Document Created');
        }
      } 
      if (command === 'assignall') {

        const KimoServer = await client.guilds.fetch(kimoServerID);
        await KimoServer.members.fetch();
        const members = KimoServer.members.cache.filter(member => member.roles.cache.has(participantRoleID));
        members.forEach(async member => {
          updateUserState(member);
        })

        message.reply('updating user states for all members');
      } 
      if (command === 'forceslice') {
        console.log ('force slice detected');
        slice(client);
      } 

      if (command === 'summary') {
        createWeeklySummary(client);
      } 

      if (command === 'resetstate') {
        const members = await message.guild.members.fetch();

        members.forEach(async member => {
          const result = await UserState.findOne({ userID: member.user.id });
          if (result) {
            const KimoServer = await client.guilds.fetch(kimoServerID);
            const botLogChannel = KimoServer.channels.cache.get(botLogChannelID);
            botLogChannel.send (`Slicing ${member}, changing state to ${result.currentState} to DANGER`, {"allowed_mentions": {"parse": []}})

            result.currentState = 'DANGER';
            result.save();
          }
          updateUserState(member);
        })
      }

      if (command === 'activate') {
        const kimoTracker = await KimoTracker.findOne({serverId: message.guild.id });

        if (kimoTracker.kimoActive == true) {

          kimoTracker.kimoActive = false;
          await kimoTracker.save();
          message.channel.send ('Kimo Deactivated');

        }
        else {
          kimoTracker.kimoActive = true;
          await kimoTracker.save();
          message.channel.send ('Kimo Activated');
        }

      }
    }
})

// Define a collection to store your commands
client.commands = new Map();

// Read the command files and register them
const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  const command = client.commands.get(commandName);

  if (!command) return;

  try {
    await command.execute(interaction, client);
  }
  catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error executing this command.', ephemeral: true });
  }
});

// Log in to Discord with your client's token

client.login(token);