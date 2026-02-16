import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

export default function MisMascotasScreen({ onMenuPress }: { onMenuPress: () => void }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Mis Mascotas</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>Gestiona tus mascotas</Text>
        </View>
        <TouchableOpacity style={styles.menuButton} onPress={onMenuPress}>
          <FontAwesome5 name="bars" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.emptyState}>
          <FontAwesome5 name="paw" size={48} color={colors.textSecondary} />
          <Text style={[styles.emptyStateTitle, { color: colors.text }]}>
            Cargando tus mascotas...
          </Text>
          <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
            Aquí verás todas tus mascotas registradas
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 20,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  menuButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    gap: 12,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptyStateText: {
    fontSize: 13,
    textAlign: 'center',
  },
});
