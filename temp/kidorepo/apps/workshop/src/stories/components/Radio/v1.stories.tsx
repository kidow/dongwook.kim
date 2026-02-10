import type { Meta, StoryObj } from '@storybook/react'
import { Radio } from 'ui'

export default {
  title: 'components/Radio/v1',
  tags: ['autodocs'],
  component: Radio.v1,
  argTypes: {
    value: {
      type: 'string'
    },
    onChange: {
      type: 'function'
    },
    options: {
      type: {
        name: 'array',
        value: {
          name: 'object',
          value: {
            name: {
              name: 'string'
            },
            value: {
              name: 'string'
            },
            disabled: {
              name: 'boolean'
            }
          }
        }
      }
    },
    direction: {
      type: {
        name: 'enum',
        value: ['horizontal', 'vertical']
      }
    }
  }
} satisfies Meta<typeof Radio.v1>

type Story = StoryObj<typeof Radio.v1>

export const Default: Story = {
  args: {
    value: 'apple',
    options: [
      { name: 'Apple', value: 'apple' },
      { name: 'Amazon', value: 'amazon' },
      { name: 'Google', value: 'google' },
      { name: 'Tesla', value: 'tesla', disabled: true }
    ],
    direction: 'horizontal'
  }
}
