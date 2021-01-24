import { shallowMount } from '@vue/test-utils';
import codeSample from '@scripts/components/code-sample/code-sample';
import slice from '@scripts/components/slice/slice';
import usage from './usage';

describe('Usage', () => {
  function mountComponent(){
    return shallowMount(usage);
  }

  it('should have appropriate css classes', () => {
    const wrapper = mountComponent();
    expect(wrapper.classes()).toEqual(['usage']);
  });

  it('should contain four slices', () => {
    const wrapper = mountComponent();
    expect(wrapper.findAll(slice).length).toEqual(4);
  });

  it('should contain four headings', () => {
    const wrapper = mountComponent();
    expect(wrapper.findAll('h2').length).toEqual(4);
  });

  it('should contain four paragraphs', () => {
    const wrapper = mountComponent();
    expect(wrapper.findAll('p').length).toEqual(4);
  });

  it('should contain four code samples', () => {
    const wrapper = mountComponent();
    expect(wrapper.findAll(codeSample).length).toEqual(4);
  });
});
