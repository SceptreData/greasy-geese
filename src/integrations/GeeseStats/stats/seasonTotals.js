import GreasySheets, { getSheetRange, getNamedSheetRanges } from './api'

const { seasonTotals, numSeasons } = GreasySheets

const STAT_RANGES = {
  totalShots: 'C4:C',
  totalGoals: 'D4:D',
  totalAssists: 'E4:E',
  totalPoints: 'F4:F',
  plusMinus: 'G4:G',
  accuracy: 'H4:H',
  shotsBlocked: 'I4:I',
  totalShifts: 'J4:J',
  totalIceTime: 'K4:K',
  gamesMissed: 'L4:L',
  avgNumShifts: 'M4:M',
  avgShiftLength: 'N4:N',
  avgIceTimeMin: 'O4:O',
}

const GOALIE_RANGES = {
  goalie: 'Q4',
  goalieShotsBlocked: 'R4',
  goalieGoalsAllowed: 'S4',
  goalieSavePercent: 'T4',
}

const GAME_STAT_RANGES = {
  goals: 'R18:R26',
  goalsAgainst: 'S18:S26',
  result: 'T18:T26',
}

const OVERALL_RANGES = {
  totalGoalsScored: 'R27',
  totalGoalsAgainst: 'S27',
  totalRecord: 'T27',
}

export const playerStatTypes = Object.keys(STAT_RANGES)
export const goalieStatTypes = Object.keys(GOALIE_RANGES)
export const gameStatTypes = Object.keys(GAME_STAT_RANGES)

async function fetchSeason(season) {
  const ranges = {
    players: 'B4:B',
    ...STAT_RANGES,
    ...GOALIE_RANGES,
    ...GAME_STAT_RANGES,
    ...OVERALL_RANGES,
  }

  const stats = await getNamedSheetRanges(seasonTotals[season], ranges)
  return stats
}

export async function fetchSeasonTotals() {
  const seasons = []
  for (let i = 0; i < numSeasons; i++) {
    const stats = await fetchSeason(i)
    seasons.push(stats)
  }

  return seasons
}

export function buildOverviewTable(season) {
  const numGames = season.result.length

  const statTypes = Object.keys(GAME_STAT_RANGES)
  const games = []

  for (let i = 0; i < numGames; i++) {
    const game = statTypes.reduce((gameStats, stat) => {
      console.log(stat)
      gameStats[stat] = season[stat][i][0]
      return gameStats
    }, {})

    games.push(game)
  }

  const overview = {
    numGames,
    games,
    totalGoals: season.totalGoalsScored[0][0],
    totalAgainst: season.totalGoalsAgainst[0][0],
    record: season.totalRecord[0][0],
  }

  return overview
}

function buildGoalie(season) {
  const goalie = {
    name: season.goalie[0][0],
    shotsBlocked: season.goalieShotsBlocked[0][0],
    goalsAllowed: season.goalieGoalsAllowed[0][0],
    savePercent: season.goalieSavePercent[0][0],
  }

  return goalie
}

const getPlayerStat = (stat, season, idx) => season[stat][idx][0]

export function buildTeamTable(season) {
  const statTypes = Object.keys(STAT_RANGES)

  const players = {}
  for (const [idx, playerName] of season.players.entries()) {
    const stats = statTypes.reduce((playerStats, stat) => {
      playerStats[stat] = getPlayerStat(stat, season, idx)
      return playerStats
    }, {})

    players[playerName] = stats
  }
  const goalie = buildGoalie(season)
  const team = { players, goalie }

  return team
}

// export const fetchLifetimeTotals = async () => {
//   const dataRanges = {
//     players:
//   }
//   const stats = await getSheetRange(lifetimeTotals, 'B4:B')
//   console.log(stats)
// }
