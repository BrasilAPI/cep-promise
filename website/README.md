# CEP Promise Website
> Site para a lib cep-promise

## Contribua

1. Instale [Node](https://nodejs.org/en/). Baixe a versão "Recommend for Most Users".

2. Clone o repoitório:
``` bash
git clone git@github.com:filipedeschamps/cep-promise.git
```

3. Vá ao diretório contendo o website
``` bash
cd cep-promise/website
```

4. Instale as dependências do projeto
``` bash
npm install
```

5. Se você quiser apenas compilar o projeto, rode:
``` bash
npm run build
```

6. Do contrário, rode:
``` bash
npm run start
```

O website estará servido em `http://localhost:7000` e o browser recarregará a página a cada alteração.

## Testes

1. Garante que todo o código adicionado está coberto com testes unitários:
``` bash
npm run test
```

2. Você pode opcionalmente gerar um relatório de cobertura de código após rodar os testes:
``` bash
npm run test -- --coverage
```
