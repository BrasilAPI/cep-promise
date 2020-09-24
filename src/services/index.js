import Correios from './correios'
import ViaCep from './viacep'
import WideNet from './widenet'
import BrasilAPI from './brasilapi.js'

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
    viacep: ViaCep,
    widenet: WideNet,
    brasilapi: BrasilAPI
  }
}
