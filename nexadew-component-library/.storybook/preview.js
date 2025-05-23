// .storybook/preview.cjs
const { fn } = require("@storybook/test");

module.exports = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  argTypes: {
    onClick: { action: fn() },
  },
};