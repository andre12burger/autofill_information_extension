# Contribuindo para Smart Autofill Pro

Obrigado por considerar contribuir! 🎉

## Como Contribuir

### Reportando Bugs

1. Verifique se o bug já foi reportado nas [Issues](../../issues)
2. Crie uma nova issue com:
   - Título claro e descritivo
   - Passos para reproduzir
   - Comportamento esperado vs obtido
   - Screenshots (se aplicável)
   - Versão do Chrome e da extensão

### Sugerindo Melhorias

1. Verifique se a sugestão já existe nas [Issues](../../issues)
2. Crie uma nova issue com:
   - Descrição clara da funcionalidade
   - Por que seria útil
   - Exemplos de uso

### Pull Requests

1. **Fork** o projeto
2. Crie uma **branch** para sua feature (`git checkout -b feature/MinhaFeature`)
3. **Commit** suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. **Push** para a branch (`git push origin feature/MinhaFeature`)
5. Abra um **Pull Request**

#### Checklist do PR

- [ ] Código segue o estilo do projeto
- [ ] Testes passam (teste.html com 100% accuracy)
- [ ] Documentação atualizada (se necessário)
- [ ] Commit messages são claros

## Padrões de Código

### JavaScript

```javascript
// Use const/let, não var
const dados = { nome: "André" };

// Funções com nomes descritivos
function preencherCampo(elemento, valor) {
    // ...
}

// Comentários claros
// 1. COLETA DE PISTAS (visual primeiro)
// 2. DETECÇÃO DE TIPO
// 3. PREENCHIMENTO
```

### Commits

```
feat: adiciona suporte a máscaras personalizadas
fix: corrige detecção de cidade em campos multilíngues
docs: atualiza README com novos exemplos
test: adiciona testes para checkbox/radio
```

## Áreas para Contribuir

### 🌐 Internacionalização
- Adicionar suporte a novos idiomas (FR, DE, IT, etc.)
- Melhorar dicionários existentes

### 🔒 Segurança
- Implementar criptografia de dados
- Adicionar senha mestra
- Melhorar privacy

### 🎨 UI/UX
- Criar temas (dark mode, etc.)
- Melhorar acessibilidade
- Animações e feedback visual

### 🧪 Testes
- Adicionar mais casos de teste
- Testar em sites reais
- Automatizar testes

### 📱 Novos Campos
- Adicionar campos de endereço internacional
- Suportar campos de pagamento (com cuidado!)
- Campos personalizados

## Dúvidas?

Abra uma [issue](../../issues) ou entre em contato!
