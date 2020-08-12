import Correios from './correios'
import ViaCep from './viacep'
import WideNet from './widenet'
import BrasilAPI from './brasilapi.js'

export function getAvailableServices () {
  const isBrowser = typeof window !== 'undefined'

  if (isBrowser) {
    return {
      brasilapi: BrasilAPI,
      viacep: ViaCep,
      widenet: WideNet,
    }
  }

  return {
    brasilapi: BrasilAPI,
    viacep: ViaCep,
    widenet: WideNet,
    correios: Correios
  }
}
