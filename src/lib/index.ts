export * from './fetchSchedule'
export * from './fetchStandings'

export const formatDate = (d: Date) =>
  d.toLocaleString('en-us', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
