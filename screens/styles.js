import { StyleSheet, Platform, StatusBar } from 'react-native';

export const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FDFBF7', // Фирменный фоновый молочный
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 10
  },
  header: { paddingHorizontal: 20, paddingBottom: 10, marginTop: 20 },
  greeting: { fontSize: 28, fontWeight: 'bold', color: '#60725C' }, // Основной шалфейный для акцента
  subtitle: { fontSize: 16, color: '#60725C', opacity: 0.8, marginTop: 5 },
  list: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 },
  
  // Карточки привычек
  habitCard: { 
    backgroundColor: '#FFFFFF', 
    padding: 20, 
    borderRadius: 16, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EFECE6'
  },
  habitCardDone: { backgroundColor: '#EFECE6', opacity: 0.7 },
  habitText: { fontSize: 16, fontWeight: '600', color: '#60725C' }, // Глубокий шалфейно-серый для текста
  habitTextDone: { textDecorationLine: 'line-through', color: '#A3AFA0' },
  
  // Чекбоксы
  checkbox: { width: 26, height: 26, borderRadius: 8, borderWidth: 2, borderColor: '#8A9A86', justifyContent: 'center', alignItems: 'center', marginLeft: 15 },
  checkboxChecked: { backgroundColor: '#8A9A86', borderColor: '#8A9A86' },
  checkmark: { color: '#FDFBF7', fontWeight: 'bold', fontSize: 14 },
  
  paddedContainer: { flex: 1, paddingHorizontal: 20, paddingTop: 25, position: 'relative' },
  screenTitle: { fontSize: 28, fontWeight: 'bold', color: '#4A5343', marginBottom: 20, marginTop: 10 },
  screenTitleWithBack: { fontSize: 28, fontWeight: 'bold', color: '#4A5343', marginBottom: 20, marginTop: 55 },
  
  // Главная карточка прогресса
  statCard: { backgroundColor: '#8A9A86', padding: 25, borderRadius: 24, alignItems: 'center', marginBottom: 15 },
  statNumber: { fontSize: 44, fontWeight: 'bold', color: '#FDFBF7' },
  statLabel: { fontSize: 14, color: '#FDFBF7', opacity: 0.9, marginTop: 5 },
  
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  statCardHalf: { flex: 1, padding: 15, borderRadius: 16, alignItems: 'center', marginHorizontal: 5 },
  statNumberSmall: { fontSize: 22, fontWeight: 'bold', color: '#4A5343' },
  statLabelSmall: { fontSize: 12, color: '#8A9A86', marginTop: 2 },
  
  motivationBox: { backgroundColor: '#FFFFFF', padding: 15, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: '#EFECE6' },
  motivationText: { fontSize: 15, fontWeight: '600', color: '#4A5343', textAlign: 'center' },
  
  inputLabel: { fontSize: 16, color: '#4A5343', fontWeight: '600', marginBottom: 10 },
  input: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, fontSize: 16, color: '#4A5343', borderWidth: 1, borderColor: '#EFECE6', marginBottom: 20 },
  
  // Кнопки
  button: { backgroundColor: '#8A9A86', padding: 16, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#FDFBF7', fontSize: 16, fontWeight: 'bold' },
  
  // Профиль
  profileHeader: { flexDirection: 'row', backgroundColor: '#FFFFFF', padding: 20, borderRadius: 20, alignItems: 'center', marginBottom: 15, borderWidth: 1, borderColor: '#EFECE6' },
  avatar: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#EFECE6', justifyContent: 'center', alignItems: 'center' },
  profileInfo: { marginLeft: 20 },
  profileName: { fontSize: 18, fontWeight: 'bold', color: '#4A5343' },
  profileRank: { fontSize: 14, color: '#8A9A86', marginTop: 4 },
  
  achCard: { flexDirection: 'row', backgroundColor: '#FFFFFF', padding: 15, borderRadius: 16, alignItems: 'center', marginBottom: 10, borderWidth: 1, borderColor: '#EFECE6' },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 18, borderRadius: 16, marginBottom: 10, borderWidth: 1, borderColor: '#EFECE6' },
  settingText: { fontSize: 16, fontWeight: '500', color: '#4A5343' },
  
  // Таб-бар снизу
  tabBar: { flexDirection: 'row', backgroundColor: '#FFFFFF', height: 70, borderTopWidth: 1, borderTopColor: '#EFECE6', paddingBottom: 10 },
  tabItem: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  tabIcon: { fontSize: 18, opacity: 0.4 },
  tabIconActive: { opacity: 1 },
  tabText: { fontSize: 10, color: '#A3AFA0', marginTop: 2 },
  tabTextActive: { color: '#8A9A86', fontWeight: '600' },
  
  // Быстрые переходы / карамельные акценты
  shortcutButton: { flex: 1, backgroundColor: '#D4A373', padding: 15, borderRadius: 16, alignItems: 'center', marginHorizontal: 5 },
  shortcutButtonText: { fontSize: 14, fontWeight: 'bold', color: '#FDFBF7', marginTop: 5 },
  
  dayCard: { flex: 1, alignItems: 'center', padding: 10, borderRadius: 12, marginHorizontal: 2 },
  dayCardActive: { backgroundColor: '#8A9A86' },
  
  // Таймер фокуса (использует карамельный акцент)
  timerCircle: { width: 220, height: 220, borderRadius: 110, borderWidth: 6, borderColor: '#D4A373', justifyContent: 'center', alignItems: 'center', marginTop: 40 },
  timerText: { fontSize: 48, fontWeight: 'bold', color: '#4A5343' },
  
  communityBanner: { flexDirection: 'row', backgroundColor: '#EFECE6', padding: 15, borderRadius: 16, alignItems: 'center', marginBottom: 20 },
  
  // Приветственный экран
  welcomeContainer: { flex: 1, justifyContent: 'space-between', alignItems: 'center', padding: 30, backgroundColor: '#FDFBF7', paddingTop: 100 },
  welcomeInfo: { alignItems: 'center', flex: 1, justifyContent: 'center' },
  welcomeLogo: { fontSize: 80, marginBottom: 20 },
  welcomeTitle: { fontSize: 36, fontWeight: 'bold', color: '#4A5343', marginBottom: 10 },
  welcomeSubtitle: { fontSize: 16, color: '#8A9A86', textAlign: 'center', paddingHorizontal: 20, lineHeight: 24 },
  
  detailCard: { backgroundColor: '#FFFFFF', padding: 25, borderRadius: 20, marginTop: 10, borderWidth: 1, borderColor: '#EFECE6' },
  detailTitle: { fontSize: 22, fontWeight: 'bold', color: '#4A5343' },
  detailDate: { fontSize: 14, color: '#A3AFA0', marginTop: 5 },
  statusBadge: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 10, marginTop: 15, alignSelf: 'flex-start' },
  
  backArrowButton: { position: 'absolute', top: 20, left: 20, zIndex: 10, width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  backArrowText: { fontSize: 28, color: '#8A9A86', fontWeight: 'bold' },
  
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 20,
  },
  topPlusButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#8A9A86',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    shadowColor: '#8A9A86',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  topPlusButtonText: {
    color: '#FDFBF7',
    fontSize: 26,
    fontWeight: '300',
    lineHeight: 28,
  },
});