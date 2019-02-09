import VueRouter from 'vue-router';
import { routesMock } from '@mocks/routes';
import routeService from './route';

describe('Route Service', () => {
  let router;

  function mockRouterInstance(){
    router = new VueRouter({
      routes: routesMock
    });
  }

  function stubRouterPush(){
    router.push = jest.fn();
  }

  beforeEach(() => {
    mockRouterInstance();
    routeService.setRouter(router);
  });

  it('should get routes', () => {
    expect(routeService.getRoutes()).toEqual(routesMock);
  });

  it('should go to route', () => {
    stubRouterPush();
    routeService.goTo('second');
    expect(router.push).toHaveBeenCalledWith({
      name: 'second',
      params: undefined,
      query: undefined
    });
  });

  it('should go to route passing route params', () => {
    stubRouterPush();
    routeService.goTo('second', {params: {some: 'param'}});
    expect(router.push).toHaveBeenCalledWith({
      name: 'second',
      params: {some: 'param'},
      query: undefined
    });
  });

  it('should go to route passing query params', () => {
    stubRouterPush();
    routeService.goTo('second', {query: {some: 'query'}});
    expect(router.push).toHaveBeenCalledWith({
      name: 'second',
      params: undefined,
      query: {some: 'query'}
    });
  });
});
