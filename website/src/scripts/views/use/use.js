import seoService from '@scripts/services/seo/seo';
import usage from '@scripts/components/usage/usage';
import viewport from '@scripts/components/viewport/viewport';
import template from './use.html';

const head = seoService.buildHead({
  title: 'Cep Promise: Use.',
  description: 'Veja aqui diversos exemplos de uso e seus respectivos resultados.',
  keywords: 'cep, promise, exemplos'
});

export default {
  name: 'use-view',
  components: {
    usage,
    viewport
  },
  head,
  template
};
