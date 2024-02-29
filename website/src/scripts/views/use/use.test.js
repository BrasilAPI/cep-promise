import { shallowMount } from '@vue/test-utils';
import usage from '@scripts/components/usage/usage';
import viewport from '@scripts/components/viewport/viewport';
import use from './use';

describe('Use View', () => {
  function mountComponent(){
    return shallowMount(use);
  }

  it('should contain a viewport', () => {
    const wrapper = mountComponent();
    expect(wrapper.find(viewport)).toBeDefined();
  });

  it('should contain an usage', () => {
    const wrapper = mountComponent();
    expect(wrapper.find(usage)).toBeDefined();
  });
});
