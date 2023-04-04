const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const { successEmb, errEmb, nopeEmb} = require("../embeds.js");
const Svr = require("../models/server.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rank-channel')
		.setDescription('Set the channel for rankup-messages')
        .addChannelOption(option=>option.setName("channel").setDescription("Channel to user for rankup-interactions").setRequired(true)),
	async execute(interaction) {
		if (!(interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) || interaction.author.id == 706819441727373342)) {
            interaction.reply({ embeds: [nopeEmb.setDescription("Imagine not being admin :)")] })
            .catch((err) => {
                console.log(err);
            });
            return;
        }
        const channel = interaction.options.getChannel("channel");
        Svr.find({ Name: interaction.guild.name })
        .then((res) => {
            res[0].Rank_Channel = channel.id;
            interaction.reply({ embeds: [successEmb.setDescription("Succesfully updated Rank-interaction-Channel.")], ephemeral: true})
            .catch((err) => {
                console.log(err);
            });

            const date = new Date();

            res[0].save()
            .then(() => {
                console.log("Successfully updated object      [" + date.getHours() + ":" + date.getMinutes() + "]");
            })
            .catch((err) => {
                console.log("Error updating object (101):\n " + err);
                interaction.followUp({embeds: [errEmb.setDescription("Database deploy error, nothing you can do about this. You might want to contact the coder about this (Link in profile)")], ephemeral: true});
            });
        })
        .catch((err) => {
            console.log(err);
        });
	},
};