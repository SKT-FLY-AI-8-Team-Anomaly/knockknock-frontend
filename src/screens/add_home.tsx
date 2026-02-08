import React, { useEffect, useReducer } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NewHomeInput, RentType } from '../types/home';

type FormAction =
  | {
      type: 'SET_FIELD';
      field: keyof NewHomeInput;
      value: string | RentType;
    }
  | { type: 'SET_ALL'; payload: NewHomeInput }
  | { type: 'RESET' };

const emptyFormState: NewHomeInput = {
  name: '',
  location: '',
  deposit: '',
  monthlyRent: '',
  maintenanceFee: '',
  dueDate: '',
  brokerPhone: '',
  rentType: 'monthly',
};

const buildInitialFormState = (
  initialValues?: NewHomeInput | null,
): NewHomeInput => ({
  ...emptyFormState,
  ...initialValues,
});

function formReducer(state: NewHomeInput, action: FormAction): NewHomeInput {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        [action.field]: action.value,
      } as NewHomeInput;
    case 'SET_ALL':
      return action.payload;
    case 'RESET':
      return emptyFormState;
    default:
      return state;
  }
}

type AddHomeProps = {
  onPressBack: () => void;
  onPressSave: (home: NewHomeInput) => void;
  initialValues?: NewHomeInput | null;
};

