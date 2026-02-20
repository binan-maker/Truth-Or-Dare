import React, { useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
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

const seatLabels = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

export default function TruthOrDareScreen() {
  const [mode, setMode] = useState<Mode>('party');
  const [currentEntry, setCurrentEntry] = useState<PromptEntry | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [turnCount, setTurnCount] = useState(0);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);

  const rotationValue = useRef(new Animated.Value(0)).current;
  const rotationTracker = useRef(0);

  const rotation = rotationValue.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  const pickPrompt = (selectedType?: EntryType) => {
    const type: EntryType = selectedType ?? (Math.random() > 0.5 ? 'truth' : 'challenge');
    const pool = type === 'truth' ? contentData[mode].truths : contentData[mode].challenges;

    if (pool.length === 0) {
      setCurrentEntry({
        text: 'No prompts available for this mode yet. Add more content and try again.',
        type,
      });
      return;
    }

    const randomIndex = Math.floor(Math.random() * pool.length);
    setCurrentEntry({ text: pool[randomIndex], type });
    setTurnCount(previous => previous + 1);
  };

  const seatFromAngle = (angle: number) => {
    const normalized = ((angle % 360) + 360) % 360;
    const sectorIndex = Math.round(normalized / 45) % seatLabels.length;
    return seatLabels[sectorIndex];
  };

  const spinBottleAndGenerate = (selectedType?: EntryType) => {
    if (isGenerating) {
      return;
    }

    setIsGenerating(true);

    const extraTurns = 1080 + Math.random() * 1440;
    const finalAngle = rotationTracker.current + extraTurns;

    Animated.timing(rotationValue, {
      toValue: finalAngle,
      duration: 2100,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      rotationTracker.current = finalAngle % 360;
      const seat = seatFromAngle(rotationTracker.current);
      setSelectedSeat(seat);
      pickPrompt(selectedType);
      setIsGenerating(false);
    });
  };

  const changeMode = (nextMode: Mode) => {
    setMode(nextMode);
    setCurrentEntry(null);
    setSelectedSeat(null);
    setIsGenerating(false);
  };

  const subtitle = useMemo(() => {
    if (!currentEntry) {
      return 'Spin the bottle to pick a player seat, then the app gives Truth or Challenge.';
    }

    return 'Selected player responds in real life, then spin again for the next turn.';
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
            <Text style={styles.emptyTitle}>SPIN THE BOTTLE</Text>
            <View style={styles.arena}>
              {seatLabels.map((seat, index) => (
                <View key={seat} style={[styles.seatPill, seatPositions[index]]}>
                  <Text style={styles.seatText}>{seat}</Text>
                </View>
              ))}

              <View style={styles.centerCircle}>
                <Animated.View style={[styles.bottleWrapper, { transform: [{ rotate: rotation }] }]}>
                  <View style={styles.bottleBody} />
                  <View style={styles.bottleNeck} />
                </Animated.View>
              </View>
            </View>

            <Text style={styles.pickedSeatText}>
              {selectedSeat ? `BOTTLE STOPPED AT: ${selectedSeat}` : 'BOTTLE HAS NOT SPUN YET'}
            </Text>

            <View style={styles.dualActionRow}>
              <TouchableOpacity
                style={[styles.actionBtn, styles.truthBtn]}
                onPress={() => spinBottleAndGenerate('truth')}
                disabled={isGenerating}
              >
                <Text style={styles.actionBtnText}>{isGenerating ? 'SPINNING...' : 'SPIN + TRUTH'}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, styles.challengeBtn]}
                onPress={() => spinBottleAndGenerate('challenge')}
                disabled={isGenerating}
              >
                <Text style={styles.actionBtnText}>{isGenerating ? 'SPINNING...' : 'SPIN + CHALLENGE'}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.randomBtn}
              onPress={() => spinBottleAndGenerate()}
              disabled={isGenerating}
            >
              <Text style={styles.randomBtnText}>{isGenerating ? 'SPINNING...' : 'SPIN + RANDOM TURN'}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.activeStage}>
            <View style={styles.playerBadge}>
              <Text style={styles.playerBadgeText}>PLAYER: {selectedSeat ?? 'UNKNOWN'}</Text>
            </View>

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
                <Text style={styles.secondaryBtnText}>BACK TO BOTTLE</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.primaryBtn} onPress={() => spinBottleAndGenerate()}>
                <Text style={styles.primaryBtnText}>SPIN NEXT TURN</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>OFFLINE ENGINE • BOTTLE MODE • NO LOGIN • PURE INTERACTION</Text>
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
    paddingHorizontal: 24,
    paddingTop: 18,
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
    paddingVertical: 10,
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
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 14,
  },
  arena: {
    width: 270,
    height: 270,
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 135,
    marginBottom: 14,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  centerCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4F4F4',
  },
  bottleWrapper: {
    width: 90,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottleBody: {
    width: 22,
    height: 52,
    borderWidth: 2,
    borderColor: '#000000',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: '#00FF00',
  },
  bottleNeck: {
    width: 12,
    height: 20,
    borderWidth: 2,
    borderColor: '#000000',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    backgroundColor: '#00FF00',
    marginTop: -2,
  },
  seatPill: {
    position: 'absolute',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  seatText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#000000',
  },
  pickedSeatText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#000000',
    marginBottom: 14,
    opacity: 0.75,
  },
  dualActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  actionBtn: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#000000',
    paddingVertical: 14,
    alignItems: 'center',
  },
  truthBtn: {
    backgroundColor: '#00FF00',
  },
  challengeBtn: {
    backgroundColor: '#FF00FF',
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#000000',
  },
  randomBtn: {
    width: '100%',
    borderWidth: 2,
    borderColor: '#000000',
    paddingVertical: 14,
    alignItems: 'center',
  },
  randomBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#000000',
  },
  activeStage: {
    flex: 1,
    justifyContent: 'center',
  },
  playerBadge: {
    alignSelf: 'flex-start',
    borderWidth: 2,
    borderColor: '#000000',
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  playerBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#000000',
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
    minHeight: 180,
    justifyContent: 'center',
    padding: 20,
    borderWidth: 3,
    borderColor: '#000000',
    backgroundColor: '#FFFFFF',
    marginBottom: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  promptText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#000000',
    textAlign: 'center',
    lineHeight: 32,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
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
    fontSize: 14,
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
    textAlign: 'center',
  },
});

const seatPositions = [
  { top: 10, left: 125 },
  { top: 38, right: 36 },
  { top: 125, right: 8 },
  { bottom: 38, right: 36 },
  { bottom: 10, left: 126 },
  { bottom: 38, left: 36 },
  { top: 125, left: 8 },
  { top: 38, left: 36 },
];
