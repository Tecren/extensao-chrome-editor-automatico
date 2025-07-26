console.log('Content script carregado');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Mensagem recebida no content script:', message);

  if (message.type === 'GET_SELECTED_TEXT') {
    handleGetSelectedText(message.fieldId);
  }
});

function handleGetSelectedText(fieldId: string, selectedTextParam?: string) {
  const selectedText = selectedTextParam || getSelectedText();
  
  if (!selectedText) {
    showNotification('Nenhum texto selecionado', 'error');
    return;
  }

  chrome.runtime.sendMessage({
    type: 'FILL_FIELD',
    payload: {
      fieldId,
      text: selectedText
    }
  });

  showNotification(`Texto capturado para ${getFieldName(fieldId)}`, 'success');
  highlightSelection();
}

function getSelectedText(): string {
  const selection = window.getSelection();
  return selection?.toString().trim() || '';
}

function getFieldName(fieldId: string): string {
  const fieldNames: Record<string, string> = {
    'nome': 'Nome',
    'cpf': 'CPF',
    'documento': 'Documento',
    //adicione mais campos aqui
  };
  return fieldNames[fieldId] || fieldId;
}

function showNotification(message: string, type: 'success' | 'error' = 'success') {
  const existingNotification = document.getElementById('extension-notification');
  if (existingNotification) existingNotification.remove();

  const notification = document.createElement('div');
  notification.id = 'extension-notification';
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#4CAF50' : '#f44336'};
    color: white;
    padding: 12px 20px;
    border-radius: 4px;
    font-family: Arial, sans-serif;
    font-size: 14px;
    z-index: 10000;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    animation: slideIn 0.3s ease-out;
  `;

  if (!document.getElementById('extension-notification-styles')) {
    const style = document.createElement('style');
    style.id = 'extension-notification-styles';
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-in';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

function highlightSelection() {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  const span = document.createElement('span');
  span.style.cssText = `
    background-color: #ffeb3b;
    transition: background-color 2s ease-out;
  `;

  try {
    range.surroundContents(span);
    setTimeout(() => {
      span.style.backgroundColor = 'transparent';
      setTimeout(() => {
        if (span.parentNode) {
          const parent = span.parentNode;
          parent.insertBefore(document.createTextNode(span.textContent || ''), span);
          parent.removeChild(span);
        }
      }, 2000);
    }, 500);
  } catch (error) {
    console.warn('Erro ao destacar seleção:', error);
  }

  selection.removeAllRanges();
}

//dropdown
document.addEventListener('contextmenu', (e) => {
  const selectedText = getSelectedText();
  if (!selectedText) return;

  e.preventDefault();
  showDropdown(e.pageX, e.pageY, selectedText);
});

function showDropdown(x: number, y: number, selectedText: string) {
  const existing = document.getElementById('custom-template-dropdown');
  if (existing) existing.remove();

  const dropdown = document.createElement('div');
  dropdown.id = 'custom-template-dropdown';
  dropdown.style.cssText = `
    position: absolute;
    top: ${y}px;
    left: ${x}px;
    background: white;
    border: 1px solid #ccc;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    padding: 5px;
    z-index: 99999;
    font-family: Arial, sans-serif;
    font-size: 14px;
    border-radius: 6px;
    min-width: 160px;
  `;

  const campos: { id: string, label: string }[] = [
    { id: 'nome', label: '<<nome>>' },
    { id: 'cpf', label: '<<cpf>>' },
    { id: 'documento', label: '<<documento>>' },
    { id: 'processo', label: '<<processo>>' },
    { id: 'periodoBloqueio', label: '<<periodoBloqueio>>' },
    { id: 'rg', label: '<<rg>>' },
    { id: 'certificado', label: '<<certificado>>' },
    { id: 'endereco', label: '<<endereco>>' },
    { id: 'municipio', label: '<<municipio>>' },
    //adicione mais campos aqui
  ];

  campos.forEach(({ id, label }) => {
    const item = document.createElement('div');
    item.textContent = label;
    item.style.cssText = `
      padding: 8px;
      cursor: pointer;
      border-bottom: 1px solid #eee;
    `;
    item.addEventListener('mouseover', () => item.style.background = '#f0f0f0');
    item.addEventListener('mouseout', () => item.style.background = 'white');
    item.addEventListener('click', () => {
      handleGetSelectedText(id, selectedText);
      dropdown.remove();
    });
    dropdown.appendChild(item);
  });

  if (dropdown.lastElementChild) {
    (dropdown.lastElementChild as HTMLElement).style.borderBottom = 'none';
  }

  document.body.appendChild(dropdown);
}

document.addEventListener('click', () => {
  const existing = document.getElementById('custom-template-dropdown');
  if (existing) existing.remove();
});


// atalhos de teclado
document.addEventListener('keydown', (event) => {
  if (event.ctrlKey && event.shiftKey) {
    let fieldId = '';
    switch (event.key) {
      case '1': fieldId = 'nome'; break;
      case '2': fieldId = 'cpf'; break;
      case '3': fieldId = 'documento'; break;
      default: return;
    }

    event.preventDefault();
    handleGetSelectedText(fieldId);
  }
});
export {};
