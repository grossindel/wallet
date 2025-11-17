import { useNavigation } from '@react-navigation/native';
import { useCameraPermissions } from 'expo-camera';
import { useCallback } from 'react';
import { Platform } from 'react-native';

import { Routes } from '@/Routes';
import { showPermissionDeniedAlert } from '@/utils/cameraPermissions';

export const useOnScanPress = () => {
  const navigation = useNavigation();
  const [_, requestPermission] = useCameraPermissions();
  const onScanPress = useCallback(async () => {
    if (Platform.OS === 'android') {
      navigation.navigate(Routes.ConnectAppQRScan);
      return;
    }

    const response = await requestPermission();
    if (response.granted) {
      navigation.navigate(Routes.ConnectAppQRScan);
    } else {
      showPermissionDeniedAlert();
    }
  }, [navigation, requestPermission]);

  return onScanPress;
};
