import { mount } from '@vue/test-utils';
import featureListItem from './feature-list-item';

describe('Feature List Item', () => {
  function mountComponent(propsData, slot = ''){
    return mount(featureListItem, { propsData, slots: { default: slot } });
  }

  it('should have appropriate css classes', () => {
    const wrapper = mountComponent();
    expect(wrapper.classes()).toEqual(['feature-list-item']);
  });

  it('should set image css class if image has been provided', () => {
    const wrapper = mountComponent({ image: 'cogs' });
    expect(wrapper.find('div').classes()).toContain('feature-list-item-image-cogs');
  });

  it('should set title', () => {
    const wrapper = mountComponent({ title: 'Some Title' });
    expect(wrapper.find('h2').text()).toEqual('Some Title');
  });

  it('should set content', () => {
    const wrapper = mountComponent({}, 'Some text');
    expect(wrapper.find('p').text()).toEqual('Some text');
  });
});
