import '@images/cep-promise-288x288.png';
import ENV from '@environment';

const _public = {};
const DEFAULT_IMAGE_FILENAME = 'cep-promise-288x288.png';

_public.buildHead = ({ title, description, keywords, imageFilename }) => {
  return {
    title: {
      inner: title
    },
    meta: [
      { name: 'application-name', content: '' },
      { name: 'description', content: description, id: 'desc' },
      { name: 'keywords', content: keywords },
      // Twitter
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:site', content: '@ceppromise' },
      { name: 'twitter:creator', content: '@ceppromise' },
      // Google+ / Schema.org
      { itemprop: 'name', content: title },
      { itemprop: 'desc', content: description },
      // Facebook / Open Graph
      { property: 'og:title', content: title },
      { property: 'og:image', content: buildImageUrl(imageFilename) }
    ]
  };
};

function buildImageUrl(filename = DEFAULT_IMAGE_FILENAME){
  return `${ENV.APP.BASE_URL}/images/${filename}`;
}

export default _public;
