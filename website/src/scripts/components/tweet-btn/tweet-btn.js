import btn from '@scripts/components/btn/btn';
import routeService from '@scripts/services/route/route';
import template from './tweet-btn.html';

export default {
  name: 'tweet-btn',
  components: {
    btn
  },
  props: ['size', 'tweet'],
  methods: {
    share(){
      routeService.openUrl('https://twitter.com/intent/tweet', {
        text: this.tweet
      });
    },
  },
  template
};
