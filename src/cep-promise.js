'use strict'

import https from 'https'
import xml2js from 'xml2js'
import _get from 'lodash.get'
import request from 'request-promise'

const CEP_SIZE = 8

const parseXMLString = xml2js.parseString

export default function (cepRawValue) {
  return new Promise((resolve, reject) => {
    Promise.resolve(cepRawValue)
      .then(validateInputType)
      .then(removeSpecialCharacters)
      .then(validateInputLength)
      .then(leftPadWithZeros)
      .then(fetchCorreiosService)
      .then(parseResponse)
      .then(extractValuesFromParsedResponse)
      .then(finish)
      .catch(handleError)

    function validateInputType (cepRawValue) {
      let cepTypeOf = typeof cepRawValue

      if (cepTypeOf === 'number' || cepTypeOf === 'string') {
        return cepRawValue
      }

      throw new TypeError('Você deve chamar o construtor utilizando uma String ou Number')
    }

    function removeSpecialCharacters (cepRawValue) {
      return cepRawValue.toString().replace(/\D+/g, '')
    }

    function leftPadWithZeros (cepCleanValue) {
      let cepWithLeftPad = cepCleanValue.toString()

      while (cepWithLeftPad.length < CEP_SIZE) {
        cepWithLeftPad = '0' + cepWithLeftPad
      }

      return cepWithLeftPad
    }

    function validateInputLength (cepWithLeftPad) {
      if (cepWithLeftPad.length <= CEP_SIZE) {
        return cepWithLeftPad
      }
      throw new TypeError('CEP deve conter exatamente 8 caracteres')
    }

    function validateXmlResponse(response) {
      return new Promise((resolve, reject) => {
        parseXMLString(response, (err, xmlObject) => {
          let errorMessage = _get(xmlObject, 'soap:Envelope.soap:Body[0].soap:Fault[0].faultstring')
          if (errorMessage) {
            reject(new RangeError(errorMessage))
          }
          if (!err &&  _get(xmlObject, 'soap:Envelope.soap:Body[0].ns2:consultaCEPResponse[0].return[0]')) {
            resolve(response)
          }
          reject(err)
        })
      })
    }

    function fetchCorreiosService (cepWithLeftPad) {
      const options = {
        method: 'POST',
        simple: false,
        uri: 'https://apps.correios.com.br/SigepMasterJPA/AtendeClienteService/AtendeCliente',
        body: '<?xml version="1.0"?>\n<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cli="http://cliente.bean.master.sigep.bsb.correios.com.br/">\n  <soapenv:Header />\n  <soapenv:Body>\n    <cli:consultaCEP>\n      <cep>' + cepWithLeftPad + '</cep>\n    </cli:consultaCEP>\n  </soapenv:Body>\n</soapenv:Envelope>',
        headers: {
          'Content-Type':'text/xml; charset=utf-8',
          'cache-control': 'no-cache'
          }
        }
      return request(options)
        .then((response) => {
          return validateXmlResponse(response)
        })
        .catch((err) => {
          if (err instanceof RangeError) {
            throw err
          }
          return fetchViaCepService(cepWithLeftPad)
        })
    }
    
    function fetchViaCepService (cepWithLeftPad) {
      const options = {
        method: 'GET',
        uri: 'https://viacep.com.br/ws/' + cepWithLeftPad + '/json/',
        headers: {
          'content-type': 'application/json;charset=utf-8',
          'cache-control': 'no-cache'
        }
      }
      return request(options)
        .catch(() => {
          throw new Error('Erro ao se conectar com o serviços de ceps')
        })
    }
    
    function parseResponse (responseString) {
      return new Promise((resolve, reject) => {
        try {
          resolve(Object.assign({isJSON: true}, JSON.parse(responseString)))
        } catch (err) {
          parseXMLString(responseString, (err, responseObject) => {
            if (!err) {
              resolve(responseObject)
            }
            throw new TypeError('Não foi possível interpretar o XML de resposta')
          })
        }
      })
    }

    function extractValuesFromParsedResponse (responseObject) {
      if (responseObject.isJSON) {
        return {
          cep: responseObject.cep.replace('-', ''),
          state: responseObject.uf,
          city: responseObject.localidade,
          neighborhood: responseObject.bairro,
          street: responseObject.logradouro
        }
      }
      let addressValues = _get(responseObject, 'soap:Envelope.soap:Body[0].ns2:consultaCEPResponse[0].return[0]')

      if (addressValues) {
        let addressObject = {
          cep: _get(addressValues, 'cep[0]'),
          state: _get(addressValues, 'uf[0]'),
          city: _get(addressValues, 'cidade[0]'),
          neighborhood: _get(addressValues, 'bairro[0]'),
          street: _get(addressValues, 'end[0]')
        }

        return addressObject
      }
      throw new Error('Correios respondeu consulta utilizando um formato de XML desconhecido')
    }

    function finish (addressObject) {
      resolve(addressObject)
    }

    function translateCorreiosMessages (message) {
      let dictionary = {
        'CEP NAO ENCONTRADO': 'CEP não encontrado na base dos Correios',
        'BUSCA DEFINIDA COMO EXATA, 0 CEP DEVE TER 8 DIGITOS': 'CEP deve conter exatamente ' + CEP_SIZE + ' caracteres'
      }

      return dictionary[message] || message
    }

    function handleError (error) {
      if (error instanceof TypeError) {
        return reject({
          type: 'type_error',
          message: translateCorreiosMessages(error.message)
        })
      }

      if (error instanceof RangeError) {
        return reject({
          type: 'range_error',
          message: translateCorreiosMessages(error.message)
        })
      }

      if (error instanceof Error) {
        return reject({
          type: 'error',
          message: translateCorreiosMessages(error.message)
        })
      }
    }
  })
}
