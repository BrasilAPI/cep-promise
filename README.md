<p align="center">
  <img src="http://piskel-imgstore-b.appspot.com/img/d580e96e-bd8a-11e6-b157-9949cad4d609.gif">
</p>

<h1 align="center">CEP Promise</h1>

<p align="center">
  <a href="https://npm-stat.com/charts.html?package=cep-promise">
    <img src="https://img.shields.io/npm/dm/cep-promise.svg">
  </a>
  <a href="https://coveralls.io/github/BrasilAPI/cep-promise?branch=master">
    <img src="https://coveralls.io/repos/github/BrasilAPI/cep-promise/badge.svg?branch=master">
  </a>
  <a href="https://www.npmjs.com/package/cep-promise">
    <img src="https://badge.fury.io/js/cep-promise.svg">
  </a>
  <a href="http://standardjs.com/">
    <img src="https://img.shields.io/badge/code%20style-standard-brightgreen.svg">
  </a>
  <a href="https://snyk.io/test/github/BrasilAPI/cep-promise">
    <img src="https://snyk.io/test/github/BrasilAPI/cep-promise/badge.svg" alt="Known Vulnerabilities" data-canonical-src="https://snyk.io/test/github/BrasilAPI/cep-promise" style="max-width:100%;">
  </a>
</p>

<p align="center">
  Busca por CEP integrado diretamente aos serviços dos Correios, ViaCEP e WideNet (Node.js e Browser)
</p>

## Features

 * Sempre atualizado em tempo-real por se conectar diretamente aos serviços dos Correios, ViaCEP e WideNet.
 * Possui alta disponibilidade por usar vários serviços como fallback.
 * Sempre retorna a resposta mais rápida por fazer as consultas de forma concorrente.
 * Sem limites de uso (rate limits) conhecidos.
 * Interface de Promise extremamente simples.
 * Suporte ao Node.js `10.x`, `11.x`, `12.x`, `13.x`, `14.x` e `@stable`.
 * Suporte ao Node.js `4.x`, `5.x`, `6.x`, `7.x`, `8.x`, `9.x`, até cep-promise versão `3.0.9`.
 * Suporte ao Node.js `0.10.x` e `0.12.x` até cep-promise versão `2.0.8`.
 * 100% de code coverage com testes unitários e E2E.
 * Desenvolvido utilizando ES6.


## Como utilizar

Teste e aprenda <a href="https://npm.runkit.com/cep-promise" target="_blank">aqui</a>.

### Realizando uma consulta

Por ser multifornecedor, a biblioteca irá resolver a Promise com o fornecedor que **mais rápido** lhe responder.

``` js
import cep from 'cep-promise'

cep('05010000')
  .then(console.log)

  // {
  //   "cep":  "05010000",
  //   "state":  "SP",
  //   "city":  "São Paulo",
  //   "street":  "Rua Caiubí",
  //   "neighborhood":  "Perdizes",
  // }
```


### Você também poderá passar o CEP como Inteiro

Em muitos sistemas o CEP é utilizado erroneamente como um Inteiro (e com isto cortando todos os zeros à esquerda). Caso este seja o seu caso, não há problema, pois a biblioteca irá preencher os caracteres faltantes na String, por exemplo:

``` js
import cep from 'cep-promise'

// enviando sem ter um zero à esquerda do CEP "05010000"
cep(5010000)
  .then(console.log)

  // {
  //   "cep":  "05010000",
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
  //     name: 'CepPromiseError',
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
  //     name: 'CepPromiseError',
  //     message: 'CEP deve conter exatamente 8 caracteres.',
  //     type: 'validation_error',
  //     errors: [{
  //       message: 'CEP informado possui mais do que 8 caracteres.',
  //       service: 'cep_validation'
  //     }]
  // }
```
### Options
- `timeout`: Timeout em milisegundos das consultas em cada serviço. O tempo total poderá ser maior devido a limites no paralelismo.
- `providers`: Lista de providers a serem usados na consulta. Default é usar todos os providers disponíveis.

```js
import cep from 'cep-promise'
cep('5010000', { timeout: 5000, providers: ['brasilapi'] })
  .then(console.log)

```

### Instalação

#### Browser usando CDN
```
<script src="https://cdn.jsdelivr.net/npm/cep-promise/dist/cep-promise.min.js"></script>
```

#### npm

```
$ npm install --save cep-promise
```

#### Bower

```
$ bower install --save cep-promise
```
#### yarn

```
$ yarn add cep-promise
```

#### Angular 2

``` ts
import * as cep from 'cep-promise'

cep('05010000')
  .then(console.log)
```

## Como contribuir

Leia nosso guia de contribuição [aqui](CONTRIBUTING.md)

## Contribuidores

<a href="https://github.com/brasilapi/cep-promise/graphs/contributors"><img src="https://contrib.rocks/image?repo=brasilapi/cep-promise" /></a>

## Autor

| [<img src="https://avatars0.githubusercontent.com/u/4248081?v=3&s=115"><br><sub>@filipedeschamps</sub>](https://github.com/filipedeschamps) |
| :---: |
