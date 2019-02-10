import { shallowMount } from '@vue/test-utils';
import logo from './logo';

describe('Logo', () => {
  function mountComponent(){
    return shallowMount(logo);
  }

  it('should have appropriate css classes', () => {
    const wrapper = mountComponent();
    expect(wrapper.classes()).toEqual(['logo']);
  });
});
