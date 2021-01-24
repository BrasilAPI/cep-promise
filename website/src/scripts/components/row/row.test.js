import { shallowMount } from '@vue/test-utils';
import row from './row';

describe('Row', () => {
  function mountComponent(propsData, slots){
    return shallowMount(row, {propsData, slots});
  }

  it('should render default slot', () => {
    const wrapper = mountComponent(null, {
      default: '<p>hello!</p>'
    });
    expect(wrapper.contains('p')).toBe(true);
    expect(wrapper.find('p').text()).toEqual('hello!');
  });

  it('should allow vertical offset option', () => {
    const wrapper = mountComponent({ verticalOffset: 3 });
    expect(wrapper.classes().includes('row-vertical-offset-3')).toEqual(true);
  });
});
