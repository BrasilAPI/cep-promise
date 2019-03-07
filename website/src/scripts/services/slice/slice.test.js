import sliceService from './slice';

describe('Slice Service', () => {
  it('should offset slices adjacent to angled slices', () => {
    const topbarMock = { offsetHeight: 50 };
    const slicesMock = [
      { classList: { contains: jest.fn(() => true) }, offsetHeight: 400 },
      { classList: { contains: jest.fn(() => false) }, style: {} }
    ];
    const containerElementMock = {
      querySelectorAll: jest.fn(() => slicesMock),
      querySelector: jest.fn(() => topbarMock)
    };
    sliceService.positionNotAngledSlices(containerElementMock);
    expect(slicesMock[1].style.marginTop).toEqual('350px');
  });
});
