import { useQuery } from "react-query"
import { Link } from "react-router-dom"
import { fetchMembers } from "services/api"
import { workModel } from "utils/constant"
import { formatTime } from "utils/time"
import DeleteIcon from "components/svg-icon/DeleteIcon"
import EditIcon from "components/svg-icon/EditIcon"
import SpinnerIcon from "components/svg-icon/SpinnerIcon"
import Table from "components/Table"
import { formatCurrency } from "utils/format"

type MemberTableProps = {
  refetchProject: boolean,
  formData: any,
  onShowActionDelete: (id: any) => void,
}

const formatMembersData = (data: any) => {
  let formated = data.map((item: any, index: number) => ({
    ID: index + 1,
    Team: item.Team.Name,
    Name: {
      name: item.Name,
      id: item.ID,
    },
    Email: item.Email,
    Role: item?.Roles[0]?.Name,
    StartDate: formatTime(item.StartDate),
    Cost: formatCurrency(item.Salary),
    Participating: '',
    WorkModel: workModel[item.WorkModel as keyof Object],
    Action: {
      id: item.ID
    }
  }))

  return formated
}

const MemberTable = ({ refetchProject, formData, onShowActionDelete }: MemberTableProps) => {
  let formatedData = []

  const { isLoading, data, error } = useQuery<any>(['fetchMembers', formData, refetchProject], () => fetchMembers(formData))

  const columns = [
    {
      title: 'No.',
      key: 'ID',
    },
    {
      title: 'Team',
      key: 'Team',
    },
    {
      title: 'Name',
      key: 'Name',
      render: ({ name, id }: any) => (
        <div className="max-w-[100px] truncate text-center mx-auto">
          <Link to={`${id}`} className="text-primary-4">{name}</Link>
        </div>
      )
    },
    {
      title: 'Email',
      key: 'Email',
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
      title: 'Cost',
      key: 'Cost',
    },
    {
      title: 'Participating',
      key: 'Participating',
    },
    {
      title: 'Work Model',
      key: 'WorkModel',
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
    formatedData = formatMembersData(data)
  }

  return (
    <div className="w-full overflow-x-auto pb-3">
      <Table head={columns} data={formatedData} className="border mt-7" />
    </div>
  )
}
export default MemberTable
