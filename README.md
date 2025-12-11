# Smart Autofill Pro

<div align="center">

![Version](https://img.shields.io/badge/version-2.0.0-2d7a4f.svg)
![License](https://img.shields.io/badge/license-MIT-2d7a4f.svg)
![Chrome](https://img.shields.io/badge/Chrome-Extension-2d7a4f.svg)
![Accuracy](https://img.shields.io/badge/accuracy-100%25-4caf50.svg)

**Preenchimento inteligente de formulários com 100% de precisão**

[🌐 Demo ao Vivo](https://andre12burger.github.io/autofill_information_extension/teste.html) • [📥 Instalação](#instalação) • [⚡ Recursos](#recursos) • [📖 Como Usar](#como-usar) • [🤝 Contribuir](#contribuindo)

</div>

---

## 🌐 Demo ao Vivo

**[👉 Testar a Suite de Testes Online](https://andre12burger.github.io/autofill_information_extension/teste.html)**

Experimente a página de testes completa com 103 campos em 12 níveis de dificuldade. A página funciona perfeitamente com qualquer extensão de autofill para validar precisão e compatibilidade.

---

## 📋 Sobre o Projeto

Smart Autofill Pro é uma extensão do Chrome que preenche formulários automaticamente com **algoritmo de detecção visual avançado**, suportando **24 campos diferentes**, múltiplos tipos de input (text, select, checkbox, radio, textarea) e **detecção multilíngue** (PT/EN/ES).

### Por que usar?

- ✓ **100% de Accuracy** - Testado com 103 cenários diferentes
- ✓ **24 Campos Suportados** - De nome a endereço completo
- ✓ **Detecção Visual-First** - Prioriza o que você vê na tela (peso 3x)
- ✓ **Múltiplos Tipos** - Input, Select, Checkbox, Radio, Textarea
- ✓ **Multilíngue** - Funciona em sites PT/EN/ES
- ✓ **HTML5 Attributes** - Suporta autocomplete, pattern, inputmode
- ✓ **Auto-Save** - Salva automaticamente após 500ms
- ✓ **Export/Import** - Backup em JSON
- ✓ **Privacy First** - Dados salvos localmente no navegador

---

## 🌟 Recursos

### Campos Suportados

#### 👤 Dados Pessoais (8 campos)
- Nome Completo
- Data de Nascimento
- CPF
- RG
- Gênero (text/select/radio/checkbox)
- Estado Civil (text/select/radio)
- Nome da Mãe
- Nome do Pai

#### 📞 Contato (6 campos)
- Email Principal
- Email Secundário
- Telefone/Celular
- Telefone Comercial
- Nome de Emergência
- Telefone de Emergência

#### 💼 Profissional (3 campos)
- Profissão/Ocupação
- Nome da Empresa
- Escolaridade (text/select/radio)

#### 🏠 Endereço (7 campos)
- CEP
- Rua/Avenida
- Número
- Complemento
- Bairro
- Cidade
- Estado/UF (text/select/radio)

### Tecnologias de Detecção

#### 🧠 Algoritmo Inteligente
```
Prioridade 1: Texto Visível (labels, placeholders) - 3x peso
Prioridade 2: Atributos de Acessibilidade (aria-label)
Prioridade 3: HTML5 Attributes (autocomplete, pattern, inputmode)
Prioridade 4: Código (id, name, class)
```

#### 🛡️ Proteção Contra Falsos Positivos
- Ignora campos de login/senha
- Ignora cartão de crédito
- Ignora campos de busca
- Ignora CNPJ (quando não temos o dado)

#### 🌍 Suporte Multilíngue
- Português: nome, email, telefone, endereço, etc.
- Inglês: name, email, phone, address, etc.
- Espanhol: nombre, correo, teléfono, dirección, etc.

---

## 🚀 Instalação

### Opção 1: Chrome Web Store (Recomendado)
1. Acesse a [Chrome Web Store](link-aqui)
2. Clique em "Adicionar ao Chrome"
3. Pronto! ✨

### Opção 2: Instalação Manual (Desenvolvimento)

1. **Clone o repositório:**
```bash
git clone https://github.com/seu-usuario/smart-autofill-pro.git
cd smart-autofill-pro
```

2. **Abra o Chrome e vá para:**
```
chrome://extensions/
```

3. **Ative o "Modo do desenvolvedor"** (canto superior direito)

4. **Clique em "Carregar sem compactação"**

5. **Selecione a pasta do projeto**

6. **Pronto!** A extensão aparecerá na barra de ferramentas

---

## 💡 Como Usar

### Primeira Configuração

1. **Clique no ícone da extensão** na barra de ferramentas
2. **Preencha seus dados** nos 4 painéis:
   - 👤 Dados Pessoais
   - 📞 Contato
   - 💼 Profissional
   - 🏠 Endereço
3. **Dados salvos automaticamente** após 500ms

### Preenchendo Formulários

1. **Acesse qualquer site** com formulário
2. **Clique no ícone** da extensão
3. **Clique em "🚀 Preencher Site!"**
4. **Mágica!** ✨ Campos preenchidos automaticamente

### Atalhos de Teclado

- `Ctrl+Shift+F` (Windows/Linux)
- `Cmd+Shift+F` (Mac)

### Recursos Avançados

#### 📤 Exportar Dados
```
1. Clique em "📥 Exportar JSON"
2. Salve o arquivo
3. Backup seguro dos seus dados!
```

#### 📥 Importar Dados
```
1. Clique em "📂 Importar JSON"
2. Selecione o arquivo
3. Dados restaurados!
```

#### 📋 Validação de Formulários
```
1. Abra teste.html no navegador
2. Clique em "Preencher Site!"
3. Clique em "🔍 VALIDAR PREENCHIMENTO"
4. Veja relatório de accuracy!
```

---

## 🧪 Testes

### Suite de Testes Abrangente

O projeto inclui **103 campos de teste** em **12 níveis de dificuldade**:

| Nível | Descrição | Campos | Dificuldade |
|-------|-----------|--------|-------------|
| 0 | HTML5 Autocomplete | 10 | ⭐ |
| 0.5 | Pattern & InputMode | 5 | ⭐⭐ |
| 1 | Básico | 5 | ⭐ |
| 2 | Médio | 5 | ⭐⭐ |
| 3 | Difícil (Multilíngue) | 8 | ⭐⭐⭐ |
| 4 | Extremo (Armadilhas) | 10 | 🛡️ |
| 5 | Endereço Completo | 7 | ⭐⭐ |
| 6 | Select & Textarea | 4 | ⭐⭐ |
| 7 | Frameworks Modernos | 3 | ⭐⭐⭐ |
| 8 | RG & Data | 4 | ⭐⭐ |
| 9 | Campos Novos | 9 | ⭐⭐ |
| 10 | Data Separada | 8 | ⭐⭐⭐ |
| 11 | Atributos Combinados | 7 | ⭐⭐⭐⭐ |
| 12 | Checkbox & Radio | 18 | ⭐⭐⭐ |

**Resultado:** 🎯 **100% Accuracy** (89/103 preenchidos corretamente, 14 ignorados como esperado)

### Executar Testes

```bash
# Abra teste.html no Chrome
# Use a extensão para preencher
# Clique em "Validar Preenchimento"
# Veja o relatório detalhado
```

---

## 🛠️ Tecnologias

- **JavaScript ES6+** - Lógica principal
- **Chrome Extension API** - Manifest V3
- **Chrome Storage API** - Persistência local
- **HTML5/CSS3** - Interface moderna
- **Regex** - Detecção de padrões

---

## 📊 Estatísticas

- **103** casos de teste
- **24** campos diferentes
- **18** tipos de campo (text, email, tel, date, select, radio, checkbox, etc.)
- **3** idiomas (PT/EN/ES)
- **100%** de accuracy
- **500ms** de debounce para auto-save
- **~1400** linhas de código (popup.js)

---

## 🤝 Contribuindo

Contribuições são muito bem-vindas! 

### Como Contribuir

1. **Fork o projeto**
2. **Crie uma branch** (`git checkout -b feature/MinhaFeature`)
3. **Commit suas mudanças** (`git commit -m 'Adiciona MinhaFeature'`)
4. **Push para a branch** (`git push origin feature/MinhaFeature`)
5. **Abra um Pull Request**

### Ideias para Contribuir

- 🌐 Adicionar mais idiomas (FR, DE, IT, etc.)
- 🔒 Implementar criptografia de dados
- 🎨 Criar temas personalizados
- 📱 Adicionar mais tipos de campos
- 🧪 Escrever mais testes
- 📝 Melhorar documentação
- 🐛 Reportar bugs

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.


## 📈 Roadmap

### Versão 2.1 (Próxima)
- [ ] Múltiplos perfis
- [ ] Modo escuro
- [ ] Geração de dados fake
- [ ] Importar CSV
- [ ] Histórico de preenchimentos

### Versão 2.2
- [ ] Criptografia de dados
- [ ] Whitelist/Blacklist de sites
- [ ] API para desenvolvedores
- [ ] Sugestões por IA

### Versão 3.0
- [ ] Suporte a Firefox
- [ ] Suporte a Edge
- [ ] Sincronização na nuvem
- [ ] App mobile

---

<div align="center">

**⭐ Se este projeto foi útil, dê uma estrela! ⭐**

[⬆ Voltar ao topo](#-smart-autofill-pro)

</div>
