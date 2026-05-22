import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Switch, ScrollView, ActivityIndicator, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';
import AppLogo from './logo.png';

const getHabitTimeStatus = (timeFrom, timeTo) => {
  if (!timeTo || !timeFrom) return 'active';
  
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  let [fromH, fromM] = timeFrom.split(':').map(Number);
  let [toH, toM] = timeTo.split(':').map(Number);
  
  if (isNaN(fromH) || isNaN(fromM) || isNaN(toH) || isNaN(toM)) return 'active';

  if (toH === 0 && toM === 0 && fromH > 0) {
    toH = 23;
    toM = 59;
  }

  let startMinutes = fromH * 60 + fromM;
  let endMinutes = toH * 60 + toM;

  if (endMinutes < startMinutes) {
    if (currentMinutes <= endMinutes) return 'active';
    if (currentMinutes >= startMinutes) return 'active';
    if (currentMinutes < startMinutes) return 'future';
    return 'expired';
  }

  if (currentMinutes < startMinutes) return 'future';
  if (currentMinutes > endMinutes) return 'expired';
  return 'active';
};

// Экран: Сегодня
export const TodayScreen = ({ habits, onToggle, onSelectHabit, onAddPress }) => (
  <View style={{ flex: 1 }}>
    <View style={styles.headerRow}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={styles.greeting}>Привет!</Text>
        </View>
        <Text style={styles.subtitle}>Твои привычки на сегодня:</Text>
      </View>
      <TouchableOpacity style={styles.topPlusButton} onPress={onAddPress}>
        <Ionicons name="add" size={24} color="#FDFBF7" />
      </TouchableOpacity>
    </View>
    
    <FlatList
      data={habits}
      renderItem={({ item }) => {
        const timeStatus = getHabitTimeStatus(item.timeFrom, item.timeTo);
        
        const isExpired = timeStatus === 'expired' && !item.done;
        const isFuture = timeStatus === 'future' && !item.done;

        return (
          <View style={[
            styles.habitCard, 
            item.done && styles.habitCardDone,
            isExpired && { backgroundColor: '#FEE2E2', borderColor: '#FCA5A5' },
            isFuture && { backgroundColor: '#FDFBF7', borderColor: '#EFECE6', opacity: 0.6 }
          ]}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => onSelectHabit(item)}>
              <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                <Text style={[
                  styles.habitText, 
                  item.done && styles.habitTextDone, 
                  isExpired && { color: '#991B1B' },
                  isFuture && { color: '#8A9A86' }
                ]}>
                  {item.title}
                </Text>
                
                {item.useTime && item.timeFrom && item.timeTo && (
                  <View style={[
                    { 
                      paddingHorizontal: 8, 
                      paddingVertical: 2, 
                      borderRadius: 12, 
                      marginTop: 6,
                      flexDirection: 'row', 
                      alignItems: 'center', 
                      gap: 4,
                      alignSelf: 'flex-start'
                    },
                    { backgroundColor: isExpired ? '#FFCAD0' : isFuture ? '#EFECE6' : '#EFECE6' }
                  ]}>
                    <Ionicons name="time-outline" size={12} color={isExpired ? '#991B1B' : '#4A5343'} />
                    <Text style={{ fontSize: 11, color: isExpired ? '#991B1B' : '#4A5343', fontWeight: '600' }}>
                      {item.timeFrom} - {item.timeTo}
                    </Text>
                  </View>
                )}
              </View>
              
              {isExpired && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 }}>
                  <Ionicons name="close-circle" size={14} color="#EF4444" />
                  <Text style={{ fontSize: 11, color: '#EF4444', fontWeight: 'bold' }}>Просрочено! Время вышло</Text>
                </View>
              )}
              {isFuture && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 }}>
                  <Ionicons name="hourglass-outline" size={14} color="#D4A373" />
                  <Text style={{ fontSize: 11, color: '#D4A373', fontWeight: '600' }}>Время ещё не пришло</Text>
                </View>
              )}
              {!isExpired && !isFuture && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 }}>
                  <Ionicons name="cog-outline" size={14} color="#A3AFA0" />
                  <Text style={{ fontSize: 11, color: '#A3AFA0' }}>Нажми для деталей</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              disabled={isExpired || isFuture}
              style={[
                styles.checkbox, 
                item.done && styles.checkboxChecked,
                isExpired && { backgroundColor: '#EF4444', borderColor: '#EF4444' },
                isFuture && { backgroundColor: '#EFECE6', borderColor: '#A3AFA0' }
              ]} 
              onPress={() => onToggle(item.id)}
            >
              {item.done && <Ionicons name="checkmark" size={16} color="#FDFBF7" />}
              {isExpired && <Ionicons name="close" size={14} color="#FDFBF7" />}
              {isFuture && <Ionicons name="lock-closed" size={14} color="#A3AFA0" />}
            </TouchableOpacity>
          </View>
        );
      }}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.list}
    />
  </View>
);

