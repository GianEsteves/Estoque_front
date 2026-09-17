# Estoque Frontend

Interface React/Vite para a API de gestão de estoque.

## Desenvolvimento

```bash
npm ci
npm run dev
```

Crie `.env` a partir de `.env.example` e defina a URL local da API.

## Deploy com Docker

`VITE_API_URL` é incorporada durante a build. No deploy, informe a URL HTTPS pública da API, sem barra final.

```bash
docker build --build-arg VITE_API_URL=https://sua-api.exemplo.com -t estoque-front .
docker run -p 8080:80 estoque-front
```

O Nginx inclui fallback para `index.html`, mantendo as rotas React acessíveis diretamente.

Depois do deploy, configure a URL pública do frontend na variável `CLIENT_URL` da API e faça uma nova publicação do backend.
