import Correios from './correios'
import ViaCep from './viacep'
import WideNet from './widenet'
import BrasilAPI from './brasilapi'
import { AvaliableProviders, CEP, Configurations } from '../types'

export type AvailableServicesConstructor = { 
  [k in AvaliableProviders]?: (cep: string, config: Configurations) => Promise<CEP | void> 
}

export function getAvailableServices(): AvailableServicesConstructor {
  const isBrowser = typeof window !== 'undefined'


  const services: AvailableServicesConstructor =  {
    viacep: ViaCep,
    widenet: WideNet,
    brasilapi: BrasilAPI
  }


  if (!isBrowser) { 
    services['correios'] = Correios;
  }

  return services;
}
