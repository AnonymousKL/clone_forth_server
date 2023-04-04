import { useQuery } from "react-query"
import { Link } from "react-router-dom"
import { fetchProjects } from "services/api"
import { projectStatus } from "utils/constant"
import { formatTime } from "utils/time"
import { formatCurrency } from "utils/format"
import Badge from "components/Badge"
import DeleteIcon from "components/svg-icon/DeleteIcon"
import EditIcon from "components/svg-icon/EditIcon"
import SpinnerIcon from "components/svg-icon/SpinnerIcon"
import Table from "components/Table"
import { Empty } from "antd"

type ProjectTableProps = {
  refetchProject: boolean,
  formData: any,
  onShowActionDelete: (id: any) => void,
}

const formatProjectsData = (data: any) => {
  let formated = data.map((item: any, index: number) => ({
    ID: index + 1,
    Status: {
      status: projectStatus[item.StatusID as keyof Object]
    },
    Name: {
      name: item.Name,
      id: item.ID,
    },
    StartDate: formatTime(item.StartDate),
    EndDate: formatTime(item.EndDate),
    Participants: item.Members?.length,
    ActualCost: formatCurrency(item.ActualCost),
    Health: item.ActualCost > item.Budget ? "Bad" : item.ActualCost < item.Budget ? "Good" : "Normal",
    Priority: {
      priority: item.Priority
    },
    Action: {
      id: item.ID
    }
  }))

  return formated
}

const ProjectTable = ({ refetchProject, formData, onShowActionDelete }: ProjectTableProps) => {
  let formatedData = []

  const { isLoading, data, error } = useQuery<any>(['fetchProjects', formData, refetchProject], () => fetchProjects(formData))

  const columns = [
    {
      title: 'No.',
      key: 'ID',
    },
    {
      title: 'Status',
      key: 'Status',
      render: ({ status }: any) => (
        <Badge className="mx-auto" type={status}>{status}</Badge>
      )
    },
    {
      title: 'Project Name',
      key: 'Name',
      render: ({ name, id }: any) => (
        <div className="max-w-[100px] truncate text-center mx-auto">
          <Link to={`${id}`} className="text-primary-4">{name}</Link>
        </div>
      )
    },
    {
      title: 'Start Date',
      key: 'StartDate',
    },
    {
      title: 'End Date',
      key: 'EndDate',
    },
    {
      title: 'Participants',
      key: 'Participants',
    },
    {
      title: 'Actual Cost',
      key: 'ActualCost',
    },
    {
      title: 'Health',
      key: 'Health',
    },
    // {
    //   title: 'Health Reason',
    //   key: 'HealthReason',
    // },
    {
      title: 'Priority',
      key: 'Priority',
      render: ({ priority }: any) => (
        <p className={`text-pri-${priority.toLowerCase()} text-center`}>{priority}</p>
      )
    },
    {
      title: '',
      key: 'Action',
      render: ({ id }: any) => (
        <>
          <Link className="inline-block mr-2" to={`${id}`}><EditIcon /></Link>
          <button onClick={() => onShowActionDelete(id)}><DeleteIcon /></button>
        </>
      )
    },
  ]
  if (isLoading) {
    return (
      <div className="rounded-5 border mt-7 h-80 flex justify-center items-center">
        <div className="m-auto w-10 h-10">
          <SpinnerIcon className="animate-spin stroke-none fill-black" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-5 border mt-7 h-80 flex justify-center items-center">
        <div className="m-auto w-14 h-14">
          <p className="text-2xl">Error</p>
        </div>
      </div>
    )
  }

  if (data?.length) {
    formatedData = formatProjectsData(data)
  }

  return (
    <div className="w-full overflow-x-auto pb-3">
      {data?.length === 0
        ? <div className="border mt-7 py-10"><Empty /></div>
        : (<Table head={columns} data={formatedData} className="border mt-7" />)
      }
    </div>
  )
}
export default ProjectTable
