import clsx from 'clsx'
import SearchIcon from 'components/svg-icon/SearchIcon'

type Props = {
  className?: string,
  inputClassName?: string,
  iconPosition?: 'left' | 'right',
  onChange?: (e: any) => void,
}

const Search = (props: Props) => {
  const { className, iconPosition = 'left', inputClassName, onChange } = props
  const positionClass = {
    left: 'left-2',
    right: 'right-2',
  }

  return (
    <div className={clsx('search relative', className)}>
      <input
        className={clsx('pl-8 w-full rounded-5 border border-gray-300 outline-none', inputClassName)}
        onChange={onChange}
      />
      <div className={clsx('absolute top-1/2 -translate-y-1/2', positionClass[iconPosition])}>
        <SearchIcon />
      </div>
    </div>
  )
}

export default Search
