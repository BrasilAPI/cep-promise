'use strict'

import CepPromiseError from './errors/cep-promise.js'
import { getAvailableServices } from './services/index.js'
import Promise from './utils/promise-any.js'

const CEP_SIZE = 8

/**
 * @typedef { Object } CepPromiseConfigurations
 * @property { string[] } [providers]
 * @property { boolean } [onlyFromCache]
 * @property { number } [timeout] - In milliseconds
 */

/**
 * @typedef { Object } CepResponse
 * @property { string } cep
 * @property { string } state
 * @property { string } city
 * @property { string } neighborhood
 * @property { string } street
 * @property { string } service
 */

/**
 * 
 * @param { string | number } cepRawValue 
 * @param { CepPromiseConfigurations } configurations 
 * @returns { Promise<void | CepResponse> }
 */
export default function (cepRawValue, configurations = {}) {
  return Promise.resolve(cepRawValue)
    .then(validateInputType)
    .then(cepRawValue => {
      configurations.providers = configurations.providers ? configurations.providers : []
      validateProviders(configurations.providers)

      return cepRawValue
    })
    .then(removeSpecialCharacters)
    .then(validateInputLength)
    .then(leftPadWithZeros)
    .then((cepWithLeftPad) => {
      return fetchCepFromServices(cepWithLeftPad, configurations)
    })
    .catch(handleServicesError)
    .catch(throwApplicationError)
}

/**
 * 
 * @param { CepPromiseConfigurations["providers"] } providers 
 */
function validateProviders (providers) {
  const availableProviders = Object.keys(getAvailableServices())

  if (!Array.isArray(providers)) {
    throw new CepPromiseError({
      message: 'Erro ao inicializar a instância do CepPromise.',
      type: 'validation_error',
      errors: [
        {
          message:
            'O parâmetro providers deve ser uma lista.',
          service: 'providers_validation'
        }
      ]
    })
  }

  for (const provider of providers) {
    if (!availableProviders.includes(provider)) {
      throw new CepPromiseError({
        message: 'Erro ao inicializar a instância do CepPromise.',
        type: 'validation_error',
        errors: [
          {
            message:
              `O provider "${provider}" é inválido. Os providers disponíveis são: ["${availableProviders.join('", "')}"].`,
            service: 'providers_validation'
          }
        ]
      })
    }
  }
}

/**
 * 
 * @param { string | number } cepRawValue 
 * @returns { string | number }
 */
function validateInputType (cepRawValue) {
  const cepTypeOf = typeof cepRawValue

  if (cepTypeOf === 'number' || cepTypeOf === 'string') {
    return cepRawValue
  }

  throw new CepPromiseError({
    message: 'Erro ao inicializar a instância do CepPromise.',
    type: 'validation_error',
    errors: [
      {
        message:
          'Você deve chamar o construtor utilizando uma String ou um Number.',
        service: 'cep_validation'
      }
    ]
  })
}

/**
 * 
 * @param { string | number } cepRawValue 
 * @returns { string }
 */
function removeSpecialCharacters (cepRawValue) {
  return cepRawValue.toString().replace(/\D+/g, '')
}

/**
 * 
 * @param { string } cepWithLeftPad 
 * @returns { string }
 */
function validateInputLength (cepWithLeftPad) {
  if (cepWithLeftPad.length <= CEP_SIZE) {
    return cepWithLeftPad
  }

  throw new CepPromiseError({
    message: `CEP deve conter exatamente ${CEP_SIZE} caracteres.`,
    type: 'validation_error',
    errors: [
      {
        message: `CEP informado possui mais do que ${CEP_SIZE} caracteres.`,
        service: 'cep_validation'
      }
    ]
  })
}

/**
 * 
 * @param { string } cepCleanValue 
 * @returns { string }
 */
function leftPadWithZeros (cepCleanValue) {
  return '0'.repeat(CEP_SIZE - cepCleanValue.length) + cepCleanValue
}

/**
 * 
 * @param { string } cepWithLeftPad 
 * @param { CepPromiseConfigurations } configurations 
 * @returns { Promise<void | CepResponse> } 
 */
function fetchCepFromServices (cepWithLeftPad, configurations) {
  const providersServices = getAvailableServices()

  if (configurations.providers.length === 0) {
    return Promise.any(
      Object.values(providersServices)
        .map(provider => provider(cepWithLeftPad, configurations))
    )
  }

  return Promise.any(
    configurations.providers.map(
      provider => {
        return providersServices[provider](cepWithLeftPad, configurations)
      }
    )
  )
}

/**
 * 
 * @param { Error[] } aggregatedErrors 
 */
function handleServicesError (aggregatedErrors) {
  if (aggregatedErrors.length !== undefined) {
    throw new CepPromiseError({
      message: 'Todos os serviços de CEP retornaram erro.',
      type: 'service_error',
      errors: aggregatedErrors
    })
  }
  throw aggregatedErrors
}

/**
 * 
 * @param { {
 * message: string,
 * type: string,
 * errors: Error[]
 * } } error
 */
function throwApplicationError ({ message, type, errors }) {
  throw new CepPromiseError({ message, type, errors })
}
