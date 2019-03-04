import '@styles/viewport.styl';
import credits from '@scripts/components/credits/credits';
import topbar from '@scripts/components/topbar/topbar';
import template from './viewport.html';

export default {
  name: 'viewport',
  components: {
    credits,
    topbar
  },
  props: ['topbarTheme'],
  mounted(){
    this.positionNotAngledSlices(this.getAllSlicesElements());
  },
  methods: {
    getAllSlicesElements(){
      return this.$el.querySelectorAll('[data-slice]');
    },
    positionNotAngledSlices(slices){
      for (var i = 0; i < slices.length; i++)
        if(this.shouldOffsetSiblingSlice(slices, i))
          this.offsetSlice(slices[i+1], this.calcOffsetAmount(slices[i]));
    },
    shouldOffsetSiblingSlice(slices, currentSliceIndex){
      return  this.isAngledSlice(slices[currentSliceIndex]) &&
              slices[currentSliceIndex+1] &&
              !this.isAngledSlice(slices[currentSliceIndex+1]);
    },
    isAngledSlice(slice){
      return slice.classList.contains('slice-angled');
    },
    calcOffsetAmount(slice){
      const topbarHeight = this.getTopbarHeight();
      return slice.offsetHeight - topbarHeight;
    },
    getTopbarHeight(){
      return this.$el.querySelector('[data-topbar]').offsetHeight;
    },
    offsetSlice(slice, offsetAmount){
      slice.style.marginTop = `${offsetAmount}px`;
    }
  },
  template
};
