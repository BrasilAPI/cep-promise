'use strict'

import CepPromiseError from './errors/cep-promise.js'
import { getAvailableServices } from './services/index.js'
import Promise from './utils/promise-any.js'

const CEP_SIZE = 8

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

function validateProviders (providers) {
  let availableProviders = ['brasilapi', 'correios', 'viacep', 'widenet']

  if (!Array.isArray(providers)) {
    throw new CepPromiseError({
      message: 'Erro ao inicializar a instância do CepPromise.',
      type: 'validation_error',
      errors: [
        {
          message:
            `O parâmetro providers deve ser uma lista.`,
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

    return provider
  }
}

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

function removeSpecialCharacters (cepRawValue) {
  return cepRawValue.toString().replace(/\D+/g, '')
}

function leftPadWithZeros (cepCleanValue) {
  return '0'.repeat(CEP_SIZE - cepCleanValue.length) + cepCleanValue
}

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

function fetchCepFromServices (cepWithLeftPad, configurations) {
  let providersServices = getAvailableServices()

  if (configurations.providers.length === 0) {
    return Promise.any(
      Object.values(providersServices).map(provider => provider(cepWithLeftPad))
    )
  }

  return Promise.any(
    configurations.providers.map(provider => {
      return providersServices[provider](cepWithLeftPad)
    })
  )
}

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

function throwApplicationError ({ message, type, errors }) {
  throw new CepPromiseError({ message, type, errors })
}
