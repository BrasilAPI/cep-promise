import { mount } from '@vue/test-utils';
import rowItem from './row-item';

describe('Row Item', () => {
  let propsDataMock;

  function mockPropsData(){
    propsDataMock = {
      label: 'Email',
      value: 'hello@rafaelcamargo.com',
      size: '3'
    };
  }

  beforeEach(() => {
    mockPropsData();
  });

  it('should set size css class if size was passed', () => {
    const wrapper = mount(rowItem, {
      propsData: propsDataMock
    });
    expect(wrapper.classes()).toContain('row-item-size-3');
  });

  it('should not set size css class if no size was passed', () => {
    delete propsDataMock.size;
    const wrapper = mount(rowItem, {
      propsData: propsDataMock
    });
    expect(wrapper.classes()).not.toContain('row-item-size-3');
  });

  it('should render some label if label was passed', () => {
    const wrapper = mount(rowItem, {
      propsData: propsDataMock
    });
    expect(wrapper.contains('.row-item-label')).toBe(true);
    expect(wrapper.find('.row-item-label').text()).toBe('Email');
  });

  it('should not render some label if no label was passed', () => {
    delete propsDataMock.label;
    const wrapper = mount(rowItem, {
      propsData: propsDataMock
    });
    expect(wrapper.contains('.row-item-label')).toBe(false);
  });

  it('should render some value if value was passed', () => {
    const wrapper = mount(rowItem, {
      propsData: propsDataMock
    });
    expect(wrapper.contains('.row-item-value')).toBe(true);
    expect(wrapper.find('.row-item-value').text()).toBe('hello@rafaelcamargo.com');
  });

  it('should not render some value if no value was passed', () => {
    delete propsDataMock.value;
    const wrapper = mount(rowItem, {
      propsData: propsDataMock
    });
    expect(wrapper.contains('.row-item-value')).toBe(false);
  });

  it('should render default slot', () => {
    const wrapper = mount(rowItem, {
      slots: {
        default: '<p>hello!</p>'
      }
    });
    expect(wrapper.find('p').text()).toEqual('hello!');
  });
});
