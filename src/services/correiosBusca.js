'use strict'

import fetch from 'axios'
import FormData from 'form-data'
import ServiceError from '../errors/service.js'
import cheerio from 'cheerio'

export default function fetchCorreiosBuscaService(cepWithLeftPad, proxyURL = '') {
  let data = new FormData();
  data.append('cep', cepWithLeftPad);

  let config = {
    method: 'post',
    url: `${proxyURL}http://www.buscacep.correios.com.br/sistemas/buscacep/detalhaCEP.cfm`,
    headers: {
      ...data.getHeaders()
    },
    data: data,
    responseEncoding: 'Latin1'
  };

  return fetch(config)
    .then(parseResponse)
    .then(extractValuesData)
    .catch(throwApplicationError)
}

const parseResponse = (res) => {
  if (res.status !== 200) {
    throw new Error(`Erro ao se conectar com o serviço dos correios.`)
  }

  return res.data
}

const extractValuesData = (res) => {
  const converUtf8 = (value) => {
    return value
      .replace(/\&#xE0;/g, 'à')
      .replace(/\&#xE1;/g, 'á')
      .replace(/\&#xE2;/g, 'â')
      .replace(/\&#xE3;/g, 'ã')
      .replace(/\&#xE7;/g, 'ç')
      .replace(/\&#xE8;/g, 'è')
      .replace(/\&#xE9;/g, 'é')
      .replace(/\&#xEA;/g, 'ê')
      .replace(/\&#xEC;/g, 'ì')
      .replace(/\&#xED;/g, 'í')
      .replace(/\&#xF2;/g, 'ò')
      .replace(/\&#xF3;/g, 'ó')
      .replace(/\&#xF4;/g, 'ô')
      .replace(/\&#xF5;/g, 'õ')
      .replace(/\&#xF9;/g, 'ù')
      .replace(/\&#xFA;/g, 'ú')
      .replace(/\&#xFB;/g, 'û');
  }

  const $ = cheerio.load(res);

  const message = $('div.ctrlcontent p').html()

  if (message == 'DADOS ENCONTRADOS COM SUCESSO.') {
    const tr = $('table.tmptabela');

    const aux = ($(tr).find('tr:nth-child(3) td:nth-child(2)').html()).split('/');

    return {
      cep: ($(tr).find('tr:nth-child(4) td:nth-child(2)').html()).toString().replace(/\D+/g, ''),
      state: aux[1],
      city: converUtf8(aux[0]),
      neighborhood: converUtf8(($(tr).find('tr:nth-child(2) td:nth-child(2)').html())).trim(),
      street: converUtf8(($(tr).find('tr:nth-child(1) td:nth-child(2)').html())).trim(),
      service: 'correiosBusca',
    }

  } else {
    throw new Error(`CEP não encontrado na base de dados dos Correios.`)
  }
}

const throwApplicationError = (error) => {
  if (error.message === 'Request failed with status code 400' || error.message === 'getaddrinfo ENOTFOUND apps.correios.com.br apps.correios.com.br:443') error.message = 'Erro ao se conectar com o serviço dos Correios.'
  const serviceError = new ServiceError({
    message: error.message,
    service: 'correiosbusca'
  })

  if (error.name === 'FetchError') {
    serviceError.message = 'Erro ao se conectar com o serviço dos Correios.'
  }

  throw serviceError
}

