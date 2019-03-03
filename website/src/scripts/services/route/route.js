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

_public.openUrl = (url, params) => {
  window.open(buildFullUrl(url, params));
};

function buildFullUrl(url, params){
  return params ? `${url}?${stringifyUrlParams(params)}` : url;
}

function stringifyUrlParams(params){
  return Object.entries(params).map(([key, value]) => {
    return `${key}=${encodeURI(value)}`;
  }).join('&');
}

export default _public;
