// ======================================================
// PARTE 0: SISTEMA DE CAPTURA DE LOGS
// ======================================================

let extensionLogs = [];

// Captura console.log original
const originalConsoleLog = console.log;
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;

console.log = function(...args) {
    extensionLogs.push({
        tipo: 'LOG',
        timestamp: new Date().toLocaleTimeString('pt-BR'),
        mensagem: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' ')
    });
    originalConsoleLog.apply(console, args);
};

console.warn = function(...args) {
    extensionLogs.push({
        tipo: 'WARN',
        timestamp: new Date().toLocaleTimeString('pt-BR'),
        mensagem: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' ')
    });
    originalConsoleWarn.apply(console, args);
};

console.error = function(...args) {
    extensionLogs.push({
        tipo: 'ERROR',
        timestamp: new Date().toLocaleTimeString('pt-BR'),
        mensagem: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' ')
    });
    originalConsoleError.apply(console, args);
};

// ======================================================
// PARTE 1: LÓGICA DO POPUP (Salvar e Carregar Dados)
// ======================================================

// 0. SISTEMA DE COLAPSO DAS SEÇÕES (com persistência de estado)
document.addEventListener('DOMContentLoaded', function() {
    const titulos = document.querySelectorAll('.secao-titulo');
    
    // Carrega estado salvo das seções
    chrome.storage.local.get(['secoes_estado'], function(resultado) {
        const estadoSalvo = resultado.secoes_estado || {};
        
        titulos.forEach((titulo, index) => {
            const secao = titulo.parentElement;
            const secaoId = secao.querySelector('.campos')?.id || `secao_${index}`;
            
            // Restaura estado (se estava collapsed, mantém collapsed)
            if (estadoSalvo[secaoId] === 'collapsed') {
                secao.classList.add('collapsed');
            }
            
            titulo.style.cursor = 'pointer';
            titulo.addEventListener('click', function() {
                secao.classList.toggle('collapsed');
                
                // Salva o novo estado
                const novoEstado = {};
                document.querySelectorAll('.secao').forEach((s, i) => {
                    const id = s.querySelector('.campos')?.id || `secao_${i}`;
                    novoEstado[id] = s.classList.contains('collapsed') ? 'collapsed' : 'expanded';
                });
                
                chrome.storage.local.set({ secoes_estado: novoEstado });
            });
        });
    });
});

// 1. Pegando os elementos da tela
const inputNome = document.getElementById('nome');
const inputDataNascimento = document.getElementById('dataNascimento');
const inputCpf = document.getElementById('cpf');
const inputRg = document.getElementById('rg');
const inputGenero = document.getElementById('genero');
const inputEstadoCivil = document.getElementById('estadoCivil');
const inputNomeMae = document.getElementById('nomeMae');
const inputNomePai = document.getElementById('nomePai');
const inputEmail = document.getElementById('email');
const inputEmailSecundario = document.getElementById('emailSecundario');
const inputTelefone = document.getElementById('telefone');
const inputTelefoneComercial = document.getElementById('telefoneComercial');
const inputNomeEmergencia = document.getElementById('nomeEmergencia');
const inputTelefoneEmergencia = document.getElementById('telefoneEmergencia');
const inputProfissao = document.getElementById('profissao');
const inputNomeEmpresa = document.getElementById('nomeEmpresa');
const inputEscolaridade = document.getElementById('escolaridade');
const inputCep = document.getElementById('cep');
const inputRua = document.getElementById('rua');
const inputNumero = document.getElementById('numero');
const inputComplemento = document.getElementById('complemento');
const inputBairro = document.getElementById('bairro');
const inputCidade = document.getElementById('cidade');
const inputEstado = document.getElementById('estado');
const statusSalvamento = document.getElementById('statusSalvamento');
const btnPreencher = document.getElementById('btnPreencher');

// ======================================================
// MÁSCARAS DE FORMATAÇÃO (aplicadas ao digitar)
// ======================================================

// Máscara de CPF: 000.000.000-00
if (inputCpf) {
    inputCpf.addEventListener('input', function(e) {
        let valor = e.target.value.replace(/\D/g, ''); // Remove tudo que não é número
        valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
        valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
        valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        e.target.value = valor;
    });
}

// Máscara de Telefone: (00) 00000-0000 ou (00) 0000-0000
if (inputTelefone) {
    inputTelefone.addEventListener('input', function(e) {
        let valor = e.target.value.replace(/\D/g, '');
        if (valor.length <= 10) {
            valor = valor.replace(/(\d{2})(\d)/, '($1) $2');
            valor = valor.replace(/(\d{4})(\d)/, '$1-$2');
        } else {
            valor = valor.replace(/(\d{2})(\d)/, '($1) $2');
            valor = valor.replace(/(\d{5})(\d)/, '$1-$2');
        }
        e.target.value = valor;
    });
}

// Máscara de CEP: 00000-000
if (inputCep) {
    inputCep.addEventListener('input', function(e) {
        let valor = e.target.value.replace(/\D/g, '');
        valor = valor.replace(/(\d{5})(\d)/, '$1-$2');
        e.target.value = valor;
    });
}

// Máscara de Data: DD/MM/AAAA
if (inputDataNascimento) {
    inputDataNascimento.addEventListener('input', function(e) {
        let valor = e.target.value.replace(/\D/g, '');
        valor = valor.replace(/(\d{2})(\d)/, '$1/$2');
        valor = valor.replace(/(\d{2})(\d)/, '$1/$2');
        e.target.value = valor;
    });
}

// Máscara de Telefone Comercial (fixo): (00) 0000-0000
if (inputTelefoneComercial) {
    inputTelefoneComercial.addEventListener('input', function(e) {
        let valor = e.target.value.replace(/\D/g, '');
        valor = valor.replace(/(\d{2})(\d)/, '($1) $2');
        valor = valor.replace(/(\d{4})(\d)/, '$1-$2');
        e.target.value = valor.substring(0, 14);
    });
}

// Máscara de Telefone Emergência: (00) 00000-0000
if (inputTelefoneEmergencia) {
    inputTelefoneEmergencia.addEventListener('input', function(e) {
        let valor = e.target.value.replace(/\D/g, '');
        valor = valor.replace(/(\d{2})(\d)/, '($1) $2');
        valor = valor.replace(/(\d{5})(\d)/, '$1-$2');
        e.target.value = valor.substring(0, 15);
    });
}

// Estado sempre em maiúsculas (SP, RJ, MG)
if (inputEstado) {
    inputEstado.addEventListener('input', function(e) {
        e.target.value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
    });
}

// ======================================================
// VALIDAÇÕES
// ======================================================

function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    
    let soma = 0, resto;
    for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i-1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    
    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i-1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;
    
    return true;
}

function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validarTelefone(telefone) {
    const numeros = telefone.replace(/\D/g, '');
    return numeros.length === 10 || numeros.length === 11;
}

function validarCEP(cep) {
    const numeros = cep.replace(/\D/g, '');
    return numeros.length === 8;
}

