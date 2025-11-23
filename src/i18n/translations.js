// 国际化翻译文件
export const translations = {
  'zh-CN': {
    // 标题栏
    appName: 'POMODORO',
    miniMode: '迷你模式',
    
    // 模式
    work: '专注',
    break: '休息',
    
    // 状态
    inProgress: '进行中',
    paused: '已暂停',
    
    // 设置
    settings: '设置',
    workDuration: '专注时长 (分钟)',
    breakDuration: '休息时长 (分钟)',
    autoMode: '连续模式',
    language: '语言',
    cancel: '取消',
    save: '保存',
    
    // 语言选项
    languages: {
      'zh-CN': '简体中文',
      'en': 'English',
      'ja': '日本語'
    }
  },
  'en': {
    // Header
    appName: 'POMODORO',
    miniMode: 'Mini Mode',
    
    // Modes
    work: 'Work',
    break: 'Break',
    
    // Status
    inProgress: 'In Progress',
    paused: 'Paused',
    
    // Settings
    settings: 'Settings',
    workDuration: 'Work Duration (minutes)',
    breakDuration: 'Break Duration (minutes)',
    autoMode: 'Auto Mode',
    language: 'Language',
    cancel: 'Cancel',
    save: 'Save',
    
    // Language options
    languages: {
      'zh-CN': '简体中文',
      'en': 'English',
      'ja': '日本語'
    }
  },
  'ja': {
    // ヘッダー
    appName: 'POMODORO',
    miniMode: 'ミニモード',
    
    // モード
    work: '集中',
    break: '休憩',
    
    // ステータス
    inProgress: '進行中',
    paused: '一時停止',
    
    // 設定
    settings: '設定',
    workDuration: '集中時間 (分)',
    breakDuration: '休憩時間 (分)',
    autoMode: '連続モード',
    language: '言語',
    cancel: 'キャンセル',
    save: '保存',
    
    // 言語オプション
    languages: {
      'zh-CN': '简体中文',
      'en': 'English',
      'ja': '日本語'
    }
  }
};

export const getTranslation = (language, key) => {
  const keys = key.split('.');
  let value = translations[language];
  
  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = value[k];
    } else {
      // Log warning in development
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`Translation not found: ${language}.${key}`);
      }
      return key; // Fallback to key if translation not found
    }
  }
  
  return value || key;
};
