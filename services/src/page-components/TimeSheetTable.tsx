import { useCallback, useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { Empty, InputNumber, notification, Pagination } from "antd"
import { createTimesheets, deleteTimesheet, fetchTimesheets } from "services/api"
import { formatDate, formatTime, incrementDate } from "utils/time"
import { _confirm } from "components/PromiseModal"
import { formatCurrency } from "utils/format"
import { PAYMENT_RATE_PER_HOUR } from "utils/constant"
import DeleteIcon from "components/svg-icon/DeleteIcon"
import Table from "components/Table"
import Button from "components/Button"
import ModelNew from "components/ModelNew"
import SpinnerIcon from "components/svg-icon/SpinnerIcon"

type TimesheetTableProps = {
  projectFilterId: number | null,
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

let PageSize = 20

function _formatTimeSheet(data: any[], fromDate: Date, range: number, projectId: number | null) {
  let formated: formated[] = []

  data.forEach((item, i) => {
    if (projectId && projectId !== item.ProjectID) {
      return
    }

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
      ID: i + 1,
      Project: {
        id: item.Project.ID,
        name: item.Project.Name,
      },
      Member: {
        id: item.Member.ID,
        name: item.Member.Name,
      },
      Role: "",
      StartDate: (item.DayLog.Date).split('T')[0],
    }
    let mergedObj = Object.assign(dt, segments, { Action: { id: item.ID } })
    formated.push(mergedObj)
  })
  return formated
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

function _parserInputHour(value: string | undefined): number {
  if (value === undefined) return 0
  const floatVal = parseFloat(value)
  return floatVal < 0 ? 0 : floatVal
}

function _calcTotalHour(timesheets: any[], projectId: number | null): number {
  const filterdTimesheets = timesheets.filter((ts) => ts.ProjectID === projectId)
  const totalHour = filterdTimesheets.reduce((acc, curr) => {
    const eachTimesheet = curr.TimeSheetSegment.reduce((accumulator: any, object: any) => {
      return accumulator + object?.Hours;
    }, 0)
    return acc + eachTimesheet
  }, 0)
  return totalHour
}

const TimeSheetTable = ({ dateRangeProp, projectFilterId }: TimesheetTableProps) => {
  const [refetchTimesheet, setRefetchTimesheet] = useState(false)
  const [totalHour, setTotalHour] = useState(0)
  const [isFetching, setIsFetching] = useState(false)
  const [tsData, setTsData] = useState<any>([])
  const [formTimesheetData, setFormTimesheetData] = useState<any>([])
  const fromDate = new Date(dateRangeProp[0] || Date())
  const dateRange = useCallback(_createDateRange(fromDate, 7), [dateRangeProp])
  const [currentPage, setCurrentPage] = useState(1)

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize
    const lastPageIndex = firstPageIndex + PageSize
    return tsData?.slice(firstPageIndex, lastPageIndex)
  }, [currentPage, tsData])

  const onChangeHours = (hours: number | null, date: string, timesheetId: number) => {
    setFormTimesheetData((timesheetPrev: any[]) => {
      let convertedDateString = formatDate(date).date.toISOString()
      const foundTsIndex = timesheetPrev.findIndex((sheet) => sheet?.TimesheetId == timesheetId)

      // Ts existed
      if (foundTsIndex != -1) {
        const foundSegmentIndex = timesheetPrev[foundTsIndex].Segments.findIndex(
          (segment: Segment) => new Date(segment.Date).toLocaleDateString() == date)
        // Replace segment if existed
        if (foundSegmentIndex != -1) {
          timesheetPrev[foundTsIndex].Segments[foundSegmentIndex] = {
            Hours: hours,
            Date: convertedDateString,
          }
        } else {
          // Add new segment
          timesheetPrev[foundTsIndex].Segments.push({
            Hours: hours,
            Date: convertedDateString,
          })
        }
        return timesheetPrev
      }

      // Add new timesheet
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
      } else {
        notification.open({
          type: 'error',
          message: 'Cannot save timesheet',
        })
      }
    } catch (err) {
      notification.open({
        type: 'error',
        message: 'Cannot save timesheet',
      })
    }
    setFormTimesheetData((prev: any) => [])
    setRefetchTimesheet(!refetchTimesheet)
  }

  const onShowActionDelete = async (id: any) => {
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
            parser={_parserInputHour}
            className="w-16"
            // type="number"
            disabled={time}
            // defaultValue={time}
            placeholder={time}
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
            parser={_parserInputHour}
            className="w-16"
            // type="number"
            disabled={time}
            // defaultValue={time}
            placeholder={time}
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
            parser={_parserInputHour}
            className="w-16"
            // type="number"
            disabled={time}
            // defaultValue={time}
            placeholder={time}
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
            parser={_parserInputHour}
            className="w-16"
            // type="number"
            disabled={time}
            // defaultValue={time}
            placeholder={time}
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
            parser={_parserInputHour}
            className="w-16"
            // type="number"
            disabled={time}
            // defaultValue={time}
            placeholder={time}
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
            parser={_parserInputHour}
            className="w-16"
            // type="number"
            disabled={time}
            // defaultValue={time}
            placeholder={time}
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
            parser={_parserInputHour}
            className="w-16"
            // type="number"
            disabled={time}
            // defaultValue={time}
            placeholder={time}
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
      setIsFetching(true)
      const res = await fetchTimesheets({
        projectId: projectFilterId,
        from: dateRangeProp[0],
        page: -1,
        limit: -1,
        // to: dateRangeProp[]
      })
      const formated = _formatTimeSheet(res.data, fromDate, 7, projectFilterId)
      setTsData(formated)
      setTotalHour(_calcTotalHour(res.data, projectFilterId))
      setCurrentPage(1)
      setIsFetching(false)
    }
    fetchTimesheet()
  }, [refetchTimesheet, dateRangeProp, projectFilterId])

  return (
    <div>
      <div className="w-full overflow-x-auto pb-3">
        {isFetching
          ? (<div className="rounded-5 border mt-7 h-80 flex justify-center items-center">
            <div className="m-auto w-10 h-10">
              <SpinnerIcon className="animate-spin stroke-none fill-black" />
            </div>
          </div>)
          : <>
            {tsData.length === 0
              ? <div className="border mt-7 py-10"><Empty /></div>
              : (
                <div>
                  <Table head={columns} data={currentTableData} className="border mt-7" />
                  <div className="flex justify-center mt-5">
                    <Pagination
                      pageSize={PageSize}
                      total={tsData.length}
                      onChange={(page: number) => setCurrentPage(page)}
                    />
                  </div>
                </div>
              )
            }
          </>
        }
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
        {projectFilterId && (
          <div>
            <div className="grid grid-cols-2 gap-4 p-2 border-b">
              <p className="font-semibold">Total Hours</p>
              <p className="text-right">{totalHour}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 p-2 border-b">
              <p className="font-semibold">{`Total Price (rate ${formatCurrency(PAYMENT_RATE_PER_HOUR)}/hour)`}</p>
              <p className="text-right">{formatCurrency(totalHour * PAYMENT_RATE_PER_HOUR)}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
export default TimeSheetTable
