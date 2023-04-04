const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const { successEmb, nopeEmb, errEmb} = require("../embeds.js");
const Svr = require("../models/server.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rank-set')
		.setDescription("Modify a user's rank")
        .addUserOption(option=>option.setName("user").setDescription("User to change rank of").setRequired(true))
        .addIntegerOption(option=>option.setName("amount").setDescription("Number to set lvl to").setRequired(true)),
	async execute(interaction) {
        if (!(interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) || interaction.user.id == 706819441727373342)){
            interaction.reply({ embeds: [nopeEmb.setDescription("Imagine not being admin :)")] })
            .catch((err) => {
                console.log(err);
            });
            return;
        }

        const user = interaction.options.getUser("user");
        const num = interaction.options.getInteger("amount");

        Svr.find({ Name: interaction.guild.name })
        .then((res) => {
            var e = true;

            for (var i = 0; i < res[0].Users.length; i++) {
                if (res[0].Users[i].id == user.id) {
                    e = false;
                    res[0].Users[i].xp = num * num * 2;
                    interaction.reply({ embeds: [successEmb.setDescription("Successfully set <@" + user.id + ">'s Level to " + num.toString() + ". (" + (num * num * 2).toString() + "XP)")], ephemeral: true})
                    .catch((err) => {
                        console.log(err);
                    });
                break;
                }
            }

            if (e) {
                res[0].Users[res[0].Users.length] = {
                    id: user.id,
                    xp: num * num * 2,
                    warns: []
                }
                interaction.reply({ embeds: [successEmb.setDescription("Successfully set <@" + user.id + ">'s Level to " + num.toString() + ". (" + (num * num * 2).toString() + "XP)")] })
                .catch((err) => {
                    console.log(err);
                });
            }

            const date = new Date();

            res[0].save()
            .then(() => {
                console.log("Successfully updated object      [" + date.getHours() + ":" + date.getMinutes() + "]");
            })
            .catch((err) => {
                console.log("Error updating object (101):\n " + err)
            });
        })
        .catch((err) => {
            console.log(err);
        });
	},
};