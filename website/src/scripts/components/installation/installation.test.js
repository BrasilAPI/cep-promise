import { shallowMount } from '@vue/test-utils';
import installation from './installation';

describe('Installation', () => {
  function mountComponent(){
    return shallowMount(installation);
  }

  it('should have appropriate css classes', () => {
    const wrapper = mountComponent();
    expect(wrapper.classes()).toEqual(['installation']);
  });

  it('should contain two paragraphs', () => {
    const wrapper = mountComponent();
    expect(wrapper.findAll('p').length).toEqual(2);
  });

  it('should contain two code samples', () => {
    const wrapper = mountComponent();
    expect(wrapper.findAll('code-sample-stub').length).toEqual(2);
  });
});
