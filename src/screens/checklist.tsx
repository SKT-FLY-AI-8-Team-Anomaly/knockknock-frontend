import React, { useEffect, useState } from 'react';
import {
  Alert,
  NativeModules,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CameraOptions,
  ImagePickerResponse,
  launchCamera,
} from 'react-native-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HomeCard } from '../types/home';

type ChecklistState = {
  mold: boolean;
  floor: boolean;
  waterPressure: boolean;
  hotWater: boolean;
};

const defaultChecklist: ChecklistState = {
  mold: false,
  floor: false,
  waterPressure: true,
  hotWater: true,
};

type ChecklistProps = {
  home: HomeCard;
  onPressBack: () => void;
};

type LegacyImagePickerModule = {
  launchCamera: (
    options: CameraOptions,
    callback: (response: ImagePickerResponse) => void,
  ) => void;
};

function launchCameraWithFallback(
  options: CameraOptions,
): Promise<ImagePickerResponse> {
  return launchCamera(options).catch(error => {
    const nativeImagePicker =
      (NativeModules.ImagePicker as LegacyImagePickerModule | undefined) ??
      (NativeModules.ImagePickerManager as LegacyImagePickerModule | undefined) ??
      (NativeModules.ImagePickerModule as LegacyImagePickerModule | undefined);

    if (!nativeImagePicker?.launchCamera) {
      throw error;
    }

    return new Promise(resolve => {
      nativeImagePicker.launchCamera(options, resolve);
    });
  });
}

function Checklist({ home, onPressBack }: ChecklistProps): React.JSX.Element {
  const [checks, setChecks] = useState<ChecklistState>(defaultChecklist);

  useEffect(() => {
    setChecks(defaultChecklist);
  }, [home.id]);

  const toggle = (key: keyof ChecklistState) => {
    setChecks(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleOpenCamera = async () => {
    try {
      const result = await launchCameraWithFallback({
        mediaType: 'photo',
        cameraType: 'back',
        saveToPhotos: false,
      });

      if (result.didCancel) {
        return;
      }

      if (result.errorCode) {
        Alert.alert(
          '카메라 실행 실패',
          result.errorMessage ?? '카메라 앱을 열 수 없습니다.',
        );
        return;
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : '카메라 앱을 열 수 없습니다. 앱을 완전히 재빌드한 뒤 다시 시도하세요.';
      Alert.alert('카메라 실행 실패', message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.mapArea}>
        <TouchableOpacity
          accessibilityRole="button"
          onPress={onPressBack}
          style={styles.backButton}
          activeOpacity={0.85}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        <View style={styles.pinOuter}>
          <View style={styles.pinInner} />
        </View>
        <View style={styles.pinStick} />
      </View>

      <View style={styles.sheet}>
        <View style={styles.handle} />

        <Text style={styles.homeName}>{home.name}</Text>

        <Text style={styles.label}>Location</Text>
        <Text style={styles.locationText}>{home.location || '-'}</Text>

        <View style={styles.divider} />

        <Text style={styles.label}>Check List</Text>

        <View style={styles.checkGrid}>
          <View style={styles.checkColumn}>
            <TouchableOpacity
              style={styles.checkRow}
              onPress={() => toggle('mold')}
              activeOpacity={0.8}>
              <View style={[styles.box, checks.mold && styles.boxChecked]}>
                {checks.mold ? <Text style={styles.checkMark}>✓</Text> : null}
              </View>
              <Text style={styles.checkText}>곰팡이</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.checkRow}
              onPress={() => toggle('floor')}
              activeOpacity={0.8}>
              <View style={[styles.box, checks.floor && styles.boxChecked]}>
                {checks.floor ? <Text style={styles.checkMark}>✓</Text> : null}
              </View>
              <Text style={styles.checkText}>바닥 상태</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.checkColumn}>
            <TouchableOpacity
              style={styles.checkRow}
              onPress={() => toggle('waterPressure')}
              activeOpacity={0.8}>
              <View
                style={[styles.box, checks.waterPressure && styles.boxChecked]}>
                {checks.waterPressure ? (
                  <Text style={styles.checkMark}>✓</Text>
                ) : null}
              </View>
              <Text style={styles.checkText}>수압</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.checkRow}
              onPress={() => toggle('hotWater')}
              activeOpacity={0.8}>
              <View style={[styles.box, checks.hotWater && styles.boxChecked]}>
                {checks.hotWater ? (
                  <Text style={styles.checkMark}>✓</Text>
                ) : null}
              </View>
              <Text style={styles.checkText}>온수</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomButtons}>
          <TouchableOpacity
            accessibilityRole="button"
            activeOpacity={0.9}
            style={styles.bottomButton}
            onPress={onPressBack}>
            <Text style={styles.bottomButtonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityRole="button"
            activeOpacity={0.9}
            style={styles.bottomButton}
            onPress={handleOpenCamera}>
            <Text style={styles.bottomButtonText}>Camera</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  mapArea: {
    height: 220,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    top: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: '#2A2A2A',
    fontSize: 20,
    fontWeight: '700',
    marginTop: -1,
  },
  pinOuter: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#D12424',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  pinStick: {
    width: 3,
    height: 26,
    backgroundColor: '#D12424',
    marginTop: -2,
  },
  sheet: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    marginTop: -12,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 16,
  },
  handle: {
    alignSelf: 'center',
    width: 48,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#AEAEAE',
    marginBottom: 20,
  },
  homeName: {
    fontSize: 30,
    fontWeight: '700',
    color: '#1F1F1F',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#9C9C9C',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 15,
    color: '#333333',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
    marginTop: 10,
    marginBottom: 16,
  },
  checkGrid: {
    flexDirection: 'row',
    marginTop: 4,
  },
  checkColumn: {
    flex: 1,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  box: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#202020',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  boxChecked: {
    borderColor: '#22A930',
    backgroundColor: '#EAF9EC',
  },
  checkMark: {
    color: '#22A930',
    fontWeight: '700',
    marginTop: -1,
  },
  checkText: {
    color: '#303030',
    fontSize: 15,
  },
  bottomButtons: {
    marginTop: 'auto',
    flexDirection: 'row',
    marginBottom: 4,
  },
  bottomButton: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#D71414',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  bottomButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default Checklist;
