import { shallowMount } from '@vue/test-utils';
import home from './home';

describe('Home View', () => {
  function mountComponent(){
    return shallowMount(home);
  }

  it('should contain a Hello heading', () => {
    const wrapper = mountComponent();
    expect(wrapper.find('h1').text()).toEqual('Hello!');
  });
});
