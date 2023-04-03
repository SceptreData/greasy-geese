import GreasySheets, { getSheetRange } from '../GreasySpreadsheets.js'
import { slugify } from '../../../lib'
import { fetchAllGames, fetchGame } from './games.js'
const { seasonTotals: seasons, numSeasons } = GreasySheets

const PLAYER_RANGE = 'B4:B'

async function fetchPlayerNames() {
  let players = {}
  for (let i = 0; i < numSeasons; i++) {
    const playersThisSeason = await (
      await getSheetRange(seasons[i], PLAYER_RANGE)
    ).values.map(v => v[0])

    playersThisSeason.forEach(name => (players[name] = true))
  }
  return Object.keys(players)
}

export async function buildPlayers(names) {
  return names.map(name => {
    return {
      name,
      slug: slugify(name),
    }
  })
}

export async function fetchPlayers() {
  const names = await fetchPlayerNames()
  const players = buildPlayers(names)
  console.log(await fetchGame())

  return players
}

export async function fetchPlayer(slug) {
  // Get Season Stats
  // get Average Stats
  // Show game stats
}
