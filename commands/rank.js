const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Svr = require("../models/server.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rank')
		.setDescription('View ranks of users')
        .addUserOption(option=>option.setName("user").setDescription("User to view rank of").setRequired(false)),
	async execute(interaction) {
		var id = 0;
        const _user = interaction.options.getUser("user");
        if (_user) {
            id = _user.id;
        } else {
            id = interaction.user.id;
        }
        const user = await interaction.guild.members.fetch(id);

        Svr.find({ Name: interaction.guild.name })
        .then((res) => {
            var e = true;
            for (var i = 0; i < res[0].Users.length; i++) {
                if (res[0].Users[i].id == id) {
                    e = false;
                    let emb = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle(`Rank of ${user.user.tag}`)
                    .setDescription("<@" + id + "> is at Level " + Math.floor(Math.sqrt(res[0].Users[i].xp / 2)).toString() + " with " + res[0].Users[i].xp.toString() + " XP.")

                    interaction.reply({ embeds: [emb] })
                    .catch((err) => {
                        console.log(err);
                    });
                    break;
                }
            }
            if (e) {
                let emb = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle(`Rank of ${user.user.tag}`)
                .setDescription("<@" + id + "> is at Level -∞ with 0 XP.")

                interaction.reply({ embeds: [emb] })
                .catch((err) => {
                    console.log(err);
                });
            }
        })
        .catch((err) => {
            console.log(err);
        });
	},
};