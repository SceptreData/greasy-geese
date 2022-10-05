import * as cheerio from 'cheerio'
import type { Team, Location, GameDay, Game } from '../types'

let $: any
export async function fetchSchedule(url: string): Promise<GameDay[]> {
  const response = await fetch(
    'https://www.edmontonsportsclub.com/leagues/ball-hockey/schedules/fall-2022/tues-rec-B'
  )
  const txt = await response.text()

  $ = cheerio.load(txt)
  const [facilityTable, teamsTable, _, ...gameTable] = $('table')

  const facilities = parseFacilities(facilityTable)

  const teams: Team[] = [...$('tbody > tr', teamsTable)]
    .reduce((arr: cheerio.Cheerio<cheerio.Element>[], t) => {
      const teamA = $('td:nth-child(2)', t)
      const teamB = $('td:nth-child(4)', t)

      if ($(teamA).text()) arr.push(teamA)
      if ($(teamB).text()) arr.push(teamB)

      return arr
    }, [])
    .filter(t => !t.text().includes('Individuals'))
    .map(t => {
      let [captain, name] = t
        .text()
        .split('-')
        .map(s => s.trim())

      return { name, captain }
    })

  teams.push({
    name: 'Individuals Team - The Jason Voorhees Fan Club',
    captain: 'Individuals',
  })

  const findTeam = (name: string): Team => teams.find(t => t.name == name)!

  function parseHeading(day: cheerio.Element): Omit<GameDay, 'games'> {
    const [dateStr, byeMsg] = $('tr > th', day).text().split('\n')
    const date = new Date(dateStr)
    const byeTeamName = byeMsg?.split(' has')[0]

    const byeTeam = findTeam(byeTeamName)

    return { date, byeTeam }
  }

  function parseGames(day: cheerio.Element): Game[] {
    const games: Game[] = [...$('tbody > tr', day)].map(game => {
      let [facilityName, time, versusStr] = $(game).text().split('\n')
      const location: Location = facilities.find(f =>
        f?.name.includes(facilityName)
      )!

      const teamNames: string[] = versusStr
        .replaceAll(/(\([\w]+) (vs\.) ([\w]+\))/g, '$1 v. $3') // Replace extra vs.
        .replace(/M[\d]:/, '') // Remove M: info
        .replace(' - League Champ Series!', '')
        .split(' vs. ') // split on versus.

      const [away, home] = teamNames.map(name => findTeam(name) || { name })

      return { teams: { away, home }, location, time }
    })

    return games
  }

  const schedule: GameDay[] = [...gameTable].map(day => {
    const { date, byeTeam } = parseHeading(day)
    const games = parseGames(day)
    return { date, byeTeam, games }
  })

  return schedule
}

function parseFacilities(facilityTable: cheerio.Element) {
  const facilities: Location[] = [...$('tbody > tr', facilityTable)].map(f => {
    const [nameTag, addressTag, directionTag, barTag] = $('td', f)
    const name = $(nameTag).text()
    const address = $(addressTag).text()
    const directions = $('a', directionTag).attr('href')
    const [barName, barUrl] = [$(barTag).text(), $('a', barTag).attr('href')]

    return { name, address, directions, barName, barUrl }
  })
  return facilities
}
