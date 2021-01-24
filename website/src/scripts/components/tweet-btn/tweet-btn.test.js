import { shallowMount } from '@vue/test-utils';
import btn from '@scripts/components/btn/btn';
import routeService from '@scripts/services/route/route';
import tweetBtn from './tweet-btn';

describe('Tweet Btn', () => {
  function createComponent(propsData, slots){
    return shallowMount(tweetBtn, { propsData, slots });
  }

  beforeEach(() => {
    routeService.openUrl = jest.fn();
  });

  it('should have appropriate css classes', () => {
    const wrapper = createComponent();
    expect(wrapper.classes()).toContain('tweet-btn');
  });

  it('should contain a base button', () => {
    const wrapper = createComponent();
    expect(wrapper.contains(btn)).toEqual(true);
  });

  it('should optionally render a small button', () => {
    const wrapper = createComponent({size: 'small'});
    const button = wrapper.find('btn-stub').element;
    expect(button.getAttribute('size')).toEqual('small');
  });

  it('should tweet', () => {
    const wrapper = createComponent({tweet: 'Hello!'});
    wrapper.vm.share();
    expect(routeService.openUrl).toHaveBeenCalledWith(
      'https://twitter.com/intent/tweet',
      {text: 'Hello!'}
    );
  });
});
