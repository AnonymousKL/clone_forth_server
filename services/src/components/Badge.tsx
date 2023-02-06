import clsx from "clsx"
import { ReactNode } from "react"

type Props = {
  children: ReactNode,
  type: 'Cancel' | 'Completed' | 'Planing' | 'Overdue' | 'Inprogress'
}

const Badge = (props: Props) => {
  const { children, type } = props
  const typeColorClass = {
    Cancel: 'bg-gray-1',
    Overdue: 'bg-red-1',
    Completed: 'bg-green-1',
    Planning: 'bg-green-2',
    Inprogress: 'bg-primary-4',
  }

  return (
    <p className={clsx("rounded-5 px-2 py-1 w-24 text-white text-center", typeColorClass[type as keyof Object])}>{children}</p>
  )
}

export default Badge
