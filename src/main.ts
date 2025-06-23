import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { DefaultApolloClient } from '@vue/apollo-composable';

import App from './App.vue';
import router from './router';
import apolloClient from './services/graphql';

import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import 'vuetify/styles';

import '@mdi/font/css/materialdesignicons.css';
import './styles/main.scss';

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
  },
});

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(vuetify);

app.provide(DefaultApolloClient, apolloClient);

app.mount('#app');
