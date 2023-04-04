const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const { successEmb, nopeEmb, errEmb} = require("../embeds.js");
const Svr = require("../models/server.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('warn-words')
		.setDescription('Costomize words that will automatically result in a warning')
        .addSubcommand(subcommand=>subcommand
            .setName("add")
            .setDescription("Add a warn-word")
            .addStringOption(option=>option.setName("word").setDescription("Word to add").setRequired(true))
        )
        .addSubcommand(subcommand=>subcommand
            .setName("remove")
            .setDescription("Remove a warn-word")
            .addStringOption(option=>option.setName("word").setDescription("Word to remove").setRequired(true))
        )
        .addSubcommand(subcommand=>subcommand
            .setName("list")
            .setDescription("View warn-words list")
        ),
	async execute(interaction) {
		if (!(interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers) || interaction.user.id == 706819441727373342)) {
            interaction.reply({ embeds: [nopeEmb.setDescription("Imagine not having that permission :)")] })
            .catch((err) => {
                console.log(err);
            });
            return;
        }

        const subcommand = interaction.options.getSubcommand();
        let word;
        try{
            word = interaction.options.getString("word");
        }catch(err){
            console.log(err);
        }

        if (subcommand === "list") {
            Svr.find({ Name: interaction.guild.name })
                .then((res) => {
                    if (res[0].Warn_Words.length > 0) {
                        let emb = new EmbedBuilder()
                        .setColor('#ff9933')
                        .setTitle("Warn Words:");

                        for (var i = 0; i < res[0].Warn_Words.length; i++) {
                            emb = emb.addFields({name: (i + 1).toString(), value: res[0].Warn_Words[i]});
                        }

                        interaction.reply({ embeds: [emb] })
                        .catch((err) => {
                            console.log(err);
                        });
                    } else {
                        interaction.reply({ embeds: [nopeEmb.setDescription("That list doesn't exist :)")], ephemeral: true})
                        .catch((err) => {
                            console.log(err);
                        });
                    }
                })
                .catch((err) => {
                console.log(err);
                });
        } else if (subcommand === "add") {
            Svr.find({ Name: interaction.guild.name })
                .then((res) => {
                    res[0].Warn_Words[res[0].Warn_Words.length] = word;
                    interaction.reply({ embeds: [successEmb.setDescription("Successfully added '" + word + "'.")] })
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
        } else if (subcommand === "remove") {
            Svr.find({ Name: interaction.guild.name })
                .then((res) => {
                    var e = true;
                    for (var i = 0; i < res[0].Warn_Words.length; i++) {
                        if (res[0].Warn_Words[i] == word) {
                            e = false;
                            res[0].Warn_Words.splice(i, 1);
                            interaction.reply({ embeds: [successEmb.setDescription("Successfully removed '" + word + "'.")], ephemeral: true})
                            .catch((err) => {
                                console.log(err);
                            });
                            break;
                        }
                    }
                    if (e) {
                    interaction.reply({ embeds: [nopeEmb.setDescription("Couldn't find that word :D")], ephemeral: true})
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
                        console.log("Error updating object (101):\n " + err);
                        interaction.followUp({embeds: [errEmb.setDescription("Database deploy error, nothing you can do about this. You might want to contact the coder about this (Link in profile)")], ephemeral: true});
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        }
	},
};