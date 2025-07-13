import type { Preview } from '@storybook/vue3-vite';
import { setup } from '@storybook/vue3';
import { createVuetify } from 'vuetify';
import { mdiSvgIconSet, vuetifyIconAliases } from '../src/plugins/vuetify-icons';
import {
  VApp,
  VAppBar,
  VMain,
  VFooter,
  VContainer,
  VRow,
  VCol,
  VCard,
  VCardTitle,
  VCardText,
  VCardActions,
  VCardSubtitle,
  VBtn,
  VBtnGroup,
  VTextField,
  VSelect,
  VCombobox,
  VFileInput,
  VForm,
  VDialog,
  VChip,
  VIcon,
  VImg,
  VProgressCircular,
  VProgressLinear,
  VPagination,
  VSpacer,
  VToolbar,
  VToolbarTitle,
  VToolbarItems,
  VSnackbar,
  VAlert,
  VCheckbox,
  VSlider,
} from 'vuetify/components';
import { Intersect, Ripple } from 'vuetify/directives';
import 'vuetify/styles';
import '../src/styles/main.scss';

const vuetify = createVuetify({
  components: {
    VApp,
    VAppBar,
    VMain,
    VFooter,
    VContainer,
    VRow,
    VCol,
    VCard,
    VCardTitle,
    VCardText,
    VCardActions,
    VCardSubtitle,
    VBtn,
    VBtnGroup,
    VTextField,
    VSelect,
    VCombobox,
    VFileInput,
    VForm,
    VDialog,
    VChip,
    VIcon,
    VImg,
    VProgressCircular,
    VProgressLinear,
    VPagination,
    VSpacer,
    VToolbar,
    VToolbarTitle,
    VToolbarItems,
    VSnackbar,
    VAlert,
    VCheckbox,
    VSlider,
  },
  directives: {
    Intersect,
    Ripple,
  },
  icons: {
    defaultSet: 'mdiSvg',
    aliases: vuetifyIconAliases,
    sets: {
      mdiSvg: mdiSvgIconSet,
    },
  },
});

setup((app) => {
  app.use(vuetify);
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'padded',
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#f5f5f5',
        },
        {
          name: 'dark',
          value: '#121212',
        },
      ],
    },
  },
  decorators: [
    (story) => ({
      components: { story },
      template: '<v-app><story /></v-app>',
    }),
  ],
};

export default preview;