import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { notification } from "antd"
import { deleteProject } from "services/api"
import { statusOptions } from "utils/constant"
import { useDebounce } from "hooks/useDebounce"
import Search from "components/Search"
import Modal from "components/Modal"
import AddIcon from "components/svg-icon/AddIcon"
import Select from "components/Select"
import ProjectTable from "page-components/ProjectTable"

const Projects = () => {
  const [isShowModal, setShowModal] = useState(false)
  const [projectIdInModal, setProjectIdInModal] = useState(null)
  const [refetchProject, setRefetchProject] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [formData, setFormData] = useState({
    keyword: '',
    status: ''
  })
  const debouncedKeyword = useDebounce(keyword, 2000)

  const navigate = useNavigate()

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
    setRefetchProject((refetchProject) => !refetchProject)
  }

  useEffect(() => {
    setFormData((prev) => ({ ...prev, keyword: debouncedKeyword }))
  }, [debouncedKeyword])

  return (
    <div>
      <p className="text-3xl font-bold text-primary-2">Projects</p>
      <div className="mt-7 w-1/2 grid grid-cols-2 gap-3">
        <Search
          iconPosition="right"
          inputClassName="h-full pl-2 border-[2.5px] border-gray-4"
          onChange={(e) => setKeyword(e.target.value)}
        />
        <Select
          options={statusOptions}
          onSelect={(option) => setFormData((prev) => ({ ...prev, status: option.value }))}
        />
      </div>
      <ProjectTable
        refetchProject={refetchProject}
        formData={formData}
        onShowActionDelete={onShowActionDelete}
      />
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
