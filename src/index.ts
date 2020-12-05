export { BottomSheet } from './components/bottomSheet';
export { BottomSheetFlatList } from './components/flatList';
export { BottomSheetSectionList } from './components/sectionList';
export { BottomSheetScrollView } from './components/scrollView';
export { BottomSheetDraggableView } from './components/draggableView';
export { BottomSheetView } from './components/view';

import BottomSheetTouchable from './components/touchables';
export const {
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback
} = BottomSheetTouchable;

export { BottomSheetHandle, BottomSheetHandleProps } from './components/handle';

export { useBottomSheet } from './hooks/useBottomSheet';
export type { SnapPoint } from './types';
