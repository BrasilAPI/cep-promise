import '@styles/btn.styl';
import template from './btn.html';

export default {
  name: 'btn',
  props: [
    'theme',
    'size'
  ],
  computed: {
    classes() {
      return {
        [`btn-${this.theme}`]: ['primary'].includes(this.theme),
        [`btn-${this.size}`]: ['small'].includes(this.size)
      };
    },
  },
  template
};
