import { shallowMount } from '@vue/test-utils';
import topbar from '@scripts/components/topbar/topbar';
import sliceService from '@scripts/services/slice/slice';
import viewport from './viewport';

describe('Viewport', () => {
  function mountComponent(slots){
    return shallowMount(viewport, { slots });
  }

  beforeEach(() => {
    sliceService.positionNotAngledSlices = jest.fn();
  });

  it('should have appropriate css classes', () => {
    const wrapper = mountComponent();
    expect(wrapper.classes()).toEqual(['viewport']);
  });

  it('should contain a topbar', () => {
    const wrapper = mountComponent();
    expect(wrapper.find(topbar)).toBeDefined();
  });

  it('should transclude some content', () => {
    const wrapper = mountComponent({ default: '<p>Hello!</p>' });
    expect(wrapper.find('p').text()).toEqual('Hello!');
  });

  it('should offset slices adjacent to angled slices', () => {
    const wrapper = mountComponent();
    expect(sliceService.positionNotAngledSlices).toHaveBeenCalledWith(wrapper.element);
  });
});
