import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { BackHandler } from 'react-native';

export const useAndroidBackButton = (onBackPress: () => boolean) => {
  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => sub?.remove?.();
    }, [onBackPress]),
  );
};

export const useNoopAndroidBackButton = () => {
  useAndroidBackButton(() => true);
};
