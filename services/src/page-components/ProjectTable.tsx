import { useQuery } from "react-query"
import { Link } from "react-router-dom"
import { fetchProjects } from "services/api"
import { projectStatus } from "utils/constant"
import { formatTime } from "utils/time"
import Badge from "components/Badge"
import DeleteIcon from "components/svg-icon/DeleteIcon"
import EditIcon from "components/svg-icon/EditIcon"
import SpinnerIcon from "components/svg-icon/SpinnerIcon"
import Table from "components/Table"

type ProjectTableProps = {
  refetchProject: boolean,
  formData: any,
  onShowActionDelete: (id: any) => void,
}

const formatProjectsData = (data: any) => {
  let formated = data.map((item: any) => ({
    ID: item.ID,
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
    Health: item.Health.Health,
    HealthReason: item.Health.HealthReason,
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
      title: '',
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
      title: 'Health',
      key: 'Health',
    },
    {
      title: 'Health Reason',
      key: 'HealthReason',
    },
    {
      title: 'Priority',
      key: 'Priority',
      render: ({ priority }: any) => (
        <p className={`text-pri-${priority.toLowerCase()}`}>{priority}</p>
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
        <div className="m-auto w-14 h-14">
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
    <Table head={columns} data={formatedData} className="border mt-7" />
  )
}
export default ProjectTable
