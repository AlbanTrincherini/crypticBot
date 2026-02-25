const { SlashCommandBuilder, ComponentType, MessageFlags } = require('discord.js')
const { genClueEmbed, genAnswerEmbed, genHintEmbed, genHintButtons, genParEmbed, genLettersEmbed, LETTER_ID } = require('../../ui/dailycrypticui.js')

const runningGames = new Set()

module.exports = {
	data: new SlashCommandBuilder().setName('dailycryptic').setDescription("Replies with today's cryptic!"),
	async execute(interaction) {
        const channelId = interaction.channel.id

        if(runningGames.has(channelId)) {
            interaction.reply({ content: 'There is already a game running in this channel...', flags: MessageFlags.Ephemeral })
            return
        }


        try {
            const dailyCryptic = await getDailyCryptic()
            const gameState = initialGameState(dailyCryptic, channelId)
            runningGames.add(channelId)

            await interaction.reply({
                components: [getHintButtons(gameState)],
                embeds: [getClueEmbed(gameState), getParEmbed(gameState), getLettersEmbed(gameState)],
            })

            gameState.clueMessage = await interaction.fetchReply()

            setupCollectors(gameState)
        } catch (err) {
            runningGames.delete(channelId) // Clean up on failure
            interaction.reply("Couldn't start the game. Try again later.")
        }
	},
}

async function getDailyCryptic() {
    const response = await fetch("https://www.minutecryptic.com/api/daily_puzzle/today?tz=Europe/Zurich")
    const data = await response.json()

    return data
}

function getParEmbed(gameState) {
    const hintsUsed = gameState.obtainedHints.size + gameState.lettersRevealed.size
    const totalHints = gameState.dailyCryptic.hints.length + gameState.dailyCryptic.letterRevealOrder.length
    const par = gameState.dailyCryptic.parDetails.averagePar

    return genParEmbed(hintsUsed, totalHints, par)
}

function getLettersEmbed(gameState) {
    return genLettersEmbed(gameState.dailyCryptic.answer, gameState.lettersRevealed)
}

function getHintButtons(gameState) {
    return genHintButtons(gameState.dailyCryptic.hints.map(h => h.type), gameState.obtainedHints)
}

function getClueEmbed(gameState) {
    const clue = gameState.dailyCryptic.clue.map(w => w.text).join(" ")
    const answer = gameState.dailyCryptic.answer
    const answerLength = answer.split(" ").map(a => a.length).join(",")
    const setterName = gameState.dailyCryptic.setterName

    return genClueEmbed(clue, answerLength, setterName)
}

const EMBED_ORDERING = Object.freeze({
    CLUE_EMBED: 0,
    PAR_EMBED: 1,
    LETTERS_EMBED: 2,
})

function updateEmbed(oldEmbeds, updatePosition, newEmbed) {
    return oldEmbeds.map((e, index) => {
            if (index !== updatePosition) return e

            return newEmbed
        })
}

function setupCollectors(gameState) {
    const collectorLifetime = 1000 * 60 * 30 // 30 minutes

    const buttonCollector = gameState.clueMessage
        .createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: collectorLifetime
        })

    const answer = gameState.dailyCryptic.answer
    const answerFilter = (m) => (m.content.trim().toUpperCase() === answer)
    const answerCollector = gameState.clueMessage.channel
        .createMessageCollector({
            filter: answerFilter,
            max: 1,
            time: collectorLifetime,
        })

    setupButtonCollector(gameState, buttonCollector)
    setupAnswerCollector(gameState, answerCollector, buttonCollector)
}
function setupButtonCollector(gameState, buttonCollector) {
    buttonCollector.on('collect', async (i) => {
        if(i.customId === LETTER_ID) {
            const revealedLetterPosition = gameState.dailyCryptic
                .letterRevealOrder[gameState.lettersRevealed.size]

            gameState.lettersRevealed.add(revealedLetterPosition)

            const newPar = getParEmbed(gameState)
            const withPar = updateEmbed(i.message.embeds, EMBED_ORDERING.PAR_EMBED, newPar)
            const newLetters = getLettersEmbed(gameState)
            const withLetters = updateEmbed(withPar, EMBED_ORDERING.LETTERS_EMBED, newLetters)

            await i.update({
                embeds: withLetters,
            })
        }
        else {
            const hintType = i.customId
            gameState.obtainedHints.add(hintType)

            const newButtons = genHintButtons(gameState.dailyCryptic.hints.map(h => h.type), gameState.obtainedHints)
            const newPar = getParEmbed(gameState)

            await i.update({
                components: [newButtons],
                embeds: updateEmbed(i.message.embeds, EMBED_ORDERING.PAR_EMBED, newPar),
            })

            const hint = gameState.dailyCryptic.hints.find(hint => hint.type === hintType)
            await i.followUp({ embeds: [genHintEmbed(hint.type, hint.text)] })
        }
    })
}

function setupAnswerCollector(gameState, answerCollector, buttonCollector) {
    answerCollector.on('collect', (m) => {
        m.react('🥳')
        m.react('😝')

        const answer = gameState.dailyCryptic.answer
        const hintsUsed = gameState.obtainedHints.size + gameState.lettersRevealed.size
        const par = gameState.dailyCryptic.parDetails.averagePar
        m.reply({ embeds: [genAnswerEmbed(answer, hintsUsed, par)] })
        m.channel.send(gameState.dailyCryptic.explainerVideo)
    })

    answerCollector.on('end', (collected, reason) => {
        buttonCollector.stop()
        runningGames.delete(gameState.channelId)
    })
}

function initialGameState(dailyCryptic, channelId) {
    return {
        dailyCryptic: dailyCryptic,
        channelId: channelId,
        clueMessage: null,
        obtainedHints: new Set(),
        lettersRevealed: new Set(),
    }
}