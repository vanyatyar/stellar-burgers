import { FeedInfoUI } from '@ui';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Example/FeedInfo',
  component: FeedInfoUI,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered'
  }
} satisfies Meta<typeof FeedInfoUI>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultFeedInfo: Story = {
  args: {
    feed: {
      total: 12345,
      totalToday: 123
    },
    readyOrders: [
      9000, 9002, 9004, 9006, 9008, 9010, 9012, 9014, 9016, 9018, 9020, 9022,
      9024, 9026, 9028, 9030, 9032, 9034, 9036, 9038
    ],
    pendingOrders: [
      9001, 9003, 9005, 9007, 9009, 9011, 9013, 9015, 9017, 9019, 9021, 9023,
      9025, 9027, 9029, 9031, 9033, 9035, 9037, 9039
    ]
  }
};
