import dayjs from 'dayjs'
import { useState } from "react"
import { useQuery } from "react-query"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { DatePicker, notification } from "antd"
import { fetchMemberByIdOrEmail, fetchProjects, updateMember } from "services/api"
import { roleOptions, teamOptions, workModelOptions } from "utils/constant"
import Select from "components/Select"
import Button from "components/Button"
import Modal from "components/Modal"
import SpinnerIcon from "components/svg-icon/SpinnerIcon"
import ToggleCheckbox from 'page-components/ToggleCheckbox'

const MemberDetail = () => {
  const [isPosting, setIsPosting] = useState(false)
  const navigate = useNavigate()
  const { id } = useParams()
  const {
    register,
    handleSubmit,
    setValue,
  } = useForm()

  const { isLoading, data, error } = useQuery<any>(['fetchMemberByIdOrEmail', id], () => fetchMemberByIdOrEmail(id))

  const onSubmit = async (data: any) => {
    setIsPosting(true)
    const res = await updateMember(id, data)
    if (res.status === 'success') {
      notification.open({
        type: 'success',
        message: 'Update member successful',
      })
      setTimeout(() => {
        navigate('/members')
      }, 1000)
    } else {
      notification.open({
        type: 'error',
        message: 'Cannot update member',
      })
    }
    setIsPosting(false)
  }

  if (isLoading) {
    return <div>Loading ...</div>
  }

  if (error) {
    return <div>Error</div>
  }

  register("Team")
  register("Roles")
  register("WorkModel")
  register("StartDate")
  register("ProjectIds", { value: data.Projects?.map((project: { ID: number }) => project.ID) || [] })

  return (
    <div>
      <p className="text-3xl font-bold text-primary-2">Member Detail</p>
      <form className="mt-7" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-16 mb-7">
          <div>
            <label htmlFor="Name">Name<span className="text-red-1">*</span></label>
            <input
              className="w-full px-2 py-1 mt-10p rounded-5 border border-gray-2"
              defaultValue={data.Name}
              {...register("Name")}
              required
            />
          </div>
          <div>
            <label htmlFor="Email">Email<span className="text-red-1">*</span></label>
            <input
              {...register("Email")}
              defaultValue={data.Email || ''}
              className="w-full px-2 py-1 mt-10p rounded-5 border border-gray-2"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-16 mb-7">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>Team<span className="text-red-1">*</span></label>
              <Select
                customWidth
                selectedClassName="font-normal"
                roundedClassName="px-2 py-1 rounded-5 border border-gray-2"
                className="w-full mt-10p"
                options={teamOptions}
                defaultSelected={teamOptions.find((option) => option.value === data.TeamID)}
                onSelect={(option) => setValue("TeamID", option.value)}
              />
            </div>
            <div>
              <label>Role<span className="text-red-1">*</span></label>
              <Select
                customWidth
                selectedClassName="font-normal"
                roundedClassName="px-2 py-1 rounded-5 border border-gray-2"
                className="w-full mt-10p"
                options={roleOptions}
                defaultSelected={roleOptions.find((option) => option.value === data.Roles[0]?.ID)}
                onSelect={(option) => setValue("Roles", [option.value])}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>Work Model<span className="text-red-1">*</span></label>
              <Select
                customWidth
                selectedClassName="font-normal"
                roundedClassName="px-2 py-1 rounded-5 border border-gray-2"
                className="w-full mt-10p"
                options={workModelOptions}
                defaultSelected={workModelOptions.find((option) => option.value === data.WorkModel)}
                onSelect={(option) => setValue("WorkModel", option.value)}
              />
            </div>
            <div>
              <label>Start Date<span className="text-red-1">*</span></label>
              <DatePicker
                className="w-full mt-10p rounded-5 border-gray-2"
                defaultValue={data.StartDate ? dayjs(data.StartDate) : undefined}
                onChange={(date) => setValue("StartDate", date?.toISOString())}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-16 mb-7">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="Salary">Salary<span className="text-red-1">*</span></label>
              <input
                {...register("Salary", {
                  valueAsNumber: true,
                  validate: (value) => value > 0,
                })}
                type="number"
                defaultValue={data.Salary || ''}
                className="w-full px-2 py-1 mt-10p rounded-5 border border-gray-2"
                step="any"
                required
              />
            </div>
            <div>
              <label>Other Cost<span className="text-red-1">*</span></label>
              <input
                {...register("OtherCost", {
                  valueAsNumber: true,
                  validate: (value) => value > 0,
                })}
                type="number"
                defaultValue={data.OtherCost || ''}
                className="w-full px-2 py-1 mt-10p rounded-5 border border-gray-2"
                required
              />
            </div>
          </div>
        </div>

        <div className="mb-5 flex gap-14">
          <p>Assign projects</p>
          <ToggleCheckbox
            queryKey="fetchProjects"
            queryFunc={fetchProjects}
            onChange={(checkedValues) => setValue("ProjectIds", checkedValues)}
            defaultSelected={data.Projects?.map((project: { ID: number }) => project.ID)}
          />
        </div>

        <div className="flex justify-end">
          <Button type="reset" className="mr-4">
            <Link to="/members">Cancel</Link>
          </Button>
          <Button type="submit" variant="dark">Update</Button>
        </div>
      </form>
      {isPosting && (
        <Modal
          isShow={isPosting}
          noModalBg={true}
          onClose={() => { }}
        >
          <div className="m-auto w-14 h-14">
            <SpinnerIcon className="animate-spin stroke-none fill-white" />
          </div>
        </Modal>
      )}
    </div>
  )
}

export default MemberDetail
