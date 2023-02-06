import clsx from "clsx"
import { ReactNode } from "react"

type ButtonProps = {
  variant?: 'light' | 'dark',
  size?: 'sm' | 'md' | 'lg',
  className?: string,
  children?: ReactNode,
  onClick: () => void,
}

const Button = (props: ButtonProps) => {
  const { variant = 'light', size = 'md', className, children, onClick } = props

  const variantClass = {
    light: 'bg-gray-3',
    dark: 'text-white bg-primary-1'
  }

  const sizeClass = {
    sm: 'text-sm px-3 py-10p',
    md: 'px-4 py-10p',
    lg: 'text-lg px-3 py-10p'
  }

  return (
    <button
      className={clsx('rounded-5', variantClass[variant], sizeClass[size], className)}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button
