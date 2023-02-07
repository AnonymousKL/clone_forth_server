import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useQuery } from "react-query"
import { apiUrl } from "services/api"
import { fetchData } from "services/axios"
import Search from "components/Search"
import Table from "components/Table"
import Badge from "components/Badge"
import Modal from "components/Modal"
import SpinnerIcon from "components/svg-icon/SpinnerIcon"
import EditIcon from "components/svg-icon/EditIcon"
import DeleteIcon from "components/svg-icon/DeleteIcon"
import AddIcon from "components/svg-icon/AddIcon"
import Button from "components/Button"
import Select from "components/Select"

const dataSource = [
  {
    key: 1,
    ID: 1,
    Status: {
      status: 'Inprogress'
    },
    Name: {
      name: 'Forth',
      id: 1,
    },
    Priority: {
      priority: 'High'
    },
    StartDate: '2020-03-05',
    EndDate: '2020-03-05',
    Action: {
      id: 1
    }
  },
  {
    key: 2,
    ID: 2,
    Status: {
      status: 'Planning'
    },
    Name: {
      name: 'Tobira',
      id: 2,
    },
    Priority: {
      priority: 'Low'
    },
    StartDate: '2020-03-02',
    EndDate: '2020-03-07',
    Action: {
      id: 2
    }
  },
  {
    key: 3,
    ID: 3,
    Status: {
      status: 'Cancel'
    },
    Name: {
      name: 'Smartgift',
      id: 3,
    },
    Priority: {
      priority: 'Medium'
    },
    StartDate: '2020-03-01',
    EndDate: '2020-03-05',
    Action: {
      id: 3
    }
  },
  {
    key: 4,
    ID: 4,
    Status: {
      status: 'Completed'
    },
    Name: {
      name: 'Tobira',
      id: 4,
    },
    Priority: {
      priority: 'Lowest'
    },
    StartDate: '2020-03-09',
    EndDate: '2020-03-10',
    Action: {
      id: 4
    }
  },
  {
    key: 5,
    ID: 5,
    Status: {
      status: 'Overdue'
    },
    Name: {
      name: 'Abcdasldfjsalkdfj',
      id: 5,
    },
    Priority: {
      priority: 'Highest'
    },
    StartDate: '2020-03-09',
    EndDate: '2020-03-10',
    Action: {
      id: 5
    }
  },
]

const statusOptions = [
  {
    name: 'All status',
    value: 'all'
  },
  {
    name: 'Completed',
    value: 'completed'
  },
  {
    name: 'Cancel',
    value: 'cancel'
  },
]

const Projects = () => {
  const [isShowModal, setShowModal] = useState(false)
  const navigate = useNavigate()
  const { isLoading, data, error } = useQuery<any>('fetchProjects',
    () => fetchData(apiUrl + '/projects/').then(res => res.data)
  )

  const onDeleteProject = (id: any) => {
    setShowModal(true)
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'ID',
      key: 'ID',
      sortable: true,
    },
    {
      title: 'Status',
      dataIndex: 'Status',
      key: 'Status',
      render: ({ status }: any) => (
        <Badge type={status}>{status}</Badge>
      )
    },
    {
      title: 'Project Name',
      dataIndex: 'Name',
      key: 'Name',
      render: ({ name, id }: any) => (
        <div className="max-w-[100px] truncate text-center">
          <Link to={`${id}`} className="text-primary-4">{name}</Link>
        </div>
      )
    },
    {
      title: 'Priority',
      dataIndex: 'Priority',
      key: 'Priority',
      render: ({ priority }: any) => (
        <p className={`text-pri-${priority.toLowerCase()}`}>{priority}</p>
      )
    },
    {
      title: 'Start Date',
      dataIndex: 'StartDate',
      key: 'StartDate',
    },
    {
      title: 'End Date',
      dataIndex: 'EndDate',
      key: 'EndDate',
    },
    {
      title: 'Action',
      key: 'Action',
      render: ({ id }: any) => (
        <>
          <Link className="inline-block mr-2" to={`${id}`}><EditIcon /></Link>
          <button onClick={() => onDeleteProject(id)}><DeleteIcon /></button>
        </>
      )
    },
  ]

  if (isLoading) {
    return (
      <Modal
        isShow={false}
        noModalBg={true}
        onClose={() => { }}
      >
        <div className="m-auto w-14 h-14">
          <SpinnerIcon className="animate-spin stroke-none fill-white" />
        </div>
      </Modal>
    )
  }

  if (error) {
    return (<div>Error</div>)
  }

  return (
    <div>
      <p className="text-3xl font-bold text-primary-2">Projects</p>
      <div className="mt-7 w-1/2 grid grid-cols-2 gap-3">
        <Search iconPosition="right" inputClassName="h-full pl-2 border-[2.5px] border-gray-4" />
        <Select options={statusOptions} onSelect={(option) => console.log(option)} />
      </div>
      <Table head={columns} data={dataSource} className="border mt-7" />
      <button
        className="fixed bottom-12 right-12"
        onClick={() => navigate('/projects/create')}
      >
        <AddIcon className="w-14 h-14" />
      </button>
      {isShowModal && (
        <Modal
          title="Delete Project"
          isShow={isShowModal}
          onClose={() => setShowModal(false)}
        >
          <div className="bg-white px-8 py-4">
            <p>Delete Forth? This Action Cannot Be Undo!</p>
            <div className="flex justify-center mt-6">
              <Button className="mr-7" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button variant="dark" onClick={() => setShowModal(false)}>Delete</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default Projects
