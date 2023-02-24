import { useState } from "react"
import { useForm } from "react-hook-form"
import { DatePicker, notification } from "antd"
import { Health, healthOptions, Priority, priorityOptions, statusOptions } from "utils/constant"
import { createProject, fetchMembers } from "services/api"
import { Link, useNavigate } from "react-router-dom"
import { ProjectStatus } from "utils/constant"
import Select from "components/Select"
import Button from "components/Button"
import Modal from "components/Modal"
import SpinnerIcon from "components/svg-icon/SpinnerIcon"
import ToggleCheckbox from "page-components/ToggleCheckbox"

const Create = () => {
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
      const res = await createProject(data)
      if (res.status === 'success') {
        notification.open({
          type: 'success',
          message: 'Create project successful',
        })
        setTimeout(() => {
          navigate('/projects')
        }, 1000)
      }
    } catch (err) {
      notification.open({
        type: 'error',
        message: 'Cannot create project',
      })
    }
    setIsPosting(false)
  }

  register("StartDate")
  register("EndDate")
  register("Health.Health", { value: Health.Strong })
  register("Priority", { value: Priority.Medium })
  register("StatusID", { value: ProjectStatus.Planning })
  register("Members", { value: [] })

  return (
    <div>
      <p className="text-3xl font-bold text-primary-2">New Project</p>
      <form className="mt-7" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-16 mb-7">
          <div>
            <label htmlFor="Name">Project Name<span className="text-red-1">*</span></label>
            <input
              className="w-full px-2 py-1 mt-10p rounded-5 border border-gray-2"
              {...register("Name")}
              required
            />
          </div>
          <div>
            <label htmlFor="Name">Client Name<span className="text-red-1">*</span></label>
            <input
              {...register("ClientName")}
              className="w-full px-2 py-1 mt-10p rounded-5 border border-gray-2"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-16 mb-7">
          <div>
            <label htmlFor="Description">Description</label>
            <textarea
              {...register("Description")}
              className="w-full px-2 py-1 mt-10p rounded-5 border border-gray-2"
            ></textarea>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="Description">Budget<span className="text-red-1">*</span></label>
              <input
                {...register("Budget", {
                  valueAsNumber: true,
                  validate: (value) => value > 0,
                })}
                type="number"
                className="w-full px-2 py-1 mt-10p rounded-5 border border-gray-2"
                required
              />
            </div>
            <div>
              <label htmlFor="ActualReceived">Actual Received</label>
              <input
                {...register("ActualReceived", {
                  valueAsNumber: true,
                  validate: (value) => value > 0,
                })}
                className="w-full px-2 py-1 mt-10p rounded-5 border border-gray-2"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-16 mb-7">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>Start Date<span className="text-red-1">*</span></label>
              <DatePicker
                className="w-full mt-10p rounded-5 border-gray-2"
                onChange={(date) => setValue("StartDate", date?.toISOString())}
              />
            </div>
            <div>
              <label>End Date<span className="text-red-1">*</span></label>
              <DatePicker
                className="w-full mt-10p rounded-5 border-gray-2"
                onChange={(date) => setValue("EndDate", date?.toISOString())}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="">
              <label>Status</label>
              <Select
                customWidth
                showSelectedIcon
                selectedClassName="font-normal"
                roundedClassName="px-2 py-1 rounded-5 border border-gray-2"
                className="w-full mt-10p"
                defaultSelected={statusOptions[1]}
                options={statusOptions}
                onSelect={(option) => setValue("StatusID", ProjectStatus[option.value])}
              />
            </div>
            <div>
              <label>Priority</label>
              <Select
                customWidth
                selectedClassName="font-normal"
                roundedClassName="px-2 py-1 rounded-5 border border-gray-2"
                className="w-full mt-10p"
                options={priorityOptions}
                defaultSelected={priorityOptions[2]}
                onSelect={(option) => setValue("Priority", option.value)}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-16 mb-7">
          <div>
            <label>Health</label>
            <Select
              customWidth
              selectedClassName="font-normal"
              roundedClassName="px-2 py-1 rounded-5 border border-gray-2"
              className="w-full mt-10p"
              options={healthOptions}
              defaultSelected={healthOptions[0]}
              onSelect={(option) => setValue("Health.Health", option.value)}
            />
          </div>
          <div>
            <label htmlFor="HealthReason">Health Reason</label>
            <input
              {...register("Health.HealthReason")}
              className="w-full px-2 py-1 mt-10p rounded-5 border border-gray-2"
            />
          </div>
        </div>

        <div className="mb-5 flex gap-14">
          <p>Participants</p>
          <ToggleCheckbox
            showSelect
            queryKey="fetchMembers"
            queryFunc={(params) => fetchMembers(params)}
            onChange={(checkedValues) => setValue("Members", checkedValues)}
          />
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

export default Create