// Экран: Прогресс
export const StatsScreen = ({ progressPercent, totalHabits, completedHabits, onNavigate }) => (
  <ScrollView style={styles.paddedContainer}>
    <Text style={styles.screenTitle}>Твой прогресс</Text>
    
    <View style={styles.statCard}>
      <Text style={styles.statNumber}>{progressPercent}%</Text>
      <Text style={styles.statLabel}>Привычек выполнено сегодня</Text>
    </View>
    
    <TouchableOpacity 
      style={[styles.shortcutButton, { width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, paddingVertical: 14 }]} 
      onPress={() => onNavigate('calendar')}
    >
      <Ionicons name="calendar-outline" size={22} color="#FDFBF7" />
      <Text style={[styles.shortcutButtonText, { marginTop: 0 }]}>Открыть архив и календарь дней</Text>
    </TouchableOpacity>

    <View style={[styles.statsRow, { marginTop: 5 }]}>
      <View style={[styles.statCardHalf, { backgroundColor: '#EFECE6' }]}>
        <Text style={styles.statNumberSmall}>{totalHabits}</Text>
        <Text style={styles.statLabelSmall}>Всего задач</Text>
      </View>
      <View style={[styles.statCardHalf, { backgroundColor: '#E2EFE0' }]}>
        <Text style={[styles.statNumberSmall, { color: '#4A5343' }]}>{completedHabits}</Text>
        <Text style={styles.statLabelSmall}>Сделано</Text>
      </View>
    </View>
  </ScrollView>
);

// Экран: Форма создания/редактирования
export const AddScreen = ({ 
  title, onChangeTitle, 
  useTime, onToggleUseTime, 
  timeFrom, onChangeTimeFrom, 
  timeTo, onChangeTimeTo, 
  onSave, onBack, isEditing 
}) => {

  const formatTimeInput = (text, onChange) => {
    let cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.length > 4) cleaned = cleaned.slice(0, 4);
    if (cleaned.length > 2) {
      cleaned = `${cleaned.slice(0, 2)}:${cleaned.slice(2)}`;
    }
    onChange(cleaned);
  };

  const isButtonDisabled = !title || !title.trim();

  return (
    <ScrollView style={styles.paddedContainer}>
      <TouchableOpacity 
        onPress={onBack} 
        style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center', marginTop: 10, marginLeft: -10 }}
      >
        <Ionicons name="arrow-back" size={24} color="#4A5343" />
      </TouchableOpacity>

      {/* Изменено на alignItems: 'baseline' для точного выравнивания иконки */}
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 15, marginBottom: 25 }}>
        <Text style={[styles.screenTitle, { marginBottom: 0 }]}>
          {isEditing ? 'Редактирование' : 'Новая привычка'}
        </Text>
        <Ionicons name={isEditing ? "pencil-outline" : "create-outline"} size={26} color="#8A9A86" />
      </View>
      
      <Text style={styles.inputLabel}>Как называется привычка?</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Например: Ночной кодинг" 
        placeholderTextColor="#A3AFA0" 
        value={title} 
        onChangeText={onChangeTitle} 
      />
      
      <View style={[styles.settingRow, { paddingHorizontal: 0, marginVertical: 15, backgroundColor: 'transparent', borderWidth: 0 }]}>
        <Text style={[styles.inputLabel, { marginTop: 0 }]}>Установить рамки времени</Text>
        <Switch 
          value={useTime} 
          onValueChange={onToggleUseTime} 
          thumbColor={useTime ? '#8A9A86' : '#F4F3F4'} 
          trackColor={{ true: '#8A9A86', false: '#EFECE6' }} 
        />
      </View>

      {useTime && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
          <View style={{ width: '47%' }}>
            <Text style={{ fontSize: 13, color: '#8A9A86', marginBottom: 6 }}>Выполнить С</Text>
            <TextInput 
              style={[styles.input, { textAlign: 'center', fontSize: 16 }]} 
              placeholder="22:00" 
              placeholderTextColor="#A3AFA0"
              keyboardType="number-pad"
              maxLength={5}
              value={timeFrom}
              onChangeText={(text) => formatTimeInput(text, onChangeTimeFrom)}
            />
          </View>
          <View style={{ width: '47%' }}>
            <Text style={{ fontSize: 13, color: '#8A9A86', marginBottom: 6 }}>Выполнить ДО</Text>
            <TextInput 
              style={[styles.input, { textAlign: 'center', fontSize: 16 }]} 
              placeholder="00:00" 
              placeholderTextColor="#A3AFA0"
              keyboardType="number-pad"
              maxLength={5}
              value={timeTo}
              onChangeText={(text) => formatTimeInput(text, onChangeTimeTo)}
            />
          </View>
        </View>
      )}
      
      <TouchableOpacity 
        disabled={isButtonDisabled} 
        style={[
          styles.button, 
          isButtonDisabled && { opacity: 0.5 } 
        ]} 
        onPress={onSave}
      >
        <Text style={styles.buttonText}>
          {isEditing ? 'Сохранить изменения' : 'Создать привычку'}
        </Text>
      </TouchableOpacity>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

