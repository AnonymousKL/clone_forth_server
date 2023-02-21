import clsx from "clsx"
import { useState } from "react"
import { Checkbox } from "antd"
import { CheckboxValueType } from "antd/es/checkbox/Group"
import { useQuery } from "react-query"

type ToggleCheckboxProps = {
  queryKey: string,
  queryFunc: (params?: any) => Promise<any>,
  defaultSelected?: Array<number>,
  onChange: (checkedValues: CheckboxValueType[]) => void
}

const ToggleCheckbox = (props: ToggleCheckboxProps) => {
  const { queryKey, queryFunc, defaultSelected, onChange } = props
  const [show, setShow] = useState(false)
  const [selectedMembers, setSelectedMembers] = useState(defaultSelected ? defaultSelected.length : 0)

  const { isLoading, data } = useQuery<any>([queryKey], () => queryFunc())

  const onChangeCheckbox = (checkedValues: CheckboxValueType[]) => {
    onChange(checkedValues)
    setSelectedMembers(checkedValues?.length)
  }

  if (isLoading) {
    return (
      <div>Loading...</div>
    )
  }

  return (
    <div>
      <p className="cursor-default" onClick={() => setShow(!show)}>{selectedMembers} Selected </p>
      <div className={clsx("mt-4", show ? "block" : "hidden")}>
        <Checkbox.Group onChange={onChangeCheckbox} defaultValue={defaultSelected}>
          <div className="grid grid-cols-3 gap-4">
            {data.map((item: any) => (
              <div key={item.ID}>
                <Checkbox value={item.ID}>{item.Name}</Checkbox>
              </div>
            ))}
          </div>
        </Checkbox.Group>
      </div>
    </div>
  )
}

export default ToggleCheckbox
