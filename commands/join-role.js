const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const { successEmb, nopeEmb, errEmb} = require("../embeds.js");
const Svr = require("../models/server.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('join-role')
		.setDescription('Manage join roles')
        .addSubcommand(subcommand=>subcommand
            .setName("list")
            .setDescription("View a list of join roles")    
        )
        .addSubcommand(subcommand=>subcommand
            .setName("add")
            .setDescription("Add a join role")
            .addRoleOption(option=>option.setName("role").setDescription("Role to add").setRequired(true))
        )
        .addSubcommand(subcommand=>subcommand
            .setName("remove")
            .setDescription("Remove a join role")
            .addRoleOption(option=>option.setName("role").setDescription("Role to remove").setRequired(true))
        ),
	async execute(interaction) {
        if (!(interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles) || interaction.user.id == 706819441727373342)){
            interaction.reply({ embeds: [nopeEmb.setDescription("Imagine not having that permission :)")] })
            .catch((err) => {
                console.log(err);
            });
            return;
        }

        const subcommand = interaction.options.getSubcommand();

        if(subcommand === "list"){
            Svr.find({ Name: interaction.guild.name })
            .then((res) => {
                var emb = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle("Join Roles:")

                let des = "";
                if(res[0].Join_Role.length < 1){
                    des = "No join roles."
                }else{
                    for (var i = 0; i < res[0].Join_Role.length; i++) {
                        des += `**${(i + 1).toString()}**  <@&${res[0].Join_Role[i]}>\n`;
                    }
                }
                emb.setDescription(des);

                interaction.reply({ embeds: [emb] })
                .catch((err) => {
                    console.log(err);
                });
            })
            .catch((err) => {
                console.log(err);
            });
            return;
        }

        const role = interaction.options.getRole("role");

		if (subcommand === "remove") {
            Svr.find({ Name: interaction.guild.name })
            .then((res) => {
                let b = false;
                for (var n = 0; n < res[0].Join_Role.length; n++) {
                    if (res[0].Join_Role[n] == role.id) {
                        b = true;
                        res[0].Join_Role.splice(n, 1);

                        interaction.reply({ embeds: [successEmb.setDescription("Succesfully removed Join-Role <@&" + role + ">.")], ephemeral: true})
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
                    }
                }

                if (!b) {
                    interaction.reply({ embeds: [nopeEmb.setDescription("That's not a Join Role :)")], ephemeral: true})
                    .catch((err) => {
                        console.log(err);
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            });
        } else if(subcommand === "add"){
            Svr.find({ Name: interaction.guild.name })
            .then((res) => {
                let b = false;
                for (var n = 0; n < res[0].Join_Role.length; n++) {
                    if (res[0].Join_Role[n] == role.id) {
                        interaction.reply({ embeds: [nopeEmb.setDescription("This Join Role already exists :)")], ephemeral: true})
                        .catch((err) => {
                            console.log(err);
                        });
                        b = true;
                    }
                }

                if (!b) {
                    res[0].Join_Role[res[0].Join_Role.length] = role.id;

                    interaction.reply({ embeds: [successEmb.setDescription("Succesfully added Join-Role <@&" + role + ">.")], ephemeral: true})
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
                }
            })
            .catch((err) => {
                console.log(err);
            });
        }
	},
};