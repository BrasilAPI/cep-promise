import { shallowMount } from '@vue/test-utils';
import credits from './credits';

describe('Credits', () => {
  function mountComponent(){
    return shallowMount(credits);
  }

  it('should have appropriate css classes', () => {
    const wrapper = mountComponent();
    expect(wrapper.classes()).toEqual(['credits']);
  });

  it('should contain two paragraph', () => {
    const wrapper = mountComponent();
    expect(wrapper.findAll('p').length).toEqual(2);
  });

  it('should contain four links', () => {
    const wrapper = mountComponent();
    expect(wrapper.findAll('a').length).toEqual(4);
  });
});
