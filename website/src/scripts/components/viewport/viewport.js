import '@styles/viewport.styl';
import topbar from '@scripts/components/topbar/topbar';
import template from './viewport.html';

export default {
  name: 'viewport',
  components: {
    topbar
  },
  props: ['topbarTheme'],
  template
};
