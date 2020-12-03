import React, { useCallback, useRef, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { BottomSheet, SnapPoint } from '@breeffy/react-native-bottom-sheet';
import ContactList from '../components/contactList';
import Button from '../components/button';
import { useHeaderHeight } from '@react-navigation/stack';

export const SwipeToCloseExample = () => {
  // hooks
  const bottomSheetRef = useRef<BottomSheet>(null);
  const headerHeight = useHeaderHeight();
  const snapPoints = useMemo<SnapPoint[]>(
    () => [
      { relativeTo: 'window', percentagesOf: 0 },
      { relativeTo: 'content', percentagesOf: 100 }
    ],
    []
  );

  // callbacks
  const handleSheetChange = useCallback(_ => {}, []);
  const handleSnapPress = useCallback(index => {
    bottomSheetRef.current?.snapTo(index);
  }, []);
  const handleExpandPress = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);
  const handleCollapsePress = useCallback(() => {
    bottomSheetRef.current?.collapse();
  }, []);
  const handleClosePress = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  return (
    <View style={styles.container}>
      <Button
        label="Snap To 100% Of Content"
        style={styles.buttonContainer}
        onPress={() => handleSnapPress(1)}
      />
      <Button
        label="Expand"
        style={styles.buttonContainer}
        onPress={() => handleExpandPress()}
      />
      <Button
        label="Collapse"
        style={styles.buttonContainer}
        onPress={() => handleCollapsePress()}
      />
      <Button
        label="Close"
        style={styles.buttonContainer}
        onPress={() => handleClosePress()}
      />
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        initialSnapIndex={1}
        topInset={headerHeight}
        onChange={handleSheetChange}
      >
        <ContactList type={'View'} count={6} />
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24
  },
  buttonContainer: {
    marginBottom: 6
  }
});
