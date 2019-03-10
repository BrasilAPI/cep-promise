import seoService from '@scripts/services/seo/seo';
import featureList from '@scripts/components/feature-list/feature-list';
import installation from '@scripts/components/installation/installation';
import intro from '@scripts/components/intro/intro';
import slice from '@scripts/components/slice/slice';
import viewport from '@scripts/components/viewport/viewport';
import template from './home.html';

const head = seoService.buildHead({
  title: 'Cep Promise: Simplesmente deslumbrante.',
  description: 'Consulte endereços postais da maneira mais fácil que você já viu.',
  keywords: 'cep, javascript, promise, código de endereço postal'
});

export default {
  name: 'home-view',
  components: {
    featureList,
    installation,
    intro,
    slice,
    viewport
  },
  head,
  template
};
