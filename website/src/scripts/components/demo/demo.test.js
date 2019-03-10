import { shallowMount } from '@vue/test-utils';
import Prism from 'prismjs';
import GDemo from '@glorious/demo';
import { GDemoMock, gDemoInstanceMock } from '@mocks/glorious-demo';
import demo from './demo';

jest.mock('@glorious/demo');
GDemo.mockImplementation(GDemoMock);

function buildExpectedHighlightedCode(){
  const code = `
const cep = require('cep-promise');

cep('04.551-010').then(console.log);
`;
  return Prism.highlight(
    code,
    Prism.languages.javascript,
    'javascript'
  );
}

describe('Demo', () => {
  function mountComponent(){
    return shallowMount(demo);
  }

  it('should have appropriate css classes', () => {
    const wrapper = mountComponent();
    expect(wrapper.classes()).toEqual(['demo']);
  });

  it('should contain a tweet sharing message', () => {
    const wrapper = mountComponent();
    expect(wrapper.vm.tweet).toEqual('Consulte endereços postais da maneira mais fácil que você já viu! http://localhost:7000');
  });

  it('should contain container attribute', () => {
    const wrapper = mountComponent();
    const container = wrapper.element;
    expect(container.getAttribute('data-demo-container')).toBeDefined();
  });

  it('should instantiate Glorious Demo on mount', () => {
    mountComponent();
    expect(GDemoMock).toHaveBeenCalledWith('[data-demo-container]');
  });

  it('should show editor when playing demo', () => {
    const highlightedCode = buildExpectedHighlightedCode();
    mountComponent();
    expect(gDemoInstanceMock.openApp).toHaveBeenCalledWith('editor', {
      minHeight: '350px',
      windowTitle: 'demo.js'
    });
    expect(gDemoInstanceMock.write).toHaveBeenCalledWith(highlightedCode, {
      onCompleteDelay: 2000
    });
  });

  it('should show a terminal when playing demo', () => {
    mountComponent();
    expect(gDemoInstanceMock.openApp).toHaveBeenCalledWith('terminal', {
      minHeight: '350px',
      promptString: '$'
    });
    expect(gDemoInstanceMock.command).toHaveBeenCalledWith('node ./demo.js', {
      onCompleteDelay: 1000
    });
    expect(gDemoInstanceMock.respond).toHaveBeenCalledWith(
/* eslint-disable indent */
`{
  "cep": "04551010",
  "state": "SP",
  "city": "São Paulo",
  "neighborhood": "Vila Olímpia",
  "street": "Rua Fidêncio Ramos"
}`
    );
    expect(gDemoInstanceMock.command).toHaveBeenCalledWith('');
    expect(gDemoInstanceMock.end).toHaveBeenCalled();
  });
});
