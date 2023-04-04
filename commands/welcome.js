const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const { successEmb, nopeEmb, errEmb} = require("../embeds.js");
const Svr = require("../models/server.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('welcome')
		.setDescription('Set a welcome-message')
        .addStringOption(option=>option.setName("message").setDescription('Use "$" to mention the new member').setRequired(true))
        .addChannelOption(option=>option.setName("channel").setDescription("Channel for welcome messages").setRequired(true)),
	async execute(interaction) {
		if (!(interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) || interaction.user.id == 706819441727373342)) {
            interaction.reply({ embeds: [nopeEmb.setDescription("Imagine not being admin :)")] })
            .catch((err) => {
                console.log(err);
            });
            return;
        }

        Svr.find({ Name: interaction.guild.name })
        .then((res) => {
            const channel = interaction.options.getChannel("channel");
            res[0].W_Msg.Channel = channel.id;
            const msg = interaction.options.getString("message");
            res[0].W_Msg.Msg = msg;

            interaction.reply({ embeds: [successEmb.setDescription(`Succesfully set welcome-message to\n**${msg}**\nIn channel **<#${channel.id}>**`)], ephemeral: true})
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