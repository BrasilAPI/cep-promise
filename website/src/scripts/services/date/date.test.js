import dateService from './date';

describe('Date Service', () => {
  const dateMock = new Date();

  it('should get now date', () => {
    window.Date = jest.fn(() => dateMock);
    expect(dateService.getNow()).toEqual(dateMock);
  });
});
