import Correios from './correios'
import CorreiosAlt from './correios-alt'
import ViaCep from './viacep'
import WideNet from './widenet'
import BrasilAPI from './brasilapi.js'

/**
 * @typedef {import('../cep-promise').CepPromiseConfigurations} CepPromiseConfigurations
 * @typedef {import('../cep-promise').CepResponse} CepResponse
 */

/**
 * @callback Provider
 * @param { string } cepWithLeftPad
 * @param { CepPromiseConfigurations } configurations
 * @returns { Promise<void | CepResponse> }
 */

/**
 * @returns { Object<string, Provider> }
 */
export function getAvailableServices () {
  const isBrowser = typeof window !== 'undefined'

  if (isBrowser) {
    return {
      viacep: ViaCep,
      widenet: WideNet,
      brasilapi: BrasilAPI
    }
  }

  return {
    correios: Correios,
    'correios-alt': CorreiosAlt,
    viacep: ViaCep,
    widenet: WideNet,
    brasilapi: BrasilAPI
  }
}
