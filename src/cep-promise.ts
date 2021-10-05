
import CepPromiseError from './errors/cep-promise'
import { getAvailableServices } from './services/index'
import { AvaliableProviders, CEP, CEPRawValue, Configurations } from './types';

const CEP_SIZE = 8


export default async function (cepRawValue: CEPRawValue, configurations: Configurations = {}): Promise<CEP> {
  try {
    const validatedInputType = validateInputType(cepRawValue);
    const removedSpecialCharacters = removeSpecialCharacters(validatedInputType);
    const validatedInputLength = validateInputLength(removedSpecialCharacters);
    const leftedPaddedWithZeros = leftPadWithZeros(validatedInputLength);


    configurations.providers = configurations.providers || []
    validateProviders(configurations.providers)

    return await fetchCepFromServices(leftedPaddedWithZeros, {
      ...configurations,
      providers: configurations.providers,
    });

    
  } catch (error) {
    throw handleServicesError(error)
  }
}

function validateProviders (providers: AvaliableProviders[]) {
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

function validateInputType (cepRawValue: CEPRawValue) {
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

function removeSpecialCharacters (cepRawValue: CEPRawValue): string {
  return cepRawValue.toString().replace(/\D+/g, '')
}

function leftPadWithZeros (cepCleanValue: string): string {
  return '0'.repeat(CEP_SIZE - cepCleanValue.length) + cepCleanValue
}

function validateInputLength (cepWithLeftPad: string): string {
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

type ValidatedConfigurations = Omit<Configurations, 'providers'> & { providers: AvaliableProviders[] }

function fetchCepFromServices (cepWithLeftPad: string, configurations: ValidatedConfigurations): Promise<CEP> {
  const providersServices = getAvailableServices()

  if (configurations.providers.length === 0) {
    return Promise.any<CEP>(
      Object.values(providersServices).map(provider => provider(cepWithLeftPad, configurations))
    )
  }

  return Promise.any<CEP>(
    configurations.providers.map(provider => {
      return providersServices[provider](cepWithLeftPad, configurations)
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
