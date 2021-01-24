import '@styles/sandbox.styl';
import btn from '@scripts/components/btn/btn';
import codeSample from '@scripts/components/code-sample/code-sample';
import loader from '@scripts/components/loader/loader';
import row from '@scripts/components/row/row';
import rowItem from '@scripts/components/row-item/row-item';
import template from './sandbox.html';

const CODE_TEMPLATE = `
const cep = require('cep-promise');

cep(%c).then(console.log, console.log);`;

export default {
  name: 'sandbox',
  components: {
    btn,
    codeSample,
    loader,
    row,
    rowItem
  },
  watch: {
    'cep': function(cep){
      this.setCode(this.buildCode(cep));
    }
  },
  data(){
    return {
      code: '',
      response: '',
      cep: '',
      shouldShowLoader: false
    };
  },
  created(){
    this.setCode(this.buildCode(this.cep));
  },
  methods: {
    buildCode(cep){
      const value = cep ? `'${cep}'` : '';
      return CODE_TEMPLATE.replace('%c', value);
    },
    setCode(code){
      this.code = code;
    },
    query(evt){
      evt.preventDefault();
      this.setLoaderVisibility(true);
      window.cep(this.cep).then(this.log, this.log);
    },
    log(response){
      this.setLoaderVisibility(false);
      this.setResponse(JSON.stringify(response, null, 2));
    },
    setResponse(response){
      this.response = response;
    },
    setLoaderVisibility(shouldShow){
      this.shouldShowLoader = shouldShow;
    }
  },
  template
};
