# 📚 Guia Completo - Tipos de Campos para Autofill

## 🎯 Objetivo
Este documento lista **todos os tipos de campos de entrada** que podem existir em sites modernos e como preparar o autofill para detectá-los.

---

## 1️⃣ HTML NATIVO

### Input Types Padrão
```html
<!-- ✅ JÁ SUPORTADOS -->
<input type="text">          <!-- Texto genérico -->
<input type="email">         <!-- Email -->
<input type="tel">           <!-- Telefone -->
<input type="date">          <!-- Data -->
<input type="number">        <!-- Números -->
<input type="url">           <!-- URLs -->
<input type="search">        <!-- Busca -->

<!-- ⚠️ PARCIALMENTE SUPORTADOS -->
<input type="password">      <!-- Senha (ignoramos por segurança) -->
<input type="hidden">        <!-- Campos ocultos -->

<!-- 🔄 TIPOS ESPECIAIS -->
<input type="datetime-local"> <!-- Data e hora -->
<input type="time">           <!-- Apenas hora -->
<input type="month">          <!-- Mês/Ano -->
<input type="week">           <!-- Semana -->
<input type="range">          <!-- Slider numérico -->
<input type="color">          <!-- Seletor de cor -->
<input type="file">           <!-- Upload de arquivo -->
```

### Textarea
```html
<textarea></textarea>         <!-- ✅ Suportado -->
```

### Select (Dropdown)
```html
<select>                      <!-- ✅ Suportado -->
  <option value="val">Texto</option>
</select>

<select multiple>             <!-- ❌ Não suportado ainda -->
  <option>Item 1</option>
</select>
```

### Datalist (Autocomplete Nativo)
```html
<input list="opcoes">         <!-- ⚠️ Funciona como input normal -->
<datalist id="opcoes">
  <option value="Opção 1">
</datalist>
```

---

## 2️⃣ FRAMEWORKS JAVASCRIPT

### React
```jsx
// Componentes controlados
<input 
  value={state} 
  onChange={handler}
  data-testid="email-input"
/>

// Material-UI
<TextField 
  variant="outlined"
  inputProps={{ name: "email" }}
/>

// Ant Design
<Input 
  placeholder="CPF"
  name="cpf"
/>

// Chakra UI
<Input 
  size="lg"
  name="telefone"
/>
```

**✅ Detecção:** Buscar por `input`, `textarea` reais no DOM (React renderiza HTML normal).

### Vue.js
```html
<!-- v-model binding -->
<input v-model="usuario.nome">

<!-- Element UI -->
<el-input v-model="email"></el-input>

<!-- Vuetify -->
<v-text-field v-model="cpf"></v-text-field>
```

**✅ Detecção:** Procurar atributos Vue (`v-model`, `data-v-*`) e elementos reais.

### Angular
```html
<!-- Two-way binding -->
<input [(ngModel)]="nome">

<!-- Angular Material -->
<mat-form-field>
  <input matInput placeholder="Email">
</mat-form-field>

<!-- PrimeNG -->
<p-inputText [(ngModel)]="cpf"></p-inputText>
```

**✅ Detecção:** Buscar inputs dentro de wrappers Angular (`mat-form-field`, etc).

---

## 3️⃣ BIBLIOTECAS DE UI

### Material Design
```html
<!-- Material-UI (React) -->
<div class="MuiTextField-root">
  <input class="MuiInputBase-input">
</div>

<!-- Vuetify -->
<div class="v-text-field">
  <input>
</div>

<!-- Angular Material -->
<mat-form-field>
  <input matInput>
</mat-form-field>
```

**🔍 Como Detectar:**
```javascript
// Procurar por classes específicas
const materialInputs = document.querySelectorAll('.MuiInputBase-input, .v-text-field input, mat-form-field input');
```

### Bootstrap
```html
<div class="form-group">
  <input class="form-control" type="text">
</div>

<!-- Bootstrap 5 -->
<div class="mb-3">
  <input class="form-control">
</div>
```

