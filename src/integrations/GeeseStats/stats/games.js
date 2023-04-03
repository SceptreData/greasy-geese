import GreasySheets, { getNamedSheetRanges, getBatchSheetRange } from './api'
import { slugify } from '../../../lib'
import { fetchPlayer } from './player.js'
const { seasonTotals: seasons, numSeasons, games: allGames } = GreasySheets

// const PLAYER_STAT_HEADINGS = 'J8:Z8'
const GAME_INFO_RANGE = 'J1:L6'
const PLAYER_STATS_RANGE = 'J8:AA21'
const GOALIE_STATS_RANGE = 'X3:AA4'

const GAME_SHEET_RANGES = {
  gameInfo: GAME_INFO_RANGE,
  playerStats: PLAYER_STATS_RANGE,
  goalieStats: GOALIE_STATS_RANGE,
}

const games = allGames.filter(game => !game.hidden)

export const fetchGames = await Promise.all(
  games.map(async gameSheet => fetchGame(gameSheet))
)

async function fetchGame(gameSheet) {
  const { title } = gameSheet
  const { gameInfo, playerStats, goalieStats } = await getNamedSheetRanges(
    gameSheet,
    GAME_SHEET_RANGES
  )

  const info = parseGameInfo(gameInfo)
  const players = parsePlayerStats(playerStats)
  const goalie = parseGoalieStats(goalieStats)

  return { title, players, goalie, ...info }
}

function parseGameInfo(rawInfo) {
  const info = {}
  for (let [key, value] of info) {
    if (key === 'vs') key = 'opponent'
    info[camelCase(key)] = value
  }

  info.result = rawInfo[4][2]
  info.shootoutResult = rawInfo[5][2]

  return info
}

function parsePlayerStats(statsTable) {
  const [rawStatNames, allPlayerStats] = statsTable

  const statNames = cleanStatNames(rawStatNames)
  const players = allPlayerStats.map(playerStats => {
    const player = {}
    statNames.forEach((stat, idx) => {
      player[stat] = playerStats[idx]
    })
  })

  return players
}

function parseGoalieStats(goalieTable) {
  const [rawStatNames, goalieStats] = goalieTable

  const statNames = cleanStatNames(rawStatNames)
  const goalie = {}
  statNames.forEach((stat, idx) => {
    goalie[stat] = goalieStats[idx]
  })

  return goalie
}

function cleanStatNames(names) {
  const renameList = [
    ['Shots - Blocked', 'shotsBlocked'],
    ['+/-', 'plusMinus'],
    ['Avg Shift Length (sec)', 'avgShiftLength'],
    ['Total Ice Time', 'totalIceTime'],
    ['0', 'showedUp'],
  ]

  for (let [oldName, newName] of renameList) {
    const idx = names.indexOf(oldName)
    if (idx > -1) {
      names[idx] = newName
    }
  }

  return names.map(name => camelCase(name))
}

function camelCase(str) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase()
    })
    .replace(/\s+/g, '')
}
