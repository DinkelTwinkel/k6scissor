const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const UserState = require('../models/userState');
const updateUserState = require('../patterns/updateUserState');
// const Point = require('../models/points');
// const increaseJackPot = require('../patterns/increaseJackPot');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('uplift')
    .setDescription('revive or make user safe')
    .addUserOption(option =>
			option
				.setName('target')
				.setDescription('target for uplift')
				.setRequired(true)),
    async execute(interaction) {

      if(!interaction.member.permissionsIn(interaction.channel).has(PermissionsBitField.Flags.Administrator) && !interaction.member.roles.cache.get('1202555128352346143')){
        await interaction.reply({content: "You must be an administrator or lifeguard to perform this action.", ephemeral: true});
        return;
      }

      const target = interaction.options.getMember('target');

      const result = await UserState.findOne({ userID: target.user.id});
      if (result) {
        interaction.reply (`Uplifting ${target}, changing state from ${result.currentState} to ${staggerStateUp(result.currentState)}`);
        result.currentState = staggerStateUp(result.currentState);
      }

      await result.save();
      updateUserState(target);

    },
  };

  function staggerStateUp(currentState) {

    if (currentState === 'DANGER') {
        return 'SAFE';
    } 
    else if (currentState === 'DEAD'){
        return 'DANGER';
    }

}

