import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { notification } from "antd"
import { deleteMember } from "services/api"
import { teamOptions } from "utils/constant"
import { useDebounce } from "hooks/useDebounce"
import { _confirm } from "components/PromiseModal"
import Search from "components/Search"
import AddIcon from "components/svg-icon/AddIcon"
import Select from "components/Select"
import MemberTable from "page-components/MemberTable"
import ModelNew from "components/ModelNew"

const Members = () => {
  const [refetchProject, setRefetchProject] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [formData, setFormData] = useState({
    keyword: '',
    team_id: ''
  })
  const debouncedKeyword = useDebounce(keyword, 1000)

  const navigate = useNavigate()

  const onShowActionDelete = async (id: any) => {
    const confirmed = await _confirm.delete({
      Template: ModelNew, props: {
        actionButton: true,
        title: "Delete Member",
        children: (
          <div className="bg-white px-8 py-4">
            <p>Delete Member? This Action Cannot Be Undo!</p>
          </div>
        )
      }
    })
    if (!confirmed) { return }
    onDeleteProject(id)
  }

  const onDeleteProject = async (id: number) => {
    const res = await deleteMember(id)
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
          inputClassName="h-full pl-2 border border-gray-3"
          onChange={(e) => setKeyword(e.target.value)}
        />
        <Select
          customWidth
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
        className="fixed bottom-4 right-4 md:bottom-8 lg:bottom-12 md:right-8 lg:right-12"
        onClick={() => navigate('/members/create')}
      >
        <AddIcon className="w-10 h-10 md:w-12 lg:w-14 md:h-12 lg:h-14" />
      </button>
    </div>
  )
}

export default Members
