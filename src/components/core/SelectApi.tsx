import { Select, Spin } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { useFindAll } from '@/hooks/core/useFindAll'
import debounce from 'lodash.debounce'
import BaseEntity from '@/sdk/model/entities/BaseEntity'
import { AbstractService } from '@/sdk/model/core/AbstractService'

interface SelectApiProps<Entity extends BaseEntity> {
  service: AbstractService<Entity>
  endpoint?: string
  querySearch?: (search: string) => Record<string, unknown>
  queryParams?: Record<string, unknown>
  queryKey: string | string[]
  value?: Entity | null
  onChange?: (value?: Entity) => void
  placeholder?: string
  renderOption?: (item: Entity) => React.ReactNode
}

export default function SelectApi<Entity extends BaseEntity>({
  service,
  endpoint,
  querySearch,
  queryParams,
  queryKey,
  value,
  onChange,
  placeholder = 'Select...',
  renderOption,
}: SelectApiProps<Entity>) {
  const [loaded, setLoaded] = useState(false)
  const [text, setText] = useState('')
  const [textDebounce, setTextDebounce] = useState('')

  const debounceText = useMemo(
    () => debounce((val: string) => setTextDebounce(val), 400),
    []
  )

  useEffect(() => {
    debounceText(text)
    return () => debounceText.cancel()
  }, [text, debounceText])

  const resolvedQuerySearch = useMemo(
    () => querySearch?.(textDebounce),
    [querySearch, textDebounce]
  )

  const { data: queryData, isLoading } = useFindAll({
    service,
    queryKey: queryKey,
    endpoint,
    queryParams: {
      ...resolvedQuerySearch,
      ...queryParams,
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  })

  const options = loaded && queryData?.data ? queryData.data : []

  return (
    <Select
      labelInValue
      value={
        value
          ? {
              value: value.id,
              label: renderOption
                ? renderOption(value)
                : value.name || value.id,
            }
          : undefined
      }
      onChange={(option) => {
        const selected = options.find((item) => item.id === option?.value)
        onChange?.(selected)
      }}
      placeholder={placeholder}
      style={{ width: '100%' }}
      showSearch
      allowClear
      loading={isLoading && !loaded}
      // 🔥 search remoto
      filterOption={false}
      onSearch={(val) => setText(val)}
      onDropdownVisibleChange={(open) => {
        if (open) setLoaded(true)
      }}
    >
      {isLoading && !loaded && (
        <Select.Option value="" disabled>
          <Spin size="small" />
        </Select.Option>
      )}

      {value && !options.find((opt) => opt.id === value.id) && (
        <Select.Option key={value.id} value={value.id}>
          {renderOption ? renderOption(value) : value.name || value.id}
        </Select.Option>
      )}

      {options.map((item) => (
        <Select.Option key={item.id} value={item.id}>
          {renderOption ? renderOption(item) : item.name || item.id}
        </Select.Option>
      ))}
    </Select>
  )
}
