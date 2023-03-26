import dayjs from 'dayjs'
import { useEffect, useState } from "react"
import { DatePicker, notification, Select } from "antd"
import { exportExcel, fetchProjects } from 'services/api'
import { incrementDate } from 'utils/time'
import { _confirm } from "components/PromiseModal"
import TimeSheetTable from "page-components/TimeSheetTable"
import Button from "components/Button"

const { RangePicker } = DatePicker;

const MAX_DAY_RANGE = 10
const today = new Date()

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
  const [dateRange, setDateRange] = useState<any>([today, incrementDate(today, 6)])
  const [projectFilterList, setProjectFilterList] = useState<any>([])
  const [projectFilterId, setProjectFilterId] = useState(null)

  const onSelectProject = (value: any, options: any) => {
    setProjectFilterId(value)
  }

  const onChangeDateRange = (values: any, formatString: [string, string]) => {
    if (!validateRange(formatString)) {
      notification.open({
        type: 'error',
        message: `Date range must be within ${MAX_DAY_RANGE} day`,
      })
    }
    setDateRange(formatString)
  }

  const onExportExcel = () => {
    fetch("https://forth-server.onrender.com/api/v1/timesheet/export_excel")
      .then(res => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(
          new Blob([blob]),
        );
        const link = document.createElement('a')
        link.href = url;
        link.setAttribute(
          'download',
          `Timesheet.xlsx`,
        );

        document.body.appendChild(link)
        link.click()
        link.parentNode?.removeChild(link)
      })
  }

  useEffect(() => {
    const fetchProjectList = async () => {
      const projects = await fetchProjects()
      const filterList = projects.map((project: any) => ({ value: project.ID, label: project.Name }))
      setProjectFilterList(filterList)
    }
    fetchProjectList()
  }, [])

  return (
    <div>
      <p className="text-3xl font-bold text-primary-2">Time Sheet</p>
      <div className="flex md:justify-between flex-col md:flex-row gap-4">
        <div className="mt-7 md:w-1/2 grid grid-cols-2 gap-3">
          <Select
            size="large"
            style={{ borderRadius: "5px" }}
            onChange={onSelectProject}
            options={projectFilterList}
          />
          <RangePicker
            className="rounded-5 border-gray-3 py-1.5 leading-6"
            defaultValue={[dayjs(today), dayjs(incrementDate(today, 6))]}
            onChange={onChangeDateRange}
          />
        </div>
        <Button
          type="button"
          variant="dark"
          className="h-fit self-end"
          onClick={onExportExcel}
        >Export to Excel</Button>
      </div>
      <TimeSheetTable
        projectFilterId={projectFilterId}
        dateRangeProp={dateRange}
      />
    </div>
  )
}

export default TimeSheet
