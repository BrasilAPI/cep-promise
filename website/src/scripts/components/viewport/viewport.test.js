import Vue from 'vue';
import { shallowMount } from '@vue/test-utils';
import topbar from '@scripts/components/topbar/topbar';
import viewport from './viewport';

describe('Viewport', () => {
  function mountComponent(slots){
    return shallowMount(viewport, { slots });
  }

  it('should have appropriate css classes', () => {
    const wrapper = mountComponent();
    expect(wrapper.classes()).toEqual(['viewport']);
  });

  it('should contain a topbar', () => {
    const wrapper = mountComponent();
    expect(wrapper.find(topbar)).toBeDefined();
  });

  it('should transclude some content', () => {
    const wrapper = mountComponent({ default: '<p>Hello!</p>' });
    expect(wrapper.find('p').text()).toEqual('Hello!');
  });

  it('should offset slices siblings to angled slices', () => {
    const topbarMock = { offsetHeight: 50 };
    const slicesMock = [
      { classList: { contains: jest.fn(() => true) }, offsetHeight: 400 },
      { classList: { contains: jest.fn(() => false) }, style: {} }
    ];
    const Constructor = Vue.extend(viewport);
    const vm = new Constructor().$mount();
    vm.$el.querySelectorAll = jest.fn(() => slicesMock);
    vm.$el.querySelector = jest.fn(() => topbarMock);
    vm.$mount();
    expect(slicesMock[1].style.marginTop).toEqual('350px');
  });
});
