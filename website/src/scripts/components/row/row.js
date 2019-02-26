import '@styles/row.styl';
import template from './row.html';

export default {
  name: 'row',
  props: ['verticalOffset'],
  computed: {
    classes(){
      return this.verticalOffset ? `row-vertical-offset-${this.verticalOffset}` : '';
    }
  },
  template
};
