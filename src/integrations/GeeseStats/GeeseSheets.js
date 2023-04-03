import { getAllSpreadsheets } from './api'

async function getGeeseSheets() {
  const sheets = await getAllSpreadsheets()

  const lifetimeTotals = sheets[0]

  const seasonTotalRegex = /S\d+ Totals/g
  const seasonTotals = sheets.filter(({ title }) =>
    title.match(seasonTotalRegex)
  )

  const playerAvgRegex = /S\d+ Player Averages/g
  const playerAverages = sheets.filter(({ title }) =>
    title.match(playerAvgRegex)
  )

  const gamesRegex = /S\d+ Game \d+/g
  const games = sheets.filter(({ title }) => title.match(gamesRegex))

  const numSeasons = Math.max(...games.map(({ title }) => Number(title[1])))

  return {
    numSeasons,
    seasonTotals,
    lifetimeTotals,
    games,
    playerAverages,
  }
}

const GeeseSheets = await getGeeseSheets().catch(console.error)

export default GeeseSheets
