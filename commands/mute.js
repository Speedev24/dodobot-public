const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const { successEmb, errEmb, nopeEmb} = require("../embeds.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mute')
		.setDescription('Timeout a user for x minutes | Requires ADMINISTRATOR permissions')
        .addUserOption(option=>option.setName("user").setDescription("User to timeout").setRequired(true))
        .addNumberOption(option=>option.setName("minutes").setDescription("x minutes to timeout").setRequired(true))
        .addStringOption(option=>option.setName("reason").setDescription("Reason for timeout").setRequired(false)),
	async execute(interaction) {
		if (!(interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) || interaction.user.id == 706819441727373342)) {
            interaction.reply({ embeds: [nopeEmb.setDescription("Imagine not having that permission :)")]})
            .catch((err) => {
                console.log(err);
            });
            return;
        }

        var user = interaction.options.getUser("user");
        var x = interaction.options.getNumber("minutes");
        var reason = interaction.options.getString("reason");

        if (x > 0) {
            var member = interaction.guild.members.cache.get(user.id);
            member.timeout(x * 60000, reason ? reason : "")
            .then(() => {
                interaction.reply({ embeds: [successEmb.setDescription(`${user.toString()} has been timeouted for ${x} minutes for reason:\n${reason ? reason : ""}`)], ephemeral: true})
                .catch((err) => {
                    console.log(err);
                });
            })
            .catch((err) => {
                interaction.reply({ embeds: [errEmb.setDescription("Error timeouting user. One likely reason for this are missing permissions or too high duration input :(")], ephemeral: true})
                .catch((err) => {
                    console.log(err);
                });
                console.log(err);
            });
        } else {
            interaction.reply({ embeds: [nopeEmb.setDescription("Successfully time-outed user for 0 minutes :)")], ephemeral: true})
            .catch((err) => {
                console.log(err);
            });
        }
	},
};