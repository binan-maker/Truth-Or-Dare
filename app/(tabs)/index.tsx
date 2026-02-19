
import React, { useState, useCallback } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import contentData from '../data/content.json';

const { width } = Dimensions.get('window');

type Mode = 'party' | 'couple' | 'family' | 'solo';
type EntryType = 'truth' | 'challenge';

export default function TruthOrDareScreen() {
  const [mode, setMode] = useState<Mode>('party');
  const [currentEntry, setCurrentEntry] = useState<{ text: string; type: EntryType } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePrompt = useCallback((selectedType?: EntryType) => {
    setIsGenerating(true);
    
    // Simulate a bit of "thinking" for dopamine effect
    setTimeout(() => {
      const type: EntryType = selectedType || (Math.random() > 0.5 ? 'truth' : 'challenge');
      const pool = type === 'truth' ? contentData[mode].truths : contentData[mode].challenges;
      const randomIndex = Math.floor(Math.random() * pool.length);
      
      setCurrentEntry({
        text: pool[randomIndex],
        type: type
      });
      setIsGenerating(false);
    }, 400);
  }, [mode]);

  const reset = () => {
    setCurrentEntry(null);
  };

  const ModeButton = ({ label, value }: { label: string; value: Mode }) => (
    <TouchableOpacity 
      style={[styles.modeBtn, mode === value && styles.modeBtnActive]} 
      onPress={() => {
        setMode(value);
        setCurrentEntry(null);
      }}
    >
      <Text style={[styles.modeBtnText, mode === value && styles.modeBtnTextActive]}>
        {label.toUpperCase()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>SOCIAL ENGINE</Text>
          <Text style={styles.title}>TRUTH OR DARE</Text>
        </View>
        <View style={styles.versionBadge}>
          <Text style={styles.versionText}>v1.0</Text>
        </View>
      </View>

      {/* Mode Selector */}
      {!currentEntry && (
        <View style={styles.modeContainer}>
          <Text style={styles.sectionLabel}>CHOOSE YOUR VIBE</Text>
          <View style={styles.modeGrid}>
            <ModeButton label="Party" value="party" />
            <ModeButton label="Couple" value="couple" />
          </View>
          <View style={[styles.modeGrid, { marginTop: 12 }]}>
            <ModeButton label="Family" value="family" />
            <ModeButton label="Solo" value="solo" />
          </View>
        </View>
      )}

      {/* Main Stage */}
      <View style={styles.stage}>
        {!currentEntry ? (
          <View style={styles.emptyStage}>
            <Text style={styles.emptyTitle}>READY TO BREAK THE SILENCE?</Text>
            <Text style={styles.emptySubtitle}>Select a mode and hit the button to start the interaction loop.</Text>
            
            <TouchableOpacity 
              style={styles.mainActionBtn}
              onPress={() => generatePrompt()}
              disabled={isGenerating}
            >
              <Text style={styles.mainActionBtnText}>
                {isGenerating ? 'GENERATING...' : 'START ENGINE'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.activeStage}>
            <View style={[styles.typeBadge, { backgroundColor: currentEntry.type === 'truth' ? '#00FF00' : '#FF00FF' }]}>
              <Text style={styles.typeBadgeText}>{currentEntry.type.toUpperCase()}</Text>
            </View>
            
            <View style={styles.promptContainer}>
              <Text style={styles.promptText}>{currentEntry.text}</Text>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity 
                style={styles.secondaryBtn}
                onPress={reset}
              >
                <Text style={styles.secondaryBtnText}>CHANGE MODE</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.primaryBtn}
                onPress={() => generatePrompt()}
              >
                <Text style={styles.primaryBtnText}>NEXT TURN</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>OFFLINE ENGINE • NO DATA TRACKING • PURE INTERACTION</Text>
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
  versionBadge: {
    backgroundColor: '#000000',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  versionText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },
  modeContainer: {
    padding: 24,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 16,
    color: '#000000',
  },
  modeGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  modeBtn: {
    flex: 1,
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
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#000000',
    opacity: 0.6,
    marginBottom: 40,
    lineHeight: 20,
  },
  mainActionBtn: {
    backgroundColor: '#00FF00',
    width: '100%',
    paddingVertical: 20,
    borderWidth: 3,
    borderColor: '#000000',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  mainActionBtnText: {
    fontSize: 20,
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
    marginBottom: 40,
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
    opacity: 0.4,
    letterSpacing: 1,
  },
});
