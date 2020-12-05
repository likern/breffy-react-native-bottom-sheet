import React, { memo } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import isEqual from 'lodash.isequal';
import { styles } from './styles';
import Animated from 'react-native-reanimated';

export interface BottomSheetHandleProps {
  containerStyle?: StyleProp<ViewStyle>;
  indicatorStyle?: StyleProp<ViewStyle>;
  animatedContainerStyle?: Animated.AnimatedStyleProp<ViewStyle>;
  animatedIndicatorStyle?: Animated.AnimatedStyleProp<ViewStyle>;
}

const BottomSheetHandleComponent = ({
  containerStyle,
  indicatorStyle,
  animatedContainerStyle,
  animatedIndicatorStyle
}: BottomSheetHandleProps) => {
  return (
    <Animated.View
      style={[styles.container, containerStyle, animatedContainerStyle]}
      shouldRasterizeIOS={true}
    >
      <Animated.View
        style={[styles.indicator, indicatorStyle, animatedIndicatorStyle]}
      />
    </Animated.View>
  );
};

export const BottomSheetHandle = memo(BottomSheetHandleComponent, isEqual);
