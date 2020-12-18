import type React from 'react';
import type Animated from 'react-native-reanimated';
import type { ViewProps } from 'react-native';
import type { SnapPoint } from '../../types';

export interface BottomSheetProps extends BottomSheetAnimationConfigs {
  /**
   * Initial snap index, you also could provide {`-1`} to initiate bottom sheet in closed state.
   * @type number
   * @default 0
   */
  initialSnapIndex?: number;
  /**
   * Points for the bottom sheet to snap to. It accepts array of number, string or mix.
   * String values should be a percentage.
   * @type Array<string | number>
   * @example
   * [100, '50%', '90%']
   */
  snapPoints: SnapPoint[];
  /**
   * Top inset value helps to calculate percentage snap points values. usually comes from `@react-navigation/stack` hook `useHeaderHeight` or from `react-native-safe-area-context` hook `useSafeArea`.
   * @type number
   */
  topInset?: number;
  /**
   * Animated value to be used as a callback of the position node internally.
   * @type Animated.Value<number>
   */
  animatedPosition?: Animated.SharedValue<number>;
  /**
   * Animated value to be used as a callback for the position index node internally.
   * @type Animated.Value<number>
   */
  animatedPositionIndex?: Animated.SharedValue<number>;
  /**
   * Component to be placed as a sheet handle.
   * @type () => JSX.Element
   */
  handleComponent?: () => JSX.Element;
  /**
   * Component to be placed as a background.
   * @type React.FC\<ViewProps\>
   */
  backgroundComponent?: React.FC<ViewProps>;
  /**
   * If **true**, `onChange()` and `onAnimate()` are called only when initial snap point and target snap point are different
   * @type boolean | undefined
   * @default true
   */
  onlyDistinctSnaps?: boolean;
  /**
   * Callback when the sheet position changed to a provided snap point index.
   * @type (index: number) => void;
   */
  onChange?: (index: number) => void;
  /**
   * Callback when the sheet about to animate to a snap point, specified by index.
   * @type (fromIndex: number, toIndex: number) => void;
   * @param fromIndex previous snap point index
   * @param toIndex next snap point index
   */
  onAnimate?: (fromIndex: number, toIndex: number) => void;
  /**
   * A scrollable node or normal view.
   * @type React.ReactNode[] | React.ReactNode
   */
  children: (() => React.ReactNode) | React.ReactNode[] | React.ReactNode;
}

export interface BottomSheetAnimationConfigs {
  /**
   * Snapping animation easing function.
   * @type Animated.EasingFunction
   * @default Easing.out(Easing.back(0.75))
   */
  animationEasing?: Animated.EasingFunction;
  /**
   * Snapping animation duration.
   * @type number
   * @default 500
   */
  animationDuration?: number;
}