function AddHome({
  onPressBack,
  onPressSave,
  initialValues,
}: AddHomeProps): React.JSX.Element {
  const [form, dispatch] = useReducer(
    formReducer,
    initialValues,
    buildInitialFormState,
  );

  useEffect(() => {
    dispatch({
      type: 'SET_ALL',
      payload: buildInitialFormState(initialValues),
    });
  }, [initialValues]);

  const handleSave = () => {
    onPressSave({
      name: form.name.trim() || 'home',
      location: form.location.trim(),
      deposit: form.deposit.trim(),
      monthlyRent: form.monthlyRent.trim(),
      maintenanceFee: form.maintenanceFee.trim(),
      dueDate: form.dueDate.trim(),
      brokerPhone: form.brokerPhone.trim(),
      rentType: form.rentType,
    });
  };

  const handleDelete = () => {
    dispatch({ type: 'RESET' });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
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
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.formBody}>
          <TextInput
            placeholder="집 이름"
            placeholderTextColor="#B6B7BA"
            style={styles.houseNameInput}
            value={form.name}
            onChangeText={value =>
              dispatch({
                type: 'SET_FIELD',
                field: 'name',
                value,
              })
            }
          />

          <Text style={styles.label}>Location</Text>
          <View style={styles.searchInputWrap}>
            <Text style={styles.searchIcon}>⌕</Text>
            <TextInput
              placeholder=""
              style={styles.searchInput}
              value={form.location}
              onChangeText={value =>
                dispatch({
                  type: 'SET_FIELD',
                  field: 'location',
                  value,
                })
              }
            />
          </View>

          <View style={styles.divider} />

          <Text style={styles.label}>집 세부 정보</Text>
          <View style={styles.rentTypeRow}>
            <TouchableOpacity
              style={[
                styles.rentTypeButton,
                styles.rentTypeButtonLeft,
                form.rentType === 'jeonse' && styles.rentTypeButtonActive,
              ]}
              onPress={() =>
                dispatch({
                  type: 'SET_FIELD',
                  field: 'rentType',
                  value: 'jeonse',
                })
              }>
              <Text
                style={[
                  styles.rentTypeText,
                  form.rentType === 'jeonse' && styles.rentTypeTextActive,
                ]}>
                전세
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.rentTypeButton,
                form.rentType === 'monthly' && styles.rentTypeButtonActive,
              ]}
              onPress={() =>
                dispatch({
                  type: 'SET_FIELD',
                  field: 'rentType',
                  value: 'monthly',
                })
              }>
              <Text
                style={[
                  styles.rentTypeText,
                  form.rentType === 'monthly' && styles.rentTypeTextActive,
                ]}>
                월세
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.priceRow}>
            <View style={[styles.priceField, styles.priceFieldLeft]}>
              <Text style={styles.priceLabel}>보증금</Text>
              <View style={styles.priceInputRow}>
                <TextInput
                  style={styles.priceInput}
                  keyboardType="number-pad"
                  value={form.deposit}
                  onChangeText={value =>
                    dispatch({
                      type: 'SET_FIELD',
                      field: 'deposit',
                      value,
                    })
                  }
                />
                <Text style={styles.priceUnit}>만원</Text>
              </View>
            </View>

            <View style={[styles.priceField, styles.priceFieldLeft]}>
              <Text style={styles.priceLabel}>월세</Text>
              <View style={styles.priceInputRow}>
                <TextInput
                  style={styles.priceInput}
                  keyboardType="number-pad"
                  value={form.monthlyRent}
                  onChangeText={value =>
                    dispatch({
                      type: 'SET_FIELD',
                      field: 'monthlyRent',
                      value,
                    })
                  }
                />
                <Text style={styles.priceUnit}>만원</Text>
              </View>
            </View>

            <View style={styles.priceField}>
              <Text style={styles.priceLabel}>관리비</Text>
              <View style={styles.priceInputRow}>
                <TextInput
                  style={styles.priceInput}
                  keyboardType="number-pad"
                  value={form.maintenanceFee}
                  onChangeText={value =>
                    dispatch({
                      type: 'SET_FIELD',
                      field: 'maintenanceFee',
                      value,
                    })
                  }
                />
                <Text style={styles.priceUnit}>만원</Text>
              </View>
            </View>
          </View>

          <Text style={styles.label}>임장 날짜</Text>
          <TextInput
            style={styles.fullInput}
            value={form.dueDate}
            onChangeText={value =>
              dispatch({
                type: 'SET_FIELD',
                field: 'dueDate',
                value,
              })
            }
          />

          <Text style={styles.label}>공인중개사 전화번호</Text>
          <TextInput
            style={styles.fullInput}
            keyboardType="phone-pad"
            value={form.brokerPhone}
            onChangeText={value =>
              dispatch({
                type: 'SET_FIELD',
                field: 'brokerPhone',
                value,
              })
            }
          />

          <View style={styles.actionRow}>
            <TouchableOpacity
              accessibilityRole="button"
              activeOpacity={0.9}
              style={[styles.actionButton, styles.deleteButton]}
              onPress={handleDelete}>
              <Text style={styles.actionButtonText}>삭제하기</Text>
            </TouchableOpacity>

            <TouchableOpacity
              accessibilityRole="button"
              activeOpacity={0.9}
              style={[styles.actionButton, styles.saveButton]}
              onPress={handleSave}>
              <Text style={styles.actionButtonText}>저장하기</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#727377',
  },
  mapArea: {
    height: 270,
    backgroundColor: '#727377',
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
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginTop: -1,
  },
  pinOuter: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#8F1616',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#D8D7D9',
  },
  pinStick: {
    width: 3,
    height: 26,
    backgroundColor: '#8F1616',
    marginTop: -2,
  },
  sheet: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -22,
    overflow: 'hidden',
  },
  formBody: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 40,
  },
  houseNameInput: {
    fontSize: 30,
    fontWeight: '700',
    color: '#313238',
    letterSpacing: -0.8,
    paddingVertical: 0,
    marginBottom: 22,
  },
  label: {
    fontSize: 15,
    color: '#8E8F95',
    marginBottom: 10,
    fontWeight: '500',
  },
  searchInputWrap: {
    height: 44,
    borderRadius: 10,
    backgroundColor: '#ECECEE',
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchIcon: {
    color: '#9A9BA0',
    fontSize: 22,
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#32343A',
    paddingVertical: 6,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#E4E4E6',
    marginBottom: 14,
  },
  rentTypeRow: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  rentTypeButton: {
    paddingHorizontal: 18,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#EFEFF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rentTypeButtonLeft: {
    marginRight: 8,
  },
  rentTypeButtonActive: {
    backgroundColor: '#D82929',
  },
  rentTypeText: {
    color: '#8F8F95',
    fontSize: 16,
    fontWeight: '600',
  },
  rentTypeTextActive: {
    color: '#FFFFFF',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  priceField: {
    flex: 1,
  },
  priceFieldLeft: {
    marginRight: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: '#94959B',
    marginBottom: 4,
  },
  priceInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceInput: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#ECECEE',
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#31323A',
  },
  priceUnit: {
    marginLeft: 4,
    color: '#9C9EA4',
    fontSize: 14,
  },
  fullInput: {
    height: 46,
    borderRadius: 10,
    backgroundColor: '#ECECEE',
    marginBottom: 18,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#31323A',
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    backgroundColor: '#4A4A4A',
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: '#D82929',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default AddHome;
