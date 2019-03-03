import featureList from '@scripts/components/feature-list/feature-list';
import intro from '@scripts/components/intro/intro';
import slice from '@scripts/components/slice/slice';
import viewport from '@scripts/components/viewport/viewport';
import template from './home.html';

export default {
  name: 'home',
  components: {
    featureList,
    intro,
    slice,
    viewport
  },
  template
};
