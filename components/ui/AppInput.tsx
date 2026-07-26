import React from 'react';
import { TextInput, TextInputProps, View } from 'react-native';
import { AppText } from './AppText';

interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
  className?: string;
  inputClassName?: string;
  right?: React.ReactNode;
  left?: React.ReactNode;
}

export function AppInput({ label, error, className = '', inputClassName = '', right, left, ...props }: AppInputProps) {
  return (
    <View className={`w-full mb-3 ${className}`}>
      {label && <AppText variant="label" color="secondary" className="mb-1 ml-1">{label}</AppText>}
      
      <View className="relative justify-center">
        {left && <View className="absolute left-3.5 z-10">{left}</View>}
        
        <TextInput
          className={`bg-white dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-700 border-b-[5px] border-r-[3px] rounded-xl p-4 text-base font-semibold text-zinc-950 dark:text-white ${left ? 'pl-11' : ''} ${right ? 'pr-11' : ''} ${error ? 'border-red-600 dark:border-red-500' : ''} ${inputClassName}`}
          placeholderTextColor="#a1a1aa"
          {...props}
        />
        
        {right && <View className="absolute right-3.5 z-10">{right}</View>}
      </View>

      {error && <AppText variant="caption" color="danger" className="mt-1 ml-1">{error}</AppText>}
    </View>
  );
}