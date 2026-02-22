const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('dailycryptic').setDescription("Replies with today's cryptic!"),
	async execute(interaction) {
        const dailyCryptic = await getDailyCryptic()
        const clue = dailyCryptic.clue.map(w => w.text).join(" ")
        const answerLength = dailyCryptic.answer.length
		await interaction.reply(`${clue} (${answerLength})`);
	},
};

async function getDailyCryptic() {
    const response = await fetch("https://www.minutecryptic.com/api/daily_puzzle/today?tz=Europe/Zurich")
    const data = await response.json()

    return data
}