import '@styles/topbar.styl';
import container from '@scripts/components/container/container';
import logo from '@scripts/components/logo/logo';
import navmenu from '@scripts/components/navmenu/navmenu';
import template from './topbar.html';

export default {
  name: 'topbar',
  components: {
    container,
    logo,
    navmenu
  },
  props: ['theme'],
  computed: {
    classes() {
      return {
        [`topbar-${this.theme}`]: ['negative'].includes(this.theme)
      };
    },
  },
  template
};
