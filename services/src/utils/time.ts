export const dateFormat = 'YYYY-MM-DD'

export const formatTime = (time: string): string => {
  const dateTime = new Date(Date.parse(time))
  const formated = dateTime.toISOString().split('T')[0]
  return formated
}

// Format to YYYY-MM-DD
export function formatDate(date: string): { dateString: string, date: Date } {
  let d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;

  const dateString = [year, month, day].join('-');
  const newDate = new Date(dateString)
  return {
    dateString,
    date: newDate,
  }
}

export function incrementDate(dateInput: Date, increment: number): Date {
  const dateFormatTotime = new Date(dateInput)
  const increasedDate = new Date(dateFormatTotime.getTime() + (increment * 86400000))
  return increasedDate
}
