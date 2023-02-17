import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { notification } from "antd"
import { deleteMember } from "services/api"
import { teamOptions } from "utils/constant"
import { useDebounce } from "hooks/useDebounce"
import Search from "components/Search"
import Modal from "components/Modal"
import AddIcon from "components/svg-icon/AddIcon"
import Select from "components/Select"
import MemberTable from "page-components/MemberTable"

const Members = () => {
  const [isShowModal, setShowModal] = useState(false)
  const [memberIdInModel, setMemberIdInModel] = useState(null)
  const [refetchProject, setRefetchProject] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [formData, setFormData] = useState({
    keyword: '',
    team_id: ''
  })
  const debouncedKeyword = useDebounce(keyword, 1000)

  const navigate = useNavigate()

  const onShowActionDelete = (id: any) => {
    setShowModal(true)
    setMemberIdInModel(id)
  }

  const onDeleteProject = async () => {
    setShowModal(false)
    const res = await deleteMember(memberIdInModel)
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
    setRefetchProject((refetchProject) => !refetchProject)
  }

  useEffect(() => {
    setFormData((prev) => ({ ...prev, keyword: debouncedKeyword }))
  }, [debouncedKeyword])

  return (
    <div>
      <p className="text-3xl font-bold text-primary-2">Members</p>
      <div className="mt-7 w-1/2 grid grid-cols-2 gap-3">
        <Search
          iconPosition="right"
          inputClassName="h-full pl-2 border-[2.5px] border-gray-4"
          onChange={(e) => setKeyword(e.target.value)}
        />
        <Select
          options={teamOptions}
          onSelect={(option) => setFormData((prev) => ({ ...prev, team_id: option.value }))}
        />
      </div>
      <MemberTable
        refetchProject={refetchProject}
        formData={formData}
        onShowActionDelete={onShowActionDelete}
      />
      <button
        className="fixed bottom-12 right-12"
        onClick={() => navigate('/members/create')}
      >
        <AddIcon className="w-14 h-14" />
      </button>
      {isShowModal && (
        <Modal
          actionButton
          title="Delete Member"
          isShow={isShowModal}
          onClose={() => setShowModal(false)}
          onCancel={() => {
            setShowModal(false)
            setMemberIdInModel(null)
          }}
          onAccept={onDeleteProject}
        >
          <div className="bg-white px-8 py-4">
            <p>Delete Member? This Action Cannot Be Undo!</p>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default Members
