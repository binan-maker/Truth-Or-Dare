import React, { useMemo, useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import contentData from '../data/content.json';

type Mode = 'party' | 'couple' | 'family' | 'solo';
type EntryType = 'truth' | 'challenge';

type PromptEntry = {
  text: string;
  type: EntryType;
};

const modes: Array<{ label: string; value: Mode }> = [
  { label: 'Party', value: 'party' },
  { label: 'Couple', value: 'couple' },
  { label: 'Family', value: 'family' },
  { label: 'Solo', value: 'solo' },
];

export default function TruthOrDareScreen() {
  const [mode, setMode] = useState<Mode>('party');
  const [currentEntry, setCurrentEntry] = useState<PromptEntry | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [turnCount, setTurnCount] = useState(0);

  const generatePrompt = (selectedType?: EntryType) => {
    setIsGenerating(true);

    setTimeout(() => {
      const type: EntryType = selectedType ?? (Math.random() > 0.5 ? 'truth' : 'challenge');
      const pool = type === 'truth' ? contentData[mode].truths : contentData[mode].challenges;

      if (pool.length === 0) {
        setCurrentEntry({
          text: 'No prompts available for this mode yet. Add more content and try again.',
          type,
        });
        setIsGenerating(false);
        return;
      }

      const randomIndex = Math.floor(Math.random() * pool.length);
      setCurrentEntry({ text: pool[randomIndex], type });
      setTurnCount(previous => previous + 1);
      setIsGenerating(false);
    }, 300);
  };

  const changeMode = (nextMode: Mode) => {
    setMode(nextMode);
    setCurrentEntry(null);
    setIsGenerating(false);
  };

  const subtitle = useMemo(() => {
    if (!currentEntry) {
      return 'Choose a mode, then generate Truth or Challenge prompts to play offline.';
    }

    return 'Speak the answer or perform the challenge in real life, then move to next turn.';
  }, [currentEntry]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>SOCIAL ENGINE</Text>
          <Text style={styles.title}>TRUTH OR DARE</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <View style={styles.counterBadge}>
          <Text style={styles.counterLabel}>TURNS</Text>
          <Text style={styles.counterValue}>{turnCount}</Text>
        </View>
      </View>

      {!currentEntry && (
        <View style={styles.modeContainer}>
          <Text style={styles.sectionLabel}>CHOOSE YOUR VIBE</Text>
          <View style={styles.modeGrid}>
            {modes.map(({ label, value }) => (
              <TouchableOpacity
                key={value}
                style={[styles.modeBtn, mode === value && styles.modeBtnActive]}
                onPress={() => changeMode(value)}
              >
                <Text style={[styles.modeBtnText, mode === value && styles.modeBtnTextActive]}>
                  {label.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <View style={styles.stage}>
        {!currentEntry ? (
          <View style={styles.emptyStage}>
            <Text style={styles.emptyTitle}>READY TO START?</Text>

            <View style={styles.dualActionRow}>
              <TouchableOpacity
                style={[styles.actionBtn, styles.truthBtn]}
                onPress={() => generatePrompt('truth')}
                disabled={isGenerating}
              >
                <Text style={styles.actionBtnText}>{isGenerating ? 'LOADING...' : 'TRUTH'}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, styles.challengeBtn]}
                onPress={() => generatePrompt('challenge')}
                disabled={isGenerating}
              >
                <Text style={styles.actionBtnText}>{isGenerating ? 'LOADING...' : 'CHALLENGE'}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.randomBtn}
              onPress={() => generatePrompt()}
              disabled={isGenerating}
            >
              <Text style={styles.randomBtnText}>{isGenerating ? 'GENERATING...' : 'RANDOM TURN'}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.activeStage}>
            <View
              style={[
                styles.typeBadge,
                { backgroundColor: currentEntry.type === 'truth' ? '#00FF00' : '#FF00FF' },
              ]}
            >
              <Text style={styles.typeBadgeText}>{currentEntry.type.toUpperCase()}</Text>
            </View>

            <View style={styles.promptContainer}>
              <Text style={styles.promptText}>{currentEntry.text}</Text>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.secondaryBtn} onPress={() => setCurrentEntry(null)}>
                <Text style={styles.secondaryBtnText}>CHANGE MODE</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.primaryBtn} onPress={() => generatePrompt()}>
                <Text style={styles.primaryBtnText}>NEXT TURN</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>OFFLINE ENGINE • NO LOGIN • NO TRACKING • PURE INTERACTION</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 2,
    borderBottomColor: '#000000',
    gap: 16,
  },
  brand: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2,
    color: '#000000',
    opacity: 0.5,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#000000',
    lineHeight: 32,
    marginTop: 4,
  },
  subtitle: {
    marginTop: 10,
    maxWidth: 240,
    color: '#000000',
    opacity: 0.65,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
  },
  counterBadge: {
    borderWidth: 2,
    borderColor: '#000000',
    minWidth: 68,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  counterLabel: {
    fontSize: 9,
    letterSpacing: 1,
    fontWeight: '900',
    color: '#000000',
    opacity: 0.55,
  },
  counterValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#000000',
  },
  modeContainer: {
    padding: 24,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 14,
    color: '#000000',
  },
  modeGrid: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  modeBtn: {
    width: '48%',
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeBtnActive: {
    backgroundColor: '#000000',
  },
  modeBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#000000',
  },
  modeBtnTextActive: {
    color: '#FFFFFF',
  },
  stage: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  emptyStage: {
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 26,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 20,
  },
  dualActionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  actionBtn: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#000000',
    paddingVertical: 16,
    alignItems: 'center',
  },
  truthBtn: {
    backgroundColor: '#00FF00',
  },
  challengeBtn: {
    backgroundColor: '#FF00FF',
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#000000',
  },
  randomBtn: {
    width: '100%',
    borderWidth: 2,
    borderColor: '#000000',
    paddingVertical: 16,
    alignItems: 'center',
  },
  randomBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#000000',
  },
  activeStage: {
    flex: 1,
    justifyContent: 'center',
  },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 2,
    borderColor: '#000000',
    marginBottom: 20,
    transform: [{ rotate: '-2deg' }],
  },
  typeBadgeText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#000000',
  },
  promptContainer: {
    minHeight: 200,
    justifyContent: 'center',
    padding: 20,
    borderWidth: 3,
    borderColor: '#000000',
    backgroundColor: '#FFFFFF',
    marginBottom: 30,
    shadowColor: '#000000',
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  promptText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#000000',
    textAlign: 'center',
    lineHeight: 36,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 16,
  },
  secondaryBtn: {
    flex: 1,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: '#000000',
    alignItems: 'center',
  },
  secondaryBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#000000',
  },
  primaryBtn: {
    flex: 2,
    backgroundColor: '#00FF00',
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: '#000000',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#000000',
  },
  footer: {
    padding: 24,
    borderTopWidth: 2,
    borderTopColor: '#000000',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#000000',
    opacity: 0.5,
    letterSpacing: 1,
  },
});
