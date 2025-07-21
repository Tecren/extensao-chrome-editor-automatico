import React, { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import { Template } from '../types';
import FieldDropdown from '../components/FieldDropdown';

interface TemplateEditorProps {
  template: Template;
  filledFields: Record<string, string>;
  onBack: () => void;
}

const TemplateEditor: React.FC<TemplateEditorProps> = ({ 
  template, 
  filledFields, 
  onBack,
}) => {
  const quillRef = useRef<HTMLDivElement>(null);
  const quillInstance = useRef<Quill | null>(null);

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [selectedText, setSelectedText] = useState('');

  useEffect(() => {
    if (quillRef.current && !quillInstance.current) {
      quillInstance.current = new Quill(quillRef.current, {
        theme: 'snow',
        readOnly: true,
        modules: {
          toolbar: false
        }
      });

      const quillRoot = quillInstance.current.root;
      const handleContextMenu = (e: MouseEvent) => {
        e.preventDefault();

        const selection = window.getSelection()?.toString().trim();
        if (!selection) return;

        setSelectedText(selection);
        setDropdownPosition({ top: e.clientY, left: e.clientX });
        setDropdownVisible(true);
      };

      quillRoot.addEventListener('contextmenu', handleContextMenu);

      return () => {
        quillRoot.removeEventListener('contextmenu', handleContextMenu);
        quillInstance.current = null;
      };
    }
  }, []);

  useEffect(() => {
    let content = typeof template.content === 'string' ? template.content : '';

    template.fields.forEach(field => {
      const value = filledFields[field.id] || field.placeholder;
      if (field.placeholder && typeof value === 'string') {
        content = content.replace(new RegExp(field.placeholder, 'g'), value);
      }
    });

    const sanitized = sanitizeTemplate(content);

    if (quillInstance.current) {
      quillInstance.current.clipboard.dangerouslyPasteHTML(sanitized);
    }
  }, [template, filledFields]);

  function sanitizeTemplate(content: string) {
    const div = document.createElement('div');
    div.innerHTML = content;

    div.querySelectorAll('img').forEach((el) => el.remove());
    div.querySelectorAll('style').forEach((el) => el.remove());

    div.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('style');
      el.removeAttribute('class');
    });

    return div.innerHTML;
  }

  const handleFieldSelect = (field: { id: string }) => {
    if (!selectedText) return;

    chrome.runtime.sendMessage({
      type: 'FILL_FIELD',
      payload: {
        fieldId: field.id,
        text: selectedText
      }
    });

    setDropdownVisible(false);
    setSelectedText('');
  };

  const getFieldStatus = (fieldId: string) => {
    return filledFields[fieldId] ? 'preenchido' : 'pendente';
  };

  const getFilledFieldsCount = () => Object.keys(filledFields).length;
  const getTotalFieldsCount = () => template.fields.length;

  return (
    <div className="template-editor">
      <div className="header">
        <button className="back-button" onClick={onBack}>
          ← Voltar
        </button>
        <h2>Editando: {template.name}</h2>
      </div>

      <div className="progress">
        <div className="progress-info">
          <span>Progresso: {getFilledFieldsCount()}/{getTotalFieldsCount()} campos</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ 
              width: `${(getFilledFieldsCount() / getTotalFieldsCount()) * 100}%` 
            }}
          ></div>
        </div>
      </div>

      <div className="editor-content">
        <div className="document-preview">
          <h3>Prévia do Documento:</h3>
          <div ref={quillRef} className="quill-editor preview-quill" />
        </div>

        <div className="fields-status">
          <h3>Status dos Campos:</h3>
          <div className="fields-list">
            {template.fields.map((field) => (
              <div 
                key={field.id} 
                className={`field-status ${getFieldStatus(field.id)}`}
              >
                <div className="field-info">
                  <span className="field-name">{field.name}</span>
                  <span className="field-shortcut">{field.shortcut}</span>
                </div>
                <div className="field-value">
                  {filledFields[field.id] || 'Não preenchido'}
                </div>
                <div className="field-indicator">
                  {getFieldStatus(field.id) === 'preenchido' ? '✓' : '○'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="instructions">
        <h4>Instruções:</h4>
        <ol>
          <li>Selecione o texto desejado</li>
          <li>Clique com o botão direito sobre a seleção</li>
          <li>Escolha o campo que deseja preencher</li>
          <li>Repita para todos os campos</li>
          <li>Finalize para assinar ou imprimir</li>
        </ol>
      </div>

      {dropdownVisible && (
        <FieldDropdown
          fields={template.fields}
          position={dropdownPosition}
          onSelect={handleFieldSelect}
          onClose={() => setDropdownVisible(false)}
        />
      )}

    </div>
  );
};

export default TemplateEditor;
