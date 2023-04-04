const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder} = require('discord.js');
const { successEmb, nopeEmb} = require("../embeds.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Clear 1-99 messages in your current channel')
        .addIntegerOption(option=>option.setName("amount").setDescription("Amount of messages to clear (1-99)").setRequired(true)),
	async execute(interaction) {
		if (!(interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) || interaction.user.id == 706819441727373342)) {
            interaction.reply({ embeds: [nopeEmb.setDescription("Imagine not being admin :)")] })
            .catch((err) => {
                console.log(err);
            });
            return;
        }

        const num = interaction.options.getInteger("amount");

        if (num < 1) {
            interaction.reply({ embeds: [nopeEmb.setDescription("Succesfully not deleted messages :)")], ephemeral: true})
            .catch((err) => {
                console.log(err);
            });
        } else {
            interaction.deferReply({ephemeral: true});
            const messages = await interaction.channel.messages.fetch({ limit: num })
            .catch((err)=>console.log(err));
            await interaction.channel.bulkDelete(messages)
            .catch((err) => console.log(err));
            interaction.editReply({embeds: [successEmb.setDescription(`Successfully cleared ${num} messages :D`)]})
            .catch((err)=>console.log(err));
        }
	},
};