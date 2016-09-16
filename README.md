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
  Busca por CEP integrado diretamente aos serviços dos Correios
</p>


## Features

 * Sempre atualizado em tempo-real por se conectar diretamente aos serviços dos Correios
 * Sem limites de uso (rate limit) conhecidos
 * Interface de Promise extremamente simples
 * Suporte ao Node.js `0.10.x`, `0.12.x`, `4.x`, `5.x`, `6.x` e `@stable`
 * 100% de code coverage com testes unitários e E2E
 * Desenvolvido utilizando ES6


## Como utilizar


### Instalação

```
$ npm install --save cep-promise
```


### Realizando uma consulta

``` js
import cep from 'cep-promise';

cep('05010000')
  .then(console.log);

  // {
  //   "zipcode":  "05010000",
  //   "state":  "SP",
  //   "city":  "São Paulo",
  //   "street":  "Rua Caiubí",
  //   "neighborhood":  "Perdizes",
  // }
```


### Você também poderá passar o CEP como Inteiro

Em muitos sistemas o CEP é utilizado erroneamente como um Inteiro (e com isto cortanto todos os zeros à esquerda). Caso este seja o seu caso, não há problema, pois a biblioteca irá preencher os caracteres faltantes na string, por exemplo:

``` js
import cep from 'cep-promise';

// enviando sem ter um zero à esquerda do CEP "05010000"
cep(5010000)
  .then(console.log);

  // {
  //   "zipcode":  "05010000",
  //   "state":  "SP",
  //   "city":  "São Paulo",
  //   "street":  "Rua Caiubí",
  //   "neighborhood":  "Perdizes",
  // }
```

### Quando o CEP não é encontrado

``` js
import cep from 'cep-promise';

cep('99999999')
  .catch(console.log);

  //  {
  //    "type": "range_error",
  //    "message": "CEP não encontrado na base dos Correios"
  //  }
```
