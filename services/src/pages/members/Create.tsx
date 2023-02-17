import { useState } from "react"
import { useForm } from "react-hook-form"
import { DatePicker, notification } from "antd"
import { roleOptions, statusOptions, teamOptions, workModelOptions } from "utils/constant"
import { createMember, createProject } from "services/api"
import { Link, useNavigate } from "react-router-dom"
import { ProjectStatus } from "utils/constant"
import Select from "components/Select"
import Button from "components/Button"
import Modal from "components/Modal"
import SpinnerIcon from "components/svg-icon/SpinnerIcon"

const CreateMember = () => {
  const [isPosting, setIsPosting] = useState(false)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setValue
  } = useForm()

  const onSubmit = async (data: any) => {
    setIsPosting(true)
    const res = await createMember(data)
    if (res.status === 'success') {
      notification.open({
        type: 'success',
        message: 'Create member successful',
      })
      setTimeout(() => {
        navigate('/members')
      }, 1000)
    } else {
      notification.open({
        type: 'error',
        message: 'Cannot create member',
      })
    }
    setIsPosting(false)
  }

  register("TeamID")
  register("Roles")
  register("WorkModel")
  register("StartDate")

  return (
    <div>
      <p className="text-3xl font-bold text-primary-2">New Member</p>
      <form className="mt-7" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-16 mb-7">
          <div>
            <label htmlFor="Name">Member Name<span className="text-red-1">*</span></label>
            <input
              className="w-full px-2 py-1 mt-10p rounded-5 border border-gray-2"
              {...register("Name")}
              required
            />
          </div>
          <div>
            <label htmlFor="Email">Email<span className="text-red-1">*</span></label>
            <input
              {...register("Email")}
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
                defaultSelected={teamOptions[0]}
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
                defaultSelected={roleOptions[0]}
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
                defaultSelected={workModelOptions[0]}
                onSelect={(option) => setValue("WorkModel", option.value)}
              />
            </div>
            <div>
              <label>Start Date<span className="text-red-1">*</span></label>
              <DatePicker
                className="w-full mt-10p rounded-5 border-gray-2"
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
                className="w-full px-2 py-1 mt-10p rounded-5 border border-gray-2"
                step="any"
                required
              />
            </div>
          </div>

        </div>

        <div className="flex justify-end">
          <Button type="reset" className="mr-4">
            <Link to="/projects">Cancel</Link>
          </Button>
          <Button type="submit" variant="dark">Create</Button>
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

export default CreateMember
