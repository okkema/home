import type { Meta, StoryObj } from "@storybook/react"
import { Home } from "./Home"
import { DemoSettings } from "../demo";

const meta: Meta<typeof Home> = {
  component: Home,
  title: "Home"
}

export default meta

type Story = StoryObj<typeof Home>;

export const Primary: Story = {
  render: () => <Home {...DemoSettings} />,
}
