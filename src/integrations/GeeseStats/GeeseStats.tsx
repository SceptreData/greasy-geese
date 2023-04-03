import { fetchGames } from './stats/games'

export async function GeeseStats() {
  const games = await fetchGames()
  /* Final Object:
  // {lifetimeTotals: {}, seasons: [{
    games: [{
      info: {vsTeam: '', date: '', location: '', result: '', score: '', shootout}
      players: [{}],
    }],
    roster: [],
    totals: {}
  }]}




  */

  return {}
}
