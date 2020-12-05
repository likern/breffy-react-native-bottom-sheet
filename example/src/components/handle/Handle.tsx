import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { BottomSheetHandleProps } from '@breeffy/react-native-bottom-sheet';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useDerivedValue
} from 'react-native-reanimated';
import { toRad } from 'react-native-redash';
import { transformOrigin } from '../../utilities/transformOrigin';

interface HandleProps extends BottomSheetHandleProps {
  animatedPositionIndex: Animated.SharedValue<number>;
}

const Handle = ({
  containerStyle,
  indicatorStyle,
  animatedContainerStyle,
  animatedIndicatorStyle,
  animatedPositionIndex
}: HandleProps) => {
  const indicatorTransformOriginY = useDerivedValue(() =>
    interpolate(
      animatedPositionIndex.value,
      [0, 1, 2],
      [-1, 0, 1],
      Extrapolate.CLAMP
    )
  );

  const containerStyles = useMemo(() => [styles.header, containerStyle], [
    containerStyle
  ]);
  const containerAnimatedStyle = useAnimatedStyle(() => {
    const borderTopRadius = interpolate(
      animatedPositionIndex.value,
      [1, 2],
      [20, 0],
      Extrapolate.CLAMP
    );
    return {
      borderTopLeftRadius: borderTopRadius,
      borderTopRightRadius: borderTopRadius
    };
  });
  const leftIndicatorStyle = useMemo(
    () => ({
      ...styles.indicator,
      ...styles.leftIndicator
    }),
    []
  );
  const leftIndicatorAnimatedStyle = useAnimatedStyle(() => {
    const leftIndicatorRotate = interpolate(
      animatedPositionIndex.value,
      [0, 1, 2],
      [toRad(-30), 0, toRad(30)],
      Extrapolate.CLAMP
    );
    return {
      transform: transformOrigin(
        { x: 0, y: indicatorTransformOriginY.value },
        {
          rotate: `${leftIndicatorRotate}rad`
        },
        {
          translateX: -5
        }
      )
    };
  });
  const rightIndicatorStyle = useMemo(
    () => ({
      ...styles.indicator,
      ...styles.rightIndicator
    }),
    []
  );
  const rightIndicatorAnimatedStyle = useAnimatedStyle(() => {
    const rightIndicatorRotate = interpolate(
      animatedPositionIndex.value,
      [0, 1, 2],
      [toRad(30), 0, toRad(-30)],
      Extrapolate.CLAMP
    );
    return {
      transform: transformOrigin(
        { x: 0, y: indicatorTransformOriginY.value },
        {
          rotate: `${rightIndicatorRotate}rad`
        },
        {
          translateX: 5
        }
      )
    };
  });

  // render
  return (
    <Animated.View
      style={[containerStyles, containerAnimatedStyle, animatedContainerStyle]}
      renderToHardwareTextureAndroid={true}
    >
      <Animated.View
        style={[
          leftIndicatorStyle,
          indicatorStyle,
          leftIndicatorAnimatedStyle,
          animatedIndicatorStyle
        ]}
      />
      <Animated.View
        style={[
          rightIndicatorStyle,
          indicatorStyle,
          rightIndicatorAnimatedStyle,
          animatedIndicatorStyle
        ]}
      />
    </Animated.View>
  );
};

export { Handle };

const styles = StyleSheet.create({
  header: {
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingVertical: 14,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: -20
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#fff'
  },
  indicator: {
    position: 'absolute',
    width: 10,
    height: 4,
    backgroundColor: '#999'
  },
  leftIndicator: {
    borderTopStartRadius: 2,
    borderBottomStartRadius: 2
  },
  rightIndicator: {
    borderTopEndRadius: 2,
    borderBottomEndRadius: 2
  }
});
