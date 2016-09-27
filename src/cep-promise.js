'use strict'

import xml2js from 'xml2js'
import _get from 'lodash.get'
import getCorreios from './services/correios.js'
import getViaCep from './services/viacep.js'
import Promise from 'bluebird'

const CEP_SIZE = 8

const parseXMLString = xml2js.parseString

export default function (cepRawValue) {
  return new Promise((resolve, reject) => {
    Promise.resolve(cepRawValue)
      .then(validateInputType)
      .then(removeSpecialCharacters)
      .then(validateInputLength)
      .then(leftPadWithZeros)
      .then(getCep)
      .then(parseResponse)
      .then(extractValuesFromParsedResponse)
      .then(finish)
      .catch(handleErrors)

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

    function getCep (cepWithLeftPad) {
      return Promise.any([
        getCorreios(cepWithLeftPad),
        getViaCep(cepWithLeftPad)
      ])
        .catch(Promise.AggregateError, (err) => {
          throw err
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
      return {
        cep: _get(addressValues, 'cep[0]'),
        state: _get(addressValues, 'uf[0]'),
        city: _get(addressValues, 'cidade[0]'),
        neighborhood: _get(addressValues, 'bairro[0]'),
        street: _get(addressValues, 'end[0]')
      }
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

    function errorHandler (error) {
      if (error instanceof TypeError) {
        return {
          type: 'type_error',
          message: translateCorreiosMessages(error.message)
        }
      }

      if (error instanceof RangeError) {
        return {
          type: 'range_error',
          message: translateCorreiosMessages(error.message)
        }
      }
      if (error instanceof Error) {
        return {
          type: 'error',
          message: translateCorreiosMessages(error.message)
        }
      }
    }

    function handleErrors (error) {
      if (error instanceof Promise.AggregateError) {
        return reject(error.map((err) => {
          return errorHandler(err)
        }))
      } else {
        return reject(errorHandler(error))
      }
    }
  })
}
