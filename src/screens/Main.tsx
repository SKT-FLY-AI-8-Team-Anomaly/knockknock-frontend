import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomTabs from '../navigation/BottomTabs';
import { HomeCard } from '../types/home';

type MainProps = {
  onPressAddHome: () => void;
  onPressEditHome: (id: string) => void;
  onPressOpenChecklist: (id: string) => void;
  homes: HomeCard[];
};

function Main({
  onPressAddHome,
  onPressEditHome,
  onPressOpenChecklist,
  homes,
}: MainProps): React.JSX.Element {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.greeting}>
            Good Morning,
            {'\n'}
            Shuri
          </Text>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarEmoji}>👩🏻</Text>
          </View>
        </View>

        {homes.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>추가된 집이 없습니다</Text>
            <Text style={styles.emptySubtitle}>집을 추가해보세요!</Text>
          </View>
        ) : (
          <View style={styles.homeList}>
            {homes.map(home => (
              <TouchableOpacity
                key={home.id}
                accessibilityRole="button"
                activeOpacity={0.88}
                style={styles.homeCard}
                onPress={() => onPressOpenChecklist(home.id)}>
                <View style={styles.cardAccent} />
                <View style={styles.cardContent}>
                  <View style={styles.cardTopRow}>
                    <Text style={styles.cardName} numberOfLines={1}>
                      {home.name}
                    </Text>

                    <View style={styles.cardActions}>
                      <TouchableOpacity
                        accessibilityRole="button"
                        style={styles.editButton}
                        onPress={event => {
                          event.stopPropagation();
                          onPressEditHome(home.id);
                        }}>
                        <Text style={styles.editIcon}>✎</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        accessibilityRole="button"
                        style={styles.heartButton}
                        onPress={event => {
                          event.stopPropagation();
                        }}>
                        <Text style={styles.heartIcon}>♡</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <Text style={styles.cardAddress} numberOfLines={1}>
                    {home.location || '-'}
                  </Text>

                  <View style={styles.cardMetaRow}>
                    <View style={styles.metaBlock}>
                      <Text style={styles.metaLabel}>공인중개사</Text>
                      <Text style={styles.metaValue}>{home.brokerPhone || '-'}</Text>
                    </View>
                    <View style={styles.metaBlock}>
                      <Text style={styles.metaLabel}>Due date</Text>
                      <Text style={styles.metaValue}>🗓 {home.dueDate || '-'}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.fab}
        onPress={onPressAddHome}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <BottomTabs activeTab="home" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F6F7F9',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: 30,
    lineHeight: 30,
    fontWeight: '700',
    color: '#273247',
    letterSpacing: -0.8,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: '#F17390',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 34,
  },
  emptyState: {
    marginTop: 180,
  },
  emptyTitle: {
    fontSize: 30,
    lineHeight: 56,
    fontWeight: '700',
    color: '#273247',
    letterSpacing: -0.9,
  },
  emptySubtitle: {
    fontSize: 30,
    lineHeight: 56,
    fontWeight: '700',
    color: '#273247',
    letterSpacing: -0.9,
    marginTop: 18,
  },
  homeList: {
    marginTop: 35,
  },
  homeCard: {
    flexDirection: 'row',
    borderRadius: 14,
    backgroundColor: '#ECEFF6',
    overflow: 'hidden',
    minHeight: 140,
  },
  cardAccent: {
    width: 4,
    backgroundColor: '#2B57FF',
    marginVertical: 12,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  cardContent: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 14,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardName: {
    color: '#1E2738',
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
    marginRight: 12,
  },
  heartIcon: {
    color: '#1F2938',
    fontSize: 26,
    lineHeight: 26,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    marginRight: 8,
    paddingHorizontal: 2,
    paddingVertical: 1,
  },
  heartButton: {
    paddingHorizontal: 1,
    paddingVertical: 1,
  },
  editIcon: {
    color: '#1F2938',
    fontSize: 22,
    lineHeight: 22,
  },
  cardAddress: {
    color: '#596277',
    fontSize: 15,
    marginTop: 8,
  },
  cardMetaRow: {
    marginTop: 25,
    flexDirection: 'row',
  },
  metaBlock: {
    flex: 1,
    marginRight: 8,
  },
  metaLabel: {
    color: '#798296',
    fontSize: 13,
    marginBottom: 6,
  },
  metaValue: {
    color: '#354157',
    fontSize: 15,
    fontWeight: '400',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 112,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#D82929',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    marginBottom: 20,
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 34,
    lineHeight: 36,
    fontWeight: '700',
    marginTop: -1,
  },
});

export default Main;
