const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const { helpEmb} = require("../embeds.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('d-help')
		.setDescription('Overview over all DodoBot-Commands'),
	async execute(interaction) {
		interaction.reply({embeds: [helpEmb]});
	},
};