const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder().setName('bleh').setDescription('Replies with BLEH! and an image'),
    async execute(interaction) {
        await interaction.reply({
            content: 'BLEH!😝',
            files: ['https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExazRlNWp1bnoyOGQwaTA4d3ltcHg1amg0a2FjdXdoZXJrZTNzb2piOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Hsz2YZ9iBxvIztWpkd/giphy.gif']
        });
    },
};