import '@styles/viewport.styl';
import credits from '@scripts/components/credits/credits';
import topbar from '@scripts/components/topbar/topbar';
import sliceService from '@scripts/services/slice/slice';
import template from './viewport.html';

export default {
  name: 'viewport',
  components: {
    credits,
    topbar
  },
  props: ['topbarTheme'],
  mounted(){
    sliceService.positionNotAngledSlices(this.$el);
  },
  template
};
