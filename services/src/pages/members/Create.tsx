import { useState } from "react"
import { useForm } from "react-hook-form"
import { DatePicker, InputNumber, notification } from "antd"
import { roleOptions, teamOptions, workModelOptions } from "utils/constant"
import { createMember, fetchProjects } from "services/api"
import { Link, useNavigate } from "react-router-dom"
import Select from "components/Select"
import Button from "components/Button"
import Modal from "components/Modal"
import SpinnerIcon from "components/svg-icon/SpinnerIcon"
import ToggleCheckbox from "page-components/ToggleCheckbox"

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
    try {
      const res = await createMember(data)
      if (res.status === 'success') {
        notification.open({
          type: 'success',
          message: 'Create member successful',
        })
        setTimeout(() => {
          navigate('/members')
        }, 1000)
      }
    } catch (err) {
      notification.open({
        type: 'error',
        message: 'Cannot create member',
      })
    }
    setIsPosting(false)
  }

  register("Salary")
  register("OtherCost")
  register("TeamID")
  register("Roles")
  register("WorkModel")
  register("StartDate")
  register("ProjectIds", { value: [] })

  return (
    <div>
      <p className="text-3xl font-bold text-primary-2">New Member</p>
      <form className="mt-7" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-16 mb-7">
          <div>
            <label htmlFor="Name">Member Name<span className="text-red-1">*</span></label>
            <input
              className="w-full px-2 py-1 mt-10p rounded-5 border border-gray-2 outline-none hover:border-[#4096ff] transition"
              {...register("Name")}
              required
            />
          </div>
          <div>
            <label htmlFor="Email">Email<span className="text-red-1">*</span></label>
            <input
              {...register("Email")}
              className="w-full px-2 py-1 mt-10p rounded-5 border border-gray-2 outline-none hover:border-[#4096ff] transition"
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
              <InputNumber
                className='mt-10p block w-full rounded-5 border border-gray-2 outline-none hover:border-[#4096ff] transition'
                formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                onChange={(value) => setValue("Salary", value)}
                required
              />
            </div>
            <div>
              <label>Other Cost<span className="text-red-1">*</span></label>
              <InputNumber
                className='mt-10p block w-full rounded-5 border border-gray-2 outline-none hover:border-[#4096ff] transition'
                formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                onChange={(value) => setValue("OtherCost", value)}
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
          />
        </div>

        <div className="flex justify-end">
          <Button type="reset" className="mr-4">
            <Link to="/members">Cancel</Link>
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