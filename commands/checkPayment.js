const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping_payments')
		.setDescription('Should ping whether a payment has been made!'),
	async execute(interaction) {
		await interaction.reply('A payment must have been made by now!');
	},
};