const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const { successEmb, errEmb, nopeEmb} = require("../embeds.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Ban a user | Requires BAN permissions')
		.addUserOption(option=>option.setName("user").setDescription("User to ban").setRequired(true)
		),
	async execute(interaction) {
		if (!(interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers) || interaction.user.id == 706819441727373342)) {
			interaction.reply({ embeds: [nopeEmb.setDescription("Imagine not having that permission :)")]})
			.catch((err) => {
				console.log(err);
			});
			return;
		}

		var user = interaction.options.getUser("user");
		var target = interaction.guild.members.cache.get(user.id);
		target.ban()
		.then((res) => {
			interaction.reply({ embeds: [successEmb.setDescription(user.toString() + " has been banned.")], ephemeral: true})
			.catch((err) => {
				console.log(err);
			});
		})
		.catch((err) => {
			interaction.reply({ embeds: [errEmb.setDescription("Error banning user. One likely reason for this are missing permissions :(")], ephemeral: true})
			.catch((err) => {
				console.log(err);
			});
			console.log(err);
		});
	},
};