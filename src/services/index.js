import CepAberto from './cepaberto'
import Correios from './correios'
import ViaCep from './viacep'
import { PROXY_URL } from '../utils/consts'

/* istanbul ignore next */
function isBrowser(){
  return typeof window !== 'undefined';
}

/* istanbul ignore next */
function injectProxy (Service) {
  return (cepWithLeftPad) => Service(cepWithLeftPad, PROXY_URL)
}

export const CepAbertoService = isBrowser() ? injectProxy(CepAberto) : CepAberto
export const CorreiosService = isBrowser() ? injectProxy(Correios) : Correios
export const ViaCepService = isBrowser() ? injectProxy(ViaCep) : ViaCep
