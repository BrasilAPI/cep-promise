import '@styles/feature-list-item.styl';
import template from './feature-list-item.html';

export default {
  name: 'feature-list-item',
  props: ['image', 'title'],
  data(){
    return {
      imageCssClass: ''
    };
  },
  created(){
    this.setImageCssClass(this.image);
  },
  methods: {
    setImageCssClass(image){
      this.imageCssClass = image ? `feature-list-item-image-${image}` : '';
    }
  },
  template
};
