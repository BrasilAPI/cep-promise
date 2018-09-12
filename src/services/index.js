import { CepAberto } from './cepaberto';
import { Correios } from './correios';
import { ViaCep } from './viacep';
import { PROXY_URL } from '../helpers/consts';

/* istanbul ignore next */
function injectProxy(Service) {
  return (cepWithLeftPad) => Service(cepWithLeftPad, PROXY_URL)
}

export const CepAbertoService = typeof process === 'undefined' ? injectProxy(CepAberto) : CepAberto;
export const CorreiosService = typeof process === 'undefined' ? injectProxy(Correios) : Correios;
export const ViaCepService = typeof process === 'undefined' ? injectProxy(ViaCep) : ViaCep;
