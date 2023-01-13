import { useState } from "react"

type InputProps = {
  type: string,
  name: string,
  label?: string,
  placeholder?: string,
  required?: boolean,
  className?: string,
  onChange?: (e: any) => void,
}

const Input = (props: InputProps) => {
  const [error, setError] = useState('')
  const [value, setValue] = useState('')

  const { label, required, onChange } = props
  const handleChange = (e: any) => {
    onChange?.(e)
    setValue(e.target.value)
  }

  return (
    <>
      {label && (
        <label>{label}
          {required && (<span className="text-red-700">*</span>)}
        </label>
      )}
      <input
        {...props}
        value={value}
        onChange={handleChange}
      />
      {required && (
        <p className="text-xs text-red-700">{error}</p>
      )}
    </>
  )
}

export default Input
