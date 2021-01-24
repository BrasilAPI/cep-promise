import { shallowMount } from '@vue/test-utils';
import sandbox from '@scripts/components/sandbox/sandbox';
import viewport from '@scripts/components/viewport/viewport';
import trial from './trial';

describe('Trial View', () => {
  function mountComponent(){
    return shallowMount(trial);
  }

  it('should contain a viewport', () => {
    const wrapper = mountComponent();
    expect(wrapper.find(viewport)).toBeDefined();
  });

  it('should contain a slice', () => {
    const wrapper = mountComponent();
    expect(wrapper.find('slice-stub')).toBeDefined();
  });

  it('should contain a sandbox', () => {
    const wrapper = mountComponent();
    expect(wrapper.find(sandbox)).toBeDefined();
  });
});
