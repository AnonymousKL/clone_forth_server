import { useEffect, useState, useRef, MutableRefObject } from 'react'
import clsx from 'clsx'
import { useClickOutside } from 'hooks/useClickOutside'
import ArrowDownIcon from 'components/svg-icon/ArrowDownIcon'
import CheckIcon from 'components/svg-icon/CheckIcon'

type Option = {
  // title: string,
  name: string,
  value: string,
}

type Props = {
  options: Array<Option>,
  className?: string,
  customWidth?: boolean,
  selectClassName?: string,
  selectedClassName?: string,
  roundedClassName?: string,
  defaultSelected?: any,
  showOptionIcon?: boolean,
  showSelectedIcon?: boolean,
  arrowIconClass?: string,
  onSelect?: (option: any) => void,
  onSelected?: (option: any) => void,
}

const Select = ({
  options,
  className = 'w-max',
  customWidth = false,
  selectClassName,
  selectedClassName = 'font-semibold',
  roundedClassName,
  defaultSelected = options[0],
  showOptionIcon = false,
  showSelectedIcon = false,
  arrowIconClass = 'fill-dark-primary dark:fill-white stroke-none ',
  onSelect,
  onSelected }: Props) => {

  const [selected, setSelected] = useState(defaultSelected)
  const [active, setActive] = useState(false)
  const selectRef: MutableRefObject<null | any> = useRef(null)
  const optionWrapRef: MutableRefObject<null | any> = useRef(null)
  const isClickOutside = useClickOutside(selectRef)

  const handleSelect = (option: any) => {
    setSelected(option)
    onSelect?.(option)
  }

  useEffect(() => {
    if (isClickOutside) {
      setActive(false)
    }
    onSelected?.(selected)
  }, [isClickOutside])

  useEffect(() => {
    if (!customWidth) {
      selectRef.current.style.width = optionWrapRef.current.getBoundingClientRect().width + 'px'
    }
  }, [])

  return (
    <div ref={selectRef} className={clsx('relative', className)}
      onClick={() => setActive(!active)}
    >
      <div className={clsx('flex items-center cursor-pointer justify-between',
        roundedClassName || 'px-[17px] py-1.5 border-gray-3 rounded-[5px] border',
        selectClassName)}
      >
        <div className={clsx("mr-[22px] flex items-center", selectedClassName)}>
          {showSelectedIcon && (
            <span className={clsx('w-5 h-5 rounded-5 mr-2', `status-${selected.name.toLowerCase()}`)}></span>
          )}
          <span className="text-ellipsis overflow-hidden inline-block align-middle shrink-0 text-gray-5">
            {selected.name ? selected.name : options[0].name}
          </span>
        </div>
        <ArrowDownIcon className={clsx('w-[13px] h-[8px] transition duration-300 shrink-0', active ? 'rotate-180' : '', arrowIconClass)} />
      </div>
      <div ref={optionWrapRef} className={`absolute right-0 min-w-max w-full z-10 bg-white dark:bg-blue-3 border rounded-lg overflow-hidden transition
        ${active ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-2 invisible'}`}>
        <ul>
          {options.map((option: any, index: number) => (
            <li key={index} value={option.value}
              className="px-4 py-1 cursor-pointer flex justify-between items-center transition hover:bg-gray-3"
              onClick={() => handleSelect(option)}
            >
              <p className="">{option.name}</p>
              {selected.value === option.value ?
                (<CheckIcon />)
                : (<span className="w-5"></span>)
              }
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Select
