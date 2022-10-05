export type Game = {
  teams: {
    away: Team
    home: Team
  }
  location: Location
  time: string
}

export type Team = {
  name: string
  captain?: string
}

export type GameDay = {
  date: Date
  byeTeam: Team | undefined
  games: Game[]
}

export type Location = {
  name: string
  address: string
  directions: string | undefined
  barName: string
  barUrl: string | undefined
}
