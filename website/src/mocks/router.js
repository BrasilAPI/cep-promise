import { createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';

const routes = [{ path: '/', name: 'home', component: { template: '<p>Home</p>'} }];
const routerMock = new VueRouter({  routes });
const localVueMock = createLocalVue();
localVueMock.use(VueRouter);

export { localVueMock, routerMock };
