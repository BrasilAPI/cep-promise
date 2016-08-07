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
</p>

<p align="center">
  Busca por CEP integrado diretamente aos serviços dos correios
</p>


## Features

 * Sem riscos de ficar desatualizado (integração direta aos services dos Correios)
 * Interface de Promise extremamente simples
 * Suporte ao Node.js `0.10.x`, `0.12.x`, `4.x`, `5.x`, and `@stable`
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
  .then(console.log);
  .catch(console.log)

  //  {
  //    "type": "range_error",
  //    "message": "CEP não encontrado na base dos Correios"
  //  }
```
