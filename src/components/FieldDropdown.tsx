import React, { useEffect, useRef } from 'react';
import { TemplateField } from '../types';

interface FieldDropdownProps {
  fields: TemplateField[];
  position: { top: number; left: number };
  onSelect: (field: TemplateField) => void;
  onClose: () => void;
}

const FieldDropdown: React.FC<FieldDropdownProps> = ({ fields, position, onSelect, onClose }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={dropdownRef}
      className="field-dropdown"
      style={{
        position: 'absolute',
        top: position.top,
        left: position.left,
        background: 'white',
        border: '1px solid #ccc',
        borderRadius: '4px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        zIndex: 10000,
        padding: '8px',
        minWidth: '180px'
      }}
    >
      <div style={{ padding: '8px', fontWeight: 'bold' }}>Escolha o campo a substituir:</div>
      {fields.map((field) => (
        <div
          key={field.id}
          className="dropdown-item"
          onClick={() => onSelect(field)}
          style={{
            padding: '6px 12px',
            cursor: 'pointer'
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.background = '#f1f1f1')
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.background = 'transparent')
          }
        >
          {field.name}
        </div>
      ))}
    </div>
  );
};

export default FieldDropdown;
