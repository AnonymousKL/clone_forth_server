import { ReactNode, useState } from "react"

type FormProps = {
  initData: any,
  children: ReactNode,
  onSubmit?: (formData: any) => void,
}

const Form = (props: FormProps) => {
  const { children, initData } = props
  const [formData, setFormData] = useState(initData)
  console.log(children)
  const handleSubmitForm = (e: any) => {
    e.preventDefault()
    const fields = Object.keys(formData)

    // console.log(children.props)
  }

  return (
    <form onSubmit={handleSubmitForm}>
      <div className="rounded-md px-4 py-6">
        {children}
        <button className="rounded-lg border border-slate-500 font-medium px-4 py-2" type="submit">Submit</button>
      </div>
    </form>
  )
}

export default Form
