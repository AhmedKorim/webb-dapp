// YourComponent.stories.ts|tsx

import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import '@webb-dapp/webb-ui-components/tailwind.css';
import { Chip } from '@webb-dapp/webb-ui-components/src/components/Chip';

//👇 This default export determines where your story goes in the story list
export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Molecules/Chip',
  component: Chip,
} as ComponentMeta<typeof Chip>;

//👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof Chip> = (args) => <Chip {...args} />;

export const FirstStory = Template.bind({});

FirstStory.args = {
  color: 'green'  
  /*👇 The args you need here will depend on your component */
};