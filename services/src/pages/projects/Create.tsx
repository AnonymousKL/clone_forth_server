import { useState } from "react"
import Input from "components/Input"

const Create = () => {
  const [formData, setFormData] = useState({
    projectName: '',
    clientName: '',
    description: '',
    budget: '',
    actualReceived: '',
    startDate: '',
    endDate: '',
    status: '',
    priority: '',
    health: '',
    healthReason: '',
  })

  return (
    <div>
      <p className="text-3xl font-bold text-primary-2">New Project</p>
      <form className="mt-7">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-16 mb-7">
          <div>
            <Input
              type="text"
              name="project_name"
              label="Project Name"
              className="w-full px-2 py-1 mt-10p rounded-5 border border-gray-2"
              value={formData.projectName}
              required
            />
          </div>
          <div>
            <Input
              type="text"
              name="client"
              label="Client Name"
              value={formData.clientName}
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-16">
          <div>
            <Input
              type="textarea"
              name="description"
              label="Description"
              value={formData.description}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              name="budget"
              label="Budget"
              value={formData.budget}
              required
            />
            <Input
              type="number"
              name="actualReceived"
              label="Actual Received"
              value={formData.actualReceived}
              required
            />
          </div>
        </div>
      </form>
    </div>
  )
}

export default Create
