import { mount } from '@vue/test-utils';
import featureListItem from '@scripts/components/feature-list-item/feature-list-item';
import featureList from './feature-list';

describe('Feature List', () => {
  function mountComponent(slot = ''){
    return mount(featureList, { slots: { default: slot } });
  }

  it('should have appropriate css classes', () => {
    const wrapper = mountComponent();
    expect(wrapper.classes()).toEqual(['feature-list']);
  });

  it('should contain feature list items', () => {
    const wrapper = mountComponent();
    expect(wrapper.findAll(featureListItem).length).toEqual(4);
  });
});
