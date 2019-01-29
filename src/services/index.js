import CepAberto from './cepaberto'
import Correios from './correios'
import ViaCep from './viacep'
import { PROXY_URL } from '../utils/consts'

/* istanbul ignore next */
function isBrowser(){
  return typeof window !== 'undefined';
}

/* istanbul ignore next */
function isHttps(){
  return typeof location !== 'undefined' && location.protocol === 'https:'
}

/* istanbul ignore next */
function shouldUseProxy(){
  return isBrowser() && !isHttps()
}

/* istanbul ignore next */
function injectProxy (Service) {
  return (cepWithLeftPad) => Service(cepWithLeftPad, PROXY_URL)
}

export const CepAbertoService = shouldUseProxy() ? injectProxy(CepAberto) : CepAberto
export const CorreiosService = shouldUseProxy() ? injectProxy(Correios) : Correios
export const ViaCepService = ViaCep
