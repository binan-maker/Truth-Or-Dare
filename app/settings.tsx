import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const manualSections = [
  {
    title: 'HOW TO PLAY',
    points: [
      'Choose your vibe: Party, Couple, Family, or Solo.',
      'Tap SPIN + TRUTH, SPIN + CHALLENGE, or SPIN + RANDOM TURN.',
      'Bottle stops on a seat label. That player responds in real life.',
      'Press SPIN NEXT TURN to continue the game flow.',
    ],
  },
  {
    title: 'GAME RULES',
    points: [
      'Respect everyone at all times.',
      'No dangerous, illegal, or harmful challenges.',
      'Skip any prompt if the group is uncomfortable.',
      'Keep it fun, safe, and inclusive.',
    ],
  },
  {
    title: 'APP NOTES',
    points: [
      'Offline-first: works without login and without server setup.',
      'No bottom navigation bar is used in this prototype UI.',
      'Turn counter helps track session momentum.',
    ],
  },
];

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <View>
          <Text style={styles.kicker}>SETTINGS</Text>
          <Text style={styles.title}>USER MANUAL</Text>
          <Text style={styles.subtitle}>Everything you need to run a great Truth or Dare session.</Text>
        </View>

        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>BACK</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {manualSections.map(section => (
          <View key={section.title} style={styles.card}>
            <Text style={styles.cardTitle}>{section.title}</Text>
            {section.points.map(point => (
              <Text key={point} style={styles.point}>
                • {point}
              </Text>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0C0E',
  },
  header: {
    padding: 24,
    borderBottomWidth: 2,
    borderBottomColor: '#2A2A2E',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  kicker: {
    color: '#AFAFBB',
    fontWeight: '900',
    letterSpacing: 1.5,
    fontSize: 11,
  },
  title: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 30,
    marginTop: 6,
  },
  subtitle: {
    color: '#D6D6DC',
    fontSize: 12,
    marginTop: 8,
    maxWidth: 250,
    lineHeight: 18,
  },
  backBtn: {
    borderWidth: 2,
    borderColor: '#2EFF9B',
    backgroundColor: '#15151B',
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignSelf: 'flex-start',
  },
  backBtnText: {
    color: '#E8FFF2',
    fontWeight: '900',
    fontSize: 12,
  },
  content: {
    padding: 24,
    gap: 14,
  },
  card: {
    borderWidth: 2,
    borderColor: '#2EFF9B',
    backgroundColor: '#121216',
    padding: 16,
  },
  cardTitle: {
    color: '#2EFF9B',
    fontWeight: '900',
    fontSize: 14,
    marginBottom: 10,
  },
  point: {
    color: '#E7E7EE',
    lineHeight: 20,
    marginBottom: 6,
    fontWeight: '600',
    fontSize: 13,
  },
});
