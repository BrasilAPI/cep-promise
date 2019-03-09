import { mount } from '@vue/test-utils';
import loader from './loader';

describe('Loader', () => {
  function mountComponent(){
    return mount(loader);
  }

  it('should have appropriate css classes', () => {
    const wrapper = mountComponent();
    expect(wrapper.classes()).toEqual(['loader']);
  });
});
