import { CheckCircledIcon, CircleIcon } from '@radix-ui/react-icons'
import { classed } from '@tw-classed/react'
import { ComponentProps } from 'react'

const CheckboxButton = classed(
  'button',
  'h-6 w-6 shrink-0 rounded-full outline-none ring-0 ring-amber-400',
  'text-gray-400 hover:text-gray-700 dark:text-gray-700 hover:dark:text-gray-600 focus:text-amber-400 focus:ring-2'
)

interface Props extends ComponentProps<typeof CheckboxButton> {
  checked: boolean
}

export function TodoCheckbox({ checked, ...btnProps }: Props) {
  const Icon = checked ? CheckCircledIcon : CircleIcon

  return (
    <CheckboxButton {...btnProps}>
      <Icon className="h-6 w-6" />
    </CheckboxButton>
  )
}
