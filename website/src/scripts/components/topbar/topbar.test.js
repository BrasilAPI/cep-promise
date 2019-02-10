import { shallowMount } from '@vue/test-utils';
import container from '@scripts/components/container/container';
import logo from '@scripts/components/logo/logo';
import topbar from './topbar';

describe('Topbar', () => {
  function mountComponent(){
    return shallowMount(topbar);
  }

  it('should contain a container', () => {
    const wrapper = mountComponent();
    expect(wrapper.find(container)).toBeDefined();
  });

  it('should contain a logo', () => {
    const wrapper = mountComponent();
    expect(wrapper.find(logo)).toBeDefined();
  });
});
