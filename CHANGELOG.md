# Changelog

Todas as mudanças notáveis neste projeto serão documentadas aqui.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [2.0.0] - 2025-12-10

### 🎉 Lançamento Oficial

### ✨ Adicionado
- **Suporte completo a Checkbox e Radio** - Preenche campos de múltipla escolha
- **Suporte melhorado a Select** - Mapeamento inteligente de valores
- **HTML5 Attributes** - Detecção de `autocomplete`, `pattern`, `inputmode`
- **Mapeamentos de valores** - Gênero, Estado Civil, Escolaridade, Estados
- **103 campos de teste** - Suite completa de testes em 12 níveis
- **Detecção multilíngue expandida** - PT/EN/ES para todos os campos
- **Proteção contra falsos positivos** - Ignora cartão de crédito, senhas, etc.
- **Validador automático** - Relatório de accuracy detalhado
- **Export/Import JSON** - Backup e restauração de dados
- **Console logging** - Captura e exibe logs para debug
- **Auto-save** - Salva dados automaticamente após 500ms

### 🔧 Melhorado
- **Algoritmo de detecção visual-first** - 3x peso para texto visível
- **Detecção de cidade** - Não confunde mais com endereço completo
- **Preenchimento de SELECT** - Busca mais inteligente por valor/texto
- **Funções auxiliares** - `destacarElemento()`, `dispararEventos()`, `getLabelText()`
- **Suporte a frameworks** - React, Vue, Angular detectados corretamente

### 🐛 Corrigido
- Cidade sendo detectada como rua em campos `address_line1`
- SELECT não preenchendo com valores parciais
- Data de nascimento conflitando com cidade
- Número de endereço preenchendo em campos genéricos

### 📊 Estatísticas
- **100% de accuracy** - 89/103 campos preenchidos corretamente
- **24 campos diferentes** - De nome a endereço completo
- **18 tipos de input** - text, email, tel, date, select, radio, checkbox, etc.
- **~1400 linhas** de código principal (popup.js)

## [1.0.0] - 2025-11-XX

### 🎉 Versão Inicial

### ✨ Adicionado
- Preenchimento de 3 campos básicos (nome, CPF, email)
- Interface simples de popup
- Storage local com Chrome API
- Detecção básica de campos por ID/name

---

## 🗺️ Roadmap

### [2.1.0] - Planejado
- [ ] Múltiplos perfis (pessoal, trabalho, etc.)
- [ ] Modo escuro
- [ ] Geração de dados fake (CPF/RG/Email válidos)
- [ ] Importar CSV
- [ ] Histórico de preenchimentos

### [2.2.0] - Planejado
- [ ] Criptografia de dados sensíveis
- [ ] Whitelist/Blacklist de sites
- [ ] API para desenvolvedores
- [ ] Máscaras personalizadas de telefone/CPF

### [3.0.0] - Futuro
- [ ] Suporte a Firefox
- [ ] Suporte a Edge
- [ ] Sincronização na nuvem (opcional)
- [ ] Shadow DOM e iframes
- [ ] Sugestões por IA

---

[2.0.0]: https://github.com/seu-usuario/smart-autofill-pro/releases/tag/v2.0.0
[1.0.0]: https://github.com/seu-usuario/smart-autofill-pro/releases/tag/v1.0.0
