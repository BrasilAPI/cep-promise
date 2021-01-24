import { mount } from '@vue/test-utils';
import btn from './btn';

describe('Btn', () => {

  function createComponent(propsData, slots){
    return mount(btn, { propsData, slots });
  }

  it('should render a default btn', () => {
    const wrapper = createComponent();
    expect(wrapper.classes()).toContain('btn');
  });

  it('should render a primary btn', () => {
    const wrapper = createComponent({theme: 'primary'});
    expect(wrapper.classes()).toContain('btn-primary');
  });

  it('should render a secondary btn', () => {
    const wrapper = createComponent({theme: 'secondary'});
    expect(wrapper.classes()).toContain('btn-secondary');
  });

  it('should render a small btn', () => {
    const wrapper = createComponent({size: 'small'});
    expect(wrapper.classes()).toContain('btn-small');
  });

  it('should transclude some content', () => {
    const content = 'Some Text';
    const wrapper = createComponent({}, {default: `<p>${content}</p>`});
    expect(wrapper.find('p').text()).toContain(content);
  });

});