### Ant Design
```html
<span class="ant-input-wrapper">
  <input class="ant-input">
</span>
```

### Semantic UI
```html
<div class="ui input">
  <input type="text">
</div>
```

---

## 4️⃣ CAMPOS ESPECIALIZADOS

### 1. Masked Inputs (Máscaras)

#### react-input-mask
```jsx
<InputMask mask="999.999.999-99" />
```

#### cleave.js
```html
<input class="cleave-cpf">
<script>
new Cleave('.cleave-cpf', {
  blocks: [3, 3, 3, 2],
  delimiters: ['.', '.', '-']
});
</script>
```

#### vanilla-masker
```javascript
VMasker(input).maskPattern("(99) 99999-9999");
```

**✅ Estratégia:** Preencher o valor e disparar eventos `input` + `change`.

### 2. Date Pickers

#### Flatpickr
```html
<input class="flatpickr" data-enable-time>
```

#### react-datepicker
```jsx
<DatePicker selected={date} onChange={setDate} />
```

#### Air Datepicker
```html
<input class="datepicker">
```

**✅ Estratégia:** 
1. Tentar preencher input diretamente
2. Procurar por `_flatpickr` ou `datepicker` no elemento
3. Chamar APIs específicas: `element._flatpickr.setDate()`

### 3. Autocomplete/Select Customizados

#### Select2
```html
<select class="select2">
  <option value="SP">São Paulo</option>
</select>
```

#### react-select
```jsx
<Select 
  options={[{ value: 'sp', label: 'SP' }]}
  onChange={handler}
/>
```

**✅ Estratégia:**
1. Buscar input oculto ou select original
2. Buscar elemento de texto visível
3. Simular cliques e digitação

### 4. Rich Text Editors

#### TinyMCE
```html
<textarea id="editor"></textarea>
<script>
tinymce.init({ selector: '#editor' });
</script>
```

#### Quill
```html
<div id="editor"></div>
```

#### CKEditor
```html
<div class="ck-editor">
  <div class="ck-content" contenteditable="true"></div>
</div>
```

**✅ Estratégia:**
1. Detectar `contenteditable="true"`
2. Usar `.innerHTML` ou `.innerText`
3. Disparar eventos de mudança

### 5. ContentEditable (Div como Input)
```html
<div contenteditable="true" data-placeholder="Digite aqui"></div>
```

**✅ Estratégia:**
```javascript
elemento.innerText = "Texto";
elemento.dispatchEvent(new Event('input', { bubbles: true }));
```

---

## 5️⃣ WEB COMPONENTS (Modernos)

### Custom Elements
```html
<my-input name="email" value=""></my-input>

<custom-form>
  #shadow-root
    <input type="text">
</custom-form>
```

**✅ Estratégia:**
1. Acessar Shadow DOM: `element.shadowRoot`
2. Buscar inputs dentro: `shadowRoot.querySelectorAll('input')`

```javascript
function buscarEmShadowDOM(elemento) {
  if (elemento.shadowRoot) {
    return elemento.shadowRoot.querySelectorAll('input, textarea, select');
  }
}
```

---

## 6️⃣ IFRAMES

```html
<iframe src="formulario.html"></iframe>
```

**✅ Estratégia:**
```javascript
// Acessar conteúdo do iframe
const iframe = document.querySelector('iframe');
const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
const inputs = iframeDoc.querySelectorAll('input');
```

**⚠️ Limitação:** Só funciona se iframe for **same-origin** (mesmo domínio).

---

## 7️⃣ CAMPOS ESPECIAIS

### Tags Input
```html
<!-- Tagify -->
<input class="tagify">

<!-- React Tag Input -->
<ReactTags tags={tags} />
```

### Toggle/Switch
```html
<label class="switch">
  <input type="checkbox">
  <span class="slider"></span>
</label>
```

### Range/Slider
```html
<input type="range" min="0" max="100">

<!-- noUiSlider -->
<div id="slider"></div>
```

