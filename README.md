<p align="center">
  <img src="http://piskel-imgstore-b.appspot.com/img/d580e96e-bd8a-11e6-b157-9949cad4d609.gif">
</p>

<h1 align="center">CEP Promise</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/cep-promise">
    <img src="https://img.shields.io/npm/dm/cep-promise.svg">
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
  Busca por CEP integrado diretamente aos serviços dos Correios, ViaCEP e outros (Node.js e Browser)
</p>

## Features

 * Sempre atualizado em tempo-real por se conectar diretamente aos serviços dos Correios, ViaCEP e outros.
 * Possui alta disponibilidade por usar vários serviços como fallback.
 * Sempre retorna a resposta mais rápida por fazer as consultas de forma concorrente.
 * Sem limites de uso (rate limits) conhecidos.
 * Interface de Promise extremamente simples.
 * Suporte ao Node.js `0.10.x`, `0.12.x`, `4.x`, `5.x`, `6.x`, `7.x`, `8.x`, `9.x` e `@stable`.
 * 100% de code coverage com testes unitários e E2E.
 * Desenvolvido utilizando ES6.


## Como utilizar

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
  //     }, {
  //       message: 'CEP não encontrado na base do Cep Aberto.',
  //       service: 'cepaberto'
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


### Instalação

#### Browser usando CDN
```
<script src="https://cdn.jsdelivr.net/npm/cep-promise/dist/cep-promise-browser.min.js"></script>
```

#### npm

```
$ npm install --save cep-promise
```

#### Bower

```
$ bower install --save cep-promise
```

#### Browser
Caso você utilize o `browserify` para gerenciamento de dependência no browser, importe a versão **otimizada** com o seguinte path:

```
require('/dist/cep-promise-browser.min.js')
```

#### Webpack
É possível configurar o `webpack.config.js` trocando caminho do cep-promise para usar o caminho correto da forma abaixo e com isto o `import cep from 'cep-promise'` deverá funcionar como o esperado:

```
  const path = require('path')
  // ...

  resolve: {
    alias: {
      "cep-promise": path.join(__dirname, 'node_modules', 'cep-promise', 'dist', 'cep-promise-browser.min.js')
    }
  }
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

| [<img src="https://avatars1.githubusercontent.com/u/8251208?v=3&s=115"><br><sub>@lucianopf</sub>](https://github.com/lucianopf) | [<img src="https://avatars1.githubusercontent.com/u/7863230?v=3&s=115"><br><sub>@MarcoWorms</sub>](https://github.com/MarcoWorms) | [<img src="https://avatars1.githubusercontent.com/u/551228?v=3&s=115"><br><sub>@caio-ribeiro-pereira</sub>](https://github.com/caio-ribeiro-pereira) | [<img src="https://avatars1.githubusercontent.com/u/1225447?v=3&s=115"><br><sub>@chrisbenseler</sub>](https://github.com/chrisbenseler) | [<img src="https://avatars0.githubusercontent.com/u/3428149?v=3&s=115"><br><sub>@luanmuniz</sub>](https://github.com/luanmuniz) | [<img src="https://avatars3.githubusercontent.com/u/3094496?v=3&s=115"><br><sub>@AlbertoTrindade</sub>](https://github.com/AlbertoTrindade) |
|:-:|:-:|:-:|:-:|:-:|:-:|
| [<img src="https://avatars1.githubusercontent.com/u/4137355?v=3&s=115"><br><sub>@pedrro</sub>](https://github.com/pedrro) | [<img src="https://avatars1.githubusercontent.com/u/8260778?v=3&s=115"><br><sub>@petronetto</sub>](https://github.com/Petronetto) | [<img src="https://avatars3.githubusercontent.com/u/434364?v=3&s=115"><br><sub>@olegon</sub>](https://github.com/olegon) | [<img src="https://avatars3.githubusercontent.com/u/2177742?v=3&s=115"><br><sub>@jhonnymoreira</sub>](https://github.com/jhonnymoreira) | [<img src="https://avatars3.githubusercontent.com/u/2955087?s=115&v=4"><br><sub>@claytonsilva</sub>](https://github.com/claytonsilva)


## Autor

| [<img src="https://avatars0.githubusercontent.com/u/4248081?v=3&s=115"><br><sub>@filipedeschamps</sub>](https://github.com/filipedeschamps) |
| :---: |
