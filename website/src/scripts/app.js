import '@styles/_native.styl';
import Vue from 'vue';
import VueRouter from 'vue-router';
import ENV from '@environment';
import routes from './routes';
import routeService from '@scripts/services/route/route';
import analyticsService from '@scripts/services/analytics/analytics';
import template from './app.html';

Vue.use(VueRouter);

const router = new VueRouter({
  routes,
  mode: 'history'
});

routeService.setRouter(router);
analyticsService.init(ENV.ANALYTICS);

const app = {
  name: 'app',
  template
};

/* eslint-disable no-unused-vars */
const mountedApp = new Vue({
  el: '[data-app]',
  router,
  render: h => h(app),
  mounted () {
    document.dispatchEvent(new Event('render-event'));
  }
});