// 2. Carregar dados salvos assim que abrir
chrome.storage.local.get([
    'usuario_nome', 'usuario_dataNascimento', 'usuario_cpf', 'usuario_rg',
    'usuario_genero', 'usuario_estadoCivil', 'usuario_nomeMae', 'usuario_nomePai',
    'usuario_email', 'usuario_emailSecundario', 'usuario_telefone', 'usuario_telefoneComercial',
    'usuario_nomeEmergencia', 'usuario_telefoneEmergencia',
    'usuario_profissao', 'usuario_nomeEmpresa', 'usuario_escolaridade',
    'usuario_cep', 'usuario_rua', 'usuario_numero', 'usuario_complemento', 
    'usuario_bairro', 'usuario_cidade', 'usuario_estado'
], function(resultado) {
    if (resultado.usuario_nome) inputNome.value = resultado.usuario_nome;
    if (resultado.usuario_dataNascimento) inputDataNascimento.value = resultado.usuario_dataNascimento;
    if (resultado.usuario_cpf) inputCpf.value = resultado.usuario_cpf;
    if (resultado.usuario_rg) inputRg.value = resultado.usuario_rg;
    if (resultado.usuario_genero) inputGenero.value = resultado.usuario_genero;
    if (resultado.usuario_estadoCivil) inputEstadoCivil.value = resultado.usuario_estadoCivil;
    if (resultado.usuario_nomeMae) inputNomeMae.value = resultado.usuario_nomeMae;
    if (resultado.usuario_nomePai) inputNomePai.value = resultado.usuario_nomePai;
    if (resultado.usuario_email) inputEmail.value = resultado.usuario_email;
    if (resultado.usuario_emailSecundario) inputEmailSecundario.value = resultado.usuario_emailSecundario;
    if (resultado.usuario_telefone) inputTelefone.value = resultado.usuario_telefone;
    if (resultado.usuario_telefoneComercial) inputTelefoneComercial.value = resultado.usuario_telefoneComercial;
    if (resultado.usuario_nomeEmergencia) inputNomeEmergencia.value = resultado.usuario_nomeEmergencia;
    if (resultado.usuario_telefoneEmergencia) inputTelefoneEmergencia.value = resultado.usuario_telefoneEmergencia;
    if (resultado.usuario_profissao) inputProfissao.value = resultado.usuario_profissao;
    if (resultado.usuario_nomeEmpresa) inputNomeEmpresa.value = resultado.usuario_nomeEmpresa;
    if (resultado.usuario_escolaridade) inputEscolaridade.value = resultado.usuario_escolaridade;
    if (resultado.usuario_cep) inputCep.value = resultado.usuario_cep;
    if (resultado.usuario_rua) inputRua.value = resultado.usuario_rua;
    if (resultado.usuario_numero) inputNumero.value = resultado.usuario_numero;
    if (resultado.usuario_complemento) inputComplemento.value = resultado.usuario_complemento;
    if (resultado.usuario_bairro) inputBairro.value = resultado.usuario_bairro;
    if (resultado.usuario_cidade) inputCidade.value = resultado.usuario_cidade;
    if (resultado.usuario_estado) inputEstado.value = resultado.usuario_estado;
});

// 3. AUTO-SAVE: Salva automaticamente ao digitar (com debounce de 500ms)
let timeoutSalvamento = null;

function salvarDados() {
    // Limpa timeout anterior
    if (timeoutSalvamento) clearTimeout(timeoutSalvamento);
    
    // Aguarda 500ms após parar de digitar
    timeoutSalvamento = setTimeout(() => {
        // Validações antes de salvar
        const avisos = [];
        
        if (inputCpf.value && !validarCPF(inputCpf.value)) {
            avisos.push('CPF inválido');
            inputCpf.style.borderColor = 'red';
        } else if (inputCpf.value) {
            inputCpf.style.borderColor = '#ced4da';
        }
        
        if (inputEmail.value && !validarEmail(inputEmail.value)) {
            avisos.push('E-mail inválido');
            inputEmail.style.borderColor = 'red';
        } else if (inputEmail.value) {
            inputEmail.style.borderColor = '#ced4da';
        }
        
        if (inputTelefone.value && !validarTelefone(inputTelefone.value)) {
            avisos.push('Telefone inválido (use 10 ou 11 dígitos)');
            inputTelefone.style.borderColor = 'red';
        } else if (inputTelefone.value) {
            inputTelefone.style.borderColor = '#ced4da';
        }
        
        if (inputCep.value && !validarCEP(inputCep.value)) {
            avisos.push('CEP inválido (use 8 dígitos)');
            inputCep.style.borderColor = 'red';
        } else if (inputCep.value) {
            inputCep.style.borderColor = '#ced4da';
        }
        
        if (avisos.length > 0) {
            alert('Corrija os seguintes campos:\n\n• ' + avisos.join('\n• '));
            return;
        }
        
        // Salva todos os dados
        chrome.storage.local.set({
            usuario_nome: inputNome.value,
            usuario_dataNascimento: inputDataNascimento.value,
            usuario_cpf: inputCpf.value,
            usuario_rg: inputRg.value,
            usuario_genero: inputGenero.value,
            usuario_estadoCivil: inputEstadoCivil.value,
            usuario_nomeMae: inputNomeMae.value,
            usuario_nomePai: inputNomePai.value,
            usuario_email: inputEmail.value,
            usuario_emailSecundario: inputEmailSecundario.value,
            usuario_telefone: inputTelefone.value,
            usuario_telefoneComercial: inputTelefoneComercial.value,
            usuario_nomeEmergencia: inputNomeEmergencia.value,
            usuario_telefoneEmergencia: inputTelefoneEmergencia.value,
            usuario_profissao: inputProfissao.value,
            usuario_nomeEmpresa: inputNomeEmpresa.value,
            usuario_escolaridade: inputEscolaridade.value,
            usuario_cep: inputCep.value,
            usuario_rua: inputRua.value,
            usuario_numero: inputNumero.value,
            usuario_complemento: inputComplemento.value,
            usuario_bairro: inputBairro.value,
            usuario_cidade: inputCidade.value,
            usuario_estado: inputEstado.value
        }, function() {
            // Feedback visual discreto
            if (statusSalvamento) {
                statusSalvamento.style.opacity = '1';
                setTimeout(() => {
                    statusSalvamento.style.opacity = '0';
                }, 1500);
            }
        });
    }, 500); // 500ms de debounce
}

// Adiciona listeners em TODOS os inputs/selects para auto-save
[inputNome, inputDataNascimento, inputCpf, inputRg, inputGenero, inputEstadoCivil,
 inputNomeMae, inputNomePai, inputEmail, inputEmailSecundario, inputTelefone,
 inputTelefoneComercial, inputNomeEmergencia, inputTelefoneEmergencia,
 inputProfissao, inputNomeEmpresa, inputEscolaridade, inputCep, inputRua,
 inputNumero, inputComplemento, inputBairro, inputCidade, inputEstado
].forEach(elemento => {
    if (elemento) {
        elemento.addEventListener('input', salvarDados);
        elemento.addEventListener('change', salvarDados); // Para selects
    }
});

// Remove listeners de validação inline (agora só valida ao preencher)
// Validações ficam silenciosas

// 4. Botão PREENCHER: Envia o robô para a página
if (btnPreencher) {
    btnPreencher.addEventListener('click', function() {
        
        // Pega os valores atuais dos inputs
        const dadosParaEnviar = {
            nome: inputNome.value,
            dataNascimento: inputDataNascimento.value,
            cpf: inputCpf.value,
            rg: inputRg.value,
            genero: inputGenero.value,
            estadoCivil: inputEstadoCivil.value,
            nomeMae: inputNomeMae.value,
            nomePai: inputNomePai.value,
            email: inputEmail.value,
            emailSecundario: inputEmailSecundario.value,
            telefone: inputTelefone.value,
            telefoneComercial: inputTelefoneComercial.value,
            nomeEmergencia: inputNomeEmergencia.value,
            telefoneEmergencia: inputTelefoneEmergencia.value,
            profissao: inputProfissao.value,
            nomeEmpresa: inputNomeEmpresa.value,
            escolaridade: inputEscolaridade.value,
            cep: inputCep.value,
            rua: inputRua.value,
            numero: inputNumero.value,
            complemento: inputComplemento.value,
            bairro: inputBairro.value,
            cidade: inputCidade.value,
            estado: inputEstado.value
        };

        // Descobre a aba atual e injeta o script
        chrome.tabs.query({active: true, currentWindow: true}, function(abas) {
            if (abas.length === 0) return;
            
            // Feedback visual
            const originalText = btnPreencher.innerText;
            btnPreencher.innerText = "Preenchendo...";
            
            chrome.scripting.executeScript({
                target: { tabId: abas[0].id },
                func: preencherNaPagina,
                args: [dadosParaEnviar]
            }, () => {
                setTimeout(() => {
                    btnPreencher.innerText = "Preenchido!";
                    setTimeout(() => {
                        btnPreencher.innerText = originalText;
                    }, 1500);
                }, 300);
            });
        });
    });
}

// ======================================================
// PARTE 1.5: EXPORTAR/IMPORTAR DADOS (BACKUP/RESTORE)
// ======================================================

const btnExportar = document.getElementById('btnExportar');
const btnImportar = document.getElementById('btnImportar');
const inputArquivo = document.getElementById('inputArquivo');

