import clsx from "clsx"
import { useState } from "react"

type InputProps = {
  type: string,
  name: string,
  label?: string,
  placeholder?: string,
  value: any,
  required?: boolean,
  error?: string,
  className?: string,
  onChange?: (e: any) => void,
}

const Input = (props: InputProps) => {
  const [error, setError] = useState(props.error)
  const [value, setValue] = useState(props.value)

  const { label, required, onChange } = props
  const handleChange = (e: any) => {
    onChange?.(e)
    setValue(e.target.value)
  }

  return (
    <div>
      {label && (
        <label htmlFor={props.name}>{label}
          {required && (<span className="text-red-700">*</span>)}
        </label>
      )}
      {props.type === 'textarea' ? (
        <textarea
          {...props}
          className={clsx('w-full px-2 py-1 mt-10p rounded-5 border border-gray-2 transition focus:outline-none focus:ring focus:ring-gray-3',
            props.className
          )}
          value={value}
          onChange={handleChange}
        />
      ) : (
        <input
          {...props}
          className={clsx('w-full px-2 py-1 mt-10p rounded-5 border border-gray-2 transition focus:outline-none focus:ring focus:ring-gray-3',
            props.className
          )}
          value={value}
          onChange={handleChange}
        />
      )}
      {required && error && (
        <p className="text-xs text-red-700">{error}</p>
      )}
    </div>
  )
}

export default Input
