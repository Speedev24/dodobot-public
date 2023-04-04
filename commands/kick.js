const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const { successEmb, errEmb, nopeEmb} = require("../embeds.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Kick a user | Requires KICK permissions')
		.addUserOption(option=>option.setName("user").setDescription("User to kick").setRequired(true)
		),
	async execute(interaction) {
		if (!(interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers) || interaction.user.id == 706819441727373342)) {
			interaction.reply({ embeds: [nopeEmb.setDescription("Imagine not having that permission :)")]})
			.catch((err) => {
				console.log(err);
			});
			return;
		}

		var user = interaction.options.getUser("user");
		var target = interaction.guild.members.cache.get(user.id);
		target.kick()
		.then((res) => {
			interaction.reply({ embeds: [successEmb.setDescription(user.toString() + " has been kicked.")], ephemeral: true})
			.catch((err) => {
				console.log(err);
			});
		})
		.catch((err) => {
			interaction.reply({ embeds: [errEmb.setDescription("Error kicking user. One likely reason for this are missing permissions :(")], ephemeral: true})
			.catch((err) => {
				console.log(err);
			});
			console.log(err);
		});
	},
};