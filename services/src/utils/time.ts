export const dateFormat = 'YYYY-MM-DD'

export const formatTime = (time: string): string => {
  const dateTime = new Date(Date.parse(time))
  const formated = dateTime.toISOString().split('T')[0]
  return formated
}
