import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { DatePicker, notification } from "antd"
import { deleteProject } from "services/api"
import { statusOptions } from "utils/constant"
import { useDebounce } from "hooks/useDebounce"
import { _confirm } from "components/PromiseModal"
import Search from "components/Search"
import TimeSheetTable from "page-components/TimeSheetTable"

const TimeSheet = () => {
  const [keyword, setKeyword] = useState('')
  const [formData, setFormData] = useState({
    keyword: '',
    status: ''
  })
  const [startDate, setStartDate] = useState<string | undefined>('')
  const debouncedKeyword = useDebounce(keyword, 1000)

  useEffect(() => {
    setFormData((prev) => ({ ...prev, keyword: debouncedKeyword }))
  }, [debouncedKeyword])

  return (
    <div>
      <p className="text-3xl font-bold text-primary-2">Time Sheet</p>
      <div className="mt-7 w-1/2 grid grid-cols-2 gap-3">
        <Search
          placeholder="Search Project"
          iconPosition="right"
          inputClassName="h-full pl-2 border border-gray-3"
          onChange={(e) => setKeyword(e.target.value)}
        />
        <DatePicker
          className="rounded-5 border-gray-3 py-1.5 leading-6"
          onChange={(date) => setStartDate(date?.toISOString())}
        />
      </div>
      <TimeSheetTable
        refetchProject={false}
        formData={formData}
        onShowActionDelete={() => { }}
      />
    </div>
  )
}

export default TimeSheet
