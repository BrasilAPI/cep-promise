import { shallowMount } from '@vue/test-utils';
import container from '@scripts/components/container/container';
import slice from './slice';

describe('Slice', () => {
  function mountComponent(propsData, slots){
    return shallowMount(slice, {propsData, slots});
  }

  it('should have appropriate css classes', () => {
    const wrapper = mountComponent();
    expect(wrapper.classes()).toEqual(['slice']);
  });

  it('should contain a container', () => {
    const wrapper = mountComponent();
    expect(wrapper.find(container)).toBeDefined();
  });

  it('should transclude some content', () => {
    const wrapper = mountComponent(undefined, { default: '<p>Hello!</p>' });
    expect(wrapper.find('p').text()).toEqual('Hello!');
  });

  it('should optionally render an angled slice', () => {
    const wrapper = mountComponent({theme: 'angled'});
    expect(wrapper.classes()).toEqual(['slice', 'slice-angled']);
  });
});
