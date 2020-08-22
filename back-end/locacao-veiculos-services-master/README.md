# locacao-veiculos
Projeto base de backend para o processo seletivo SHX - 08/2020

Este é projeto é um Maven project, portanto, já possui as configurações necessárias para trabalhar com o desenvolvimento dos requisitos do projeto de locação de veículos.

## Principais dependências
- java 8
- spring-boot 2.3.3.RELEASE
- h2 (database)

## Instruções
- Após baixar o projeto, importe o mesmo na sua IDE.
- No arquivo application.properties, estão algumas configurações importantes a serem vistas. Não deixe de conferir.
- Para executar o projeto, execute a partir do main da classe **LocacaoVeiculosServicesApplication**
- Por padrão, está habilitado o console do banco de dados H2. Nesse ambiente, é possível executar as consultas, inserções e updates que deseja. Para acessá-lo, com a aplicação em execução:

http:{seu_ip}:{server.port}/{server.servlet.contextPath}/{spring.h2.console.path}

**Observação:** _Todos os valores das configurações podem ser encontrados no arquivo application.properties._

- Acessando a URL, será exibida uma página na qual será possível informar a URL do JDBC do banco para conexão:
- Preencha com **jdbc:h2:file:${user.home}/locacao_veiculos_db/data**, onde **${user.home}** é a pasta do seu usuário da máquina.
- Preencha com o usuário e senha e conecte.

## O que você DEVE fazer
- A API deve comunicar exclusivamente via JSON.
- Obedecer sempre o MVC. Lembre-se: cada camada tem sua responsabilidade dentro de uma aplicação.
- Código limpo tornará mais facil a compreensão de todos =)
- Boas práticas e otimização são sempre bem vistas.
- Garantir que seu código funcione de acordo com os requisitos.

## O que você NÃO DEVE fazer
- Utilizar Spring Data para gerar os repositórios.
- Códigos confusos e obsoletos.


## Dica
Para criar a camada de Repositório dentro da estrutura Spring e também obter o **EntityManager**:

```
package com.shx.locacao.veiculos.repository;

import javax.persistence.EntityManager;
import org.springframework.stereotype.Repository;

@Repository
public class RepositoryTest {

   @PersistenceContext
   private EntityManager em;

   // Código
}
```

## Por fim
- Em caso de dúvidas, entre em contato.
- Bora codar !!! =)