import { shallowMount } from '@vue/test-utils';
import { localVueMock, routerMock } from '@mocks/router';
import demo from '@scripts/components/demo/demo';
import intro from './intro';

describe('Intro', () => {
  function mountComponent(){
    return shallowMount(intro, {
      localVue: localVueMock,
      router: routerMock
    });
  }

  it('should have appropriate css classes', () => {
    const wrapper = mountComponent();
    expect(wrapper.classes()).toEqual(['intro']);
  });

  it('should contain a heading', () => {
    const wrapper = mountComponent();
    expect(wrapper.find('h1').text()).toEqual('Simplicidade deslumbrante.');
  });

  it('should contain a paragraph', () => {
    const wrapper = mountComponent();
    expect(wrapper.find('p').text()).toEqual('Consulte endereços postais da maneira mais fácil que você já viu.');
  });

  it('should contain a button', () => {
    const wrapper = mountComponent();
    expect(wrapper.find(demo)).toBeDefined();
    expect(wrapper.find('btn-stub').text()).toEqual('Experimente');
  });

  it('should contain a demo', () => {
    const wrapper = mountComponent();
    expect(wrapper.find(demo)).toBeDefined();
  });
});
