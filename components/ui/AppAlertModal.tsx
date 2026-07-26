import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Modal, TouchableOpacity, View } from 'react-native';
import { AppButton } from './AppButton';
import { AppText } from './AppText';

export type AlertType = 'error' | 'warning' | 'success' | 'info';

interface AppAlertModalProps {
  visible: boolean;
  title: string;
  message: string;
  type: AlertType;
  onClose: () => void;
  actionText?: string;
  onAction?: () => void;
}

export function AppAlertModal({ visible, title, message, type, onClose, actionText, onAction }: AppAlertModalProps) {
  const getConfig = () => {
    switch (type) {
      case 'error': return { icon: 'alert-triangle', colorClass: 'text-red-700 dark:text-red-500', bgClass: 'bg-red-100 dark:bg-red-950/50', borderClass: 'border-red-700 dark:border-red-500' };
      case 'warning': return { icon: 'alert-circle', colorClass: 'text-amber-700 dark:text-amber-500', bgClass: 'bg-amber-100 dark:bg-amber-950/50', borderClass: 'border-amber-700 dark:border-amber-500' };
      case 'success': return { icon: 'check-circle', colorClass: 'text-emerald-700 dark:text-emerald-500', bgClass: 'bg-emerald-100 dark:bg-emerald-950/50', borderClass: 'border-emerald-700 dark:border-emerald-500' };
      case 'info': default: return { icon: 'info', colorClass: 'text-blue-700 dark:text-blue-500', bgClass: 'bg-blue-100 dark:bg-blue-950/50', borderClass: 'border-blue-700 dark:border-blue-500' };
    }
  };
  
  const config = getConfig();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/70 justify-center p-5">
        <View className={`bg-white dark:bg-zinc-950 p-6 rounded-2xl border-2 border-black dark:border-zinc-800 border-t-8 ${config.borderClass}`}>
          <View className="flex-row justify-between items-start">
            <View className={`w-12 h-12 rounded-xl border-2 justify-center items-center ${config.bgClass} ${config.borderClass}`}>
              <Feather name={config.icon as any} size={24} className={config.colorClass} />
            </View>
            <TouchableOpacity onPress={onClose} className="p-1">
              <Feather name="x" size={24} className="text-zinc-400 dark:text-zinc-500" />
            </TouchableOpacity>
          </View>
          <AppText variant="titleMd" className="mt-4 mb-2">
            {title}
          </AppText>
          <AppText variant="bodySm" color="secondary" className="mb-6">
            {message}
          </AppText>
          <AppButton variant="primary" onPress={() => { if(onAction) onAction(); onClose(); }}>
            {actionText || "ACKNOWLEDGE"}
          </AppButton>
        </View>
      </View>
    </Modal>
  );
}