const _public = {};

let router;

_public.setRouter = routerInstance => {
  router = routerInstance;
};

_public.getRoutes = () => {
  return router.options.routes;
};

_public.goTo = (routeName, options = {}) => {
  router.push({
    name: routeName,
    params: options.params,
    query: options.query
  });
};

export default _public;
