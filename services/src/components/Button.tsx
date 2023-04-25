import clsx from "clsx"
import { ReactNode } from "react"

type ButtonProps = {
  type?: "button" | "submit" | "reset",
  variant?: 'light' | 'dark' | 'red',
  size?: 'sm' | 'md' | 'lg',
  className?: string,
  disabled?: boolean,
  children?: ReactNode,
  onClick?: (e: any) => void,
}

const Button = (props: ButtonProps) => {
  const { variant = 'light', size = 'md', type = 'button', className, children, disabled = false, onClick } = props

  const variantClass = {
    light: 'bg-gray-3 hover:bg-gray-3/80',
    dark: 'text-white bg-primary-1 hover:bg-primary-1/80',
    red: 'text-white bg-red-1 hover:bg-red-1/80'
  }

  const sizeClass = {
    sm: 'text-sm px-3 py-10p',
    md: 'px-4 py-10p',
    lg: 'text-lg px-3 py-10p'
  }

  return (
    <button
      className={clsx(
        'rounded-5 transition-colors',
        variantClass[variant],
        sizeClass[size],
        disabled ? 'cursor-not-allowed bg-primary-1/80' : 'cursor-pointer',
        className
      )}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default Button