// EXPORTAR: Baixa arquivo JSON com todos os dados
if (btnExportar) {
    btnExportar.addEventListener('click', function() {
        // Coleta TODOS os dados salvos
        chrome.storage.local.get(null, function(dados) {
            // Cria objeto JSON limpo (remove chaves do chrome se houver)
            const dadosExportacao = {};
            for (let chave in dados) {
                if (chave.startsWith('usuario_')) {
                    dadosExportacao[chave] = dados[chave];
                }
            }
            
            // Adiciona metadados
            const exportacao = {
                versao: '1.0',
                dataExportacao: new Date().toISOString(),
                dados: dadosExportacao
            };
            
            // Converte para JSON formatado
            const jsonString = JSON.stringify(exportacao, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            // Cria link de download
            const a = document.createElement('a');
            a.href = url;
            a.download = `autofill-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            // Feedback visual
            const originalText = btnExportar.innerText;
            btnExportar.innerText = 'Exportado!';
            btnExportar.style.background = '#28a745';
            setTimeout(() => {
                btnExportar.innerText = originalText;
                btnExportar.style.background = '#6c757d';
            }, 2000);
        });
    });
}

// IMPORTAR: Carrega arquivo JSON
if (btnImportar) {
    btnImportar.addEventListener('click', function() {
        inputArquivo.click(); // Abre seletor de arquivo
    });
}

// COPIAR LOGS: Copia logs da extensão para área de transferência
const btnCopiarLogs = document.getElementById('btnCopiarLogs');
if (btnCopiarLogs) {
    btnCopiarLogs.addEventListener('click', function() {
        if (extensionLogs.length === 0) {
            alert('Nenhum log capturado ainda!\n\nClique em "Preencher Site!" primeiro para gerar logs.');
            return;
        }
        
        // Monta texto formatado
        let textoLogs = '═══════════════════════════════════════\n';
        textoLogs += '🧩 LOGS DA EXTENSÃO - AUTOFILL DEBUG\n';
        textoLogs += '═══════════════════════════════════════\n\n';
        textoLogs += `📊 Total de Logs: ${extensionLogs.length}\n`;
        textoLogs += `📅 Capturados em: ${new Date().toLocaleString('pt-BR')}\n\n`;
        textoLogs += '═══════════════════════════════════════\n\n';
        
        // Estatísticas
        const logsPorTipo = {
            LOG: extensionLogs.filter(l => l.tipo === 'LOG').length,
            WARN: extensionLogs.filter(l => l.tipo === 'WARN').length,
            ERROR: extensionLogs.filter(l => l.tipo === 'ERROR').length
        };
        
        textoLogs += '📈 ESTATÍSTICAS:\n';
        textoLogs += `   📝 Logs: ${logsPorTipo.LOG}\n`;
        textoLogs += `   Warnings: ${logsPorTipo.WARN}\n`;
        textoLogs += `   Errors: ${logsPorTipo.ERROR}\n\n`;
        textoLogs += '═══════════════════════════════════════\n\n';
        
        // Lista logs
        textoLogs += 'LOGS COMPLETOS:\n';
        textoLogs += '─────────────────────────────────────\n\n';
        
        extensionLogs.forEach((log) => {
            const emoji = {
                'LOG': '📝',
                'WARN': '',
                'ERROR': ''
            }[log.tipo] || '📝';
            
            textoLogs += `${emoji} [${log.tipo}] ${log.timestamp}\n`;
            textoLogs += `${log.mensagem}\n`;
            textoLogs += '─────────────────────────────────────\n\n';
        });
        
        textoLogs += '═══════════════════════════════════════\n';
        textoLogs += `📅 Gerado em: ${new Date().toLocaleString('pt-BR')}\n`;
        textoLogs += '═══════════════════════════════════════\n';
        
        // Copia para clipboard
        navigator.clipboard.writeText(textoLogs).then(() => {
            const originalText = btnCopiarLogs.innerText;
            const originalBg = btnCopiarLogs.style.background;
            btnCopiarLogs.innerText = 'Copiado!';
            btnCopiarLogs.style.background = '#28a745';
            setTimeout(() => {
                btnCopiarLogs.innerText = originalText;
                btnCopiarLogs.style.background = originalBg;
            }, 2000);
        }).catch(err => {
            console.error('Erro ao copiar:', err);
            alert('Erro ao copiar logs. Verifique o console da extensão (F12 > Console).');
        });
    });
}

// COPIAR JSON: Copia todos os dados em formato JSON para validação manual
const btnCopiarJSON = document.getElementById('btnCopiarJSON');
if (btnCopiarJSON) {
    btnCopiarJSON.addEventListener('click', function() {
        // Busca TODOS os dados salvos
        chrome.storage.local.get([
            'usuario_nome', 'usuario_dataNascimento', 'usuario_cpf', 'usuario_rg',
            'usuario_genero', 'usuario_estadoCivil', 'usuario_nomeMae', 'usuario_nomePai',
            'usuario_email', 'usuario_emailSecundario', 
            'usuario_telefone', 'usuario_telefoneComercial', 
            'usuario_nomeEmergencia', 'usuario_telefoneEmergencia',
            'usuario_profissao', 'usuario_nomeEmpresa', 'usuario_escolaridade',
            'usuario_cep', 'usuario_rua', 'usuario_numero', 'usuario_complemento',
            'usuario_bairro', 'usuario_cidade', 'usuario_estado'
        ], function(dados) {
            // Converte para JSON formatado
            const jsonFormatado = JSON.stringify(dados, null, 2);
            
            // Copia para clipboard
            navigator.clipboard.writeText(jsonFormatado).then(() => {
                const originalText = btnCopiarJSON.innerText;
                const originalBg = btnCopiarJSON.style.background;
                btnCopiarJSON.innerText = 'JSON Copiado!';
                btnCopiarJSON.style.background = '#28a745';
                
                console.log('JSON copiado para área de transferência:');
                console.log(jsonFormatado);
                
                setTimeout(() => {
                    btnCopiarJSON.innerText = originalText;
                    btnCopiarJSON.style.background = originalBg;
                }, 2000);
            }).catch(err => {
                console.error('Erro ao copiar JSON:', err);
                alert('Erro ao copiar. Tente novamente.');
            });
        });
    });
}

if (inputArquivo) {
    inputArquivo.addEventListener('change', function(e) {
        const arquivo = e.target.files[0];
        if (!arquivo) return;
        
        const reader = new FileReader();
        reader.onload = function(evento) {
            try {
                const importacao = JSON.parse(evento.target.result);
                
                // Valida estrutura
                if (!importacao.dados) {
                    throw new Error('Formato de arquivo inválido');
                }
                
                // Restaura os dados
                chrome.storage.local.set(importacao.dados, function() {
                    // Recarrega a interface
                    location.reload();
                });
                
                // Feedback
                alert('Dados importados com sucesso!\n\nA extensão será recarregada.');
                
            } catch (erro) {
                alert('Erro ao importar arquivo:\n\n' + erro.message + '\n\nCertifique-se de usar um arquivo exportado por esta extensão.');
            }
        };
        reader.readAsText(arquivo);
    });
}

// ======================================================
// PARTE 2: O ROBÔ DETETIVE (Roda dentro do site)
// ======================================================

function preencherNaPagina(dados) {
    console.log("🤖 Robô Autofill Inteligente iniciado...");
    console.log("═══════════════════════════════════════");
    console.log("DADOS SALVOS NA EXTENSÃO:");
    console.log("═══════════════════════════════════════");
    console.log("👤 Nome:", dados.nome || "(vazio)");
    console.log("📅 Data Nasc:", dados.dataNascimento || "(vazio)");
    console.log("🆔 CPF:", dados.cpf || "(vazio)");
    console.log("🆔 RG:", dados.rg || "(vazio)");
    console.log("⚧ Gênero:", dados.genero || "(vazio)");
    console.log("💍 Estado Civil:", dados.estadoCivil || "(vazio)");
    console.log("👩 Nome Mãe:", dados.nomeMae || "(vazio)");
    console.log("👨 Nome Pai:", dados.nomePai || "(vazio)");
    console.log("📧 Email:", dados.email || "(vazio)");
    console.log("📧 Email Sec:", dados.emailSecundario || "(vazio)");
    console.log("📞 Telefone:", dados.telefone || "(vazio)");
    console.log("📞 Tel Comercial:", dados.telefoneComercial || "(vazio)");
    console.log("🚨 Nome Emerg:", dados.nomeEmergencia || "(vazio)");
    console.log("🚨 Tel Emerg:", dados.telefoneEmergencia || "(vazio)");
    console.log("💼 Profissão:", dados.profissao || "(vazio)");
    console.log("🏢 Empresa:", dados.nomeEmpresa || "(vazio)");
    console.log("🎓 Escolaridade:", dados.escolaridade || "(vazio)");
    console.log("📮 CEP:", dados.cep || "(vazio)");
    console.log("🏠 Rua:", dados.rua || "(vazio)");
    console.log("🔢 Número:", dados.numero || "(vazio)");
    console.log("🏢 Complemento:", dados.complemento || "(vazio)");
    console.log("🏘Bairro:", dados.bairro || "(vazio)");
    console.log("🌆 Cidade:", dados.cidade || "(vazio)");
    console.log("Estado:", dados.estado || "(vazio)");
    console.log("═══════════════════════════════════════\n");
    
    // --- DICIONÁRIO MULTILÍNGUE EXPANDIDO ---
    const palavrasChave = {
        nome: [
            // Português
            'nome', 'completo', 'cliente', 'usuário', 'usuario', 'titular', 'beneficiário',
            // Inglês
            'name', 'full name', 'fullname', 'first name', 'firstname', 'last name', 'lastname', 'user',
            // Espanhol
            'nombre', 'apellido', 'completo',
            // HTML5 autocomplete
            'given-name', 'family-name', 'additional-name', 'nickname'
        ],
        
        email: [
            // Português
            'email', 'e-mail', 'eletrônico', 'eletronico', 'correio',
            // Inglês
            'mail', 'e-mail', 'electronic mail',
            // Espanhol
            'correo', 'correo electrónico', 'correo electronico',
            // HTML5 autocomplete
            'email'
        ],
        
        cpf: [
            // Português (mais específicos primeiro)
            'cpf', 'cadastro pessoa física', 'cadastro pessoa fisica',
            'documento', 'doc', 'cadastro', 'física', 'fisica',
            // Inglês
            'tax id', 'ssn', 'social security', 'id number', 'identification',
            // Espanhol
            'dni', 'nif', 'cedula', 'cédula', 'rut'
        ],
        
        rg: [
            // Português (muito específico)
            'rg', 'identidade', 'carteira de identidade', 'carteira',
            // Inglês
            'identity card', 'id card', 'identity',
            // Espanhol
            'cédula', 'cedula'
        ],
        
        telefone: [
            // Português
            'telefone', 'fone', 'celular', 'cel', 'contato', 'whatsapp', 'zap',
            // Inglês
            'phone', 'mobile', 'cell', 'telephone', 'contact',
            // Espanhol
            'teléfono', 'telefono', 'móvil', 'movil', 'celular',
            // HTML5 autocomplete
            'tel', 'tel-national', 'tel-local', 'mobile'
        ],
        
        dataNascimento: [
            // Português
            'nascimento', 'data', 'nasc', 'aniversário', 'aniversario', 'idade',
            // Inglês
            'birth', 'birthday', 'birthdate', 'date of birth', 'dob', 'age',
            // Espanhol
            'nacimiento', 'fecha de nacimiento', 'cumpleaños',
            // HTML5 autocomplete
            'bday', 'bday-day', 'bday-month', 'bday-year'
        ],
        
        cep: [
            // Português
            'cep', 'código postal', 'codigo postal',
            // Inglês
            'zip', 'zip code', 'postal code', 'postcode',
            // Espanhol
            'código postal', 'codigo postal', 'cp',
            // HTML5 autocomplete
            'postal-code'
        ],
        
        rua: [
            // Português
            'rua', 'avenida', 'logradouro', 'endereço', 'endereco', 'av',
            // Inglês
            'street', 'address', 'avenue', 'road', 'lane',
            // Espanhol
            'calle', 'avenida', 'dirección', 'direccion',
            // HTML5 autocomplete
            'street-address', 'address-line1', 'address-line2', 'address-line3'
        ],
        
        enderecoCompleto: [
            // Português
            'endereço completo', 'endereco completo', 'endereço residencial',
            // Inglês
            'full address', 'complete address', 'residential address',
            // Espanhol
            'dirección completa', 'direccion completa'
        ],
        
        numero: [
            // Português
            'nº', 'num_', 'num ', '_num', // Mais específicos primeiro
            // Inglês
            'house number', 'street number',
            // Genéricos por último (para evitar conflitos)
            'número', 'numero', 'no', 'number', '#'
        ],
        
        complemento: [
            // Português
            'complemento', 'apto', 'apartamento', 'bloco', 'sala', 'andar',
            // Inglês
            'complement', 'apartment', 'apt', 'suite', 'floor', 'unit',
            // Espanhol
            'complemento', 'apartamento', 'piso', 'depto'
        ],
        
        bairro: [
            // Português
            'bairro', 'distrito', 'região', 'regiao',
            // Inglês
            'neighborhood', 'district', 'area', 'borough',
            // Espanhol
            'barrio', 'colonia', 'distrito'
        ],
        
        cidade: [
            // Português
            'cidade', 'município', 'municipio', 'localidade',
            // Inglês
            'city', 'town', 'municipality',
            // Espanhol
            'ciudad', 'municipio', 'localidad',
            // HTML5 autocomplete
            'address-level2'
        ],
        
        estado: [
            // Português
            'estado', 'uf', 'unidade federativa', 'província', 'provincia',
            // Inglês
            'state', 'province', 'region',
            // Espanhol
            'estado', 'provincia',
            // HTML5 autocomplete
            'address-level1'
        ],
        
        genero: [
            // Português
            'gênero', 'genero', 'sexo',
            // Inglês
            'gender', 'sex',
            // Espanhol
            'género', 'genero', 'sexo'
        ],
        
        estadoCivil: [
            // Português
            'estado civil', 'situação conjugal', 'casado', 'solteiro',
            // Inglês
            'marital status', 'civil status', 'married', 'single',
            // Espanhol
            'estado civil', 'situación conyugal'
        ],
        
        nomeMae: [
            // Português
            'mãe', 'mae', 'nome da mãe', 'nome mae', 'filiação materna',
            // Inglês
            'mother', 'mother name', 'maternal',
            // Espanhol
            'madre', 'nombre madre'
        ],
        
        nomePai: [
            // Português
            'pai', 'nome do pai', 'filiação paterna',
            // Inglês
            'father', 'father name', 'paternal',
            // Espanhol
            'padre', 'nombre padre'
        ],
        
        emailSecundario: [
            // Português
            'email secundário', 'email alternativo', 'segundo email', 'outro email',
            // Inglês
            'secondary email', 'alternate email', 'alternative email', 'second email',
            // Espanhol
            'email secundario', 'correo alternativo'
        ],
        
        telefoneComercial: [
            // Português
            'telefone comercial', 'tel comercial', 'fone comercial', 'trabalho', 'empresa',
            'telefone fixo', 'fixo',
            // Inglês
            'business phone', 'work phone', 'office phone', 'landline',
            // Espanhol
            'teléfono comercial', 'telefono trabajo', 'telefono fijo'
        ],
        
        nomeEmergencia: [
            // Português
            'contato emergência', 'emergencia', 'nome emergência', 'contato emergencial',
            // Inglês
            'emergency contact', 'emergency name',
            // Espanhol
            'contacto emergencia', 'nombre emergencia'
        ],
        
        telefoneEmergencia: [
            // Português
            'telefone emergência', 'tel emergencia', 'fone emergência',
            // Inglês
            'emergency phone', 'emergency tel',
            // Espanhol
            'teléfono emergencia', 'telefono emergencia'
        ],
        
        profissao: [
            // Português
            'profissão', 'profissao', 'ocupação', 'ocupacao', 'cargo', 'função',
            // Inglês
            'profession', 'occupation', 'job title', 'position',
            // Espanhol
            'profesión', 'profesion', 'ocupación', 'ocupacion',
            // HTML5 autocomplete
            'organization-title'
        ],
        
        nomeEmpresa: [
            // Português
            'empresa', 'empregador', 'local trabalho', 'razão social',
            // Inglês
            'company', 'employer', 'workplace', 'company name',
            // Espanhol
            'empresa', 'empleador', 'lugar trabajo',
            // HTML5 autocomplete
            'organization'
        ],
        
        escolaridade: [
            // Português
            'escolaridade', 'nível escolar', 'grau instrução', 'formação',
            // Inglês
            'education', 'education level', 'schooling', 'degree',
            // Espanhol
            'escolaridad', 'nivel educativo', 'formación'
        ]
    };

    // --- MAPEAMENTOS DE VALORES PADRONIZADOS ---
    const mapeamentoValores = {
        genero: {
            // Valores possíveis que nosso dado pode ter
            'masculino': ['masculino', 'homem', 'male', 'm', 'man', 'hombre', 'macho'],
            'feminino': ['feminino', 'mulher', 'female', 'f', 'woman', 'mujer', 'femenino'],
            'outro': ['outro', 'other', 'non-binary', 'não-binário', 'nao-binario', 'nb'],
            'prefiro-nao-dizer': ['prefiro não dizer', 'prefiro-nao-dizer', 'prefer not to say', 'no especificar']
        },
        estadoCivil: {
            'solteiro': ['solteiro', 'solteira', 'single', 'soltero', 'soltera'],
            'casado': ['casado', 'casada', 'married', 'casado', 'casada'],
            'divorciado': ['divorciado', 'divorciada', 'divorced', 'divorciado', 'divorciada'],
            'viuvo': ['viúvo', 'viúva', 'viuvo', 'viuva', 'widowed', 'viudo', 'viuda'],
            'uniao-estavel': ['união estável', 'uniao estavel', 'união-estável', 'domestic partnership', 'unión estable']
        },
        escolaridade: {
            'fundamental-incompleto': ['fundamental incompleto', 'elementary incomplete', 'primaria incompleta'],
            'fundamental-completo': ['fundamental completo', 'elementary complete', 'primaria completa'],
            'medio-incompleto': ['médio incompleto', 'medio incompleto', 'high school incomplete', 'secundaria incompleta'],
            'medio-completo': ['médio completo', 'medio completo', 'high school complete', 'high school', 'secundaria completa'],
            'superior-incompleto': ['superior incompleto', 'college incomplete', 'universidad incompleta'],
            'superior-completo': ['superior completo', 'college complete', 'bachelor', 'universidad completa'],
            'pos-graduacao': ['pós-graduação', 'pos-graduacao', 'postgraduate', 'postgrado', 'especialização'],
            'mestrado': ['mestrado', 'master', 'maestría'],
            'doutorado': ['doutorado', 'doctorate', 'phd', 'doctorado']
        },
        estado: {
            // Mapeamento de estados brasileiros (sigla e nome completo)
            'AC': ['ac', 'acre'],
            'AL': ['al', 'alagoas'],
            'AP': ['ap', 'amapá', 'amapa'],
            'AM': ['am', 'amazonas'],
            'BA': ['ba', 'bahia'],
            'CE': ['ce', 'ceará', 'ceara'],
            'DF': ['df', 'distrito federal', 'brasília', 'brasilia'],
            'ES': ['es', 'espírito santo', 'espirito santo'],
            'GO': ['go', 'goiás', 'goias'],
            'MA': ['ma', 'maranhão', 'maranhao'],
            'MT': ['mt', 'mato grosso'],
            'MS': ['ms', 'mato grosso do sul'],
            'MG': ['mg', 'minas gerais'],
            'PA': ['pa', 'pará', 'para'],
            'PB': ['pb', 'paraíba', 'paraiba'],
            'PR': ['pr', 'paraná', 'parana'],
            'PE': ['pe', 'pernambuco'],
            'PI': ['pi', 'piauí', 'piaui'],
            'RJ': ['rj', 'rio de janeiro'],
            'RN': ['rn', 'rio grande do norte'],
            'RS': ['rs', 'rio grande do sul'],
            'RO': ['ro', 'rondônia', 'rondonia'],
            'RR': ['rr', 'roraima'],
            'SC': ['sc', 'santa catarina'],
            'SP': ['sp', 'são paulo', 'sao paulo'],
            'SE': ['se', 'sergipe'],
            'TO': ['to', 'tocantins']
        }
    };

    // Busca TODOS os inputs visíveis (exceto hidden, submit, button, password)
    const inputs = document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="password"]):not([type="image"])');
    
    // Busca também textareas e SELECTS
    const textareas = document.querySelectorAll('textarea');
    const selects = document.querySelectorAll('select');
    const todosElementos = [...inputs, ...textareas, ...selects];
    
    const checkboxes = Array.from(inputs).filter(i => i.type === 'checkbox').length;
    const radios = Array.from(inputs).filter(i => i.type === 'radio').length;
    console.log(`Total de campos encontrados: ${todosElementos.length} (${selects.length} selects, ${checkboxes} checkboxes, ${radios} radios)`);
    console.log('Campos RG:', Array.from(todosElementos).filter(el => el.id === 'rg_field' || el.id === 'id_card'));

    todosElementos.forEach(input => {
        // 1. COLETA DE PISTAS NA ORDEM QUE O USUÁRIO VÊ! (visual primeiro, código depois)
        let pistasVisiveis = ""; // Texto que o usuário VÊ na tela
        let pistasCodigo = "";   // Atributos de código (fallback)
        
        // ===== PRIORIDADE 1: TEXTO VISÍVEL (como usuário lê) =====
        
        // Label associado via "for" (mais comum e confiável)
        if (input.id) {
            const label = document.querySelector(`label[for="${input.id}"]`);
            if (label) pistasVisiveis += label.innerText + " ";
        }
        
        // Label pai (quando input está DENTRO da tag label)
        const labelPai = input.closest('label');
        if (labelPai) pistasVisiveis += labelPai.innerText + " ";

        // Elementos ANTES do input (span, div, p que funcionam como label)
        const irmaoAnterior = input.previousElementSibling;
        if (irmaoAnterior && irmaoAnterior.innerText) {
            pistasVisiveis += irmaoAnterior.innerText + " ";
        }
        
        // Pai direto (pode ter texto descritivo)
        const pai = input.parentElement;
        if (pai && pai.innerText && pai.innerText.length < 100) {
            pistasVisiveis += pai.innerText + " ";
        }

        // ===== PRIORIDADE 2: DICAS NO CAMPO =====
        pistasVisiveis += (input.placeholder || "") + " ";
        pistasVisiveis += (input.getAttribute('title') || "") + " ";
        
        // ===== PRIORIDADE 3: ATRIBUTOS DE ACESSIBILIDADE =====
        pistasVisiveis += (input.getAttribute('aria-label') || "") + " ";
        
        // ===== PRIORIDADE 3.5: ATRIBUTOS HTML5 =====
        const autocomplete = input.getAttribute('autocomplete') || "";
        if (autocomplete) {
            pistasVisiveis += autocomplete + " ";
        }
        
        const pattern = input.getAttribute('pattern') || "";
        if (pattern) {
            // Detecta padrões comuns por regex
            if (pattern.includes('[0-9]{3}') || pattern.includes('\\d{3}')) {
                pistasVisiveis += "cpf documento ";
            }
            if (pattern.includes('[0-9]{5}-[0-9]{3}') || pattern.includes('\\d{5}-\\d{3}')) {
                pistasVisiveis += "cep postal ";
            }
            if (pattern.includes('\\(') || pattern.includes('[0-9]{2}.*[0-9]{4}')) {
                pistasVisiveis += "telefone fone ";
            }
        }
        
        const inputmode = input.getAttribute('inputmode') || "";
        if (inputmode) {
            if (inputmode === 'numeric') pistasVisiveis += "numero number ";
            if (inputmode === 'tel') pistasVisiveis += "telefone phone ";
            if (inputmode === 'email') pistasVisiveis += "email mail ";
        }
        
        // ===== PRIORIDADE 4: CÓDIGO (última opção) =====
        pistasCodigo += (input.id || "") + " ";
        pistasCodigo += (input.name || "") + " ";
        pistasCodigo += (input.className || "") + " ";
        pistasCodigo += (input.getAttribute('data-label') || "") + " ";
        
        // Junta tudo: VISUAL tem 3x mais peso que código!
        const pistas = (pistasVisiveis + " " + pistasVisiveis + " " + pistasVisiveis + " " + pistasCodigo).toLowerCase().trim();

        // 2. PROTEÇÃO CONTRA FALSOS POSITIVOS (expandida)
        const palavrasProibidas = [
            'login', 'password', 'senha', 'pass', 'busca', 'search', 'pesquisar', 
            'cnpj', 'usuario', 'username', 'credit card', 'cartao credito', 'cartão crédito', 
            'numero cartao', 'número cartão', 'card number', 'cvv', 'cvc', 'cartao', 'cartão',
            'produto', 'product', 'buscar',
            // HTML5 autocomplete para ignorar
            'current-password', 'new-password', 'cc-name', 'cc-number', 'cc-exp', 'cc-csc',
            'transaction-amount', 'username'
        ];
        const ehCampoProibido = palavrasProibidas.some(termo => pistas.includes(termo));
        
        // Se for campo proibido e NÃO for CPF/telefone/documento/RG válido, pula
        if (ehCampoProibido && !pistas.includes('cpf') && !pistas.includes('telefone') && 
            !pistas.includes('documento') && !pistas.includes('identity') && !pistas.includes('identidade') && !pistas.includes('rg')) {
            return;
        }

        // 3. VERIFICAÇÃO COM O DICIONÁRIO (Ordem otimizada!)
        
        // 3.1 - EMAIL (mais específico, verifica primeiro)
        if (palavrasChave.email.some(termo => pistas.includes(termo)) || input.type === 'email') {
            preencher(input, dados.email);
            return;
        }

        // 3.2 - CEP (verificação rigorosa ANTES de tudo)
        if (palavrasChave.cep.some(termo => pistas.includes(termo))) {
            const ehCEP = pistas.includes('cep') || pistas.includes('postal') || pistas.includes('zip');
            const naoCPF = !pistas.includes('cpf') && !pistas.includes('tax');
            
            if (ehCEP && naoCPF) {
                preencher(input, dados.cep);
                return;
            }
        }

        // 3.3 - CPF (ANTES de telefone - muito rigoroso)
        if (palavrasChave.cpf.some(termo => pistas.includes(termo))) {
            const ehCPF = pistas.includes('cpf') || pistas.includes('cadastro') || 
                         pistas.includes('fisica') || pistas.includes('física') ||
                         pistas.includes('documento') || pistas.includes('dni');
            
            const naoCEP = !pistas.includes('cep') && !pistas.includes('zip') && !pistas.includes('postal');
            
            // Se o TEXTO deixa MUITO claro que é CPF (tem "cpf" ou "cadastro de pessoa física")
            const contextoForteCPF = pistas.includes('cpf') || 
                                    (pistas.includes('cadastro') && pistas.includes('física')) ||
                                    (pistas.includes('cadastro') && pistas.includes('fisica'));
            
            // Só bloqueia se for type="tel" MAS NÃO tiver contexto forte de CPF
            const naoTelefone = !pistas.includes('telefone') && !pistas.includes('phone') && 
                               !pistas.includes('celular') && !pistas.includes('fone') && 
                               !pistas.includes('contato') && !pistas.includes('contact') &&
                               !input.name.includes('tel') && !input.name.includes('phone') &&
                               !input.name.includes('contact');
            
            const podeSerTelMasEhCPF = contextoForteCPF && input.type === 'tel';
            
            if (ehCPF && naoCEP && (naoTelefone || podeSerTelMasEhCPF) && dados.cpf) {
                preencher(input, dados.cpf);
                return;
            }
        }

        // 3.4 - TELEFONE (depois de CPF, mas só se não for documento)
        if (palavrasChave.telefone.some(termo => pistas.includes(termo)) || input.type === 'tel') {
            const naoCPF = !pistas.includes('cpf') && !pistas.includes('cadastro') && 
                          !pistas.includes('documento') && !pistas.includes('fisica');
            
            if (naoCPF && dados.telefone) {
                preencher(input, dados.telefone);
                return;
            }
        }

        // 3.5 - RG (detecção DIRETA e ULTRA específica)
        const temRGnoID = input.id && (input.id.includes('rg') || input.id.includes('id_card') || input.id === 'rg_field');
        const temRGnoName = input.name && (input.name.includes('rg') || input.name.includes('identity') || input.name.includes('id_card'));
        const temRGnaPista = pistas.includes('rg ') || pistas.includes(' rg') || 
                            pistas.includes('identidade') || 
                            pistas.includes('identity') ||
                            pistas.includes('carteira') ||
                            pistas.includes('cédula') ||
                            pistas.includes('cedula');
        
        // DEBUG detalhado
        if (input.id === 'rg_field' || input.id === 'id_card') {
            console.log('🔍 Campo RG encontrado:', {
                id: input.id,
                name: input.name,
                temRGnoID,
                temRGnoName,
                temRGnaPista,
                pistas: pistas.substring(0, 200),
                'dados.rg': dados.rg
            });
        }
        
        if (temRGnoID || temRGnoName || temRGnaPista) {
            const naoCPF = !pistas.includes('cpf') && !pistas.includes('cadastro pessoa física') && 
                          !pistas.includes('cadastro de pessoa física');
            const naoOutro = !pistas.includes('passaporte') && !pistas.includes('passport');
            
            console.log('RG vai preencher:', input.id, input.name, 'naoCPF:', naoCPF, 'naoOutro:', naoOutro, 'dados.rg:', dados.rg);
            
            if (naoCPF && naoOutro && dados.rg) {
                preencher(input, dados.rg);
                return;
            }
        }

        // 3.6 - DATA DE NASCIMENTO (verificação rigorosa)
        if (palavrasChave.dataNascimento.some(termo => pistas.includes(termo)) || input.type === 'date') {
            // Não preenche se parecer ser cidade ou nome
            const pareceOutroCampo = pistas.includes('cidade') || pistas.includes('city') || 
                                     pistas.includes('município') || pistas.includes('nome') ||
                                     (input.name && input.name.includes('city')) ||
                                     (input.id && input.id.includes('city')) ||
                                     (input.name && input.name.includes('municipio'));
            
            if (!pareceOutroCampo) {
                // Tenta detectar o formato esperado
                if (input.type === 'date') {
                    // Formato ISO: YYYY-MM-DD
                    const partes = dados.dataNascimento.split('/');
                    if (partes.length === 3) {
                        preencher(input, `${partes[2]}-${partes[1]}-${partes[0]}`);
                    }
                } else {
                    preencher(input, dados.dataNascimento);
                }
                return;
            }
        }

        // 3.6.1 - DATA EM CAMPOS SEPARADOS (dia/mês/ano)
        const ehDia = pistas.includes('dia') || pistas.includes('day') || 
                     (input.id && (input.id.includes('day') || input.id.includes('dia'))) ||
                     (input.name && (input.name.includes('day') || input.name.includes('dia'))) ||
                     (input.placeholder && (input.placeholder.toLowerCase().includes('dd') || input.placeholder.toLowerCase().includes('dia')));
        
        const ehMes = pistas.includes('mês') || pistas.includes('mes') || pistas.includes('month') || 
                     (input.id && (input.id.includes('month') || input.id.includes('mes'))) ||
                     (input.name && (input.name.includes('month') || input.name.includes('mes'))) ||
                     (input.placeholder && (input.placeholder.toLowerCase().includes('mm') || input.placeholder.toLowerCase().includes('mês')));
        
        const ehAno = pistas.includes('ano') || pistas.includes('year') || 
                     (input.id && (input.id.includes('year') || input.id.includes('ano'))) ||
                     (input.name && (input.name.includes('year') || input.name.includes('ano'))) ||
                     (input.placeholder && (input.placeholder.toLowerCase().includes('yyyy') || input.placeholder.toLowerCase().includes('aaaa') || input.placeholder.toLowerCase().includes('ano')));
        
        if (dados.dataNascimento && (ehDia || ehMes || ehAno)) {
            const partes = dados.dataNascimento.split('/'); // [DD, MM, YYYY]
            if (partes.length === 3) {
                if (ehDia) {
                    preencher(input, partes[0]); // Dia
                    return;
                } else if (ehMes) {
                    preencher(input, partes[1]); // Mês
                    return;
                } else if (ehAno) {
                    preencher(input, partes[2]); // Ano
                    return;
                }
            }
        }

        // 3.7 - NÚMERO (MUITO ESPECÍFICO - só em contexto de endereço)
        if (palavrasChave.numero.some(termo => pistas.includes(termo))) {
            // Só preenche se tiver ID/name MUITO específico
            const ehNumeroEndereco = (input.id && (input.id.includes('num_') || input.id.includes('_num') || input.id === 'numero')) ||
                                     (input.name && (input.name.includes('num_') || input.name.includes('_num') || input.name === 'number'));
            
            const naoEhNome = !pistas.includes('nome') && !pistas.includes('name') && 
                             !pistas.includes('completo') && !pistas.includes('full');
            
            const naoEhRua = !pistas.includes('logradouro') && !pistas.includes('rua') && 
                            !pistas.includes('avenida') && !pistas.includes('street') &&
                            !pistas.includes('address');
            
            const naoEhOutro = !pistas.includes('telefone') && !pistas.includes('cpf') && 
                              !pistas.includes('documento') && !pistas.includes('data');
            
            if (ehNumeroEndereco && naoEhNome && naoEhRua && naoEhOutro && dados.numero) {
                preencher(input, dados.numero);
                return;
            }
        }

        // 3.7.1 - ENDEREÇO COMPLETO (campo único com rua + número + complemento)
        if (palavrasChave.enderecoCompleto.some(termo => pistas.includes(termo))) {
            const ehEnderecoCompleto = pistas.includes('completo') || pistas.includes('full') || 
                                      pistas.includes('residencial') || pistas.includes('residential');
            
            if (ehEnderecoCompleto && dados.rua && dados.numero) {
                // Monta endereço completo: Rua + Número + Complemento
                let enderecoCompleto = `${dados.rua}, ${dados.numero}`;
                if (dados.complemento) {
                    enderecoCompleto += ` - ${dados.complemento}`;
                }
                preencher(input, enderecoCompleto);
                return;
            }
        }

        // 3.8 - RUA/ENDEREÇO (mais agressivo)
        if (palavrasChave.rua.some(termo => pistas.includes(termo))) {
            const ehRua = pistas.includes('rua') || pistas.includes('logradouro') || 
                         pistas.includes('street') || pistas.includes('address') ||
                         pistas.includes('avenida') || pistas.includes('av') ||
                         input.name.includes('street') || input.name.includes('address') ||
                         input.id.includes('logradouro') || input.id.includes('street');
            
            const naoEhNumero = !input.id.includes('num_') && !input.name.includes('num_') &&
                               !input.name.includes('number');
            
            // Se é address_line1 ou logradouro, preenche endereço completo
            const deveSerCompleto = input.id.includes('address_line') || input.name.includes('address_line') ||
                                   input.id.includes('logradouro') || input.name.includes('logradouro');
            
            if ((ehRua || naoEhNumero) && dados.rua) {
                if (deveSerCompleto && dados.numero) {
                    // Endereço completo: Rua + Número + Complemento
                    let enderecoCompleto = `${dados.rua}, ${dados.numero}`;
                    if (dados.complemento) {
                        enderecoCompleto += ` - ${dados.complemento}`;
                    }
                    preencher(input, enderecoCompleto);
                } else {
                    // Apenas rua
                    preencher(input, dados.rua);
                }
                return;
            }
        }

        // 3.9 - COMPLEMENTO (mais permissivo)
        if (palavrasChave.complemento.some(termo => pistas.includes(termo))) {
            if (dados.complemento) {
                preencher(input, dados.complemento);
                return;
            }
        }

        // 3.10 - BAIRRO (mais permissivo)
        if (palavrasChave.bairro.some(termo => pistas.includes(termo))) {
            if (dados.bairro) {
                preencher(input, dados.bairro);
                return;
            }
        }

        // 3.11 - CIDADE (mais flexível, mas evita confusão com RUA)
        if (palavrasChave.cidade.some(termo => pistas.includes(termo))) {
            const naoEhData = input.type !== 'date' && 
                             !input.name.includes('dob') && 
                             !input.id.includes('birth');
            
            // Evita preencher se tiver indicadores fortes de RUA
            const naoEhRua = !pistas.includes('rua') && !pistas.includes('street') && 
                            !pistas.includes('logradouro') && !pistas.includes('address_line');
            
            if (naoEhData && naoEhRua && dados.cidade) {
                preencher(input, dados.cidade);
                return;
            }
        }

        // 3.12 - ESTADO (mais permissivo - suporta checkbox/radio/select)
        if (palavrasChave.estado.some(termo => pistas.includes(termo))) {
            if (dados.estado) {
                preencher(input, dados.estado, 'estado');
                return;
            }
        }

        // 3.8 - GÊNERO (verificação específica - suporta checkbox/radio/select)
        if (palavrasChave.genero.some(termo => pistas.includes(termo))) {
            if (dados.genero) {
                preencher(input, dados.genero, 'genero');
                return;
            }
        }

        // 3.9 - ESTADO CIVIL (suporta checkbox/radio/select)
        if (palavrasChave.estadoCivil.some(termo => pistas.includes(termo))) {
            if (dados.estadoCivil) {
                preencher(input, dados.estadoCivil, 'estadoCivil');
                return;
            }
        }

        // 3.10 - NOME DA MÃE
        if (palavrasChave.nomeMae.some(termo => pistas.includes(termo))) {
            const ehMae = pistas.includes('mãe') || pistas.includes('mae') || pistas.includes('mother');
            if (ehMae && dados.nomeMae) {
                preencher(input, dados.nomeMae);
                return;
            }
        }

        // 3.11 - NOME DO PAI
        if (palavrasChave.nomePai.some(termo => pistas.includes(termo))) {
            const ehPai = pistas.includes('pai') || pistas.includes('father') || pistas.includes('padre');
            if (ehPai && dados.nomePai) {
                preencher(input, dados.nomePai);
                return;
            }
        }
        
        // 3.11.1 - ESCOLARIDADE (suporta checkbox/radio/select)
        if (palavrasChave.escolaridade.some(termo => pistas.includes(termo))) {
            if (dados.escolaridade) {
                preencher(input, dados.escolaridade, 'escolaridade');
                return;
            }
        }

        // 3.12 - EMAIL SECUNDÁRIO (antes do email principal)
        if (palavrasChave.emailSecundario.some(termo => pistas.includes(termo))) {
            const ehSecundario = pistas.includes('secundário') || pistas.includes('secundario') || 
                                pistas.includes('alternativo') || pistas.includes('secondary') || 
                                pistas.includes('alternate');
            if (ehSecundario && dados.emailSecundario) {
                preencher(input, dados.emailSecundario);
                return;
            }
        }

        // 3.13 - TELEFONE COMERCIAL (antes do telefone normal)
        if (palavrasChave.telefoneComercial.some(termo => pistas.includes(termo))) {
            const ehComercial = pistas.includes('comercial') || pistas.includes('trabalho') || 
                              pistas.includes('fixo') || pistas.includes('business') || 
                              pistas.includes('work') || pistas.includes('landline');
            if (ehComercial && dados.telefoneComercial) {
                preencher(input, dados.telefoneComercial);
                return;
            }
        }

        // 3.14 - NOME EMERGÊNCIA
        if (palavrasChave.nomeEmergencia.some(termo => pistas.includes(termo))) {
            const ehEmergencia = pistas.includes('emergência') || pistas.includes('emergencia') || 
                                pistas.includes('emergency');
            const naoEhTelefone = !pistas.includes('telefone') && !pistas.includes('phone') && 
                                 !pistas.includes('tel') && input.type !== 'tel';
            if (ehEmergencia && naoEhTelefone && dados.nomeEmergencia) {
                preencher(input, dados.nomeEmergencia);
                return;
            }
        }

        // 3.15 - TELEFONE EMERGÊNCIA
        if (palavrasChave.telefoneEmergencia.some(termo => pistas.includes(termo))) {
            const ehEmergencia = pistas.includes('emergência') || pistas.includes('emergencia') || 
                                pistas.includes('emergency');
            const ehTelefone = pistas.includes('telefone') || pistas.includes('phone') || 
                              pistas.includes('tel') || input.type === 'tel';
            if (ehEmergencia && ehTelefone && dados.telefoneEmergencia) {
                preencher(input, dados.telefoneEmergencia);
                return;
            }
        }

        // 3.16 - PROFISSÃO
        if (palavrasChave.profissao.some(termo => pistas.includes(termo))) {
            const naoEhEmpresa = !pistas.includes('empresa') && !pistas.includes('company');
            if (naoEhEmpresa && dados.profissao) {
                preencher(input, dados.profissao);
                return;
            }
        }

        // 3.17 - NOME DA EMPRESA
        if (palavrasChave.nomeEmpresa.some(termo => pistas.includes(termo))) {
            const ehEmpresa = pistas.includes('empresa') || pistas.includes('company') || 
                            pistas.includes('empregador') || pistas.includes('employer');
            if (ehEmpresa && dados.nomeEmpresa) {
                preencher(input, dados.nomeEmpresa);
                return;
            }
        }

        // 3.18 - ESCOLARIDADE
        if (palavrasChave.escolaridade.some(termo => pistas.includes(termo))) {
            if (dados.escolaridade) {
                preencher(input, dados.escolaridade);
                return;
            }
        }

        // 3.19 - NOME (prioridade alta se tiver "nome" ou "name" explícito)
        if (palavrasChave.nome.some(termo => pistas.includes(termo))) {
            const ehNome = pistas.includes('nome') || pistas.includes('name') || 
                          input.id.includes('nome') || input.name.includes('nome') ||
                          input.id.includes('name') || input.name.includes('name');
            
            const contextoInvalido = pistas.includes('produto') || pistas.includes('product') ||
                                     pistas.includes('empresa') || pistas.includes('company') ||
                                     input.type === 'date' || input.type === 'search';
            
            const naoEhNumero = !input.id.includes('num') && !input.name.includes('num');
            
            if (ehNome && !ehCampoProibido && !contextoInvalido && naoEhNumero && dados.nome) {
                preencher(input, dados.nome);
                return;
            }
        }
    });

    // 4. FUNÇÃO DE PREENCHIMENTO UNIVERSAL (INPUT, SELECT, TEXTAREA, CHECKBOX, RADIO)
    function preencher(elemento, valor, tipoCampo = null) {
        if (!valor || valor.toString().trim() === '') return;
        
        const valorStr = valor.toString();
        
        // --- TRATAMENTO PARA CHECKBOX ---
        if (elemento.type === 'checkbox') {
            // Busca grupo de checkboxes com mesmo name
            const grupoCheckboxes = document.querySelectorAll(`input[type="checkbox"][name="${elemento.name}"]`);
            
            if (grupoCheckboxes.length > 1 && tipoCampo) {
                // Múltiplas checkboxes - usa mapeamento
                const mapeamento = mapeamentoValores[tipoCampo];
                if (mapeamento) {
                    grupoCheckboxes.forEach(cb => {
                        const cbValor = (cb.value || '').toLowerCase();
                        const cbLabel = getLabelText(cb).toLowerCase();
                        
                        // Verifica se esse checkbox corresponde ao valor
                        for (const [chave, variantes] of Object.entries(mapeamento)) {
                            if (valorStr.toLowerCase().includes(chave) || chave.includes(valorStr.toLowerCase())) {
                                if (variantes.some(v => cbValor.includes(v) || cbLabel.includes(v))) {
                                    cb.checked = true;
                                    destacarElemento(cb);
                                }
                            }
                        }
                    });
                }
            } else {
                // Checkbox única - marca como true/false
                elemento.checked = true;
                destacarElemento(elemento);
            }
            dispararEventos(elemento);
            return;
        }
        
        // --- TRATAMENTO PARA RADIO ---
        if (elemento.type === 'radio') {
            // Busca grupo de radios com mesmo name
            const grupoRadios = document.querySelectorAll(`input[type="radio"][name="${elemento.name}"]`);
            
            if (tipoCampo) {
                const mapeamento = mapeamentoValores[tipoCampo];
                if (mapeamento) {
                    grupoRadios.forEach(radio => {
                        const radioValor = (radio.value || '').toLowerCase();
                        const radioLabel = getLabelText(radio).toLowerCase();
                        
                        // Verifica se esse radio corresponde ao valor
                        for (const [chave, variantes] of Object.entries(mapeamento)) {
                            if (valorStr.toLowerCase().includes(chave) || chave.includes(valorStr.toLowerCase())) {
                                if (variantes.some(v => radioValor.includes(v) || radioLabel.includes(v))) {
                                    radio.checked = true;
                                    destacarElemento(radio);
                                }
                            }
                        }
                    });
                }
            }
            dispararEventos(elemento);
            return;
        }
        
        // --- TRATAMENTO PARA SELECT ---
        if (elemento.tagName === 'SELECT') {
            let opcaoEncontrada = false;
            
            // Se tiver mapeamento, usa ele
            if (tipoCampo && mapeamentoValores[tipoCampo]) {
                const mapeamento = mapeamentoValores[tipoCampo];
                
                for (let i = 0; i < elemento.options.length; i++) {
                    const option = elemento.options[i];
                    const optionValue = option.value.toLowerCase();
                    const optionText = option.text.toLowerCase();
                    
                    // Verifica contra todas as variantes do mapeamento
                    for (const [chave, variantes] of Object.entries(mapeamento)) {
                        if (valorStr.toLowerCase().includes(chave) || chave.includes(valorStr.toLowerCase())) {
                            if (variantes.some(v => optionValue.includes(v) || optionText.includes(v) || 
                                                   optionValue === v || optionText === v)) {
                                elemento.selectedIndex = i;
                                opcaoEncontrada = true;
                                break;
                            }
                        }
                    }
                    if (opcaoEncontrada) break;
                }
            }
            
            // Fallback: busca direta sem mapeamento
            if (!opcaoEncontrada) {
                for (let i = 0; i < elemento.options.length; i++) {
                    const option = elemento.options[i];
                    const optionValue = option.value.toLowerCase();
                    const optionText = option.text.toLowerCase();
                    const valorBusca = valorStr.toLowerCase();
                    
                    if (optionValue === valorBusca || optionText === valorBusca ||
                        optionValue.includes(valorBusca) || optionText.includes(valorBusca)) {
                        elemento.selectedIndex = i;
                        opcaoEncontrada = true;
                        break;
                    }
                }
            }
            
            if (!opcaoEncontrada) {
                console.warn('Opção não encontrada no select:', elemento.id || elemento.name, 'valor:', valorStr);
                return;
            }
            destacarElemento(elemento);
            dispararEventos(elemento);
            return;
        }
        
        // --- INPUT ou TEXTAREA padrão ---
        elemento.focus();
        elemento.value = valorStr;
        
        destacarElemento(elemento);
        dispararEventos(elemento);
    }
    
    // Função auxiliar: destaque visual
    function destacarElemento(elemento) {
        // Para checkbox/radio, destaca o label ou parent
        if (elemento.type === 'checkbox' || elemento.type === 'radio') {
            const label = elemento.parentElement?.tagName === 'LABEL' ? elemento.parentElement : 
                         document.querySelector(`label[for="${elemento.id}"]`);
            if (label) {
                label.style.backgroundColor = "#d4edda";
                label.style.border = "2px solid #28a745";
                label.style.borderRadius = "4px";
                label.style.padding = "5px";
                label.style.transition = "all 0.3s ease";
                setTimeout(() => {
                    label.style.backgroundColor = "";
                    label.style.border = "";
                    label.style.padding = "";
                }, 2000);
            }
        } else {
            elemento.style.backgroundColor = "#d4edda";
            elemento.style.border = "2px solid #28a745";
            elemento.style.transition = "all 0.3s ease";
            setTimeout(() => {
                elemento.style.backgroundColor = "";
                elemento.style.border = "";
            }, 2000);
        }
    }
    
    // Função auxiliar: disparar eventos
    function dispararEventos(elemento) {
        elemento.dispatchEvent(new Event('input', { bubbles: true }));
        elemento.dispatchEvent(new Event('change', { bubbles: true }));
        elemento.dispatchEvent(new Event('click', { bubbles: true }));
        elemento.dispatchEvent(new Event('blur', { bubbles: true }));
        
        // Para React
        try {
            if (elemento instanceof HTMLInputElement || elemento instanceof HTMLTextAreaElement || elemento instanceof HTMLSelectElement) {
                const prototype = elemento instanceof HTMLInputElement ? window.HTMLInputElement.prototype :
                                 elemento instanceof HTMLTextAreaElement ? window.HTMLTextAreaElement.prototype :
                                 window.HTMLSelectElement.prototype;
                const descriptor = Object.getOwnPropertyDescriptor(prototype, elemento.type === 'checkbox' || elemento.type === 'radio' ? 'checked' : 'value');
                if (descriptor && descriptor.set) {
                    descriptor.set.call(elemento, elemento.type === 'checkbox' || elemento.type === 'radio' ? elemento.checked : elemento.value);
                    elemento.dispatchEvent(new Event('input', { bubbles: true }));
                }
            }
        } catch (e) {
            console.warn('Aviso ao disparar eventos React:', e);
        }
    }
    
    // Função auxiliar: obter texto do label
    function getLabelText(elemento) {
        if (elemento.id) {
            const label = document.querySelector(`label[for="${elemento.id}"]`);
            if (label) return label.innerText || label.textContent || '';
        }
        const parentLabel = elemento.closest('label');
        if (parentLabel) return parentLabel.innerText || parentLabel.textContent || '';
        return ''
        
        console.log(`✓ Preenchido: ${elemento.name || elemento.id || 'campo'} = ${valor}`);
    }
    
    console.log("✓ Robô finalizado! Campos detectados:", todosElementos.length);
}