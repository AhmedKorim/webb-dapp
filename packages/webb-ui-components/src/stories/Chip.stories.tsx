import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Chip } from '@webb-dapp/webb-ui-components/components';
import '@webb-dapp/webb-ui-components/tailwind.css';
import { twMerge } from 'tailwind-merge';

//👇 This default export determines where your story goes in the story list
export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Molecules/Chip',
  component: Chip,
} as ComponentMeta<typeof Chip>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Chip> = (args) => <Chip {...args}>Active </Chip>;

export const Color = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Color.args = {
  color:'green',
};
