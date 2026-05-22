import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, BackHandler, ToastAndroid } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { styles } from './screens/styles';
import { Ionicons } from '@expo/vector-icons'
import { 
  TodayScreen, StatsScreen, AddScreen, ProfileScreen, SettingsScreen, 
  CalendarScreen, TimerScreen, CommunityScreen, WelcomeScreen, HabitDetailScreen 
} from './screens/AllScreens';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [selectedHabitDetails, setSelectedHabitDetails] = useState(null);
  
  const [chosenMinutes, setChosenMinutes] = useState(25);
  const [timerLeft, setTimerLeft] = useState(25 * 60);
  const [timerActive, setTimerActive] = useState(false);
  
  
  const [selectedDay, setSelectedDay] = useState('Ср');
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [useTime, setUseTime] = useState(false);
  const [timeFrom, setTimeFrom] = useState('22:00');
  const [timeTo, setTimeTo] = useState('00:00');

  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [avatarUri, setAvatarUri] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const lastBackPressed = useRef(0);

  const [habits, setHabits] = useState([
    { id: '1', title: 'Ночной кодинг', done: false, date: 'Создано: сегодня', useTime: true, timeFrom: '22:00', timeTo: '00:00' },
    { id: '2', title: 'Утренний стакан воды', done: false, date: 'Создано: сегодня', useTime: true, timeFrom: '06:00', timeTo: '12:00' },
    { id: '3', title: 'Почитать книгу 15 мин', done: false, date: 'Создано: 3 дня назад', useTime: false, timeFrom: '', timeTo: '' },
    { id: '4', title: 'Учить программирование', done: true, date: 'Создано: сегодня в 09:00', useTime: false, timeFrom: '', timeTo: '' },
  ]);

  const [communityFeed, setCommunityFeed] = useState([
    { id: '1', user: 'Алексей М. ', text: 'Разблокировано общее achievement: «Марафон Дисциплины»! Выполнил все привычки 30 дней подряд. 🔥🏃‍♂️', rating: 42, hasLike: false },
    { id: '2', user: 'Екатерина К. ', text: 'Разблокировано общее achievement: «Ранняя Пташка»! Проснулась в 5:00 утра на пробежку 7 дней подряд.', rating: 19, hasLike: false },
    { id: '3', user: 'Арсен В. ', text: 'Разблокировано общее achievement: «Гуру Кодинга»! Написал 5000 строк кода без перерыва на прокрастинацию.', rating: 56, hasLike: false },
    { id: '4', user: 'Ольга С. ', text: 'Разблокировано общее achievement: «Книжный Червь»! Прочитала 3 книги по React Native за две недели.', rating: 8, hasLike: false }
  ]);

  const handleCommunityReaction = (id) => {
    setCommunityFeed(prevFeed => prevFeed.map(item => {
      if (item.id !== id) return item;
      const isLiked = item.hasLike;
      return { ...item, rating: isLiked ? item.rating - 1 : item.rating + 1, hasLike: !isLiked };
    }));
  };

  useEffect(() => {
    let interval = null;
    if (timerActive && timerLeft > 0) {
      interval = setInterval(() => {
        setTimerLeft(time => time - 1);
      }, 1000);
    } else if (timerLeft === 0) {
      setTimerActive(false);
      alert('Время вышло! Отдохни немного ☕');
      setTimerLeft(chosenMinutes * 60);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerLeft, chosenMinutes]);

  const changeTimerPreset = (minutes) => {
    setChosenMinutes(minutes);
    setTimerLeft(minutes * 60);
  };

  useEffect(() => {
    const backAction = () => {
      if (currentScreen === 'calendar') { setCurrentScreen('stats'); return true; }
      if (currentScreen === 'timer' || currentScreen === 'stats' || currentScreen === 'profile' || currentScreen === 'settings') { 
        setCurrentScreen('today'); 
        return true; 
      }
      if (currentScreen === 'community') { setCurrentScreen('profile'); return true; }
      if (currentScreen === 'add' || currentScreen === 'habitDetail') { setCurrentScreen('today'); return true; }
      
      if (currentScreen === 'today' || currentScreen === 'welcome') {
        const currentTime = Date.now();
        if (currentTime - lastBackPressed.current < 2000) { BackHandler.exitApp(); return true; }
        lastBackPressed.current = currentTime;
        ToastAndroid.show('Нажмите ещё раз для выхода', ToastAndroid.SHORT);
        return true;
      }
      return false; 
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [currentScreen]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { alert('Нам нужно разрешение на доступ к галерее. 📸'); return; }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) { setAvatarUri(result.assets[0].uri); }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const toggleHabit = (id) => {
    setHabits(habits.map(h => h.id === id ? { ...h, done: !h.done } : h));
  };

  const saveHabit = () => {
    if (newHabitTitle.trim() === '') return;
    if (isEditing) {
      setHabits(habits.map(h => h.id === selectedHabitDetails.id ? { ...h, title: newHabitTitle, useTime: useTime, timeFrom: useTime ? timeFrom : '', timeTo: useTime ? timeTo : '' } : h));
    } else {
      setHabits([...habits, { id: Date.now().toString(), title: newHabitTitle, done: false, date: 'Создано: только что', useTime: useTime, timeFrom: useTime ? timeFrom : '', timeTo: useTime ? timeTo : '' }]);
    }
    setNewHabitTitle(''); setUseTime(false); setTimeFrom('22:00'); setTimeTo('00:00'); setIsEditing(false); setCurrentScreen('today');
  };

  const startEditing = (habit) => {
    setNewHabitTitle(habit.title); setUseTime(habit.useTime || false); setTimeFrom(habit.timeFrom || '22:00'); setTimeTo(habit.timeTo || '00:00'); setIsEditing(true); setCurrentScreen('add');
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter(h => h.id !== id)); setCurrentScreen('today');
  };

  const totalHabits = habits.length;
  const completedHabits = habits.filter(h => h.done).length;
  const progressPercent = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        {currentScreen === 'welcome' && <WelcomeScreen onStart={() => setCurrentScreen('today')} />}
        {currentScreen === 'today' && <TodayScreen habits={habits} onToggle={toggleHabit} onSelectHabit={(habit) => { setSelectedHabitDetails(habit); setCurrentScreen('habitDetail'); }} onAddPress={() => { setNewHabitTitle(''); setUseTime(false); setTimeFrom('22:00'); setTimeTo('00:00'); setIsEditing(false); setCurrentScreen('add'); }} />}
        {currentScreen === 'stats' && <StatsScreen progressPercent={progressPercent} totalHabits={totalHabits} completedHabits={completedHabits} onNavigate={setCurrentScreen} />}
        {currentScreen === 'add' && <AddScreen title={newHabitTitle} onChangeTitle={setNewHabitTitle} useTime={useTime} onToggleUseTime={setUseTime} timeFrom={timeFrom} onChangeTimeFrom={setTimeFrom} timeTo={timeTo} onChangeTimeTo={setTimeTo} onSave={saveHabit} onBack={() => setCurrentScreen('today')} isEditing={isEditing} />}
        {currentScreen === 'profile' && <ProfileScreen onNavigate={setCurrentScreen} avatarUri={avatarUri} onPickImage={pickImage} />}
        {currentScreen === 'settings' && <SettingsScreen notifications={notifications} setNotifications={setNotifications} soundEnabled={soundEnabled} setSoundEnabled={setSoundEnabled} darkMode={darkMode} setDarkMode={setDarkMode} />}
        
        {/* Экран: Календарь */}
        {currentScreen === 'calendar' && <CalendarScreen selectedDay={selectedDay} onSelectDay={setSelectedDay} onBack={() => setCurrentScreen('stats')} progressPercent={progressPercent} completedHabits={completedHabits} totalHabits={totalHabits} />}
        
        {/* Экран: Таймер */}
        {currentScreen === 'timer' && (
          <TimerScreen 
            timeText={formatTime(timerLeft)} 
            timerActive={timerActive} 
            onToggleTimer={() => setTimerActive(!timerActive)} 
            onReset={() => { setTimerActive(false); setTimerLeft(chosenMinutes * 60); }} 
            onBack={() => setCurrentScreen('today')} 
          />
        )}
        
        {currentScreen === 'community' && <CommunityScreen feed={communityFeed} onReaction={handleCommunityReaction} onBack={() => setCurrentScreen('profile')} />}
        {currentScreen === 'habitDetail' && <HabitDetailScreen habit={selectedHabitDetails} onDelete={deleteHabit} onEdit={startEditing} onBack={() => setCurrentScreen('today')} />}
      </View>

      {/* Тулбар */}
      {currentScreen !== 'welcome' && (
        <View style={styles.tabBar}>
          {[
            ['stats', 'bar-chart', 'Прогресс'],
            ['timer', 'time', 'Таймер'],  
            ['today', 'calendar', 'Сегодня'], 
            ['profile', 'person', 'Профиль'], 
            ['settings', 'settings', 'Опции']
          ].map(([screen, icon, label]) => {
            const isActive = currentScreen === screen;
            return (
              <TouchableOpacity key={screen} style={styles.tabItem} onPress={() => setCurrentScreen(screen)}>
                <Ionicons 
                  name={isActive ? icon : `${icon}-outline`} 
                  size={22} 
                  color={isActive ? '#8A9A86' : '#A3AFA0'} 
                  style={{ marginBottom: 4 }}
                />
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </SafeAreaView>
  );
}