// Экран: Профиль
export const ProfileScreen = ({ onNavigate, avatarUri, onPickImage }) => {
  const globalAchievements = [
    { id: '1', title: 'Большой старт', desc: 'Создана первая персональная цель в приложении', icon: 'rocket-outline' },
    { id: '2', title: 'Железная дисциплина', desc: '7 дней подряд идеального выполнения планов', icon: 'shield-checkmark-outline' },
    { id: '3', title: 'Ранняя пташка', desc: 'Закрыты все задачи с ограничением времени до 12:00 дня', icon: 'sunny-outline' },
    { id: '4', title: 'Хозяин времени', desc: 'Успешно завершена первая сессия в Фокус-таймере', icon: 'hourglass-outline' }
  ];

  return (
    <ScrollView style={styles.paddedContainer}>
      <Text style={styles.screenTitle}>Профиль</Text>
      <View style={styles.profileHeader}>
        <TouchableOpacity style={styles.avatar} onPress={onPickImage}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={{ width: 70, height: 70, borderRadius: 35 }} />
          ) : (
            <Ionicons name="camera-outline" size={24} color="#8A9A86" />
          )}
        </TouchableOpacity>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>Антон</Text>
          <Text style={styles.profileRank}>Уровень 3 • Новичок</Text>
        </View>
      </View>
      <TouchableOpacity style={[styles.communityBanner, { backgroundColor: '#EFECE6' }]} onPress={() => onNavigate('community')}>
        <Ionicons name="people-outline" size={24} color="#4A5343" />
        <View style={{ flex: 1, marginLeft: 15 }}>
          <Text style={{ fontWeight: 'bold', color: '#4A5343' }}>Лента сообщества</Text>
          <Text style={{ fontSize: 12, color: '#8A9A86' }}>Посмотри успехи единомышленников</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#8A9A86" />
      </TouchableOpacity>

      <Text style={[styles.inputLabel, { marginTop: 10, marginBottom: 15 }]}>Твои награды:</Text>
      
      {globalAchievements.map(ach => (
        <View key={ach.id} style={styles.achCard}>
          <Ionicons name={ach.icon} size={26} color="#8A9A86" />
          <View style={{ flex: 1, marginLeft: 15 }}>
            <Text style={{ fontWeight: 'bold', color: '#4A5343' }}>{ach.title}</Text>
            <Text style={{ fontSize: 12, color: '#8A9A86', marginTop: 2 }}>{ach.desc}</Text>
          </View>
        </View>
      ))}

      <TouchableOpacity style={[styles.button, { backgroundColor: '#DC2626', marginTop: 20 }]} onPress={() => onNavigate('welcome')}>
        <Text style={styles.buttonText}>Выйти из аккаунта</Text>
      </TouchableOpacity>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

