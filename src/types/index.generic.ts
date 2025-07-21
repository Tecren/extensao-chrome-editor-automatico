export interface Template {
  id: string;
  name: string;
  description: string;
  content: string;
  fields: TemplateField[];
}

export interface TemplateField {
  id: string;
  name: string;
  placeholder: string;
  shortcut: string;
  value?: string;
}

export interface Employee {
  id: string;
  name: string;
  position: string;
}

export interface ExtensionState {
  selectedTemplate: Template | null;
  filledFields: Record<string, string>;
  isEditing: boolean;
  employees: Employee[];
  selectedEmployee: Employee | null;
}

export interface ChromeMessage {
  type: 'FILL_FIELD' | 'GET_SELECTED_TEXT' | 'UPDATE_STATE' | 'GET_STATE';
  payload?: any;
}

export interface SelectedTextData {
  text: string;
  fieldId: string;
}

export const DEFAULT_TEMPLATES = [
  {
    id: 'termo-liberacao',
    name: 'Modelo Genérico 1',
    description: 'Descrição genérica do modelo 1',
    content: `
      <div class="modelo-impressao">
        <h2 style="text-align: center;">MODELO GENÉRICO</h2>
        <p class="paragrafo">Prezado(a) <<nome>>, CPF <<cpf>>, documento <<documento>>, referente ao processo <<processo>>, data <<data>>.</p>
        <p class="paragrafo">Assinado por: <<funcionario>>.</p>
      </div>
    `,
    fields: [
      { id: 'nome', name: 'Nome', placeholder: '<<nome>>', shortcut: 'Ctrl+Shift+1' },
      { id: 'cpf', name: 'CPF', placeholder: '<<cpf>>', shortcut: 'Ctrl+Shift+2' },
      { id: 'documento', name: 'Documento', placeholder: '<<documento>>', shortcut: 'Ctrl+Shift+3' },
      { id: 'processo', name: 'Processo', placeholder: '<<processo>>', shortcut: 'dropdown' },
      { id: 'data', name: 'Data', placeholder: '<<data>>', shortcut: '' },
      { id: 'funcionario', name: 'Funcionário', placeholder: '<<funcionario>>', shortcut: '' }
    ]
  },
  {
    id: 'modelo-generico-2',
    name: 'Modelo Genérico 2',
    description: 'Descrição genérica do modelo 2',
    content: `
      <div class="modelo-impressao">
        <h2 style="text-align: center;">MODELO GENÉRICO 2</h2>
        <p class="paragrafo">Nome: <<nome>>, CPF: <<cpf>>, Documento: <<documento>>, Processo: <<processo>>.</p>
        <p>Emitido em: <<data>> - Responsável: <<funcionario>>.</p>
      </div>
    `,
    fields: [
      { id: 'nome', name: 'Nome', placeholder: '<<nome>>', shortcut: 'Ctrl+Shift+1' },
      { id: 'cpf', name: 'CPF', placeholder: '<<cpf>>', shortcut: 'Ctrl+Shift+2' },
      { id: 'documento', name: 'Documento', placeholder: '<<documento>>', shortcut: 'Ctrl+Shift+3' },
      { id: 'processo', name: 'Processo', placeholder: '<<processo>>', shortcut: 'dropdown' },
      { id: 'data', name: 'Data', placeholder: '<<data>>', shortcut: '' },
      { id: 'funcionario', name: 'Funcionário', placeholder: '<<funcionario>>', shortcut: '' }
    ]
  }
];

export const DEFAULT_EMPLOYEES = [
  { id: '1', name: 'Fulano da Silva', position: 'Analista' },
  { id: '2', name: 'Beltrano de Souza', position: 'Coordenador' },
  { id: '3', name: 'Ciclano Pereira', position: 'Estagiário' }
];