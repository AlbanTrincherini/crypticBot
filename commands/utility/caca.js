const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('caca').setDescription('Replies with Pipi!'),
	async execute(interaction) {
		await interaction.reply('Pipi!');
	},
};