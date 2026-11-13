## Instruções de criação e nomeação de branches e commits

Essa documentação tem o objetivo de descrever o padrão determinado pelos desenvolvedores para nomeação de branches e commits.  
Esse padrão pode não ser seguido completamente conforme for necessário (ex: commit automático). Mas no geral, é o ideal.

---

### Regras de nomeação das branches:
- **feat/nome-da-feature** - para funcionalidades novas
- **fix/nome-da-correcao** - para correções de bugs
- **hotfix/nome-da-correcao** - também para correções de bugs, mas são correções críticas de funcionalidades
- **docs/nome-do-docs** - apenas mudanças na documentação (como o README ou qualquer outra parte do projeto)
- **design/nome-do-desing** - adição de imagens de design de telas, logo, etc
- **test/nome-do-teste** - adição de testes ou testes automatizados no projeto

Quando uma branch for definida como pronta pelo desenvolvedor, é feito o pull request dela, para ser integrado no projeto principal.  
O desenvolvedor precisa atribuir ao menos duas pessoas para revisar as suas alterações, sendo que ao menos uma delas precisa aprovar para ser permitido o merge.  
Após a aprovação, será feito o merge do pull request, para no fim, a branch ser deletada.

<br>

### Regras de nomeação de commits:
- **feat(escopo)**: o que foi mudado - funcionalidade nova e terminada (atenção no terminada)
- **wip(escopo)**: o que está sendo trabalhado - algo que ainda está sendo desenvolvido, mas não foi completo
- **fix(escopo)**: o que foi consertado - correção de bugs
- **docs**: o que foi feito - apenas para documentação
- **style(escopo)**: o que foi feito - mudanças no estilo do projeto, nada de código funcional
- **refactor(escopo)**: o que foi "limpo" - serve para uma "limpeza de código", apenas reescreve ele, sem necessariamente adicionar algo
- **test(escopo)**: teste que foi feito - para os testes do Jest e automatizados

O escopo é que parte do sistema foi ajustado (login, cadastro, home, questionário, footer, etc - não é necessariamente só um
arquivo, é tudo que faz parte daquele sistema).

Sempre limite o tamanho do título do commit a, no máximo, 50 caracteres, para não ficar muito extenso.  
Caso o título ficar muito grande, e não houver jeito de diminuir, é possível retirar o escopo.  
O título do commit é sempre no modo imperativo: `feat(login): adiciona campo de email`, e não algo como: `feat(login):
fiz o campo de email`.

A preferência é que todos os commits tenham uma descrição, mesmo que breve. O formato dela é livre, mas precisa descrever bem o que foi feito.

<br>

---

<br>

<div align="center">
    <i>Desenvolvido por Atmos<br>2026</i>
</div>
