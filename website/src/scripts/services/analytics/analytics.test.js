import analyticsService from './analytics';
import dateService from '@scripts/services/date/date';

describe('Analytics Service', () => {
  const dateMock = new Date();
  const locationHashMock = '#/home';
  const createElementMock = {
    setAttribute: jest.fn()
  };

  function mockAnalyticsEnvironment(INSPECTLET = {}){
    return {
      GOOGLE: { ID: '123', BASE_URL: 'https://some.url.com' },
      INSPECTLET
    };
  }

  beforeEach(() => {
    document.createElement = jest.fn(() => {
      return { setAttribute: createElementMock.setAttribute };
    });
    document.head.appendChild = jest.fn();
    dateService.getNow = jest.fn(() => dateMock);
  });

  afterEach(() => {
    delete window.dataLayer;
    window.location.hash = '';
  });

  it('should get analytics thirdy party code asynchronously', () => {
    analyticsService.init(mockAnalyticsEnvironment());
    expect(createElementMock.setAttribute).toHaveBeenCalledWith('async', 'true');
  });

  it('should get analytics thirdy party code passing analytics id', () => {
    analyticsService.init(mockAnalyticsEnvironment());
    expect(createElementMock.setAttribute).toHaveBeenCalledWith(
      'src',
      'https://some.url.com?id=123'
    );
  });

  it('should append script tag to get analytics thirdy party code on head', () => {
    analyticsService.init(mockAnalyticsEnvironment());
    expect(typeof document.head.appendChild.mock.calls[0][0]).toEqual('object');
  });

  it('should configure analytics settings after append script tag on head', () => {
    window.location.hash = locationHashMock;
    analyticsService.init(mockAnalyticsEnvironment());
    expect(window.dataLayer[0][0]).toEqual('js');
    expect(window.dataLayer[0][1]).toEqual(dateMock);
    expect(window.dataLayer[1][0]).toEqual('config');
    expect(window.dataLayer[1][1]).toEqual('123');
    expect(window.dataLayer[1][2]).toEqual({page_path: '/home'});
  });

  it('should track page view', () => {
    const path = '/author';
    analyticsService.trackPageView(path);
    expect(window.dataLayer[0][0]).toEqual('config');
    expect(window.dataLayer[0][1]).toEqual('123');
    expect(window.dataLayer[0][2]).toEqual({page_path: path});
  });
});
