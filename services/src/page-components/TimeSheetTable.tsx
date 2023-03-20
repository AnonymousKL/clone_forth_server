import { useCallback, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { InputNumber, notification } from "antd"
import { createTimesheets, deleteTimesheet, fetchTimesheets } from "services/api"
import { _confirm } from "components/PromiseModal"
import DeleteIcon from "components/svg-icon/DeleteIcon"
import Table from "components/Table"
import Button from "components/Button"
import ModelNew from "components/ModelNew"

type TimesheetTableProps = {
  formData?: any,
  dateRangeProp: [string],
}

type Segment = {
  Date: string,
  Hours: number
}

type formated = {
  ID: number,
  Project: {
    id: number,
    name: string,
  },
  Member: {
    id: number,
    name: string,
  },
  Role: string,
  StartDate: string,
}

function formatTimeSheet(data: any[], fromDate: Date, range: number) {
  let formated: formated[] = []
  data.forEach((item, i) => {
    let segments: any = {}
    for (let j = 0; j < range; j++) {
      const dateString = incrementDate(fromDate, j).toLocaleDateString()
      const foundSegment = item.TimeSheetSegment.find(
        (segment: Segment) => segment?.Date && new Date(segment?.Date).toLocaleDateString() == dateString
      )
      if (foundSegment) {
        segments[dateString] = { time: foundSegment.Hours, timesheetId: item.ID }
      } else {
        segments[dateString] = { time: "", timesheetId: item.ID }
      }
    }

    let dt = {
      ID: i,
      Project: {
        id: item.Project.ID,
        name: item.Project.Name,
      },
      Member: {
        id: item.Member.ID,
        name: item.Member.Name,
      },
      Role: "",
      StartDate: "2022/02/02",
    }
    let mergedObj = Object.assign(dt, segments, { Action: { id: item.ID } })
    formated.push(mergedObj)
  })
  return formated
}

function incrementDate(dateInput: Date, increment: number) {
  const dateFormatTotime = new Date(dateInput)
  const increasedDate = new Date(dateFormatTotime.getTime() + (increment * 86400000))
  return increasedDate
}

function _createDateRange(fromDate: Date, range: number) {
  const dateRange: any = {
    date1: fromDate.toLocaleDateString()
  }
  for (let i = 1; i <= range; i++) {
    const k = `date${i + 1}`
    dateRange[k as keyof object] = incrementDate(fromDate, i).toLocaleDateString()
  }
  return dateRange
}

const onDeleteTimesheet = async (id: number) => {
  const res = await deleteTimesheet(id)
  if (res.status === 'success') {
    notification.open({
      type: 'success',
      message: 'Delete member successful',
    })
  } else {
    notification.open({
      type: 'error',
      message: 'Cannot delete member',
    })
  }
}

async function onShowActionDelete(id: any) {
  const confirmed = await _confirm.delete({
    Template: ModelNew, props: {
      actionButton: true,
      title: "Delete timesheet",
      children: (
        <div className="bg-white px-8 py-4">
          <p>Delete timesheet? This Action Cannot Be Undo!</p>
        </div>
      )
    }
  })
  if (!confirmed) { return }
  onDeleteTimesheet(id)
}

const TimeSheetTable = ({ dateRangeProp }: TimesheetTableProps) => {
  const [refetchTimesheet, setRefetchTimesheet] = useState(false)
  const [tsData, setTsData] = useState<any>([])
  const [formTimesheetData, setFormTimesheetData] = useState<any>([])
  const fromDate = new Date(dateRangeProp[0] || Date())
  const dateRange = useCallback(_createDateRange(fromDate, 7), [dateRangeProp])

  const onChangeHours = (hours: number | null, date: string, timesheetId: number) => {
    setFormTimesheetData((timesheetPrev: any[]) => {
      let convertedDateString = new Date(date).toISOString()
      const foundTsIndex = timesheetPrev.findIndex((sheet) => sheet?.TimesheetId == timesheetId)

      if (foundTsIndex != -1) {
        timesheetPrev[foundTsIndex].Segments.push({
          Hours: hours,
          Date: convertedDateString,
        })
        return timesheetPrev
      }

      return [...timesheetPrev, {
        TimesheetId: timesheetId,
        Segments: [{
          Hours: hours,
          Date: convertedDateString,
        }]
      }]
    })
  }

  const onSaveTimesheet = async () => {
    try {
      const res = await createTimesheets(formTimesheetData)
      if (res.status === 'success') {
        notification.open({
          type: 'success',
          message: res.message,
        })
      }
    } catch (err) {
      notification.open({
        type: 'error',
        message: 'Cannot save timesheet',
      })
    }
    setRefetchTimesheet(!refetchTimesheet)
  }

  const columns = [
    {
      title: 'No.',
      key: 'ID',
    },
    {
      title: 'Project',
      key: 'Project',
      render: ({ name, id }: any) => (
        <div className="max-w-[100px] px-2 truncate text-center mx-auto">
          <Link to={`/projects/${id}`} className="text-primary-4">{name}</Link>
        </div>
      )
    },
    {
      title: 'Member',
      key: 'Member',
      render: ({ name, id }: any) => (
        <div className="max-w-[100px] px-2 truncate text-center mx-auto">
          <Link to={`/members/${id}`} className="text-primary-4">{name}</Link>
        </div>
      )
    },
    {
      title: 'Role',
      key: 'Role',
    },
    {
      title: 'Start Date',
      key: 'StartDate',
    },
    {
      title: dateRange.date1,
      key: dateRange.date1,
      render: ({ time, timesheetId }: any) => (
        <div className="flex justify-center">
          <InputNumber
            className="w-16"
            // type="number"
            disabled={time}
            defaultValue={time}
            onChange={(value: number | null) => onChangeHours(value, dateRange.date1, timesheetId)}
          />
        </div>
      )
    },
    {
      title: dateRange.date2,
      key: dateRange.date2,
      render: ({ time, timesheetId }: any) => (
        <div className="flex justify-center">
          <InputNumber
            className="w-16"
            // type="number"
            disabled={time}
            defaultValue={time}
            onChange={(value: number | null) => onChangeHours(value, dateRange.date2, timesheetId)}
          />
        </div>
      )
    },
    {
      title: dateRange.date3,
      key: dateRange.date3,
      render: ({ time, timesheetId }: any) => (
        <div className="flex justify-center">
          <InputNumber
            className="w-16"
            // type="number"
            disabled={time}
            defaultValue={time}
            onChange={(value: number | null) => onChangeHours(value, dateRange.date3, timesheetId)}
          />
        </div>
      )
    },
    {
      title: dateRange.date4,
      key: dateRange.date4,
      render: ({ time, timesheetId }: any) => (
        <div className="flex justify-center">
          <InputNumber
            className="w-16"
            // type="number"
            disabled={time}
            defaultValue={time}
            onChange={(value: number | null) => onChangeHours(value, dateRange.date4, timesheetId)}
          />
        </div>
      )
    },
    {
      title: dateRange.date5,
      key: dateRange.date5,
      render: ({ time, timesheetId }: any) => (
        <div className="flex justify-center">
          <InputNumber
            className="w-16"
            // type="number"
            disabled={time}
            defaultValue={time}
            onChange={(value: number | null) => onChangeHours(value, dateRange.date5, timesheetId)}
          />
        </div>
      )
    },
    {
      title: dateRange.date6,
      key: dateRange.date6,
      render: ({ time, timesheetId }: any) => (
        <div className="flex justify-center">
          <InputNumber
            className="w-16"
            // type="number"
            disabled={time}
            defaultValue={time}
            onChange={(value: number | null) => onChangeHours(value, dateRange.date6, timesheetId)}
          />
        </div>
      )
    },
    {
      title: dateRange.date7,
      key: dateRange.date7,
      render: ({ time, timesheetId }: any) => (
        <div className="flex justify-center">
          <InputNumber
            className="w-16"
            // type="number"
            disabled={time}
            defaultValue={time}
            onChange={(value: number | null) => onChangeHours(value, dateRange.date7, timesheetId)}
          />
        </div>
      )
    },
    {
      title: '',
      key: 'Action',
      render: ({ id }: any) => (
        <>
          <button className="px-2" onClick={() => onShowActionDelete(id)}><DeleteIcon /></button>
        </>
      )
    },
  ]

  useEffect(() => {
    const fetchTimesheet = async () => {
      const res = await fetchTimesheets()
      const fmtData = formatTimeSheet(res.data, fromDate, 7)
      setTsData(fmtData)
    }
    fetchTimesheet()
  }, [refetchTimesheet])

  return (
    <div>
      <div className="w-full overflow-x-auto pb-3">
        {tsData.length && (
          <Table head={columns} data={tsData} className="border mt-7" />
        )}
      </div>
      <div className="flex flex-col sm:flex-row justify-between gap-4 mt-5">
        <Button
          type="submit"
          variant="dark"
          className="h-fit"
          disabled={formTimesheetData.length <= 0}
          onClick={onSaveTimesheet}
        >
          Save Timesheet
        </Button>
        <div>
          <div className="grid grid-cols-2 gap-4 p-2 border-b">
            <p className="font-semibold">Total Billable</p>
            <p className="text-right">120</p>
          </div>
          <div className="grid grid-cols-2 gap-4 p-2 border-b">
            <p className="font-semibold">Total Non-Billable</p>
            <p className="text-right">40</p>
          </div>
          <div className="grid grid-cols-2 gap-4 p-2 border-b">
            <p className="font-semibold">Total Hour</p>
            <p className="text-right">160</p>
          </div>
        </div>
      </div>
    </div>
  )
}
export default TimeSheetTable
