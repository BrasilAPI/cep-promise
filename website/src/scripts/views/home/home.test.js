import { shallowMount } from '@vue/test-utils';
import viewport from '@scripts/components/viewport/viewport';
import home from './home';

describe('Home View', () => {
  function mountComponent(){
    return shallowMount(home);
  }

  it('should contain a Hello heading', () => {
    const wrapper = mountComponent();
    expect(wrapper.find('h1').text()).toEqual('Hello!');
  });

  it('should contain a viewport', () => {
    const wrapper = mountComponent();
    expect(wrapper.find(viewport)).toBeDefined();
  });
});
