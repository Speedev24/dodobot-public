const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const { successEmb, nopeEmb, errEmb} = require("../embeds.js");
const Svr = require("../models/server.js");
const index = require("../index.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('react-role')
		.setDescription('Manage reaction-roles')
        .addSubcommand(subcommand=>subcommand
            .setName("list")
            .setDescription("View a list of all reaction-roles")
        )
        .addSubcommand(subcommand=>subcommand
            .setName("add")
            .setDescription("Add a reaction-role")
            .addRoleOption(option=>option.setName("role").setDescription("Role to add").setRequired(true))
        )
        .addSubcommand(subcommand=>subcommand
            .setName("remove")
            .setDescription("Remove a reaction-role")
            .addRoleOption(option=>option.setName("role").setDescription("Role to remove").setRequired(true))
        ),
	async execute(interaction) {
		if (!(interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles) || interaction.user.id == 706819441727373342)) {
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
                let emb = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle("Reaction Roles:");

                let des = "";

                if(res[0].React_Role.length < 1){
                    des = "No reaction-roles."
                }else{
                    for (var i = 0; i < res[0].React_Role.length; i++) {
                        des += `**${(i + 1).toString()}** <@&${res[0].React_Role[i].Role}>\n`;
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

        const r = interaction.options.getRole("role");

        if (subcommand === "remove") {
            Svr.find({ Name: interaction.guild.name })
            .then((res) => {
                let e = false;
                for (var n = 0; n < res[0].React_Role.length; n++) {
                    if (res[0].React_Role[n].Role == r.id) {
                        res[0].React_Role.splice(n, 1);

                        interaction.reply({ embeds: [successEmb.setDescription("Succesfully removed Reaction-Role <@&" + r + ">.")], ephemeral: true})
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
                        e = true;
                    }
                }
                if(!e){
                    interaction.reply({ embeds: [nopeEmb.setDescription("Reaction-role does not exist")], ephemeral: true})
                    .catch((err) => {
                        console.log(err);
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            });
        } else if(subcommand === "add") {
            let emb = new EmbedBuilder()
            .setColor('#ffcc00')
            .setTitle("Reaction Role")
            .setDescription("React to a message within the next 10 seconds to apply reaction role <@&" + r + ">.");

            interaction.reply({ embeds: [emb], ephemeral: true})
            .catch((err) => {
                console.log(err);
            });
            /*rr = true;rra = interaction.user.id;rrc = interaction.channel.id;rrr = r.id;*/
            index.rrChange(true, interaction.user.id, interaction.channel.id, r.id);
            console.log("set");
            (async () => {
                await index.sleep(10000);
                if (index.getrr() === true) {
                    /*rr = false;rra = null;rrc = null;rrr = null;*/
                   index.rrChange(false, null, null, null);
                   console.log("set again");
                }
            })();
        }
	},
};