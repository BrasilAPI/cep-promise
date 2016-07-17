'use strict'

var https = require('https')
var parseXMLString = require('xml2js').parseString
import { get as _get } from 'lodash'

export default function (cepRawValue) {
  return new Promise((resolve, reject) => {
    Promise.resolve(cepRawValue)
      .then(validateInput)
      .then(removeSpecialCharacters)
      .then(leftPadWithZeros)
      .then(fetchCorreiosService)
      .then(parseXML)
      .then(extractValuesFromParsedXML)
      .then(finish)
      .catch(handleError)

    function validateInput (cepRawValue) {
      var cepTypeOf = typeof cepRawValue

      if (cepTypeOf === 'number' || cepTypeOf === 'string') {
        return cepRawValue
      }

      throw new TypeError('Você deve chamar o construtor utilizando uma String ou Number')
    }

    function removeSpecialCharacters (cepRawValue) {
      let cepCleanValue = cepRawValue.toString().replace(/[^0-9]+/ig, '')
      return cepCleanValue
    }

    function leftPadWithZeros (cepCleanValue) {
      let cepWithLeftPad = cepCleanValue.toString()
      let size = 8

      while (cepWithLeftPad.length < size) {
        cepWithLeftPad = '0' + cepWithLeftPad
      }

      return cepWithLeftPad
    }

    function fetchCorreiosService (cepWithLeftPad) {
      return new Promise(function (resolve, reject) {
        var options = {
          'method': 'POST',
          'hostname': 'apps.correios.com.br',
          'path': '/SigepMasterJPA/AtendeClienteService/AtendeCliente',
          'headers': {
            'content-type': 'text/xml;charset=utf-8',
            'cache-control': 'no-cache'
          }
        }

        var req = https.request(options, function (res) {
          var chunks = []

          res.on('data', function (chunk) {
            chunks.push(chunk)
          })

          res.on('end', function () {
            var body = Buffer.concat(chunks).toString()

            if (res.statusCode === 200) {
              return resolve(body)
            } else {
              parseXMLString(body, function (err, xmlObject) {
                var errorMessage = _get(xmlObject, 'soap:Envelope.soap:Body[0].soap:Fault[0].faultstring');

                if(errorMessage) {
                  return reject(new RangeError(errorMessage))
                }

                return reject(new Error('Correios respondeu consulta utilizando um formato de XML desconhecido'))

              })
            }
          })
        })

        req.on('error', function (err) {
          return reject(new Error('Erro ao se conectar com o serviço dos Correios'))
        })

        req.write('<?xml version="1.0"?>\n<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cli="http://cliente.bean.master.sigep.bsb.correios.com.br/">\n  <soapenv:Header />\n  <soapenv:Body>\n    <cli:consultaCEP>\n      <cep>' + cepWithLeftPad + '</cep>\n    </cli:consultaCEP>\n  </soapenv:Body>\n</soapenv:Envelope>')
        req.end()
      })
    }

    function parseXML (xmlString) {
      return new Promise(function (resolve, reject) {
        parseXMLString(xmlString, function (err, xmlObject) {
          resolve(xmlObject)
        })
      })
    }

    function extractValuesFromParsedXML (xmlObject) {
      var addressValues = _get(xmlObject, 'soap:Envelope.soap:Body[0].ns2:consultaCEPResponse[0].return[0]')

      if (addressValues) {
        var addressObject = {
          cep: addressValues['cep'][0],
          state: addressValues['uf'][0],
          city: addressValues['cidade'][0],
          neighborhood: addressValues['bairro'][0],
          street: addressValues['end'][0]
        }

        return addressObject
      }

      throw new Error('Correios respondeu consulta utilizando um formato de XML desconhecido')

    }

    function finish (addressObject) {
      resolve(addressObject)
    }

    function translateCorreiosMessages(message) {

      let dictionary = {
        'CEP NAO ENCONTRADO': 'Cep não encontrado na base dos Correios',
        'BUSCA DEFINIDA COMO EXATA, 0 CEP DEVE TER 8 DIGITOS': 'Cep deve conter exatamente 8 caracteres'
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
