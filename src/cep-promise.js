'use strict'

var http = require('https')
var parseXMLString = require('xml2js').parseString

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

      throw new TypeError('You need to call the constructor with a String or Number.')
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

        var req = http.request(options, function (res) {
          var chunks = []

          res.on('data', function (chunk) {
            chunks.push(chunk)
          })

          res.on('end', function () {
            var body = Buffer.concat(chunks)
            return resolve(body.toString())
          })
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
      var addressValues = xmlObject['soap:Envelope']['soap:Body'][0]['ns2:consultaCEPResponse'][0]['return'][0]
      var addressObject = {
        cep: addressValues['cep'][0],
        state: addressValues['uf'][0],
        city: addressValues['cidade'][0],
        neighborhood: addressValues['bairro'][0],
        street: addressValues['end'][0]
      }

      return addressObject
    }

    function finish (addressObject) {
      resolve(addressObject)
    }

    function handleError (error) {
      if (error instanceof TypeError) {
        return reject({
          type: 'type_error',
          message: error.message
        })
      }
    }
  })
}
