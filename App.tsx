/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useReducer } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AddHome from './src/screens/add_home';
import Checklist from './src/screens/checklist';
import Main from './src/screens/Main';
import { HomeCard, NewHomeInput } from './src/types/home';

type Screen = 'main' | 'addHome' | 'checklist';
type AppState = {
  screen: Screen;
  homes: HomeCard[];
  editingHomeId: string | null;
  selectedHomeId: string | null;
};
type AppAction =
  | { type: 'OPEN_ADD_HOME' }
  | { type: 'OPEN_EDIT_HOME'; payload: string }
  | { type: 'OPEN_CHECKLIST'; payload: string }
  | { type: 'OPEN_MAIN' }
  | { type: 'SAVE_HOME'; payload: NewHomeInput };

const initialState: AppState = {
  screen: 'main',
  homes: [],
  editingHomeId: null,
  selectedHomeId: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'OPEN_ADD_HOME':
      return {
        ...state,
        screen: 'addHome',
        editingHomeId: null,
        selectedHomeId: null,
      };
    case 'OPEN_EDIT_HOME':
      return {
        ...state,
        screen: 'addHome',
        editingHomeId: action.payload,
        selectedHomeId: null,
      };
    case 'OPEN_CHECKLIST':
      return {
        ...state,
        screen: 'checklist',
        editingHomeId: null,
        selectedHomeId: action.payload,
      };
    case 'OPEN_MAIN':
      return {
        ...state,
        screen: 'main',
        editingHomeId: null,
        selectedHomeId: null,
      };
    case 'SAVE_HOME':
      if (state.editingHomeId) {
        return {
          screen: 'main',
          editingHomeId: null,
          selectedHomeId: null,
          homes: state.homes.map(home =>
            home.id === state.editingHomeId
              ? {
                  ...home,
                  ...action.payload,
                }
              : home,
          ),
        };
      }

      return {
        screen: 'main',
        editingHomeId: null,
        selectedHomeId: null,
        homes: [
          {
            id: `home-${Date.now()}`,
            name: action.payload.name,
            location: action.payload.location,
            deposit: action.payload.deposit,
            monthlyRent: action.payload.monthlyRent,
            maintenanceFee: action.payload.maintenanceFee,
            rentType: action.payload.rentType,
            brokerPhone: action.payload.brokerPhone,
            dueDate: action.payload.dueDate,
          },
          ...state.homes,
        ],
      };
    default:
      return state;
  }
}

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [state, dispatch] = useReducer(appReducer, initialState);
  const editingHome =
    state.editingHomeId == null
      ? null
      : state.homes.find(home => home.id === state.editingHomeId) ?? null;
  const editingHomeInput: NewHomeInput | null =
    editingHome == null
      ? null
      : {
          name: editingHome.name,
          location: editingHome.location,
          deposit: editingHome.deposit,
          monthlyRent: editingHome.monthlyRent,
          maintenanceFee: editingHome.maintenanceFee,
          rentType: editingHome.rentType,
          brokerPhone: editingHome.brokerPhone,
          dueDate: editingHome.dueDate,
        };
  const selectedHome =
    state.selectedHomeId == null
      ? null
      : state.homes.find(home => home.id === state.selectedHomeId) ?? null;

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={
          state.screen === 'addHome'
            ? 'light-content'
            : isDarkMode
              ? 'light-content'
              : 'dark-content'
        }
      />
      <AppContent
        screen={state.screen}
        homes={state.homes}
        onPressAddHome={() => dispatch({ type: 'OPEN_ADD_HOME' })}
        onPressEditHome={id => dispatch({ type: 'OPEN_EDIT_HOME', payload: id })}
        onPressOpenChecklist={id =>
          dispatch({ type: 'OPEN_CHECKLIST', payload: id })
        }
        onPressBackMain={() => dispatch({ type: 'OPEN_MAIN' })}
        onSaveHome={home => dispatch({ type: 'SAVE_HOME', payload: home })}
        editingHome={editingHomeInput}
        selectedHome={selectedHome}
      />
    </SafeAreaProvider>
  );
}

type AppContentProps = {
  screen: Screen;
  homes: HomeCard[];
  onPressAddHome: () => void;
  onPressEditHome: (id: string) => void;
  onPressOpenChecklist: (id: string) => void;
  onPressBackMain: () => void;
  onSaveHome: (home: NewHomeInput) => void;
  editingHome: NewHomeInput | null;
  selectedHome: HomeCard | null;
};

function AppContent({
  screen,
  homes,
  onPressAddHome,
  onPressEditHome,
  onPressOpenChecklist,
  onPressBackMain,
  onSaveHome,
  editingHome,
  selectedHome,
}: AppContentProps) {
  return (
    <View style={styles.container}>
      {screen === 'main' && (
        <Main
          homes={homes}
          onPressAddHome={onPressAddHome}
          onPressEditHome={onPressEditHome}
          onPressOpenChecklist={onPressOpenChecklist}
        />
      )}
      {screen === 'addHome' && (
        <AddHome
          onPressBack={onPressBackMain}
          onPressSave={onSaveHome}
          initialValues={editingHome}
        />
      )}
      {screen === 'checklist' && selectedHome && (
        <Checklist home={selectedHome} onPressBack={onPressBackMain} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
