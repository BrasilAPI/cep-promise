'use strict'

import https from 'https'
import xml2js from 'xml2js'
import _get from 'lodash.get'

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

    function fetchCorreiosService (cepWithLeftPad) {
      return new Promise((resolve, reject) => {
        let options = {
          'method': 'POST',
          'hostname': 'apps.correios.com.br',
          'path': '/SigepMasterJPA/AtendeClienteService/AtendeCliente',
          'headers': {
            'content-type': 'text/xml;charset=utf-8',
            'cache-control': 'no-cache'
          }
        }

        let req = https.request(options, (res) => {
          let chunks = []

          res.on('data', (chunk) => {
            chunks.push(chunk)
          })

          res.on('end', () => {
            let body = Buffer.concat(chunks).toString()
            parseXMLString(body, (err, xmlObject) => {
              let errorMessage = _get(xmlObject, 'soap:Envelope.soap:Body[0].soap:Fault[0].faultstring')
              if (errorMessage) {
                return reject(new RangeError(errorMessage))
              }
              if (res.statusCode === 200 && !err) {
                return resolve(body)
              }

              return fetchViaCepService(cepWithLeftPad)
                  .then(res => resolve(res))
                  .catch(err => reject(err))
            })
          })
        })

        req.on('error', () => {
          return fetchViaCepService(cepWithLeftPad)
            .then(res => resolve(res))
            .catch(err => reject(err))
        })

        req.write('<?xml version="1.0"?>\n<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cli="http://cliente.bean.master.sigep.bsb.correios.com.br/">\n  <soapenv:Header />\n  <soapenv:Body>\n    <cli:consultaCEP>\n      <cep>' + cepWithLeftPad + '</cep>\n    </cli:consultaCEP>\n  </soapenv:Body>\n</soapenv:Envelope>')
        req.end()
      })
    }
    function fetchViaCepService (cepWithLeftPad) {
      return new Promise((resolve, reject) => {
        let options = {
          'method': 'GET',
          'hostname': 'viacep.com.br',
          'path': '/ws/' + cepWithLeftPad + '/json/',
          'headers': {
            'content-type': 'application/json;charset=utf-8',
            'cache-control': 'no-cache'
          }
        }
        let req = https.request(options, (res) => {
          let chunks = []
          res.on('data', (chunk) => {
            chunks.push(chunk)
          })

          res.on('end', () => {
            let body = Buffer.concat(chunks).toString()

            if (res.statusCode === 200) {
              return resolve(body)
            } else {
              return reject(new Error('Não foi possível processar o cep requerido'))
            }
          })
        })

        req.on('error', () => {
          return reject(new Error('Erro ao se conectar com o serviços de ceps'))
        })
        req.end()
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
