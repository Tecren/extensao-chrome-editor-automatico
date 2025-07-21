import React, { useEffect, useRef } from 'react';
import { Template, Employee } from '../types';
import { gerarDataPorExtenso } from '../utils/formatters';
import { formatCPF } from '../utils/formatCPF';

interface SignatureSelectorProps {
  template: Template;
  filledFields: Record<string, string>;
  employees: Employee[];
  selectedEmployee: Employee | null;
  onEmployeeSelect: (employee: Employee) => void;
  onFinish: () => void;
  onBack: () => void;
}

  const SignatureSelector: React.FC<SignatureSelectorProps> = ({
    template,
    filledFields,
    employees,
    selectedEmployee,
    onEmployeeSelect,
    onFinish,
    onBack
  }) => {
  const hasFuncionarioField = template.fields.some(field => field.id === 'funcionario');


  const gerarConteudoPreenchido = (): string => {
    let content = typeof template.content === 'string' ? template.content : '';
    template.fields.forEach(field => {
      let value = field.placeholder;
      if (field.id === 'funcionario' && selectedEmployee) {
        value = selectedEmployee.name;
      } else if (field.id === 'data') {
        value = gerarDataPorExtenso();
      } else if (field.id === 'cpf') {
        const rawCPF = filledFields[field.id];
        value = rawCPF ? formatCPF(rawCPF) : field.placeholder;
      } else if (filledFields[field.id]) {
        value = filledFields[field.id];
      }
      if (field.placeholder && typeof value === 'string') {
        content = content.replace(new RegExp(field.placeholder, 'g'), value);
      }
    });
    return content;
  };

  const isDocumentComplete = () => {
    return template.fields
      .filter(field => field.id !== 'funcionario' && field.id !== 'data')
      .every(field => filledFields[field.id]);
  };

  const escapeHtml = (unsafe?: string) => {
    if (!unsafe) return '';
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  };

  const sanitizeTemplate = (content: string) => {
    const div = document.createElement('div');
    div.innerHTML = content;

    div.querySelectorAll('img').forEach((el) => el.remove());
    div.querySelectorAll('style').forEach((el) => el.remove());

    div.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('style');
      el.removeAttribute('class');
    });

    return div.innerHTML;
  };

  const handleFinish = () => {
    const printWindow = window.open('', '', 'width=1000,height=800');
    const content = gerarConteudoPreenchido();

    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Documento Detran</title>
            <link rel="stylesheet" type="text/css" href="${window.location.origin}/styles/print.css">
          </head>
          <body>
            <div class="modelo-impressao">
              ${content}
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();

      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
        onFinish();
      };
    } else {
      alert('Não foi possível abrir a janela de impressão.');
    }
  };


  return (
    <div className="signature-selector">
      <div className="header">
        <button className="back-button" onClick={onBack}>
          ← Voltar
        </button>
        <h2>Finalizar Documento</h2>
      </div>

      <div className="document-final">
        <h3>Documento Preenchido:</h3>
        <div className="preview-document" dangerouslySetInnerHTML={{ __html: sanitizeTemplate(gerarConteudoPreenchido())}} />
      </div>

      {!isDocumentComplete() && (
        <div className="incomplete-warning">
          <p>⚠️ Alguns campos ainda não foram preenchidos. Volte para completar todos os campos antes de assinar.</p>
        </div>
      )}

      {isDocumentComplete() && hasFuncionarioField && (
        <div className="signature-section">
          <h3>Selecionar Funcionário Responsável:</h3>
          <div className="employees-list">
            {employees.map((employee) => (
              <div
                key={employee.id}
                className={`employee-item ${selectedEmployee?.id === employee.id ? 'selected' : ''}`}
                onClick={() => onEmployeeSelect(employee)}
                style={{
                  border: '2px solid',
                  borderColor: selectedEmployee?.id === employee.id ? '#667eea' : '#ccc',
                  cursor: 'pointer',
                  padding: '16px',
                  fontSize: '16px',
                  marginBottom: '8px'
                }}
              >
                <div className="employee-info">
                  <span className="employee-name">{employee.name}</span><br />
                  <span className="employee-position">{employee.position}</span>
                </div>
                <div className="selection-indicator">
                  {selectedEmployee?.id === employee.id ? '✓' : '○'}
                </div>
              </div>
            ))}
          </div>

          {selectedEmployee && (
            <div className="signature-confirmation">
              <p>Funcionário selecionado: <strong>{selectedEmployee.name}</strong></p>
              <button className="finish-button" onClick={handleFinish}>
                Finalizar Documento
              </button>
            </div>
          )}
        </div>
      )}

      {isDocumentComplete() && !hasFuncionarioField && (
        <div className="signature-confirmation">
          <button className="finish-button" onClick={handleFinish}>
            Finalizar Documento
          </button>
        </div>
      )}

      <div className="document-summary">
        <h4>Resumo do Documento:</h4>
        <div className="summary-fields">
          {template.fields.map((field) => (
            <div key={field.id} className="summary-field">
              <span className="field-label">{field.name}:</span>
              <span className="field-value">
                {field.id === 'funcionario'
                  ? selectedEmployee?.name || 'Não preenchido'
                  : field.id === 'data'
                  ? gerarDataPorExtenso()
                  : filledFields[field.id] || 'Não preenchido'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SignatureSelector;
