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
  const providersServices = getAvailableServices()

  const { providers: providersFromConfigurations, ...configurationsWithoutProviders } = configurations

  const providersName = Object.keys(providersServices)
  const { globalConfigs, specificConfigs } = Object.entries(configurationsWithoutProviders).reduce((obj, [key, value]) => {
    const isAProvider = providersName.includes(key)

    if (isAProvider) {
      obj.specificConfigs[key] = value
    } else {
      obj.globalConfigs[key] = value
    }

    return obj
  }, { globalConfigs: {}, specificConfigs: {} })

  if (providersFromConfigurations.length === 0) {
    return Promise.any(
      Object.entries(providersServices).map(([providerName, provider]) => provider(cepWithLeftPad, { ...globalConfigs, ...specificConfigs[providerName] }))
    )
  }

  return Promise.any(
    providersFromConfigurations.map(provider => {
      return providersServices[provider](cepWithLeftPad, { ...globalConfigs, ...specificConfigs[provider] })
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
