import { Link } from "react-router-dom"
import DeleteIcon from "components/svg-icon/DeleteIcon"
import EditIcon from "components/svg-icon/EditIcon"
import Table from "components/Table"
import { InputNumber } from "antd"
import Button from "components/Button"

type ProjectTableProps = {
  refetchProject: boolean,
  formData: any,
  onShowActionDelete: (id: any) => void,
}

type formated = {
  MemberID: any,
  ProjectID: any,
  Log: any[],
}

function formatTimeSheet(data: any[]) {
  let formated: formated[] = []
  data.forEach((item, i) => {
    formated.push({
      MemberID: item["MemberID"],
      ProjectID: item["ProjectID"],
      Log: [],
    })
    formated[i].Log.push(item["DayLog"])
  })
  return formated
}

function incrementDate(dateInput: Date, increment: number) {
  var dateFormatTotime = new Date(dateInput)
  var increasedDate = new Date(dateFormatTotime.getTime() + (increment * 86400000))
  return increasedDate
}

const fromDate = new Date()
const dateRange = {
  date1: fromDate.toLocaleDateString(),
  date2: incrementDate(fromDate, 1).toLocaleDateString(),
  date3: incrementDate(fromDate, 2).toLocaleDateString(),
  date4: incrementDate(fromDate, 3).toLocaleDateString(),
  date5: incrementDate(fromDate, 4).toLocaleDateString(),
  date6: incrementDate(fromDate, 5).toLocaleDateString(),
  date7: incrementDate(fromDate, 6).toLocaleDateString(),
}

const timeSheetData = [
  {
    ID: 1,
    Project: {
      id: 1,
      name: "Forth Management"
    },
    Member: {
      id: 1,
      name: "Anh Nhat"
    },
    Role: "Develop",
    StartDate: "02/02/2022",
    [dateRange.date1]: {
      time: 3
    },
    [dateRange.date2]: {
      time: 4
    },
    [dateRange.date3]: {
      time: 2
    },
    [dateRange.date4]: {
      time: 6
    },
    [dateRange.date5]: {
      time: 7
    },
    [dateRange.date6]: {
      time: 5
    },
    [dateRange.date7]: {
      time: 0
    },
    Action: {
      id: 1
    }
  },
  {
    ID: 2,
    Project: {
      id: 2,
      name: "Enjoy NFT Land"
    },
    Member: {
      id: 2,
      name: "Dang Huynh"
    },
    Role: "QA/QC",
    StartDate: "02/01/2022",
    [dateRange.date1]: {
      time: 3
    },
    [dateRange.date2]: {
      time: 4
    },
    [dateRange.date3]: {
      time: 2
    },
    [dateRange.date4]: {
      time: 6
    },
    [dateRange.date5]: {
      time: 7
    },
    [dateRange.date6]: {
      time: 5
    },
    [dateRange.date7]: {
      time: 4
    },
    Action: {
      id: 2
    }
  },
  {
    ID: 3,
    Project: {
      id: 3,
      name: "Circle"
    },
    Member: {
      id: 2,
      name: "Dang Huynh"
    },
    Role: "QA/QC",
    StartDate: "12/03/2022",
    [dateRange.date1]: {
      time: 4
    },
    [dateRange.date2]: {
      time: 6
    },
    [dateRange.date3]: {
      time: 3
    },
    [dateRange.date4]: {
      time: 7
    },
    [dateRange.date5]: {
      time: 8
    },
    [dateRange.date6]: {
      time: 7
    },
    [dateRange.date7]: {
      time: 0
    },
    Action: {
      id: 3
    }
  },
  {
    ID: 4,
    Project: {
      id: 4,
      name: "Another Project"
    },
    Member: {
      id: 2,
      name: "Anh Nhat"
    },
    Role: "Develop",
    StartDate: "12/03/2023",
    [dateRange.date1]: {
      time: 3
    },
    [dateRange.date2]: {
      time: 7
    },
    [dateRange.date3]: {
      time: 3
    },
    [dateRange.date4]: {
      time: 4
    },
    [dateRange.date5]: {
      time: 5
    },
    [dateRange.date6]: {
      time: 3
    },
    [dateRange.date7]: {
      time: 2
    },
    Action: {
      id: 4
    }
  }
]

const TimeSheetTable = ({ refetchProject, formData, onShowActionDelete }: ProjectTableProps) => {
  // const { isLoading, data, error } = useQuery<any>(['fetchTimesheet', formData, refetchProject], () => fetch('http://localhost:8080/api/v1/timesheet').then(res => res.json()))
  // console.log(data)
  // if (data?.data.length) {
  //   formatTimeSheet(data.data)
  // }

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
      render: ({ time }: any) => (
        <div className="flex justify-center"><InputNumber type="number" value={time} className="w-16" /></div>
      )
    },
    {
      title: dateRange.date2,
      key: dateRange.date2,
      render: ({ time }: any) => (
        <div className="flex justify-center"><InputNumber type="number" value={time} className="w-16" /></div>
      )
    },
    {
      title: dateRange.date3,
      key: dateRange.date3,
      render: ({ time }: any) => (
        <div className="flex justify-center"><InputNumber type="number" value={time} className="w-16" /></div>
      )
    },
    {
      title: dateRange.date4,
      key: dateRange.date4,
      render: ({ time }: any) => (
        <div className="flex justify-center"><InputNumber type="number" value={time} className="w-16" /></div>
      )
    },
    {
      title: dateRange.date5,
      key: dateRange.date5,
      render: ({ time }: any) => (
        <div className="flex justify-center"><InputNumber type="number" value={time} className="w-16" /></div>
      )
    },
    {
      title: dateRange.date6,
      key: dateRange.date6,
      render: ({ time }: any) => (
        <div className="flex justify-center"><InputNumber type="number" value={time} className="w-16" /></div>
      )
    },
    {
      title: dateRange.date7,
      key: dateRange.date7,
      render: ({ time }: any) => (
        <div className="flex justify-center"><InputNumber type="number" value={time} className="w-16" /></div>
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

  return (
    <div>
      <div className="w-full overflow-x-auto pb-3">
        <Table head={columns} data={timeSheetData} className="border mt-7" />
      </div>
      <div className="flex flex-col sm:flex-row justify-between gap-4 mt-5">
        <Button type="submit" variant="dark" className="h-fit">Save Timesheet</Button>
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
