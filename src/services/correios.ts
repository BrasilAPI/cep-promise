import fetch, { Response } from 'node-fetch'
import ServiceError from '../errors/service'
import { ArrayString, CEP, Configurations } from '../types'

export default function fetchCorreiosService(cepWithLeftPad: string, configurations: Configurations): Promise<CEP | void> {
  const url = 'https://apps.correios.com.br/SigepMasterJPA/AtendeClienteService/AtendeCliente'
  const options = {
    method: 'POST',
    body: `<?xml version="1.0"?>\n<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cli="http://cliente.bean.master.sigep.bsb.correios.com.br/">\n  <soapenv:Header />\n  <soapenv:Body>\n    <cli:consultaCEP>\n      <cep>${cepWithLeftPad}</cep>\n    </cli:consultaCEP>\n  </soapenv:Body>\n</soapenv:Envelope>`,
    headers: {
      'Content-Type': 'text/xml;charset=UTF-8',
      'cache-control': 'no-cache'
    },
    timeout: configurations.timeout || 30000
  }

  return fetch(url, options)
    .then(analyzeAndParseResponse)
    .catch(throwApplicationError)
}

async function analyzeAndParseResponse(response: Response): Promise<CEP> {
  if (response.ok) {
    return response.text()
      .then(parseSuccessXML)
      .then(extractValuesFromSuccessResponse)
  }


  const responseText = await response.text()
  throw new Error(parseAndExtractErrorMessage(responseText))
}

function parseSuccessXML(xmlString: string) {
  try {
    const returnStatement = xmlString.replace(/\r?\n|\r/g, '').match(/<return>(.*)<\/return>/)?.[0] ?? ''
    const cleanReturnStatement = returnStatement.replace('<return>', '').replace('</return>', '')
    const parsedReturnStatement = cleanReturnStatement
      .split(/</)
      .reduce<ArrayString>((result, exp) => {
        const splittenExp = exp.split('>')
        if (splittenExp.length > 1 && splittenExp[1].length) {
          result[splittenExp[0]] = splittenExp[1]
        }
        return result
      }, {})

    return parsedReturnStatement
  } catch (e) {
    throw new Error('Não foi possível interpretar o XML de resposta.')
  }
}

function parseAndExtractErrorMessage(xmlString: string): string {
  try {
    const returnStatement = xmlString.match(/<faultstring>(.*)<\/faultstring>/)?.[0] ?? ''
    const cleanReturnStatement = returnStatement.replace('<faultstring>', '').replace('</faultstring>', '')
    return cleanReturnStatement
  } catch (e) {
    throw new Error('Não foi possível interpretar o XML de resposta.')
  }
}


function extractValuesFromSuccessResponse(xmlObject: ArrayString): CEP {
  return {
    cep: xmlObject.cep,
    state: xmlObject.uf,
    city: xmlObject.cidade,
    neighborhood: xmlObject.bairro,
    street: xmlObject.end,
    service: 'correios'
  }
}

function throwApplicationError(error: Error) {
  const serviceError = new ServiceError({
    message: error.message,
    service: 'correios'
  })

  if (error.name === 'FetchError') {
    serviceError.message = 'Erro ao se conectar com o serviço dos Correios.'
  }

  throw serviceError
}
