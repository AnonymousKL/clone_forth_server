import { ReactNode, useState } from 'react'
import clsx from 'clsx'
import { ReactComponent as SvgIcon } from 'assets/icon/chevron-down.svg'

type Props = {
  head?: Array<any> | any,
  data?: Array<any> | any,
  className?: string,
}

type TableHead = {
  title?: string,
  key?: string,
  sortable?: boolean,
  description?: string,
  options?: SortOptions,
  render: (params?: any) => ReactNode,
}

type SortOptions = {
  arrowRight?: boolean,
  arrowIcon?: string,
  sortDirection?: 'asc' | 'desc',
  sortKey?: string,
  tooltipPosition?: 'top' | 'right' | 'bottom',
}

const renderCustom = (head: any[], data: any, key: any): ReactNode => {
  for (let i = 0; i < head.length; i++) {
    if (head[i]['render'] && head[i].key === key) {
      return head[i]['render'](data)
    }
  }
}

type CustomObj = {
  [key: string]: any
}

const renderTableCell = (head: Object[], obj: Object) => {
  const headKey: string[] = head.map((element) => element['key' as keyof object])
  const jsx = []

  for (const property in obj) {
    if (typeof obj[property as keyof object] !== 'object') {
      if (headKey.includes(property)) {
        jsx.push(<td className="px-2 py-4 whitespace-nowrap max-w-[150px] truncate text-center" key={property}>
          {obj[property as keyof object]}
        </td>
        )
      }
    } else {
      const record: CustomObj = head.find((obj: CustomObj) => {
        return obj.key === property
      }) || {}
      jsx.push(<td className={clsx(`${record?.tdClass}`)} key={property}>
        {renderCustom(head, obj[property as keyof object], property)}
      </td>)
    }
  }
  return jsx
}

const Table = ({ head, data, className }: Props) => {
  const [sortDirection, setSortDirection] = useState('asc')
  const [activeSortCol, setActiveSortCol] = useState('')
  let beta = data

  // Todo: Sort follow options
  const handleSort = (options: SortOptions, key: string) => {
    setActiveSortCol(key)
    let nestedKey: string

    if (typeof options === 'object' && options?.sortKey) {
      nestedKey = options.sortKey
    }

    if (sortDirection === 'asc') {
      beta.sort((a: any, b: any) => {
        if (nestedKey) {
          return a[key][nestedKey] - b[key][nestedKey]
        }
        return a[key] - b[key]
      })
      setSortDirection('desc')
    } else {
      beta.sort((a: any, b: any) => {
        if (nestedKey) {
          return b[key][nestedKey] - a[key][nestedKey]
        }
        return b[key] - a[key]
      })
      setSortDirection('asc')
    }
  }

  return (
    <table className={clsx('w-full border-collapse', className)}>
      <thead className="table-header-group">
        <tr className="table-row align-middle">
          {head.map((item: any, index: number) => (
            <th key={index} className={clsx(
              'p-2 table-cell text-left font-medium capitalize',
              item.sortable && 'sortable-col',
              activeSortCol === item.key && 'active')}
            >
              {/* Remove w-max */}
              <div className="flex justify-center">
                {item.sortable ? (
                  <button type="button"
                    className={`inline-flex items-center shrink-0 ${sortDirection === 'asc' ? 'arrow-down' : 'arrow-up'}`}
                    onClick={() => handleSort(item.options, item.key)}
                  >
                    {item?.title && item.options?.arrowRight ? (
                      <>
                        {item.title}
                        <SvgIcon
                          name={item.options?.arrowIcon || 'arrowDown'}
                          className="w-5 h-5 stroke-none fill-gray-6 cursor-pointer"
                        />
                      </>
                    ) : (
                      <>
                        <SvgIcon
                          name={item.options?.arrowIcon || 'arrowDown'}
                          className="w-5 h-5 stroke-none fill-gray-6 cursor-pointer"
                        />
                        {item.title}
                      </>
                    )}

                  </button>
                ) : (
                  <p className="whitespace-pre-line">{item?.title}</p>
                )}
                {/* {item.description && (
                  <Tooltip position={item.options?.tooltipPosition}>{item.description}</Tooltip>
                )} */}
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="table-row-group">
        {beta.map((element: object, index: number) => (
          <tr key={index} className="table-row border-t">
            {renderTableCell(head, element)}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Table
