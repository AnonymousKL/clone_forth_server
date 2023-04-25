import { useEffect } from "react"

function incrementDate(dateInput: Date, increment: number) {
  var dateFormatTotime = new Date(dateInput)
  var increasedDate = new Date(dateFormatTotime.getTime() + (increment * 86400000))
  return increasedDate
}

const fromDate = new Date()
const useChangeDate = (defaultDate: Date) => {
  const dateRange = {
    date1: fromDate.toLocaleDateString(),
    date2: incrementDate(fromDate, 1).toLocaleDateString(),
    date3: incrementDate(fromDate, 2).toLocaleDateString(),
    date4: incrementDate(fromDate, 3).toLocaleDateString(),
    date5: incrementDate(fromDate, 4).toLocaleDateString(),
    date6: incrementDate(fromDate, 5).toLocaleDateString(),
    date7: incrementDate(fromDate, 6).toLocaleDateString(),
  }

  useEffect(() => {

  }, [defaultDate])

  return dateRange
}

export default useChangeDate