// Экран: Настройки
export const SettingsScreen = ({ notifications, setNotifications, soundEnabled, setSoundEnabled}) => (
  <View style={styles.paddedContainer}>
    <Text style={styles.screenTitle}>Настройки</Text>
    <View style={styles.settingRow}>
      <Text style={styles.settingText}>Напоминания</Text>
      <Switch value={notifications} onValueChange={setNotifications} thumbColor={notifications ? '#8A9A86' : '#F4F3F4'} trackColor={{ true: '#8A9A86', false: '#EFECE6' }} />
    </View>
    <View style={styles.settingRow}>
      <Text style={styles.settingText}>Вибрация</Text>
      <Switch value={soundEnabled} onValueChange={setSoundEnabled} thumbColor={soundEnabled ? '#8A9A86' : '#F4F3F4'} trackColor={{ true: '#8A9A86', false: '#EFECE6' }} />
    </View>
  </View>
);

// Экран: Календарь
export const CalendarScreen = ({ selectedDay, onSelectDay, onBack, progressPercent, completedHabits, totalHabits }) => {
  const days = [
    { short: 'Пн', num: '18', done: true }, 
    { short: 'Вт', num: '19', done: true }, 
    { short: 'Ср', num: '20', done: progressPercent === 100 }, 
    { short: 'Чт', num: '21', done: false }, 
    { short: 'Пт', num: '22', done: false }
  ];

  return (
    <View style={styles.paddedContainer}>
      <TouchableOpacity onPress={onBack} style={{ width: 40, height: 40, justifyContent: 'center', marginTop: 10 }}>
        <Ionicons name="arrow-back" size={24} color="#4A5343" />
      </TouchableOpacity>
      
      {/* Изменено на alignItems: 'baseline' для точного выравнивания иконки */}
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 5, marginBottom: 20 }}>
        <Text style={[styles.screenTitle, { marginBottom: 0 }]}>История дней</Text>
        <Ionicons name="calendar" size={24} color="#8A9A86" />
      </View>
      
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#FFFFFF', padding: 15, borderRadius: 16, borderWidth: 1, borderColor: '#EFECE6' }}>
        {days.map(d => (
          <TouchableOpacity 
            key={d.short} 
            style={[styles.dayCard, selectedDay === d.short && styles.dayCardActive]} 
            onPress={() => onSelectDay(d.short)}
          >
            <Text style={{ color: selectedDay === d.short ? '#FDFBF7' : '#8A9A86', fontWeight: '500' }}>{d.short}</Text>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginVertical: 4, color: selectedDay === d.short ? '#FDFBF7' : '#4A5343' }}>{d.num}</Text>
            <Ionicons name={d.done ? "checkmark-circle" : "close-circle"} size={14} color={selectedDay === d.short ? '#FDFBF7' : d.done ? '#4A5343' : '#EF4444'} />
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.inputLabel, { marginTop: 30 }]}>Активность за {selectedDay}:</Text>
      
      <View style={styles.motivationBox}>
        {selectedDay === 'Ср' ? (
          <Text style={{ color: '#4A5343', fontSize: 15, textAlign: 'center', lineHeight: 22 }}>
            {totalHabits === 0 ? (
              "На сегодня привычек пока нет. Добавь их через главный экран!"
            ) : progressPercent === 100 ? (
              `🎉 Отлично! Выполнено 100% целей (${completedHabits} из ${totalHabits}). День закрыт полностью!`
            ) : (
              `📈 Выполнено ${progressPercent}% планов на сегодня.\nСделано привычек: ${completedHabits} из ${totalHabits}.`
            )}
          </Text>
        ) : (
          <Text style={{ color: '#4A5343', fontSize: 15, textAlign: 'center' }}>
            В этот день (архив) выполнено {selectedDay === 'Пн' || selectedDay === 'Вт' ? '100%' : '0%'} планов.
          </Text>
        )}
      </View>
    </View>
  );
};

