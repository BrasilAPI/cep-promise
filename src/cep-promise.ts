
import CepPromiseError from './errors/cep-promise'
import { getAvailableServices } from './services/index'
import { AvaliableProviders, CEP, CEPRawValue, Configurations } from './types';

const CEP_SIZE = 8

export default async function cepPromise(cepRawValue: CEPRawValue, configurations: Configurations = {}): Promise<CEP> {
  try {
    const validatedInputType = validateInputType(cepRawValue);
    const removedSpecialCharacters = removeSpecialCharacters(validatedInputType);
    const validatedInputLength = validateInputLength(removedSpecialCharacters);
    const leftedPaddedWithZeros = leftPadWithZeros(validatedInputLength);

    configurations.providers = configurations.providers || []
    validateProviders(configurations.providers)

    const result = await fetchCepFromServices(leftedPaddedWithZeros, {
      ...configurations,
      providers: configurations.providers,
    });

    if (!result) {
      // TODO: tratar o erro
      throw new Error("Tratar erro")
    }

    return result;

  } catch (error) {
    // @ts-ignore
    throw handleServicesError(error)
  }
}

function validateProviders(providers: AvaliableProviders[]) {
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

function validateInputType(cepRawValue: CEPRawValue) {
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

function removeSpecialCharacters(cepRawValue: CEPRawValue): string {
  return cepRawValue.toString().replace(/\D+/g, '')
}

function leftPadWithZeros(cepCleanValue: string): string {
  return '0'.repeat(CEP_SIZE - cepCleanValue.length) + cepCleanValue
}

function validateInputLength(cepWithLeftPad: string): string {
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

function fetchCepFromServices(cepWithLeftPad: string, configurations: ValidatedConfigurations): Promise<CEP | void> {
  const providersServices = getAvailableServices()

  if (configurations.providers.length === 0) {
    return Promise.any<CEP | void>(
      Object.values(providersServices).map(provider => provider(cepWithLeftPad, configurations))
    )
  }

  const mappedServices = configurations.providers
    .map(p => providersServices[p])

  return Promise.any<CEP | void>(
    mappedServices.map(service => service?.(cepWithLeftPad, configurations))
  )
}

function handleServicesError(aggregatedErrors: CepPromiseError[]) {
  if (aggregatedErrors.length !== undefined) {
    throw new CepPromiseError({
      message: 'Todos os serviços de CEP retornaram erro.',
      type: 'service_error',
      errors: []
    })
  }
  throw aggregatedErrors
}

function throwApplicationError({ message, type, errors }: CepPromiseError) {
  throw new CepPromiseError({ message, type, errors })
}
