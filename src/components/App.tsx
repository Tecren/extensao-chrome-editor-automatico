import React, { useState, useEffect } from 'react';
import TemplateList from './TemplateList';
import TemplatePreview from './TemplatePreview';
import TemplateEditor from './TemplateEditor';
import SignatureSelector from './SignatureSelector';
import { Template, ExtensionState, DEFAULT_TEMPLATES, DEFAULT_EMPLOYEES } from '../types';

const App: React.FC = () => {
  const [state, setState] = useState<ExtensionState>({
    selectedTemplate: null,
    filledFields: {},
    isEditing: false,
    employees: DEFAULT_EMPLOYEES,
    selectedEmployee: null
  });

  const [currentView, setCurrentView] = useState<'list' | 'preview' | 'editor' | 'signature'>('list');

  useEffect(() => {
    chrome.storage.local.get(['extensionState'], (result) => {
      let savedState = result.extensionState;

      if (savedState) {
        if (!savedState.employees || savedState.employees.length === 0) {
          savedState.employees = DEFAULT_EMPLOYEES;
        }

        setState(savedState);

        if (savedState.selectedTemplate) {
          const hasFilledFields = Object.keys(savedState.filledFields).length > 0;
          if (hasFilledFields) {
            setCurrentView('signature');
          } else {
            setCurrentView('preview');
          }
        }
      }
    });
  }, []);

  useEffect(() => {
    const listener = (changes: any, areaName: string) => {
      if (areaName === 'local' && changes.extensionState) {
        const newState = changes.extensionState.newValue;
        console.log("Storage atualizado:", newState);
        setState(newState);
      }
    };

    chrome.storage.onChanged.addListener(listener);

    return () => {
      chrome.storage.onChanged.removeListener(listener);
    };
  }, []);

  const saveState = (newState: ExtensionState) => {
    setState(newState);
    chrome.storage.local.set({ extensionState: newState });
  };

  const handleTemplateSelect = (template: Template) => {
    const newState = {
      ...state,
      selectedTemplate: template,
      filledFields: {},
      isEditing: false,
      selectedEmployee: null
    };
    saveState(newState);
    setCurrentView('preview');
  };

  const handleStartEditing = () => {
    const newState = {
      ...state,
      isEditing: true
    };
    saveState(newState);
    setCurrentView('editor');
    
    window.close();
  };

  const handleBackToList = () => {
    const newState = {
      ...state,
      selectedTemplate: null,
      filledFields: {},
      isEditing: false,
      selectedEmployee: null
    };
    saveState(newState);
    setCurrentView('list');
  };

  const handleEmployeeSelect = (employee: any) => {
    console.log("Selecionado no App:", employee);
    if (!state.selectedTemplate) return;

    const funcionarioField = state.selectedTemplate.fields.find(f => f.id === 'funcionario');
    if (funcionarioField) {
      const newFilledFields = {
        ...state.filledFields,
        funcionario: employee.name
      };

      const updatedState = {
        ...state,
        filledFields: {
          ...state.filledFields,
          funcionario: employee.name
        },
        selectedEmployee: employee
      };

      saveState(updatedState);
      
      setTimeout(() => {
        setState((prev) => ({ ...prev }));
      }, 50);
    }
  };

  const handleFinishDocument = () => {
    const newState = {
      selectedTemplate: null,
      filledFields: {},
      isEditing: false,
      employees: DEFAULT_EMPLOYEES,
      selectedEmployee: null
    };
    saveState(newState);
    setCurrentView('list');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'list':
        return (
          <TemplateList
            templates={DEFAULT_TEMPLATES}
            onTemplateSelect={handleTemplateSelect}
          />
        );
      
      case 'preview':
        return state.selectedTemplate ? (
          <TemplatePreview
            template={state.selectedTemplate}
            onStartEditing={handleStartEditing}
            onBack={handleBackToList}
          />
        ) : null;
      
      case 'editor':
        return state.selectedTemplate ? (
          <TemplateEditor
            template={state.selectedTemplate}
            filledFields={state.filledFields}
            onBack={handleBackToList}
          />
        ) : null;
      
      case 'signature':
        return state.selectedTemplate ? (
          <SignatureSelector
            template={state.selectedTemplate}
            filledFields={state.filledFields}
            employees={state.employees}
            selectedEmployee={state.selectedEmployee}
            onEmployeeSelect={handleEmployeeSelect}
            onFinish={handleFinishDocument}
            onBack={handleBackToList}
          />
        ) : null;
      
      default:
        return null;
    }
  };

  return (
    <div className="app">
      {renderCurrentView()}
    </div>
  );
};

export default App;