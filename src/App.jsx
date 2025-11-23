import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, X, Minus, Settings, Pin, PinOff, Check, Minimize2, Maximize2 } from 'lucide-react';
import { TomatoIcon } from './components/TomatoIcon';

const App = () => {
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [autoStart, setAutoStart] = useState(false);
  const [timeLeft, setTimeLeft] = useState(workDuration * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('work'); // 'work' | 'break'
  const [isTop, setIsTop] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  
  // 配置
  const config = {
    work: workDuration * 60,
    break: breakDuration * 60
  };

  useEffect(() => {
    if (!isActive) {
        setTimeLeft(config[mode]);
    }
  }, [workDuration, breakDuration]);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      if (autoStart) {
          const nextMode = mode === 'work' ? 'break' : 'work';
          setMode(nextMode);
          setTimeLeft(nextMode === 'work' ? workDuration * 60 : breakDuration * 60);
      } else {
          setIsActive(false);
      }
      // 播放提示音或通知（待实现）
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, autoStart, mode, workDuration, breakDuration]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(config[mode]);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(config[newMode]);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMinimize = () => {
    if (window.electronAPI) window.electronAPI.minimize();
  };

  const handleClose = () => {
    if (window.electronAPI) window.electronAPI.close();
  };
  
  const toggleTop = () => {
      const newTop = !isTop;
      setIsTop(newTop);
      if (window.electronAPI) window.electronAPI.setAlwaysOnTop(newTop);
  }

  const toggleCompactMode = () => {
      const newCompact = !isCompact;
      setIsCompact(newCompact);
      if (window.electronAPI) {
          if (newCompact) {
              window.electronAPI.setSize(180, 180);
              window.electronAPI.setAlwaysOnTop(true);
          } else {
              window.electronAPI.setSize(400, 600);
              window.electronAPI.setAlwaysOnTop(isTop); // Restore previous state
          }
      }
  }

  const handleSaveSettings = (e) => {
      e.preventDefault();
      const form = e.target;
      const newWorkDuration = parseInt(form.workDuration.value, 10);
      const newBreakDuration = parseInt(form.breakDuration.value, 10);
      const newAutoStart = form.autoStart.checked;
      
      if (newWorkDuration > 0) setWorkDuration(newWorkDuration);
      if (newBreakDuration > 0) setBreakDuration(newBreakDuration);
      setAutoStart(newAutoStart);
      
      setShowSettings(false);
  }

  // 进度百分比
  const progress = ((config[mode] - timeLeft) / config[mode]) * 100;

  if (isCompact) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-transparent p-6">
            <div className="w-full h-full bg-white/90 backdrop-blur-md rounded-[2.5rem] shadow-xl overflow-hidden flex flex-col relative border-4 border-white/50 items-center justify-center group">
                {/* 拖动区域 */}
                <div className="absolute inset-0 z-0" style={{ WebkitAppRegion: 'drag' }}></div>
                
                {/* 悬浮控制 */}
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[2.5rem]">
                    <button onClick={toggleCompactMode} className="p-2 bg-white rounded-full shadow-lg text-gray-600 hover:text-primary transition-colors no-drag">
                        <Maximize2 size={20} />
                    </button>
                    <button onClick={toggleTimer} className="ml-2 p-2 bg-white rounded-full shadow-lg text-gray-600 hover:text-primary transition-colors no-drag">
                        {isActive ? <Pause size={20} /> : <Play size={20} />}
                    </button>
                </div>

                {/* 环形进度条 */}
                <svg className="w-full h-full transform -rotate-90 absolute inset-0 pointer-events-none scale-90">
                    <circle
                        cx="50%"
                        cy="50%"
                        r="42%"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-gray-100"
                    />
                    <motion.circle
                        cx="50%"
                        cy="50%"
                        r="42%"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className={`${mode === 'work' ? 'text-primary' : 'text-secondary'}`}
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 - progress / 100 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                </svg>
                
                {/* 时间显示 */}
                <div className="relative z-0 flex flex-col items-center justify-center pointer-events-none">
                    <div className={`text-3xl font-bold tracking-tighter ${mode === 'work' ? 'text-gray-800' : 'text-gray-600'}`}>
                        {formatTime(timeLeft)}
                    </div>
                </div>
            </div>
        </div>
      );
  }

  return (
    <div className="w-full h-full flex items-center justify-center bg-transparent p-8">
      <div className="w-full h-full bg-white/90 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden flex flex-col relative border border-white/50">
        {/* 标题栏 / 拖动区域 */}
        <div className="h-8 w-full flex justify-between items-center px-3 absolute top-0 z-50">
         <div className="flex items-center space-x-2 no-drag opacity-50 hover:opacity-100 transition-opacity">
             <TomatoIcon size={18} className="text-primary" />
             <span className="text-xs font-bold text-gray-500 tracking-wider">POMODORO</span>
         </div>
         <div className="flex items-center space-x-2">
            <button onClick={toggleCompactMode} className="p-1 hover:bg-gray-200 rounded-full transition-colors no-drag text-gray-500" title="迷你模式">
                <Minimize2 size={14} />
            </button>
            <button onClick={() => setShowSettings(!showSettings)} className="p-1 hover:bg-gray-200 rounded-full transition-colors no-drag text-gray-500">
                <Settings size={14} />
            </button>
            <button onClick={toggleTop} className="p-1 hover:bg-gray-200 rounded-full transition-colors no-drag text-gray-500">
                {isTop ? <Pin size={14} className="fill-current" /> : <PinOff size={14} />}
            </button>
            <button onClick={handleMinimize} className="p-1 hover:bg-gray-200 rounded-full transition-colors no-drag text-gray-500">
                <Minus size={16} />
            </button>
            <button onClick={handleClose} className="p-1 hover:bg-red-100 hover:text-red-500 rounded-full transition-colors no-drag text-gray-500">
                <X size={16} />
            </button>
         </div>
      </div>

      {/* 设置弹窗 */}
      <AnimatePresence>
        {showSettings && (
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute inset-0 z-40 bg-white/95 backdrop-blur-sm flex items-center justify-center p-6"
            >
                <form onSubmit={handleSaveSettings} className="w-full max-w-xs space-y-4 no-drag">
                    <h3 className="text-lg font-bold text-gray-700 mb-4">设置</h3>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-600">专注时长 (分钟)</label>
                        <input 
                            name="workDuration"
                            type="number" 
                            defaultValue={workDuration}
                            min="1"
                            max="120"
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-600">休息时长 (分钟)</label>
                        <input 
                            name="breakDuration"
                            type="number" 
                            defaultValue={breakDuration}
                            min="1"
                            max="60"
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white"
                        />
                    </div>
                    
                    <label className="flex items-center justify-between cursor-pointer py-2">
                        <span className="text-sm font-medium text-gray-600">连续模式</span>
                        <div className="relative">
                            <input type="checkbox" name="autoStart" defaultChecked={autoStart} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </div>
                    </label>

                    <div className="flex space-x-3 pt-4">
                        <button 
                            type="button"
                            onClick={() => setShowSettings(false)}
                            className="flex-1 px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 font-medium transition-colors"
                        >
                            取消
                        </button>
                        <button 
                            type="submit"
                            className="flex-1 px-4 py-2 rounded-lg bg-primary text-white hover:bg-red-500 font-medium transition-colors flex items-center justify-center space-x-2"
                        >
                            <Check size={16} />
                            <span>保存</span>
                        </button>
                    </div>
                    <div className="text-center mt-2">
                        <span className="text-xs text-gray-400">By Lumine</span>
                    </div>
                </form>
            </motion.div>
        )}
      </AnimatePresence>

      {/* 主内容 */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8">
        
        {/* 模式切换 */}
        <div className="flex space-x-2 bg-gray-100 p-1 rounded-full no-drag">
          {[
            { id: 'work', label: '专注' },
            { id: 'break', label: '休息' }
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => switchMode(m.id)}
              className={`px-6 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
                mode === m.id 
                  ? 'bg-white text-primary shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* 倒计时显示 */}
        <div className="relative flex items-center justify-center">
            {/* 简单的环形进度条背景 */}
            <svg className="w-64 h-64 transform -rotate-90">
                <circle
                    cx="128"
                    cy="128"
                    r="120"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-gray-100"
                />
                <motion.circle
                    cx="128"
                    cy="128"
                    r="120"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className={`${mode === 'work' ? 'text-primary' : 'text-secondary'}`}
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 - progress / 100 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                />
            </svg>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <div 
                    className={`text-6xl font-bold tracking-tighter ${mode === 'work' ? 'text-gray-800' : 'text-gray-600'}`}
                 >
                    {formatTime(timeLeft)}
                 </div>
                 <p className="text-gray-400 mt-2 text-sm font-medium tracking-widest uppercase">
                    {isActive ? '进行中' : '已暂停'}
                 </p>
            </div>
        </div>

        {/* 控制按钮 */}
        <div className="flex items-center space-x-6 no-drag">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTimer}
            className={`p-4 rounded-full shadow-lg text-white transition-colors ${
                mode === 'work' ? 'bg-primary hover:bg-red-500' : 'bg-secondary hover:bg-teal-500'
            }`}
          >
            {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetTimer}
            className="p-3 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
          >
            <RotateCcw size={24} />
          </motion.button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default App;