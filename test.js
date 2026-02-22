async function getDailyCryptic() {
    const response = await fetch("https://www.minutecryptic.com/api/daily_puzzle/today?tz=Europe/Zurich")
    const data = await response.json()

    const daily = data.clue.map(w => w.text).join(" ")
    return daily;
}

console.log(getDailyCryptic())