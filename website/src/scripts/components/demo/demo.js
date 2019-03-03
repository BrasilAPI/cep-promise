import '@styles/demo.styl';
import '@glorious/demo/dist/gdemo.min.css';
import 'prismjs/themes/prism-tomorrow.css';
import GDemo from '@glorious/demo';
import Prism from 'prismjs';
import githubButtonWidget from '@scripts/components/github-button-widget/github-button-widget';
import row from '@scripts/components/row/row';
import rowItem from '@scripts/components/row-item/row-item';
import tweetBtn from '@scripts/components/tweet-btn/tweet-btn';
import template from './demo.html';

export default {
  name: 'demo',
  components: {
    githubButtonWidget,
    row,
    rowItem,
    tweetBtn,
  },
  data(){
    return {
      tweet: 'Consulte endereços postais da maneira mais fácil que você já viu!'
    };
  },
  mounted(){
    this.play();
  },
  methods: {
    play(){
      const gdemo = new GDemo('[data-demo-container]');
      const code = `
const cep = require('cep-promise');

cep('04551-010').then(console.log);
`;

      const highlightedCode = Prism.highlight(
        code,
        Prism.languages.javascript,
        'javascript'
      );

      gdemo
        .openApp('editor', { minHeight: '350px', windowTitle: 'demo.js' })
        .write(highlightedCode, { onCompleteDelay: 2000 })
        .openApp('terminal', { minHeight: '350px', promptString: '$' })
        .command('node ./demo.js', { onCompleteDelay: 1000 })
        .respond(`{
  "cep": "04551010",
  "state": "SP",
  "city": "São Paulo",
  "neighborhood": "Vila Olímpia",
  "street": "Rua Fidêncio Ramos"
}`)
        .command('')
        .end();
    }
  },
  template
};
