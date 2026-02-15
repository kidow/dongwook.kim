import type { Meta, StoryObj } from '@storybook/react'
import { Pagination } from 'ui'

export default {
  title: 'components/Pagination/v1',
  tags: ['autodocs'],
  component: Pagination.v1,
  argTypes: {
    page: {
      type: 'number',
      defaultValue: 1
    },
    total: {
      type: 'number',
      defaultValue: 0
    },
    size: {
      type: 'number'
    },
    onChange: {
      type: 'function'
    }
  }
} satisfies Meta<typeof Pagination.v1>

type Story = StoryObj<typeof Pagination.v1>

export const Default: Story = {
  args: {
    page: 1,
    total: 100,
    size: 10
  }
}
