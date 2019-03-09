import home from '@scripts/views/home/home';
import use from '@scripts/views/use/use';
import trial from '@scripts/views/trial/trial';

const routes = [
  {
    path: '/',
    name: 'home',
    component: home
  },
  {
    path: '/experimente',
    name: 'trial',
    component: trial
  },
  {
    path: '/use',
    name: 'use',
    component: use
  }
];

export default routes;
