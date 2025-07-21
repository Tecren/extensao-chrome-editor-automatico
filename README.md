# Editor de Texto com Templates - Extensão Chrome

Uma extensão do Chrome desenvolvida para o setor de Imposição de Penalidades da Ciretran de Araranguá, permite criar e preencher documentos usando templates pré-definidos com atalhos de teclado e/ou um Dropdown.

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

## Funcionalidades

- **Templates Pré-definidos**: Lista de modelos de documento prontos para uso
- **Preenchimento por Atalhos**: Use atalhos de teclado ou de mouse para preencher campos automaticamente
- **Captura de Texto**: Selecione texto em qualquer página e preencha campos instantaneamente
- **Editor Visual**: Visualização em tempo real do documento sendo preenchido
- **Sistema de Assinatura**: Selecione funcionários para assinar documentos
- **Sistema de Data automatica**: Adiciona a data atual já formatada

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

## Tecnologias Utilizadas

- **Frontend**: React + TypeScript
- **Editor**: Quill.js para visualização de documentos
- **Estilização**: CSS puro
- **Build**: Webpack 5
- **Extensão**: Chrome Extension Manifest V3

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

## Como Usar

### 1. Selecione um Template
- Clique no ícone da extensão na barra de ferramentas
- Escolha um template da lista disponível
- Visualize a prévia do documento

### 2. Edite o Documento
- Clique no botão "Editar" na prévia
- A extensão será fechada e você retornará à página web
- Navegue para qualquer site e selecione o texto desejado
- Use os atalhos de teclado para preencher os campos:

#### Atalhos Disponíveis:
- `Ctrl+Shift+1` - Nome do Condutor
- `Ctrl+Shift+2` - CPF
- `Ctrl+Shift+3` - Número do Documento  
- `borão direito mouse` - Os demais campos tem que ser preenchidos com o dropdown


### 3. Finalizando o Documento
- Após preencher todos os campos, clique novamente no ícone da extensão
- O documento preenchido será exibido
- Selecione um funcionário para assinar (se nescessário)
- Clique em "Finalizar Documento"

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

## Estrutura do Projeto

```
chrome-text-editor-extension/
├── public/
│   ├── manifest.json
│   ├── imagens/
│   ├── styles/
│   └── icons/
├── src/
│   ├── components/
│   │   ├── App.tsx
│   │   ├── FieldDropdown.tsx
│   │   ├── TemplateList.tsx
│   │   ├── TemplatePreview.tsx
│   │   ├── TemplateEditor.tsx
│   │   └── SignatureSelector.tsx
│   ├── scripts/
│   │   ├── background.ts
│   │   └── content.ts
│   ├── styles/
│   │   ├── base.css
│   │   ├── header.css
│   │   ├── others.css
│   │   ├── scrollbar.css
│   │   ├── signatureSelector.css
│   │   ├── templateEditor.css
│   │   ├── templateList.css
│   │   └── templatePreview.css    
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── formatCPF.ts
│   │   └── formatters.ts
│   ├── popup.tsx
│   └── popup.html
├── dist/
├── package.json
├── tsconfig.json
├── webpack.config.js
└── README.md
```

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

## Galeria do projeto

![Tela Inicial](\src\imagens\1-tela-inicial.png)

![Tela do Modelo](\src\imagens\2-tela-modelo.png)

![Tela da Assinatura](\src\imagens\3-tela-assinatura.png)

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

## Instalação e Build

### Instale as dependências
```bash
npm install
```

### Faça o build da extensão
```bash
npm run build
```

### Carregue a extensão no Chrome

1. Abra o Chrome e vá para `chrome://extensions/`
2. Ative o "Modo do desenvolvedor" no canto superior direito
3. Clique em "Carregar sem compactação"
4. Selecione a pasta `dist` do projeto
5. A extensão será instalada e aparecerá na barra de ferramentas

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-