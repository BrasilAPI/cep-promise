import Vue from 'vue';
import { mount } from '@vue/test-utils';
import Prism from 'prismjs';
import codeSample from './code-sample';

describe('Code Sample', () => {
  function mountComponent(propsData, slots){
    return mount(codeSample, { propsData, slots });
  }

  beforeEach(() => {
    Prism.highlight = jest.fn(code => code);
  });

  it('should have appropriate css classes', () => {
    const wrapper = mountComponent();
    expect(wrapper.classes()).toEqual(['code-sample']);
  });

  it('should render a plain text if no language has been provided', () => {
    const plainText = 'npm install cep-promise --save';
    const wrapper = mountComponent({}, { default: plainText });
    expect(wrapper.find('code').text()).toEqual(plainText);
  });

  it('should render a highlighted code if language has been provided', () => {
    const code = '<p>Hello</p>';
    const Constructor = Vue.extend(codeSample);
    const vm = new Constructor({
      propsData: {language: 'html'},
      slots: { default: code }
    }).$mount();
    vm.$el.querySelector = jest.fn(() => {
      return { innerText: code };
    });
    vm.$mount();
    expect(Prism.highlight.mock.calls[1][0]).toEqual(code);
    expect(typeof Prism.highlight.mock.calls[1][1]).toEqual('object');
    expect(Prism.highlight.mock.calls[1][2]).toEqual('html');
    expect(vm.$el.querySelector('code').innerText).toEqual(code);
  });

  it('should update highlighted code on code update', () => {
    const code = 'function greet(){ alert("Hello!"); }';
    const wrapper = mountComponent({language: 'javascript'});
    wrapper.setProps({ code });
    expect(Prism.highlight.mock.calls[1][0]).toEqual(code);
    expect(typeof Prism.highlight.mock.calls[1][1]).toEqual('object');
    expect(Prism.highlight.mock.calls[1][2]).toEqual('javascript');
  });
});