// Экран: Таймер
export const TimerScreen = ({ timeText, timerActive, onToggleTimer, onReset, onBack }) => (
  <View style={[styles.paddedContainer, { alignItems: 'center' }]}>
    <TouchableOpacity onPress={onBack} style={{ width: 40, height: 40, justifyContent: 'center', marginTop: 10, alignSelf: 'flex-start' }}>
      <Ionicons name="arrow-back" size={24} color="#4A5343" />
    </TouchableOpacity>
    
    <Text style={[styles.screenTitle, { marginTop: 5, marginBottom: 20, alignSelf: 'flex-start' }]}>Фокус-таймер</Text>

    <View style={styles.timerCircle}>
      <Text style={styles.timerText}>{timeText}</Text>
      <Text style={{ color: '#8A9A86', marginTop: 5, fontWeight: '500' }}>Помодоро сессия</Text>
    </View>
    <TouchableOpacity style={[styles.button, { width: '80%', backgroundColor: timerActive ? '#EF4444' : '#8A9A86', marginTop: 30 }]} onPress={onToggleTimer}>
      <Text style={styles.buttonText}>{timerActive ? 'Пауза' : 'Старт'}</Text>
    </TouchableOpacity>
    <TouchableOpacity style={{ marginTop: 20 }} onPress={onReset}>
      <Text style={{ color: '#D4A373', fontWeight: '600' }}>Сбросить таймер</Text>
    </TouchableOpacity>
  </View>
);

// Экран: Сообщество
export const CommunityScreen = ({ feed, onReaction, onBack }) => {
  return (
    <View style={styles.paddedContainer}>
      <TouchableOpacity onPress={onBack} style={{ width: 40, height: 40, justifyContent: 'center', marginTop: 10 }}>
        <Ionicons name="arrow-back" size={24} color="#4A5343" />
      </TouchableOpacity>
      
      {/* Изменено на alignItems: 'baseline' для точного выравнивания иконки */}
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 5, marginBottom: 6 }}>
        <Text style={[styles.screenTitle, { marginBottom: 0 }]}>Общие достижения</Text>
        <Ionicons name="ribbon-outline" size={24} color="#8A9A86" />
      </View>
      
      <Text style={{ fontSize: 13, color: '#8A9A86', marginBottom: 15 }}>
        Успехи и награды пользователей со всего мира! Порадуйся за других:
      </Text>

      <FlatList 
        data={feed} 
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 30 }}
        renderItem={({ item }) => {
          return (
            <View style={{ 
              backgroundColor: '#FFFFFF', 
              padding: 16, 
              borderRadius: 16, 
              marginBottom: 14,
              borderWidth: 1,
              borderColor: '#EFECE6'
            }}>
              <Text style={{ fontWeight: 'bold', color: '#8A9A86', fontSize: 15, marginBottom: 6 }}>
                {item.user}
              </Text>
              
              <Text style={{ color: '#4A5343', fontSize: 14, lineHeight: 20 }}>
                {item.text}
              </Text>
              
              <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                marginTop: 14, 
                borderTopWidth: 1, 
                borderTopColor: '#EFECE6', 
                paddingTop: 10 
              }}>
                
                <TouchableOpacity 
                  onPress={() => onReaction(item.id)}
                  style={{ 
                    backgroundColor: item.hasLike ? '#E2EFE0' : '#EFECE6', 
                    paddingHorizontal: 16, 
                    paddingVertical: 8, 
                    borderRadius: 20,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <Ionicons name="flame" size={16} color={item.hasLike ? '#4A5343' : '#8A9A86'} />
                  <Text style={{ fontSize: 13, fontWeight: 'bold', color: item.hasLike ? '#4A5343' : '#8A9A86' }}>
                    {item.hasLike ? 'Супер!' : 'Молодец'}
                  </Text>
                </TouchableOpacity>

                <View style={{ backgroundColor: '#FDFBF7', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#EFECE6' }}>
                  <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#4A5343' }}>
                    Поддержали: {item.rating} чел.
                  </Text>
                </View>

              </View>

            </View>
          );
        }} 
      />
    </View>
  );
};

