import { shallowMount } from '@vue/test-utils';
import sandbox from './sandbox';

describe('Sandbox', () => {
  function mountComponent(){
    return shallowMount(sandbox);
  }

  beforeEach(() => {
    window.cep = jest.fn(() => Promise.resolve({}));
  });

  it('should have appropriate css classes', () => {
    const wrapper = mountComponent();
    expect(wrapper.classes()).toEqual(['sandbox']);
  });

  it('should set sample code on create', () => {
    const wrapper = mountComponent();
    expect(wrapper.vm.code).toEqual(`
const cep = require('cep-promise');

cep().then(console.log, console.log);`);
  });

  it('should update code on CEP change', () => {
    const wrapper = mountComponent();
    wrapper.setData({cep: '04.551-010'});
    expect(wrapper.vm.code).toEqual(`
const cep = require('cep-promise');

cep('04.551-010').then(console.log, console.log);`);
  });

  it('should query postal address on cep submit', () => {
    const cep = '04.551-010';
    const wrapper = mountComponent();
    wrapper.setData({ cep });
    wrapper.find('form').trigger('submit');
    expect(window.cep).toHaveBeenCalledWith(cep);
  });

  it('should prevent event default on cep submit', () => {
    const submitEventMock = new Event('submit');
    const wrapper = mountComponent();
    wrapper.setData({cep: '04.551-010'});
    submitEventMock.preventDefault = jest.fn();
    const formElement = wrapper.element.querySelector('form');
    formElement.dispatchEvent(submitEventMock);
    expect(submitEventMock.preventDefault).toHaveBeenCalled();
  });

  it('should show loader on query postal address', () => {
    window.cep = jest.fn(() => {
      return { then: jest.fn() };
    });
    const wrapper = mountComponent();
    wrapper.find('form').trigger('submit');
    expect(wrapper.vm.shouldShowLoader).toEqual(true);
  });

  it('should hide loader when query postal address completes', () => {
    window.cep = jest.fn(() => {
      return { then: jest.fn((onSuccess) => onSuccess({})) };
    });
    const wrapper = mountComponent();
    wrapper.find('form').trigger('submit');
    expect(wrapper.vm.shouldShowLoader).toEqual(false);
  });

  it('should set response when query postal address completes', () => {
    const responseMock = {some: 'response'};
    window.cep = jest.fn(() => {
      return { then: jest.fn((onSuccess) => onSuccess(responseMock)) };
    });
    const wrapper = mountComponent();
    wrapper.find('form').trigger('submit');
    expect(wrapper.vm.response).toEqual(JSON.stringify(responseMock, null, 2));
  });
});
