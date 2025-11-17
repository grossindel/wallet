import { BlurView } from '@react-native-community/blur';
import { memo, useCallback } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { Touchable } from '@/components/Touchable';
import { useTheme } from '@/theme/themes';

import { useAndroidBackButton } from '@/utils/useAndroidBackButton';

import { useLongPress } from './LongPressContext';
import { LongPressOptionItem } from './LongPressOptionItem';

const BlurBackground = memo(({ colors }: { colors: any }) => {
  if (Platform.OS === 'ios') {
    return <BlurView blurType="ultraThinMaterialDark" reducedTransparencyFallbackColor={colors.background} style={[StyleSheet.absoluteFill]} blurAmount={10} />;
  }
  return <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: colors.blurBackgroundAndroid }]} />;
});

export const LongPressOverlay = () => {
  const { selectedItem, onPressOut, animatedStyle, options, overlayStyle, animatedOptionsStyle, styles: itemStyles } = useLongPress();
  const { colors } = useTheme();

  useAndroidBackButton(() => {
    if (selectedItem) {
      onPressOut();
      return true;
    }
    return false;
  });

  const onItemPress = useCallback(
    (onPress?: () => void) => {
      onPressOut(false, onPress);
    },
    [onPressOut],
  );

  const handlePressOut = useCallback(() => {
    onPressOut();
  }, [onPressOut]);

  const renderOptions = useCallback(
    () => (
      <Animated.View style={[styles.options, animatedOptionsStyle]}>
        {options.map((item, index) => (
          <LongPressOptionItem key={index} text={item.text} iconName={item.iconName} spaceBelow={item.spaceBelow} onPress={() => onItemPress(item.onPress)} />
        ))}
      </Animated.View>
    ),
    [animatedOptionsStyle, onItemPress, options],
  );

  const isActive = selectedItem !== null && selectedItem !== undefined;
  const hasRealContent = isActive && typeof selectedItem !== 'boolean';

  return (
    <Animated.View style={[StyleSheet.absoluteFill, overlayStyle]} pointerEvents={isActive ? 'auto' : 'none'}>
      {isActive && (
        <>
          <BlurBackground colors={colors} />
          <Touchable onPress={handlePressOut} style={styles.container}>
            <Animated.View style={animatedStyle}>
              <Animated.View style={styles.itemContainer}>
                <Touchable style={[styles.item, itemStyles, { backgroundColor: colors.dark50 }]}>
                  {hasRealContent ? <View pointerEvents="none">{selectedItem}</View> : <View style={styles.placeholder} />}
                </Touchable>
              </Animated.View>
              {renderOptions()}
            </Animated.View>
          </Touchable>
        </>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
  },
  item: {
    borderRadius: 16,
    padding: 12,
    margin: -12,
  },
  placeholder: {
    width: 100,
    height: 100,
    borderRadius: 16,
  },
  options: {
    marginTop: 18,
    width: '80%',
    marginLeft: 14,
    borderRadius: 16,
    overflow: 'hidden',
    transformOrigin: 'left top',
  },
});
