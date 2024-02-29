import { shallowMount } from '@vue/test-utils';
import { localVueMock, routerMock } from '@mocks/router';
import container from '@scripts/components/container/container';
import logo from '@scripts/components/logo/logo';
import navmenu from '@scripts/components/navmenu/navmenu';
import topbar from './topbar';

describe('Topbar', () => {
  function mountComponent(propsData){
    return shallowMount(topbar, {
      propsData,
      localVue: localVueMock,
      router: routerMock
    });
  }

  it('should have appropriate css classes', () => {
    const wrapper = mountComponent();
    expect(wrapper.classes()).toEqual(['topbar']);
  });

  it('should render a themed topbar', () => {
    const wrapper = mountComponent({ theme: 'negative' });
    expect(wrapper.classes('topbar-negative')).toBe(true);
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
