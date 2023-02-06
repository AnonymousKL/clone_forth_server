import Icons from './icons'

type Props = {
  className?: string,
  name: string,
  fill?: string,
  stroke?: string,
  strokeWidth?: string,
  viewBox?: string,
  onClick?: (e: any) => void,
}

const SvgIcon = ({
  className = 'w-5 h-5 dark:stroke-white',
  name, fill = 'none', stroke = 'black',
  strokeWidth = '1.5',
  viewBox = '0 0 24 24',
  onClick,
  ...props
}: Props) => {
  const icon = Icons[name as keyof typeof Icons]

  return (
    <svg
      viewBox={viewBox}
      className={`inline-block stroke-[${strokeWidth}] ${className}`}
      fill={fill}
      stroke={stroke}
      dangerouslySetInnerHTML={{ __html: icon }}
      onClick={onClick}
      {...props}
    >
    </svg>
  )
}

export default SvgIcon
