import { shallowMount } from '@vue/test-utils';
import intro from '@scripts/components/intro/intro';
import viewport from '@scripts/components/viewport/viewport';
import home from './home';

describe('Home View', () => {
  function mountComponent(){
    return shallowMount(home);
  }

  it('should contain a viewport', () => {
    const wrapper = mountComponent();
    expect(wrapper.find(viewport)).toBeDefined();
  });

  it('should contain a angled slice', () => {
    const wrapper = mountComponent();
    expect(wrapper.find('slice-stub').attributes('theme')).toBe('angled');
  });

  it('should contain a intro', () => {
    const wrapper = mountComponent();
    expect(wrapper.find(intro)).toBeDefined();
  });
});
