const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, } = require('discord.js');

const DEFAULT_COLOR = 'LuminousVividPink'

function genClueEmbed(clue, answerLength, setterName) {
    const clueEmbed = new EmbedBuilder()
        .setColor(DEFAULT_COLOR)
        .setTitle('Today\'s clue')
        .setURL('https://www.minutecryptic.com/')
        .addFields(
            { name: `${clue} (${answerLength})`, value: '\u200b' },
        )
        .setTimestamp()
        .setFooter({ text: `By ${setterName}` })

    return clueEmbed;
}

function genAnswerEmbed(answer) {
    const answerEmbed = new EmbedBuilder()
        .setColor('Gold')
        .setTitle(`${answer}`)
        .addFields(
            { name: "You got it!", value: "x under par" }
        )

    return answerEmbed;
}

function genHintEmbed(type, text) {
    const hintEmbed = new EmbedBuilder()
            .setColor('Random')
            .setTitle("Hint")
            .addFields(
                { name: `${type}`, value: `${text}` },
            )

    return hintEmbed
}

const LETTER_ID = 'letter'
function genHintButtons(hintTypes, obtainedHints) {
    const hintButtons = hintTypes.map(hintType => {
            const hintButton = new ButtonBuilder()
                .setCustomId(hintType)
                .setLabel(`show ${hintType}`)
                .setDisabled(obtainedHints.has(hintType))
                .setStyle(ButtonStyle.Primary)
            return hintButton;
        })

    const lettersButton = new ButtonBuilder()
        .setCustomId(LETTER_ID)
        .setLabel("show letter")
        .setStyle(ButtonStyle.Primary)
    
    const row = new ActionRowBuilder()
        .addComponents(hintButtons)
        .addComponents([lettersButton])

    return row;
}

const PAR_FILLED = '<:par_filled:1475638682533892096>'
const PAR_EMPTY = '<:par_empty:1475639309804769463>'
const DEF_FILLED = '<:def_filled:1475627435755045117>'
const DEF_EMPTY = '<:def_empty:1475627468982583366>'

const getEmoji = (isPar, isFilled) =>
    ({
    true:  { true: PAR_FILLED, false: PAR_EMPTY },
    false: { true: DEF_FILLED, false: DEF_EMPTY }
    })[isPar][isFilled]

function genParEmbed(hintsUsed, totalHints, par) {
    const parEmojis = Array.from({ length: totalHints }, (_, i) => i)
        .map(i => {
            const isPar = i == (par - 1) // par index is one-based
            const isFilled = i < hintsUsed
            return getEmoji(isPar, isFilled)
        })
        .join(" ")

    const parEmbed = new EmbedBuilder()
        .setColor(DEFAULT_COLOR)
        .setDescription(parEmojis)

    return parEmbed
}

function genLettersEmbed(answer, lettersRevealed) {
    const letters = Array.from({ length: answer.length }, (_, i) => i)
        .map((i) => {
            const answerLetter = answer.charAt(i)
            if(answerLetter == " " || lettersRevealed.has(i)) {
                return answerLetter
            }
            else {
                return "_"
            }
        })
        .join("")

    const lettersEmbed = new EmbedBuilder()
        .setColor(DEFAULT_COLOR)
        .setTitle(`\`${letters}\``)

    return lettersEmbed
}

module.exports = { genClueEmbed, genAnswerEmbed, genHintEmbed, genHintButtons, genParEmbed, genLettersEmbed, LETTER_ID }