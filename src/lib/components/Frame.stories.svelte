<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Frame from './Frame.svelte';

  // More on how to set up stories at: https://storybook.js.org/docs/writing-stories
  const { Story } = defineMeta({
    title: 'Components/Frame',
    component: Frame,
    tags: ['autodocs'],
    // argTypes: {
    //   backgroundColor: { control: 'color' },
    //   size: {
    //     control: { type: 'select' },
    //     options: ['small', 'medium', 'large'],
    //   },
    // },
    // args: {
    //   onClick: fn(),
    // }
  });
</script>

<Story name="Default" args={{ variant: 'full', size: 'md' }}>
    Hello
</Story>
