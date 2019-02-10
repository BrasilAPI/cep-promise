import { shallowMount } from '@vue/test-utils';
import container from './container';

describe('Container', () => {
  function mountComponent(slots){
    return shallowMount(container, { slots });
  }

  it('should have appropriate css classes', () => {
    const wrapper = mountComponent();
    expect(wrapper.classes()).toEqual(['container']);
  });

  it('should transclude some content', () => {
    const wrapper = mountComponent({ default: '<p>Hello!</p>' });
    expect(wrapper.find('p').text()).toEqual('Hello!');
  });
});