### Color Picker
```html
<input type="color">

<!-- React Color -->
<SketchPicker color={color} />
```

### File Upload
```html
<input type="file">

<!-- Dropzone -->
<div class="dropzone"></div>

<!-- react-dropzone -->
<Dropzone onDrop={handleDrop} />
```

---

## 🎯 ESTRATÉGIA UNIVERSAL DE DETECÇÃO

### Função para Detectar TODOS os Campos

```javascript
function buscarTodosCampos() {
  const campos = [];
  
  // 1. HTML Nativo
  const nativos = document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]), textarea, select');
  campos.push(...nativos);
  
  // 2. ContentEditable
  const editaveis = document.querySelectorAll('[contenteditable="true"]');
  campos.push(...editaveis);
  
  // 3. Shadow DOM (Web Components)
  const componentes = document.querySelectorAll('*');
  componentes.forEach(el => {
    if (el.shadowRoot) {
      const shadowInputs = el.shadowRoot.querySelectorAll('input, textarea, select');
      campos.push(...shadowInputs);
    }
  });
  
  // 4. Iframes (same-origin)
  const iframes = document.querySelectorAll('iframe');
  iframes.forEach(iframe => {
    try {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      const iframeInputs = iframeDoc.querySelectorAll('input, textarea, select');
      campos.push(...iframeInputs);
    } catch (e) {
      console.log('Iframe cross-origin, não pode acessar');
    }
  });
  
  return campos;
}
```

---

## 🔍 COMO PESQUISAR NOVOS TIPOS

### 1. Inspecionar Elemento (F12)
```
1. Clique-direito no campo → Inspecionar
2. Veja o HTML gerado
3. Anote classes, IDs, atributos especiais
```

### 2. Console do Navegador
```javascript
// Ver tipo do elemento
console.log($0.tagName); // INPUT, DIV, etc

// Ver classes
console.log($0.className);

// Ver atributos
console.log($0.attributes);

// Ver se tem Shadow DOM
console.log($0.shadowRoot);

// Ver eventos
getEventListeners($0);
```

### 3. Pesquisar Bibliotecas Populares
- **npm trends:** https://npmtrends.com
- **GitHub stars:** Procurar "react input", "vue form", etc
- **Stack Overflow:** Procurar problemas relacionados

### 4. Detectar Framework Usado
```javascript
// React
window.React || document.querySelector('[data-reactroot]')

// Vue
window.Vue || document.querySelector('[data-v-]')

// Angular
window.ng || document.querySelector('[ng-version]')

// jQuery
window.jQuery || window.$
```

---

## 📝 CHECKLIST DE COMPATIBILIDADE

### ✅ Suportado Atualmente
- [x] Input text/email/tel/date
- [x] Textarea
- [x] Select (dropdown simples)
- [x] ContentEditable (parcial)

### 🔄 Em Desenvolvimento
- [ ] Shadow DOM
- [ ] Iframes
- [ ] Masked inputs
- [ ] Date pickers customizados
- [ ] Autocomplete/Select2
- [ ] Rich text editors

### 🎯 Próximos Passos
1. Adicionar detecção de Shadow DOM
2. Melhorar suporte a date pickers
3. Adicionar suporte a masked inputs
4. Criar sistema de plugins para novos tipos

---

## 🚀 Como Adicionar Suporte a Novo Tipo

1. **Identificar:** Inspecionar o campo no site
2. **Testar:** Tentar preencher manualmente via console
3. **Implementar:** Adicionar lógica no `popup.js`
4. **Validar:** Testar no `teste.html`
5. **Documentar:** Atualizar este arquivo

---

## 📚 Recursos Úteis

- **MDN Web Docs:** https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/input
- **Can I Use:** https://caniuse.com (Compatibilidade de navegadores)
- **Component Libraries:** Material-UI, Ant Design, Bootstrap docs
- **Web Components:** https://developer.mozilla.org/en-US/docs/Web/Web_Components

---

**Última atualização:** 10/12/2025
