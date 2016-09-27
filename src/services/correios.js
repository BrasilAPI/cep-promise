'use strict'

import xml2js from 'xml2js'
import _get from 'lodash.get'
import request from 'request-promise'

const parseXMLString = xml2js.parseString

function validateXmlResponse (response) {
  return new Promise((resolve, reject) => {
    parseXMLString(response, (err, xmlObject) => {
      let errorMessage = _get(xmlObject, 'soap:Envelope.soap:Body[0].soap:Fault[0].faultstring')
      if (errorMessage) {
        reject(new RangeError(errorMessage))
      }
      if (!err && _get(xmlObject, 'soap:Envelope.soap:Body[0].ns2:consultaCEPResponse[0].return[0]')) {
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
      'Content-Type': 'text/xml; charset=utf-8',
      'cache-control': 'no-cache'
    }
  }
  return request(options)
    .then((response) => validateXmlResponse(response))
    .catch((err) => {
      throw err
    })
}

export default fetchCorreiosService


