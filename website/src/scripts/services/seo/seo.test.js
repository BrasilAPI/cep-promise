import seoService from './seo';

describe('SEO Service', () => {
  function buildViewData(){
    return {
      title: 'Title',
      description: 'Description',
      keywords: 'Keywords',
      imageFilename: 'test.png'
    };
  }

  it('should build seo items', () => {
    expect(seoService.buildHead(buildViewData())).toEqual({
      title: {
        inner: 'Title'
      },
      meta: [
        { name: 'application-name', content: '' },
        { name: 'description', content: 'Description', id: 'desc' },
        { name: 'keywords', content: 'Keywords' },
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:title', content: 'Title' },
        { name: 'twitter:description', content: 'Description' },
        { name: 'twitter:site', content: '@ceppromise' },
        { name: 'twitter:creator', content: '@ceppromise' },
        { itemprop: 'name', content: 'Title' },
        { itemprop: 'desc', content: 'Description' },
        { property: 'og:title', content: 'Title' },
        { property: 'og:image', content: 'http://localhost:7000/images/test.png' }
      ]
    });
  });

  it('should build seo items with default image if no image filename has been provided', () => {
    const viewData = buildViewData();
    delete viewData.imageFilename;
    expect(seoService.buildHead(viewData)).toEqual({
      title: {
        inner: 'Title'
      },
      meta: [
        { name: 'application-name', content: '' },
        { name: 'description', content: 'Description', id: 'desc' },
        { name: 'keywords', content: 'Keywords' },
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:title', content: 'Title' },
        { name: 'twitter:description', content: 'Description' },
        { name: 'twitter:site', content: '@ceppromise' },
        { name: 'twitter:creator', content: '@ceppromise' },
        { itemprop: 'name', content: 'Title' },
        { itemprop: 'desc', content: 'Description' },
        { property: 'og:title', content: 'Title' },
        { property: 'og:image', content: 'http://localhost:7000/images/cep-promise-288x288.png' }
      ]
    });
  });
});
