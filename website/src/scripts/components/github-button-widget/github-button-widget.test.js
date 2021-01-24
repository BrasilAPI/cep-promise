import { shallowMount } from '@vue/test-utils';
import githubButtonWidget from './github-button-widget';

describe('Github Button Widget', () => {
  function mountComponent(propsData){
    return shallowMount(githubButtonWidget, {propsData});
  }

  afterEach(() => {
    const tag = document.querySelector('[data-github-script-tag]');
    tag.remove();
  });

  it('should have appropriate css classes', () => {
    const wrapper = mountComponent();
    expect(wrapper.classes()).toEqual(['github-button-widget']);
  });

  it('should have a repository link', () => {
    const wrapper = mountComponent({
      username: 'user',
      repositoryName: 'repo'
    });
    expect(wrapper.vm.repositoryLink).toEqual('https://github.com/user/repo');
  });

  it('should have an aria label', () => {
    const wrapper = mountComponent({
      username: 'user',
      repositoryName: 'repo'
    });
    expect(wrapper.vm.ariaLabel).toEqual('Star user/repo on GitHub');
  });

  it('should append github script tag on body', () => {
    mountComponent();
    const tag = document.body.querySelector('[data-github-script-tag]');
    expect(tag.getAttribute('src')).toBeDefined();
  });

  it('should github script tag has source attribute', () => {
    mountComponent();
    const tag = document.body.querySelector('[data-github-script-tag]');
    expect(tag.getAttribute('src')).toEqual('https://buttons.github.io/buttons.js');
  });

  it('should not append more than one github script tag on body', () => {
    const tag = document.createElement('script');
    tag.setAttribute('data-github-script-tag','');
    document.body.appendChild(tag);
    mountComponent();
    const tags = document.body.querySelectorAll('[data-github-script-tag]');
    expect(tags.length).toEqual(1);
  });
});
