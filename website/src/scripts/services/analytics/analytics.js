import dateService from '@scripts/services/date/date';

let ANALYTICS_ENV;
const _public = {};

_public.init = analyticsEnv => {
  ANALYTICS_ENV = analyticsEnv;
  buildGoogleAnalyticsScriptTag(ANALYTICS_ENV.GOOGLE);
  configAnalytics(ANALYTICS_ENV.GOOGLE.ID);
};

_public.trackPageView = path => {
  configAnalytics(ANALYTICS_ENV.GOOGLE.ID, path);
};

function buildGoogleAnalyticsScriptTag(GOOGLE_ANALYTICS_ENV){
  const tag = document.createElement('script');
  tag.setAttribute('async', 'true');
  tag.setAttribute('src', `${GOOGLE_ANALYTICS_ENV.BASE_URL}?id=${GOOGLE_ANALYTICS_ENV.ID}`);
  document.head.appendChild(tag);
}

function configAnalytics(id, path){
  if(!path)
    gtag('js', dateService.getNow());
  gtag('config', id, {page_path: (path || getLocationPath())});
}

function getLocationPath(){
  return window.location.hash.replace('#/','/');
}

function gtag(){
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(arguments);
}

export default _public;
