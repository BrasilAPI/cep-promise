import '@styles/row-item.styl';
import template from './row-item.html';

export default {
  name: 'row-item',
  props: ['label', 'value', 'size'],
  data(){
    return {
      sizeCssClass: ''
    };
  },
  created(){
    this.setSizeCssClass(this.size);
  },
  methods: {
    setSizeCssClass(size){
      this.sizeCssClass = size ? `row-item-size-${size}` : '';
    }
  },
  template
};
