import seoService from '@scripts/services/seo/seo';
import sandbox from '@scripts/components/sandbox/sandbox';
import slice from '@scripts/components/slice/slice';
import viewport from '@scripts/components/viewport/viewport';
import template from './trial.html';

const head = seoService.buildHead({
  title: 'Cep Promise: Experimente.',
  description: 'Experimente a lib no próprio browser. Faça uma consulta e confira tanto sua resposta quanto o código que a produziu.',
  keywords: 'cep, promise, experimente'
});

export default {
  name: 'trial-view',
  components: {
    sandbox,
    slice,
    viewport
  },
  head,
  template
};
