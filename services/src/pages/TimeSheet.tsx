import dayjs from 'dayjs'
import { useEffect, useState } from "react"
import { DatePicker, notification } from "antd"
import { useDebounce } from "hooks/useDebounce"
import { _confirm } from "components/PromiseModal"
import Search from "components/Search"
import TimeSheetTable from "page-components/TimeSheetTable"
import Button from "components/Button"

const { RangePicker } = DatePicker;

const MAX_DAY_RANGE = 10

const validateRange = (dateRange: [string, string]): number | false => {
  const fromDateTimestamp = new Date(dateRange[0]).getTime()
  const toDateTimestamp = new Date(dateRange[1]).getTime()
  const dayRange = (toDateTimestamp - fromDateTimestamp) / 1000 / 3600 / 24
  if (dayRange > MAX_DAY_RANGE) {
    return false
  }
  return dayRange
}

const TimeSheet = () => {
  const [keyword, setKeyword] = useState('')
  const [formData, setFormData] = useState({
    keyword: '',
    status: ''
  })
  const [dateRange, setDateRange] = useState<any>([Date()])
  const debouncedKeyword = useDebounce(keyword, 1000)

  const onChangeDateRange = (values: any, formatString: [string, string]) => {
    if (!validateRange(formatString)) {
      notification.open({
        type: 'error',
        message: `Date range must be within ${MAX_DAY_RANGE} day`,
      })
    }
    setDateRange(formatString)
  }

  useEffect(() => {
    setFormData((prev) => ({ ...prev, keyword: debouncedKeyword }))
  }, [debouncedKeyword])

  return (
    <div>
      <p className="text-3xl font-bold text-primary-2">Time Sheet</p>
      <div className="flex md:justify-between flex-col md:flex-row gap-4">
        <div className="mt-7 md:w-1/2 grid grid-cols-2 gap-3">
          <Search
            placeholder="Search Project"
            showIcon={false}
            inputClassName="h-full pl-2 border border-gray-3"
            onChange={(e) => setKeyword(e.target.value)}
          />
          <RangePicker
            className="rounded-5 border-gray-3 py-1.5 leading-6"
            defaultValue={[dayjs(Date()), dayjs(Date())]}
            onChange={onChangeDateRange}
          />
        </div>
        <Button type="submit" variant="dark" className="h-fit self-end">Export to Excel</Button>
      </div>
      <TimeSheetTable
        formData={formData}
        dateRangeProp={dateRange}
      />
    </div>
  )
}

export default TimeSheet
