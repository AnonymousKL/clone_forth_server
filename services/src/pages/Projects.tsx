import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useQuery } from "react-query"
import { notification } from "antd"
import { deleteProject, fetchProjects } from "services/api"
import { projectStatus, statusOptions } from "utils/constant"
import { formatTime } from "utils/time"
import Search from "components/Search"
import Table from "components/Table"
import Badge from "components/Badge"
import Modal from "components/Modal"
import SpinnerIcon from "components/svg-icon/SpinnerIcon"
import EditIcon from "components/svg-icon/EditIcon"
import DeleteIcon from "components/svg-icon/DeleteIcon"
import AddIcon from "components/svg-icon/AddIcon"
import Select from "components/Select"

const Projects = () => {
  const [isShowModal, setShowModal] = useState(false)
  const [projectIdInModal, setProjectIdInModal] = useState(null)
  const [formData, setFormData] = useState({
    keyword: '',
    status: ''
  })

  const navigate = useNavigate()
  const { isLoading, data, error } = useQuery<any>(['fetchProjects', formData], () => fetchProjects(formData))

  let formatedData = []

  const onShowActionDelete = (id: any) => {
    setShowModal(true)
    setProjectIdInModal(id)
  }

  const onDeleteProject = async () => {
    setShowModal(false)
    const res = await deleteProject(projectIdInModal)
    if (res.status === 'success') {
      notification.open({
        type: 'success',
        message: 'Delete project successful',
      })
    } else {
      notification.open({
        type: 'error',
        message: 'Cannot delete project',
      })
    }
  }

  const columns = [
    {
      title: 'ID',
      key: 'ID',
      sortable: true,
    },
    {
      title: 'Status',
      key: 'Status',
      render: ({ status }: any) => (
        <Badge type={status}>{status}</Badge>
      )
    },
    {
      title: 'Project Name',
      key: 'Name',
      render: ({ name, id }: any) => (
        <div className="max-w-[100px] truncate text-center">
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

  if (data.length) {
    formatedData = data.map((item: any) => ({
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
      Participants: item.Users.length,
      Health: item.Health.health,
      HealthReason: item.Health.HealthReason,
      Priority: {
        priority: item.Priority
      },
      Action: {
        id: item.ID
      }
    }))
  }

  return (
    <div>
      <p className="text-3xl font-bold text-primary-2">Projects</p>
      <div className="mt-7 w-1/2 grid grid-cols-2 gap-3">
        <Search iconPosition="right" inputClassName="h-full pl-2 border-[2.5px] border-gray-4" />
        <Select
          options={statusOptions}
          onSelect={(option) => setFormData((prev) => ({ ...prev, status: option.value }))}
        />
      </div>
      <Table head={columns} data={formatedData} className="border mt-7" />
      <button
        className="fixed bottom-12 right-12"
        onClick={() => navigate('/projects/create')}
      >
        <AddIcon className="w-14 h-14" />
      </button>
      {isShowModal && (
        <Modal
          actionButton
          title="Delete Project"
          isShow={isShowModal}
          onClose={() => setShowModal(false)}
          onCancel={() => {
            setShowModal(false)
            setProjectIdInModal(null)
          }}
          onAccept={onDeleteProject}
        >
          <div className="bg-white px-8 py-4">
            <p>Delete Project? This Action Cannot Be Undo!</p>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default Projects
