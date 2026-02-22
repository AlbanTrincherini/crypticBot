const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder().setName('bleh').setDescription('Replies with bleh and a gif'),
    async execute(interaction) {

        const image = [
            'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExazRlNWp1bnoyOGQwaTA4d3ltcHg1amg0a2FjdXdoZXJrZTNzb2piOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Hsz2YZ9iBxvIztWpkd/giphy.gif',
            'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExemZyem9yejhzcnNrdjBvbDQwMTBocm96cjhsNmcyb2VrMmJha3A1dSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ulWUgCk4F1GGA/giphy.gif',
            'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExMGlxNWszYzZkNGVidHF2cTc0dzgzOHlpZ3VqNjl0bndqZnh0NzhlaCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/dkvGrfQ6ryIAU/giphy.gif',
            'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExYXUxbTBmbGJ2NW15dW51OG5qeHNzcnR5cTZndXFwZG9nc2dobTBwYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/UrPxdGW62TDtS/giphy.gif',
            'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExYzAwNDFzM25nd2VuNzVyMHg5bnloaWczdnVwZzNzcGFleGxnd2RjNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/YJ4AynOvIRZAs/giphy.gif',
            'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDlwbnB3Y2FnNmdqeDZiaWpxeDg3a282ZDYxZm9qZTk2NXMxZnMybyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/LUrk8vViXaVGg/giphy.gif',
            'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExeWxwa240N200aXhmZXcxN3N6cXd3Y2d5NG91bW55dGVvMDJ3MGRlYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/9dSszxkp1QhVu/giphy.gif',
            'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExMng3dzF6b2FyM3FzdWk3eGhyN2Y5aHRyYmVsOGk5cnh0MWY3aGRwZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/mu93K3BTDzckn7VVrz/giphy.gif',
            'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExb3duMXZkenpjN3ZhaW5jZTU1aTI5cm51dWt4Nmp0MXJzcXQ1anA2YiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/FWAcpJsFT9mvrv0e7a/giphy.gif',
            'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZXpwMjllYjZxdW9jamdobGRneXg0ODQ3MzcyZ2VldmE3Z2Jud3E0MSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/WoTqb0vq0xrx42Sj8s/giphy.gif',
            'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExY2o0eWtoNWY2ajI4MGdldDRvOHFvMjg5cjlyOGFnYzN1MjFhOWl6cyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/kXFpgStKE2Ypi/giphy.gif',
            'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExeGtwbms3enFvYmI2MWlobmdjd2Y1YnJ5Z3h6Mnprb3Z4aDhydTM4diZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/uHJTtpE9WqfYc/giphy.gif',
            'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExYW1iYTF6OTVwNDhrNHp3YWh3N3FyNm12MmN2MXRuZWh4MW1pbGltNiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/8MFkW6mDff37G/giphy.gif'
        ]

        const randomImage = image[Math.floor(Math.random() * image.length)];

        const embed = new EmbedBuilder()
            .setTitle('BLEH! 😝')
            .setImage(randomImage)
            .setColor('Random');


        await interaction.reply({
            content: 'BLEH!😝',
            embeds: [embed]
        });
    },
};