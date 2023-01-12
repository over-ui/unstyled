export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

import { withThemesProvider } from 'storybook-addon-styled-component-theme';
import { theme } from '../styles/theme';
import { addDecorator } from '@storybook/react';
import { ThemeProvider } from 'styled-components';

const themes = [theme];
addDecorator(withThemesProvider(themes), ThemeProvider);
