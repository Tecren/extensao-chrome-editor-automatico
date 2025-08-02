interface ExtensionState {
  selectedTemplate: any;
  filledFields: Record<string, string>;
  isEditing: boolean;
  employees: any[];
  selectedEmployee: any;
}

const COMMAND_TO_FIELD_MAP: Record<string, string> = {
  'fill-field-1': 'nome',
  'fill-field-2': 'cpf',
  'fill-field-3': 'documento',
};

chrome.commands.onCommand.addListener(async (command) => {
  console.log('Comando recebido:', command);
  
  const fieldId = COMMAND_TO_FIELD_MAP[command];
  if (!fieldId) return;

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab.id) return;

    const result = await chrome.storage.local.get(['extensionState']);
    const state: ExtensionState = result.extensionState;
    
    if (!state || !state.isEditing || !state.selectedTemplate) {
      console.log('Não está em modo de edição ou template não selecionado');
      return;
    }

    chrome.tabs.sendMessage(tab.id, {
      type: 'GET_SELECTED_TEXT',
      fieldId: fieldId
    });

  } catch (error) {
    console.error('Erro ao processar comando:', error);
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Mensagem recebida no background:', message);

  if (message.action === 'openExtensionPopup') {
    chrome.runtime.openOptionsPage();
  }

  switch (message.type) {
    case 'FILL_FIELD':
      handleFillField(message.payload);
      break;
    
    case 'GET_STATE':
      chrome.storage.local.get(['extensionState'], (result) => {
        sendResponse(result.extensionState || null);
      });
      return true;
    
    case 'UPDATE_STATE':
      chrome.storage.local.set({ extensionState: message.payload });
      break;
  }
});

async function handleFillField(payload: { fieldId: string; text: string }) {
  try {
    const { fieldId, text } = payload;

    const result = await chrome.storage.local.get(['extensionState']);
    const state: ExtensionState = result.extensionState || {};

    if (!state.selectedTemplate) {
      console.error('Nenhum template selecionado');
      return;
    }

    const matchingFields = state.selectedTemplate.fields.filter(
      (field: any) => field.id === fieldId
    );

    const updatedFields = { ...state.filledFields };
    matchingFields.forEach((field: any) => {
      if (field.id === 'processo') {
        const currentValue = updatedFields[field.id] || '';
        const values = currentValue ? currentValue.split(',').map(v => v.trim()) : [];

        if (!values.includes(text.trim())) {
          values.push(text.trim());
        }

        updatedFields[field.id] = values.join(', ');
      } else {
        updatedFields[field.id] = text.trim();
      }
    });

    const updatedState = {
      ...state,
      filledFields: updatedFields
    };

    await chrome.storage.local.set({ extensionState: updatedState });

    console.log(`Campo ${fieldId} preenchido com: ${text}`);

    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'Campo Preenchido',
      message: `${getFieldName(fieldId)}: ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}`
    });

  } catch (error) {
    console.error('Erro ao preencher campo:', error);
  }
}

function getFieldName(fieldId: string): string {
  const fieldNames: Record<string, string> = {
    'nome': 'Nome',
    'cpf': 'CPF',
    'documento': 'Documento',
  };
  
  return fieldNames[fieldId] || fieldId;
}

chrome.runtime.onInstalled.addListener(() => {
  console.log('Extensão instalada');
  
  chrome.storage.local.set({
    extensionState: {
      selectedTemplate: null,
      filledFields: {},
      isEditing: false,
      employees: [],
      selectedEmployee: null
    }
  });
});

chrome.runtime.onStartup.addListener(() => {
  console.log('Extensão iniciada');
});

export {};

