import type { StorybookConfig } from '@storybook/vue3-vite';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-links",
    "@storybook/addon-a11y",
    "@storybook/addon-docs"
  ],
  "framework": {
    "name": "@storybook/vue3-vite",
    "options": {}
  },
  "staticDirs": ["../public"],
  "viteFinal": async (config) => {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': '/src',
      };
    }
    return config;
  },
};
export default config;