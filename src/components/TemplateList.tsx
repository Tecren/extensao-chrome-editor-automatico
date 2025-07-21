import React from 'react';
import { Template } from '../types';

interface TemplateListProps {
  templates: Template[];
  onTemplateSelect: (template: Template) => void;
}

const TemplateList: React.FC<TemplateListProps> = ({ templates, onTemplateSelect }) => {
  return (
    <div className="template-list">
      <div className="header">
        <h2>Modelos de Documento</h2>
        <p>Selecione um modelo para começar</p>
      </div>
      
      <div className="templates">
        {templates.map((template) => (
          <div
            key={template.id}
            className="template-item"
            onClick={() => onTemplateSelect(template)}
          >
            <div className="template-info">
              <h3>{template.name}</h3>
              <p>{template.description}</p>
            </div>
            
            <div className="template-fields">
              <span className="fields-count">
                {template.fields.length} campos
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="footer">
        <div className="shortcuts-info">
          <h4>Atalhos:</h4>
          <ul>
            <li><kbd>Ctrl+Shift+1</kbd> - Nome</li>
            <li><kbd>Ctrl+Shift+2</kbd> - CPF</li>
            <li><kbd>Ctrl+Shift+3</kbd> - Documento</li>
            <li><kbd>Botão direito mouse</kbd> - Dropdown</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TemplateList;

