/** @type { import('@storybook/react').Preview } */
import '../src/index.css'; // Remove if not needed

const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewport: {
      viewports: {
        mobile1: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1280px',
            height: '720px',
          },
        },
      },
    },
  },
};

export default preview;