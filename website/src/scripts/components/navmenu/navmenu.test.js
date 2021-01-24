import { shallowMount } from '@vue/test-utils';
import { localVueMock, routerMock } from '@mocks/router';
import navmenu from './navmenu';

describe('Nav Menu', () => {
  function mountComponent(){
    return shallowMount(navmenu, {
      localVue: localVueMock,
      router: routerMock
    });
  }

  it('should have appropriate css classes', () => {
    const wrapper = mountComponent();
    expect(wrapper.classes()).toEqual(['navmenu']);
  });
});
