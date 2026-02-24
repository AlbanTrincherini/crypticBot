const { SlashCommandBuilder, ComponentType } = require('discord.js')
const { genClueEmbed, genAnswerEmbed, genHintEmbed, genHintButtons, genParEmbed } = require('../../ui/dailycrypticui.js')

module.exports = {
	data: new SlashCommandBuilder().setName('dailycryptic').setDescription("Replies with today's cryptic!"),
	async execute(interaction) {
        const gameState = initialGameState()
        gameState.gameInteraction = interaction
        gameState.dailyCryptic = await getDailyCryptic()
        
        const clue = gameState.dailyCryptic.clue.map(w => w.text).join(" ")
        const answer = gameState.dailyCryptic.answer
        const answerLength = answer.length
        const setterName = gameState.dailyCryptic.setterName

        const clueEmbed = genClueEmbed(clue, answerLength, setterName) 
        const hintButtons = genHintButtons(gameState.dailyCryptic.hints.map(h => h.type), gameState.obtainedHints)

        await interaction.reply({
            components: [hintButtons],
            embeds: [clueEmbed, getParEmbed(gameState)],
        })

        gameState.clueMessage = await interaction.fetchReply()

        setupButtonCollector(gameState)
        setupAnswerCollector(gameState)
	},
}

async function getDailyCryptic() {
    const response = await fetch("https://www.minutecryptic.com/api/daily_puzzle/today?tz=Europe/Zurich")
    const data = await response.json()

    return data
}

function getParEmbed(gameState) {
    const hintsUsed = gameState.obtainedHints.size
    const totalHints = gameState.dailyCryptic.hints.length
    const par = gameState.dailyCryptic.parDetails.averagePar

    return genParEmbed(hintsUsed, totalHints, par)
}

const EMBED_ORDERING = Object.freeze({
    CLUE_EMBED: 0,
    PAR_EMBED: 1,
    // LETTERS_EMBED: 2,
})

function updateEmbed(oldEmbeds, updatePosition, newEmbed) {
    return oldEmbeds.map((e, index) => {
            if (index !== updatePosition) return e

            return newEmbed
        })
}

function setupButtonCollector(gameState) {
    const interactionCollector = gameState.clueMessage.createMessageComponentCollector({ componentType: ComponentType.Button })

    interactionCollector.on('collect', async (i) => {
        const hintType = i.customId
        gameState.obtainedHints.add(hintType)

        const newButtons = genHintButtons(gameState.dailyCryptic.hints.map(h => h.type), gameState.obtainedHints)
        const newPar = getParEmbed(gameState)
        
        await i.update({ 
            components: [newButtons],
            embeds: updateEmbed(i.message.embeds, EMBED_ORDERING.PAR_EMBED, newPar),
        })

        gameState.clueMessage = await i.fetchReply()
        
        const hint = gameState.dailyCryptic.hints.find(hint => hint.type === hintType)
        await i.followUp({ embeds: [genHintEmbed(hint.type, hint.text)] })
    })


    gameState.buttonCollector = interactionCollector
}

function setupAnswerCollector(gameState) {
    const answer = gameState.dailyCryptic.answer
    const collectorFilter = (m) => (m.content.trim().toUpperCase() == answer)

    const collector = gameState.gameInteraction.channel
        .createMessageCollector({ filter: collectorFilter, max: 1 })

    collector.on('collect', (m) => {
        gameState.buttonCollector.stop()
        m.react('🥳')
        m.react('😝')
        m.reply({ embeds: [genAnswerEmbed(answer)] })
    })
}

function initialGameState() {
    return {
        gameInteraction: null,
        dailyCryptic: null,
        buttonCollector: null,
        clueMessage: null,
        obtainedHints: new Set(),
    }
}