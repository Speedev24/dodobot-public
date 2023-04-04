const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const { successEmb, errEmb, nopeEmb} = require("../embeds.js");
const Svr = require("../models/server");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('warn')
        .setDescription('Warn a user / Remove a warning / View Warning list')
        .addSubcommand(subcommand=>
            subcommand.setName("add")
            .setDescription("Add a warning to a user's criminal profile")
            .addUserOption(option=>option.setName("user").setDescription("User to warn").setRequired(true))
            .addStringOption(option=>option.setName("reason").setDescription("Reason for warning").setRequired(false))
        )
        .addSubcommand(subcommand=>
            subcommand.setName("remove")
            .setDescription("Remove a warning from a user's criminal profile")
            .addUserOption(option=>option.setName("user").setDescription("User to remove warning from").setRequired(true))
            .addStringOption(option=>option.setName("index").setDescription("Index of warning in list or ALL").setRequired(true))
        )
        .addSubcommand(subcommand=>
            subcommand.setName("list")
            .setDescription("View a user's criminal profile | Requires MOD permissions")  
            .addUserOption(option=>option.setName("user").setDescription("User to view").setRequired(true))  
        ),
	async execute(interaction) {
        var subcommand = interaction.options.getSubcommand();
        const user = interaction.options.getUser("user");
        const member = await interaction.guild.members.fetch(user.id);

        switch(subcommand){
            case "add":
                if (!(interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers) || interaction.user.id == 706819441727373342)) {
                    interaction.reply({ embeds: [nopeEmb.setDescription("Imagine not having that permission :)")] })
                    .catch((err) => {
                        console.log(err);
                    });
                    return;
                }

                const reason = interaction.options.getString("reason");

                if (!member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
                    Svr.find({ Name: interaction.guild.name })
                    .then((res) => {
                        var e = true;
                        for (var i = 0; i < res[0].Users.length; i++) {
                            if (res[0].Users[i].id == user.id) {
                                e = false;
                                res[0].Users[i].warns[res[0].Users[i].warns.length] = {
                                Reason: reason ? reason : "",
                                Time: new Date().getTime()
                                }
                            }
                        }

                        if (e) {
                            res[0].Users[res[0].Users.length] = {
                                id: user.id,
                                xp: 0,
                                warns: [{
                                Reason: reason ? reason : "",
                                Time: new Date().getTime()
                                }]
                            }
                        }

                        interaction.reply({ embeds: [successEmb.setDescription("Warn successful :D")], ephemeral: true})
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

                        let emb = new EmbedBuilder()
                        .setColor('#ff9933')
                        .setTitle("You have received a Warning in " + interaction.guild.name)
                        .setDescription("<t:" + Math.floor(new Date().getTime() / 1000) + ":F>")
                        .addFields(
                            { name: "Reason: ", value: reason ? reason : "undefined" }
                        );

                        user.send({ embeds: [emb] })
                        .catch((err) => {
                            console.log(err);
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                    });
                } else {
                    interaction.reply({ embeds: [nopeEmb.setDescription("Uhm yeah no")] })
                    .catch((err) => {
                        console.log(err);
                    });
                }
                break;
            case "remove":
                if (!(interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers) || interaction.user.id == 706819441727373342)) {
                    interaction.reply({ embeds: [nopeEmb.setDescription("Imagine not having that permission :)")] })
                    .catch((err) => {
                        console.log(err);
                    });
                    return;
                } 

                const index = interaction.options.getString("index");

                if (parseInt(index)) {
                    Svr.find({ Name: interaction.guild.name })
                    .then((res) => {
                        var e = true;
                        for (var i = 0; i < res[0].Users.length; i++) {
                            if (res[0].Users[i].id == user.id) {
                                if (res[0].Users[i].warns.length > 0) {
                                e = false;
                                res[0].Users[i].warns.splice(parseInt(index) - 1, 1);
                                interaction.reply({ embeds: [successEmb.setDescription("Successfully deleted warning :D")], ephemeral: true})
                                .catch((err) => {
                                    console.log(err);
                                });
                                }
                            }
                        }
                        if (e) {
                        interaction.reply({ embeds: [nopeEmb.setDescription("User <@" + user.id + "> doesn't have a criminal profile yet :)")], ephemeral: true})
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
                } else if (index === "all") {
                    Svr.find({ Name: interaction.guild.name })
                    .then((res) => {
                        var e = true;
                        for (var i = 0; i < res[0].Users.length; i++) {
                            if (res[0].Users[i].id == user.id) {
                                if (res[0].Users[i].warns.length > 0) {
                                    e = false;
                                    res[0].Users[i].warns = [];
                                    interaction.reply({ embeds: [successEmb.setDescription("Successfully deleted all warnings :D")], ephemeral: true})
                                    .catch((err) => {
                                        console.log(err);
                                    });
                                }
                            }
                        }
                        if (e) {
                        interaction.reply({ embeds: [nopeEmb.setDescription("User <@" + interaction.mentions.users.first().id + "> doesn't have a criminal profile yet :)")], ephemeral: true})
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
                } else {
                    interaction.reply({ embeds: [nopeEmb.setDescription("Which one?")], ephemeral: true})
                    .catch((err) => {
                        console.log(err);
                    });
                }
                break;
            case "list":
                if (!(interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers) || interaction.user.id == 706819441727373342)) {
                    interaction.reply({ embeds: [nopeEmb.setDescription("Imagine not having that permission :)")] })
                    .catch((err) => {
                    console.log(err);
                    });
                    return;
                }

                Svr.find({ Name: interaction.guild.name })
                .then((res) => {
                    var e = true;
                    for (var i = 0; i < res[0].Users.length; i++) {
                        if (res[0].Users[i].id == user.id) {
                            if (res[0].Users[i].warns.length > 0) {
                                e = false;

                                let emb = new EmbedBuilder()
                                .setColor('#ff9933')
                                .setTitle(user.tag + "'s Warnings:");

                                for (var n = 0; n < res[0].Users[i].warns.length; n++) {
                                    emb = emb.addFields({name: (n + 1).toString(), value: "<t:" + Math.floor(res[0].Users[i].warns[n].Time / 1000) + ":F>\n\nReason: " + res[0].Users[i].warns[n].Reason + "\n\n"})
                                }

                                interaction.reply({ embeds: [emb] })
                                .catch((err) => {
                                    console.log(err);
                                });
                            }
                        }
                    }
                    if (e) {
                        interaction.reply({ embeds: [nopeEmb.setDescription("User <@" + user.id + "> doesn't have a criminal profile yet :)")] })
                        .catch((err) => {
                            console.log(err);
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
                break;
        }
	},
};