// Экран: Приветствие (Сплэш-скрин загрузки через PNG)
export const WelcomeScreen = ({ onStart, darkMode }) => {
  
  useEffect(() => {
    const timer = setTimeout(() => {
      onStart();
    }, 2500); 
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: darkMode ? '#121212' : '#FDFBF7', 
      padding: 40 
    }}>
      
      {/* Контейнер логотипа и названия (центрирован вертикально) */}
      <View style={{ alignItems: 'center', marginBottom: 30 }}>
        
        {/* Отображение PNG логотипа */}
        <Image 
          source={AppLogo} 
          style={{ 
            width: 120, 
            height: 120, 
            marginBottom: 16,
            resizeMode: 'contain'
          }} 
        />
        
        {/* Название под логотипом */}
        <Text style={{ 
          fontSize: 36, 
          fontWeight: '900', 
          color: darkMode ? '#FDFBF7' : '#4A5343', 
          letterSpacing: -1,
          textAlign: 'center'
        }}>
          Loop
        </Text>
      </View>

      {/* Крутилка загрузки строго под названием */}
      <View style={{ height: 40, justifyContent: 'center' }}>
        <ActivityIndicator size="small" color="#8A9A86" animating={true} />
      </View>
      
    </View>
  );
};

// Экран: Детали привычки
export const HabitDetailScreen = ({ habit, onDelete, onEdit, onBack }) => {
  if (!habit) return null;
  
  const timeStatus = getHabitTimeStatus(habit.timeFrom, habit.timeTo);
  const isExpired = timeStatus === 'expired' && !habit.done;
  const isFuture = timeStatus === 'future' && !habit.done;

  return (
    <View style={styles.paddedContainer}>
      <TouchableOpacity onPress={onBack} style={{ width: 40, height: 40, justifyContent: 'center', marginTop: 10 }}>
        <Ionicons name="arrow-back" size={24} color="#4A5343" />
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 5, marginBottom: 20 }}>
        <Text style={[styles.screenTitle, { marginBottom: 0 }]}>О привычке</Text>
        <Ionicons name="document-text-outline" size={24} color="#8A9A86" />
      </View>
      
      <View style={styles.detailCard}>
        <Text style={styles.detailTitle}>{habit.title}</Text>
        <Text style={styles.detailDate}>{habit.date}</Text>
        
        {habit.useTime && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 }}>
            <Ionicons name="time-outline" size={16} color="#4A5343" />
            <Text style={{ fontSize: 14, color: '#4A5343', fontWeight: '500' }}>
              Время выполнения: с {habit.timeFrom} до {habit.timeTo}
            </Text>
          </View>
        )}

        <View style={[
          styles.statusBadge, 
          { marginTop: 12 },
          habit.done && { backgroundColor: '#E2EFE0' },
          isExpired && { backgroundColor: '#FEE2E2' },
          isFuture && { backgroundColor: '#EFECE6' }
        ]}>
          <Text style={{ 
            fontWeight: 'bold',
            color: habit.done ? '#4A5343' : isExpired ? '#991B1B' : isFuture ? '#4A5343' : '#4A5343'
          }}>
            {habit.done ? 'Выполнено сегодня ✓' : isExpired ? 'Просрочено (время вышло) ✕' : isFuture ? 'Время ещё не пришло ⏳' : 'Еще не сделано'}
          </Text>
        </View>
      </View>
      
      <View style={[styles.motivationBox, { marginTop: 20, flexDirection: 'row', alignItems: 'flex-start', gap: 8 }]}>
        <Ionicons name="bulb-outline" size={20} color="#D4A373" style={{ marginTop: 2 }} />
        <Text style={[styles.motivationText, { flex: 1 }]}>Совет: Старайся выполнять эту привычку в одно и то же время, чтобы закрепить нейронные связи!</Text>
      </View>
      
      <View style={{ marginTop: 'auto', marginBottom: 20 }}>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#8A9A86', marginBottom: 12 }]} onPress={() => onEdit(habit)}>
          <Text style={styles.buttonText}>Редактировать</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#EF4444' }]} onPress={() => onDelete(habit.id)}>
          <Text style={styles.buttonText}>Удалить привычку</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};