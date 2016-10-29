<p align="center">
  <img src="https://raw.githubusercontent.com/filipedeschamps/cep-promise/master/content/logo.gif">
</p>

<h1 align="center">CEP Promise</h1>

<p align="center">
  <a href="https://travis-ci.org/filipedeschamps/cep-promise">
    <img src="https://travis-ci.org/filipedeschamps/cep-promise.svg?branch=master">
  </a>
  <a href="https://coveralls.io/github/filipedeschamps/cep-promise?branch=master">
    <img src="https://coveralls.io/repos/github/filipedeschamps/cep-promise/badge.svg?branch=master">
  </a>
  <a href="https://www.npmjs.com/package/cep-promise">
    <img src="https://badge.fury.io/js/cep-promise.svg">
  </a>
  <a href="http://standardjs.com/">
    <img src="https://img.shields.io/badge/code%20style-standard-brightgreen.svg">
  </a>
</p>

<p align="center">
  Busca por CEP integrado diretamente aos serviços dos Correios e ViaCEP (Node.js e Browser)
</p>

## Features

 * Sempre atualizado em tempo-real por se conectar diretamente aos serviços dos Correios ou ViaCEP
 * Possui alta disponibilidade por usar serviços como fallback
 * Sempre retorna a resposta mais rápida por fazer as consultas de forma concorrente
 * Sem limites de uso (rate limits) conhecidos
 * Interface de Promise extremamente simples
 * Suporte ao Node.js `0.10.x`, `0.12.x`, `4.x`, `5.x`, `6.x` e `7.x`
 * 100% de code coverage com testes unitários e E2E
 * Desenvolvido utilizando ES6


## Como utilizar


### Instalação

```
$ npm install --save cep-promise
```


### Realizando uma consulta

Por ser multifornecedor, a biblioteca irá resolver a Promise com o fornecedor que mais rápido lhe responder.

``` js
import cep from 'cep-promise'

cep('05010000')
  .then(console.log)

  // {
  //   "zipcode":  "05010000",
  //   "state":  "SP",
  //   "city":  "São Paulo",
  //   "street":  "Rua Caiubí",
  //   "neighborhood":  "Perdizes",
  // }
```


### Você também poderá passar o CEP como Inteiro

Em muitos sistemas o CEP é utilizado erroneamente como um Inteiro (e com isto cortanto todos os zeros à esquerda). Caso este seja o seu caso, não há problema, pois a biblioteca irá preencher os caracteres faltantes na String, por exemplo:

``` js
import cep from 'cep-promise'

// enviando sem ter um zero à esquerda do CEP "05010000"
cep(5010000)
  .then(console.log)

  // {
  //   "zipcode":  "05010000",
  //   "state":  "SP",
  //   "city":  "São Paulo",
  //   "street":  "Rua Caiubí",
  //   "neighborhood":  "Perdizes",
  // }
```

### Quando o CEP não é encontrado

Neste caso será retornado um `"service_error"` e por ser multifornecedor, a biblioteca irá rejeitar a Promise apenas quando tiver a resposta negativa de todos os fornecedores.

``` js
import cep from 'cep-promise'

cep('99999999')
  .catch(console.log)

  // {
  //     message: 'Todos os serviços de CEP retornaram erro.',
  //     type: 'service_error',
  //     errors: [{
  //       message: 'CEP NAO ENCONTRADO',
  //       service: 'correios'
  //     }, {
  //       message: 'CEP não encontrado na base do ViaCEP.',
  //       service: 'viacep'
  //     }]
  // }

```

### Quando o CEP possui um formato inválido

Neste caso será retornado um `"validation_error"` e a biblioteca irá rejeitar imediatamente a Promise, sem chegar a consultar nenhum fornecedor.

``` js
import cep from 'cep-promise'

cep('123456789123456789')
  .catch(console.log)

  // {
  //     message: 'CEP deve conter exatamente 8 caracteres.',
  //     type: 'validation_error',
  //     errors: [{
  //       message: 'CEP informado possui mais do que 8 caracteres.',
  //       service: 'cep_validation'
  //     }]
  // }
```

## Como contribuir

Leia nosso guia de contribuição [aqui](CONTRIBUTING.md)

## Contribuidores

| [<img src="https://avatars1.githubusercontent.com/u/8251208?v=3&s=115"><br><sub>@lucianopf</sub>](https://github.com/lucianopf) | [<img src="https://avatars1.githubusercontent.com/u/7863230?v=3&s=115"><br><sub>@MarcoWorms</sub>](https://github.com/MarcoWorms) | [<img src="https://avatars1.githubusercontent.com/u/551228?v=3&s=115"><br><sub>@caio-ribeiro-pereira</sub>](https://github.com/caio-ribeiro-pereira) | [<img src="https://avatars1.githubusercontent.com/u/1225447?v=3&s=115"><br><sub>@chrisbenseler</sub>](https://github.com/chrisbenseler) | [<img src="https://avatars0.githubusercontent.com/u/3428149?v=3&s=115"><br><sub>@luanmuniz</sub>](https://github.com/luanmuniz) | [<img src="https://avatars3.githubusercontent.com/u/3094496?v=3&s=115"><br><sub>@AlbertoTrindade</sub>](https://github.com/AlbertoTrindade) |
|:-:|:-:|:-:|:-:|:-:|:-:|
| [<img src="https://avatars1.githubusercontent.com/u/4137355?v=3&s=115"><br><sub>@pedrro</sub>](https://github.com/pedrro) |


## Autor

| [<img src="https://avatars0.githubusercontent.com/u/4248081?v=3&s=115"><br><sub>@filipedeschamps</sub>](https://github.com/filipedeschamps) |
| :---: |
