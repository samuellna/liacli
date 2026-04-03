# LIACLI - Sistema de Gestão de Análises Laboratoriais

Este repositório contém o sistema desenvolvido para o LIACLI (Laboratório de Análises Clínicas), com o objetivo de digitalizar e organizar o processo de solicitação de análises, registro de resultados e geração de laudos.

O sistema busca substituir processos manuais e descentralizados, trazendo mais eficiência, redução de erros e melhor rastreabilidade das informações.

---

## Estrutura do Projeto

O projeto está dividido em duas aplicações principais:

```
liacli/
├── client   # Frontend
├── server   # Backend
```

---

## client (Frontend)

Responsável pela interface do sistema.

### Funcionalidades principais:

* Formulário de solicitação de análises (para pesquisadores)
* Painel interno para funcionários
* Visualização de solicitações
* Registro de resultados de forma simplificada
* Visualização de resultados por solicitação

### Objetivo:

Fornecer uma interface simples e intuitiva para:

* entrada de dados (pesquisadores)
* operação interna do laboratório (funcionários)

---

## server (Backend)

Responsável pela lógica de negócio e persistência dos dados.

### Funcionalidades principais:

* API para criação de solicitações de análise
* Gerenciamento de solicitações (status, listagem)
* Registro e armazenamento de amostras
* Registro de resultados laboratoriais
* Geração de dados para laudos
* Controle de acesso para funcionários

### Objetivo:

Centralizar regras de negócio, garantir integridade dos dados e permitir a comunicação entre frontend e banco de dados.

---

## Objetivo do Sistema

O sistema foi projetado para resolver problemas atuais do LIACLI, como:

* uso de múltiplas ferramentas (WhatsApp, papel, planilhas)
* retrabalho na transcrição de dados
* dificuldade de organização e rastreabilidade

Com a solução proposta, espera-se:

* reduzir erros
* otimizar tempo da equipe
* centralizar informações
* melhorar o controle das análises realizadas

---

## Observações

Este projeto está em desenvolvimento e pode evoluir conforme novas necessidades do laboratório forem identificadas.
