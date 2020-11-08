import Correios from './correios'
import CorreiosBusca from './correiosBusca'
import ViaCep from './viacep'
import WideNet from './widenet'
import BrasilAPI from './brasilapi'

export function getAvailableServices() {
  const isBrowser = typeof window !== 'undefined'

  if (isBrowser) {
    return {
      correiosbusca: CorreiosBusca,
      viacep: ViaCep,
      widenet: WideNet,
      brasilapi: BrasilAPI
    }
  }

  return {
    correiosbusca: CorreiosBusca,
    correios: Correios,
    viacep: ViaCep,
    widenet: WideNet,
    brasilapi: BrasilAPI
  }
}
