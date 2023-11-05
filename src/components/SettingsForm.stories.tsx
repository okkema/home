import type { Meta, StoryObj } from "@storybook/react"
import { SettingsForm } from "./SettingsForm"
import { DemoSettings } from "../demo";

const meta: Meta<typeof SettingsForm> = {
  component: SettingsForm,
  title: "SettingsForm"
}

export default meta

type Story = StoryObj<typeof SettingsForm>;

export const Primary: Story = {
  render: () => <SettingsForm {...DemoSettings} />,
}
