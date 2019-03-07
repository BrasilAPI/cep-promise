import '@styles/code-sample.styl';
import Prism from 'prismjs';
import template from './code-sample.html';

export default {
  name: 'code-sample',
  props: ['language'],
  mounted(){
    if(this.language)
      this.renderCodeSample(this.highlightCode(this.getCodeSample(), this.language));
  },
  methods: {
    getCodeSample(){
      return this.getCodeSampleContainer().innerText;
    },
    highlightCode(code, language){
      return Prism.highlight(code, Prism.languages[language], language);
    },
    renderCodeSample(highlightedCode){
      const container = this.getCodeSampleContainer();
      container.innerHTML = highlightedCode;
    },
    getCodeSampleContainer(){
      return this.$el.querySelector('[data-code-sample]');
    }
  },
  template
};
