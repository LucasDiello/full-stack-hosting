# Projeto MERN Full Stack APP projeto para venda de imóveis!
#### (Em desenvolvimento)

 - Visão Geral :
O Projeto Full Stack APP é uma aplicação para compra de imóveis, desenvolvida utilizando a stack MERN (MongoDB, Express, React e Node.js). A aplicação permite que os usuários visualizem, filtrem, conversem com o dono do imóvel, e negociem além de gerenciar suas contas e preferências.

![GitHub last commit](https://img.shields.io/github/last-commit/LucasDiello/Next-js-Ecommerce)

## Arquitetura utilizada (até o momento):

<div>
  <img src="/api/frontend/public/arquitetura.png" alt="Imagem 1"  />
</div>

## Pré visualização:
<div display=grid>
  <img src="/api/frontend/public/host1.png" alt="Imagem 1" width=400 object-fit=cover/>
  <img src="/api/frontend/public/host10.png" alt="Imagem 1" width=400 object-fit=cover/>
  <img src="/api/frontend/public/host11.png" alt="Imagem 1" width=400 object-fit=cover/>
  <img src="/api/frontend/public/host2.png" alt="Imagem 2"  width=400 object-fit=cover/>
  <img src="/api/frontend/public/host3.png" alt="Imagem 3"  width=400 object-fit=cover/>
  <img src="/api/frontend/public/host4.png" alt="Imagem 4"  width=400 object-fit=cover/>
  <img src="/api/frontend/public/host6.png" alt="Imagem 6"  width=400 object-fit=cover/>
  <img src="/api/frontend/public/host7.png" alt="Imagem 7"  width=400 object-fit=cover/>
  <img src="/api/frontend/public/host8.png" alt="Imagem 8"  width=400 object-fit=cover/>
  <img src="/api/frontend/public/host9.png" alt="Imagem 9"  width=400 object-fit=cover/>
</div>

## Tecnologias Utilizadas

### - Back end -
- MongoDB: Banco de dados NoSQL para armazenar informações sobre imóveis e usuários.
- Prisma: Ferramenta (ORM) para Node.js e TypeScript. Ele facilita a interação com bancos de dados.
- Express: Framework para construir a API backend.
- JWT: JSON Web Tokens (JWT) são uma forma popular de autenticação e autorização em aplicações web.
- Google Auth: Autenticação com o Google.
- Socket.io - biblioteca para JavaScript que permite a comunicação em tempo real entre cliente e servidor.
- Node.js: Ambiente de execução JavaScript para o backend.

![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)
![Google Auth](https://img.shields.io/badge/Google%20Auth-4285F4?style=for-the-badge&logo=google&logoColor=white)
### - Front end -
- React: Biblioteca para construir a interface do usuário (frontend).
- SCSS: Adiciona funcionalidades avançadas ao CSS, facilitando a escrita e a manutenção de estilos.
- Leaflet: É uma biblioteca de JavaScript para criar mapas interativos em páginas web.
- Cloudnary: Plataforma de gerenciamento e otimização de mídia na nuvem, que oferece serviços para armazenamento, transformação e entrega de imagens e vídeos.
- Zustand: Biblioteca para gerenciamento de estado em React que se destaca pela simplicidade e performance.
  
![React](https://img.shields.io/badge/React-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![SCSS](https://img.shields.io/badge/SCSS-CC6699?style=for-the-badge&logo=sass&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-003300?style=for-the-badge&logo=leaflet&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-2D9CDB?style=for-the-badge&logo=cloudinary&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-007ACC?style=for-the-badge&logo=zustand&logoColor=white)

#### Outros
![JavaScript](https://img.shields.io/badge/JavaScript-F0DB4F?style=for-the-badge&logo=javascript&logoColor=F0DB4F)

## Estrutura da Aplicação:

O projeto é organizado em três principais diretórios:

- /api : Contém o backend da aplicação, incluindo o prisma & controller & service & auth & middleware.

- /api/frontend : Contém o código React para a interface do usuário.

- /api/socket : Contém o código para a comunicação em tempo real (se aplicável).
