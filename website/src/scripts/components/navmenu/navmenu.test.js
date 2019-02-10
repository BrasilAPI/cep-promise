import { shallowMount } from '@vue/test-utils';
import navmenu from './navmenu';

describe('Nav Menu', () => {
  function mountComponent(){
    return shallowMount(navmenu);
  }

  it('should have appropriate css classes', () => {
    const wrapper = mountComponent();
    expect(wrapper.classes()).toEqual(['navmenu']);
  });
});
