import clsx from "clsx"
import { useState } from "react"
import { Checkbox } from "antd"
import { CheckboxValueType } from "antd/es/checkbox/Group"
import { useQuery } from "react-query"
import { teamOptions } from "utils/constant"
import ChevronDownIcon from "components/svg-icon/ChevronDownIcon"
import Select from "components/Select"
import Button from "components/Button"

type ToggleCheckboxProps = {
  showSelect?: boolean,
  queryKey: string,
  queryFunc: (params?: any) => Promise<any>,
  defaultSelected?: CheckboxValueType[],
  onChange: (checkedValues: CheckboxValueType[]) => void
}

const ToggleCheckbox = (props: ToggleCheckboxProps) => {
  const { showSelect = false, queryKey, queryFunc, defaultSelected, onChange } = props
  const [show, setShow] = useState(false)
  const [selectedMembers, setSelectedMembers] = useState(defaultSelected ? defaultSelected.length : 0)
  const [defaultSelectedState, setDefaultSelectedState] = useState<CheckboxValueType[] | undefined>(defaultSelected)
  const [queryParams, setQueryParams] = useState({})

  const { isLoading, data } = useQuery<any>([queryKey, queryParams], () => queryFunc(queryParams))

  const onChangeCheckbox = (checkedValues: CheckboxValueType[]) => {
    onChange(checkedValues)
    setDefaultSelectedState(checkedValues)
    setSelectedMembers(checkedValues?.length)
  }

  const onClearAll = () => {
    setSelectedMembers(0)
    setDefaultSelectedState([])
    onChange([])
  }

  return (
    <div className="min-w-[250px]">
      <p className="cursor-pointer select-none font-semibold" onClick={() => setShow(!show)}>{selectedMembers} Selected
        <ChevronDownIcon className={clsx("inline-block ml-4 transition", show && "rotate-180")} />
      </p>
      <div className={clsx("mt-4", show ? "block" : "hidden")}>
        {showSelect && (
          <Select
            className="mb-4"
            customWidth
            options={teamOptions}
            onSelect={(option) => setQueryParams({ team_id: option.value })}
          />
        )}
        {isLoading
          ? <div>Loading...</div>
          : (<>
            <Checkbox.Group
              value={defaultSelectedState}
              onChange={onChangeCheckbox}
            >
              <div className="grid grid-cols-3 gap-4">
                {data.map((item: any) => (
                  <div key={item.ID}>
                    <Checkbox value={item.ID}>{item.Name}</Checkbox>
                  </div>
                ))}
              </div>
            </Checkbox.Group>
            <div className="mt-4">
              <Button
                variant="dark"
                className="block float-right"
                onClick={onClearAll}
              >
                Clear
              </Button>
            </div>
          </>
          )}
      </div>
    </div>
  )
}

export default ToggleCheckbox
