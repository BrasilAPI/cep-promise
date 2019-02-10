import '@styles/slice.styl';
import container from '@scripts/components/container/container';
import template from './slice.html';

export default {
  name: 'slice',
  props: ['theme'],
  components: {
    container
  },
  computed: {
    classes(){
      return {
        [`slice-${this.theme}`]: this.theme
      };
    }
  },
  template
};
