import dayjs from 'dayjs'
import { useState } from "react"
import { useQuery } from "react-query"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { DatePicker, InputNumber, notification } from "antd"
import { fetchMembers, fetchProjectByIdOrName, updateProject } from "services/api"
import { healthOptions, priorityOptions, projectStatus, ProjectStatus, statusOptions } from "utils/constant"
import Select from "components/Select"
import Button from "components/Button"
import Modal from "components/Modal"
import SpinnerIcon from "components/svg-icon/SpinnerIcon"
import ToggleCheckbox from 'page-components/ToggleCheckbox'

const ProjectDetail = () => {
  const [isPosting, setIsPosting] = useState(false)
  const navigate = useNavigate()
  const { id } = useParams()
  const {
    register,
    handleSubmit,
    setValue,
  } = useForm();

  const { isLoading, data, error } = useQuery<any>(
    ['fetchProjectByIdOrName', id],
    () => fetchProjectByIdOrName(id),
    { cacheTime: 0 }
  )

  const onSubmit = async (data: any) => {
    setIsPosting(true)
    try {
      const res = await updateProject(id, data)
      if (res.status === 'success') {
        notification.open({
          type: 'success',
          message: 'Update project successful',
        })
        setTimeout(() => {
          navigate('/projects')
        }, 1000)
      }
    } catch (err) {
      notification.open({
        type: 'error',
        message: 'Cannot update project',
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

  register("Budget")
  register("ActualReceived")
  register("StartDate")
  register("EndDate")
  register("Health.Health")
  register("Priority")
  register("StatusID")
  register("Members", { value: data.Members?.map((member: { ID: number }) => member.ID) || [] })

  return (
    <div>
      <p className="text-3xl font-bold text-primary-2">Project Detail</p>
      <form className="mt-7" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-16 mb-7">
          <div>
            <label htmlFor="Name">Project Name<span className="text-red-1">*</span></label>
            <input
              className="w-full px-2 py-1 mt-10p rounded-5 border border-gray-2 outline-none hover:border-[#4096ff] transition"
              defaultValue={data.Name}
              {...register("Name")}
              required
            />
          </div>
          <div>
            <label htmlFor="Name">Client Name<span className="text-red-1">*</span></label>
            <input
              {...register("ClientName")}
              defaultValue={data.ClientName || ''}
              className="w-full px-2 py-1 mt-10p rounded-5 border border-gray-2 outline-none hover:border-[#4096ff] transition"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-16 mb-7">
          <div>
            <label htmlFor="Description">Description</label>
            <textarea
              {...register("Description")}
              defaultValue={data.Description}
              className="w-full px-2 py-1 mt-10p rounded-5 border border-gray-2 outline-none hover:border-[#4096ff] transition"
            ></textarea>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="Description">Budget<span className="text-red-1">*</span></label>
              <InputNumber
                className='mt-10p block w-full rounded-5 border border-gray-2 outline-none hover:border-[#4096ff] transition'
                defaultValue={data.Budget || ''}
                formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                onChange={(value) => setValue("Budget", value)}
                required
              />
            </div>
            <div>
              <label htmlFor="ActualReceived">Actual Received<span className="text-red-1">*</span></label>
              <InputNumber
                className='mt-10p block w-full rounded-5 border border-gray-2 outline-none hover:border-[#4096ff] transition'
                defaultValue={data.ActualReceived || ''}
                formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                onChange={(value) => setValue("ActualReceived", value)}
                required
              />
            </div>
            <div>
              <label htmlFor="ActualReceived">Actual Cost</label>
              <InputNumber
                className='mt-10p block w-full rounded-5 border border-gray-2 outline-none hover:border-[#4096ff] transition'
                defaultValue={data.ActualReceived || ''}
                formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                disabled
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
                defaultValue={dayjs(data.StartDate)}
                onChange={(date) => setValue("StartDate", date?.toISOString())}
              />
            </div>
            <div>
              <label>End Date<span className="text-red-1">*</span></label>
              <DatePicker
                className="w-full mt-10p rounded-5 border-gray-2"
                defaultValue={dayjs(data.EndDate)}
                onChange={(date) => setValue("EndDate", date?.toISOString())}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>Status</label>
              <Select
                customWidth
                showSelectedIcon
                selectedClassName="font-normal"
                roundedClassName="px-2 py-1 rounded-5 border border-gray-2"
                className="w-full mt-10p"
                options={statusOptions}
                defaultSelected={statusOptions.find((option) => option.value === projectStatus[data.StatusID as keyof object])}
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
                defaultSelected={priorityOptions.find((option) => option.value === data.Priority)}
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
              defaultSelected={healthOptions.find((option) => option.value === data.Health.Health)}
              onSelect={(option) => setValue("Health.Health", option.value)}
            />
          </div>
          <div>
            <label htmlFor="HealthReason">Health Reason</label>
            <input
              {...register("Health.HealthReason")}
              defaultValue={data.Health.HealthReason || ''}
              className="w-full px-2 py-1 mt-10p rounded-5 border border-gray-2 outline-none hover:border-[#4096ff] transition"
            />
          </div>
        </div>

        <div className="mb-5 flex gap-14">
          <p>Participants</p>
          <ToggleCheckbox
            showSelect
            queryKey="fetchMembers"
            queryFunc={fetchMembers}
            onChange={(checkedValues) => setValue("Members", checkedValues)}
            defaultSelected={data.Members?.map((member: { ID: number }) => member.ID)}
          />
        </div>

        <div className="flex justify-end">
          <Button type="reset" className="mr-4">
            <Link to="/projects">Cancel</Link>
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

export default ProjectDetail