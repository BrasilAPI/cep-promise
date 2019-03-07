import home from '@scripts/views/home/home';
import use from '@scripts/views/use/use';

const routes = [
  {
    path: '/',
    name: 'home',
    component: home
  },
  {
    path: '/use',
    name: 'use',
    component: use
  }
];

export default routes;
