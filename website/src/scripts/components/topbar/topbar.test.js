import { shallowMount } from '@vue/test-utils';
import container from '@scripts/components/container/container';
import logo from '@scripts/components/logo/logo';
import navmenu from '@scripts/components/navmenu/navmenu';
import topbar from './topbar';

describe('Topbar', () => {
  function mountComponent(){
    return shallowMount(topbar);
  }

  it('should have appropriate css classes', () => {
    const wrapper = mountComponent();
    expect(wrapper.classes()).toEqual(['topbar']);
  });

  it('should contain a container', () => {
    const wrapper = mountComponent();
    expect(wrapper.find(container)).toBeDefined();
  });

  it('should contain a logo', () => {
    const wrapper = mountComponent();
    expect(wrapper.find(logo)).toBeDefined();
  });

  it('should contain a navigation menu', () => {
    const wrapper = mountComponent();
    expect(wrapper.find(navmenu)).toBeDefined();
  });
});
