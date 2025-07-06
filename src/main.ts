import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { DefaultApolloClient } from '@vue/apollo-composable';

import App from './App.vue';
import router from './router';
import apolloClient from './services/graphql';

import { createVuetify } from 'vuetify';
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
import './styles/main.scss';

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
});

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(vuetify);

app.provide(DefaultApolloClient, apolloClient);

app.mount('#app');
