import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type BottomTabKey =
  | 'home'
  | 'calendar'
  | 'document'
  | 'chatbot'
  | 'contract';

type TabItem = {
  key: BottomTabKey;
  icon: string;
  label: string;
};

const tabs: TabItem[] = [
  { key: 'home', icon: '⌂', label: 'Home' },
  { key: 'calendar', icon: '☷', label: 'Calender' },
  { key: 'document', icon: '▤', label: 'Document' },
  { key: 'chatbot', icon: '◔', label: 'ChatBot' },
  { key: 'contract', icon: '☑', label: 'Contract' },
];

type BottomTabsProps = {
  activeTab: BottomTabKey;
  onPressTab?: (tabKey: BottomTabKey) => void;
};

function BottomTabs({
  activeTab,
  onPressTab,
}: BottomTabsProps): React.JSX.Element {
  return (
    <View style={styles.tabBar}>
      {tabs.map(tab => (
        <TouchableOpacity
          key={tab.key}
          accessibilityRole="button"
          style={styles.tabItem}
          activeOpacity={0.85}
          onPress={() => onPressTab?.(tab.key)}>
          <Text style={[styles.tabIcon, tab.key === activeTab && styles.activeTab]}>
            {tab.icon}
          </Text>
          <Text style={[styles.tabLabel, tab.key === activeTab && styles.activeTab]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 78,
    borderTopWidth: 1,
    borderTopColor: '#D7DCE5',
    backgroundColor: '#F6F7F9',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 62,
  },
  tabIcon: {
    color: '#708095',
    fontSize: 18,
    fontWeight: '600',
  },
  tabLabel: {
    color: '#708095',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  activeTab: {
    color: '#D82929',
  },
});

export default BottomTabs;
