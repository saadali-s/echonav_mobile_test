import React, { createContext, useContext, useState } from 'react';
import { AlertType, AppAlertModal } from '../../components/ui/AppAlertModal';

interface AlertState {
  visible: boolean;
  title: string;
  message: string;
  type: AlertType;
  actionText?: string;
  onAction?: () => void;
}

interface AlertContextType {
  showAlert: (title: string, message: string, type?: AlertType, actionText?: string, onAction?: () => void) => void;
}

const AlertContext = createContext<AlertContextType | null>(null);

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alert, setAlert] = useState<AlertState>({ visible: false, title: '', message: '', type: 'info' });

  const showAlert = (title: string, message: string, type: AlertType = 'info', actionText?: string, onAction?: () => void) => {
    setAlert({ visible: true, title, message, type, actionText, onAction });
  };

  const closeAlert = () => {
    setAlert(prev => ({ ...prev, visible: false }));
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <AppAlertModal
        visible={alert.visible}
        title={alert.title}
        message={alert.message}
        type={alert.type}
        actionText={alert.actionText}
        onAction={alert.onAction}
        onClose={closeAlert}
      />
    </AlertContext.Provider>
  );
}

export const useAppAlert = () => {
  const context = useContext(AlertContext);
  if (!context) throw new Error('useAppAlert must be used within an AlertProvider');
  return context;
};