const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Svr = require("../models/server.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rank-lb')
		.setDescription('View rank leaderboard of the server')
        .addIntegerOption(option=>option.setName("page").setDescription("Leaderboard page").setRequired(false)),
	async execute(interaction) {
        const n = interaction.options.getInteger("page");

		Svr.findOne({ Name: interaction.guild.name })
        .then(async (res) => {
            const members = await interaction.guild.members.fetch();
            const page = n > 0 ? n : 1;

            let users = res.Users;
            users.sort((a, b)=>{
                if(a.xp<b.xp)return 1;
                if(a.xp>b.xp)return -1;
                return 0;
            });

            let top = [];

            for(let i = (page-1) * 10; i<((page-1) * 10)+10; i++){
                if(users[i]) top.push(users[i]);
            }

            let emb = new EmbedBuilder()
            .setTitle(`Server Leaderboard (${interaction.guild.name}):`)
            .setColor('#0099ff');

            let des = "";

            for(let i = 0; i<top.length; i++){
                let member = members.find(member=>member.id===top[i].id);
                let tag;
                if(member) {tag = member.user.tag;}
                else {tag = `Undefined user with id ${top[i].id}`}
                des += `**${i+1} ${tag}:**  LVL ${Math.floor(Math.sqrt(top[i].xp / 2)).toString()}\n`;
            }
            if(des != "") {emb.setDescription(des).setFooter({text: `Page ${page}`});}
            else {emb.setDescription("Page unavailable").setFooter({text: `Page ${page}`});}

            interaction.reply({embeds: [emb]})
            .catch(err=>console.log(err));
        })
        .catch((err) => {
            console.log(err);
        });
	},
};