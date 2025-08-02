import React from 'react';
import { Template } from '../types';

interface TemplatePreviewProps {
  template: Template;
  onStartEditing: () => void;
  onBack: () => void;
}

function sanitizeTemplate(content: string) {
  const div = document.createElement('div');
  div.innerHTML = content;

  div.querySelectorAll('img, style').forEach((el) => el.remove());

  div.querySelectorAll('*').forEach((el) => {
    el.removeAttribute('style');
    el.removeAttribute('class');
  });

  return div.innerHTML;
}

const TemplatePreview: React.FC<TemplatePreviewProps> = ({
  template,
  onStartEditing,
  onBack,
}) => {
  return (
    <div className="template-preview">
      <div className="header">
        <button className="back-button" onClick={onBack}>
          ← Voltar
        </button>
        <h2>{template.name}</h2>
      </div>

      <div className="preview-content">
        <div className="preview-document" dangerouslySetInnerHTML={{ __html: sanitizeTemplate(template.content) }}></div>

        <div className="fields-info">
          <h3>Campos para Preenchimento:</h3>
          <div className="fields-list">
            {template.fields.map((field) => (
              <div key={field.id} className="field-item">
                <span className="field-name">{field.name}</span>
                <span className="field-shortcut">{field.shortcut}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="actions">
        <button className="edit-button" onClick={onStartEditing}>
          Editar
        </button>
      </div>

      <div className="instructions">
        <h4>Como usar:</h4>
        <ol>
          <li>Clique em "Editar" para começar</li>
          <li>Selecione texto em qualquer página</li>
          <li>Use os atalhos ou o botão direito do mouse para preencher os campos</li>
          <li>Volte aqui para assinar o documento</li>
        </ol>
      </div>
    </div>
  );
};

export default TemplatePreview;