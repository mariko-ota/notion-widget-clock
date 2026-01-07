import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';

const AnalogClock = () => {
  const [time, setTime] = useState(new Date());
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    size: 300,
    backgroundColor: '#ffffff',
    faceColor: '#ffffff',
    hourHandColor: '#333333',
    minuteHandColor: '#333333',
    secondHandColor: '#ff6b6b',
    numbersColor: '#333333',
    marksColor: '#cccccc',
    showNumbers: true,
    showSecondHand: true,
    showMarks: true,
    showBorder: false,
    hourHandWidth: 8,
    minuteHandWidth: 6,
    secondHandWidth: 2,
    numberFont: 'sans-serif',
    clockStyle: 'modern', // modern, classic, minimal
  });

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourAngle = (hours + minutes / 60) * 30;
  const minuteAngle = (minutes + seconds / 60) * 6;
  const secondAngle = seconds * 6;

  const renderNumbers = () => {
    if (!settings.showNumbers) return null;
    const numbers = [];
    const fontMap = {
      'sans-serif': "'Inter', sans-serif",
      'serif': "'Georgia', serif",
      'monospace': "'Courier New', monospace",
      'rounded': "'Quicksand', sans-serif",
      'elegant': "'Playfair Display', serif"
    };
    
    for (let i = 1; i <= 12; i++) {
      const angle = (i * 30 - 90) * (Math.PI / 180);
      const radius = settings.size * 0.35;
      const x = settings.size / 2 + radius * Math.cos(angle);
      const y = settings.size / 2 + radius * Math.sin(angle);
      numbers.push(
        <text
          key={i}
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={settings.numbersColor}
          fontSize={settings.size * 0.08}
          fontWeight="300"
          fontFamily={fontMap[settings.numberFont] || fontMap['sans-serif']}
        >
          {i}
        </text>
      );
    }
    return numbers;
  };

  const renderMarks = () => {
    if (!settings.showMarks) return null;
    const marks = [];
    for (let i = 0; i < 60; i++) {
      const angle = (i * 6 - 90) * (Math.PI / 180);
      const isHour = i % 5 === 0;
      const length = isHour ? settings.size * 0.06 : settings.size * 0.03;
      const width = isHour ? 2 : 1;
      const startRadius = settings.size * 0.42;
      
      const x1 = settings.size / 2 + startRadius * Math.cos(angle);
      const y1 = settings.size / 2 + startRadius * Math.sin(angle);
      const x2 = settings.size / 2 + (startRadius - length) * Math.cos(angle);
      const y2 = settings.size / 2 + (startRadius - length) * Math.sin(angle);
      
      marks.push(
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={settings.marksColor}
          strokeWidth={width}
          strokeLinecap="round"
        />
      );
    }
    return marks;
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-6" style={{ backgroundColor: settings.backgroundColor }}>
      <div className="relative">
        <svg
          width={settings.size}
          height={settings.size}
          style={{
            filter: settings.clockStyle === 'modern' 
              ? 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))'
              : settings.clockStyle === 'classic'
              ? 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))'
              : 'none'
          }}
        >
          {/* Clock Face */}
          <circle
            cx={settings.size / 2}
            cy={settings.size / 2}
            r={settings.size * 0.45}
            fill={settings.faceColor}
            stroke={settings.showBorder ? settings.marksColor : 'none'}
            strokeWidth={settings.showBorder ? 2 : 0}
          />
          
          {/* Marks */}
          {renderMarks()}
          
          {/* Numbers */}
          {renderNumbers()}
          
          {/* Hour Hand */}
          <line
            x1={settings.size / 2}
            y1={settings.size / 2}
            x2={settings.size / 2}
            y2={settings.size / 2 - settings.size * 0.2}
            stroke={settings.hourHandColor}
            strokeWidth={settings.hourHandWidth}
            strokeLinecap="round"
            transform={`rotate(${hourAngle} ${settings.size / 2} ${settings.size / 2})`}
          />
          
          {/* Minute Hand */}
          <line
            x1={settings.size / 2}
            y1={settings.size / 2}
            x2={settings.size / 2}
            y2={settings.size / 2 - settings.size * 0.3}
            stroke={settings.minuteHandColor}
            strokeWidth={settings.minuteHandWidth}
            strokeLinecap="round"
            transform={`rotate(${minuteAngle} ${settings.size / 2} ${settings.size / 2})`}
          />
          
          {/* Second Hand */}
          {settings.showSecondHand && (
            <line
              x1={settings.size / 2}
              y1={settings.size / 2}
              x2={settings.size / 2}
              y2={settings.size / 2 - settings.size * 0.35}
              stroke={settings.secondHandColor}
              strokeWidth={settings.secondHandWidth}
              strokeLinecap="round"
              transform={`rotate(${secondAngle} ${settings.size / 2} ${settings.size / 2})`}
            />
          )}
        </svg>

        {/* Settings Button */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full bg-white bg-opacity-10 hover:bg-opacity-20 transition-all flex items-center gap-2"
        >
          <Settings size={20} color="white" />
          <span className="text-white text-sm">{showSettings ? '設定を閉じる' : '設定を開く'}</span>
        </button>

        {/* Settings Panel */}
        {showSettings && (
          <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 translate-y-full bg-gray-900 text-white p-6 rounded-lg shadow-2xl max-h-96 overflow-y-auto w-80 mt-4">
            <h3 className="text-lg font-semibold mb-4 text-center">時計の設定</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">サイズ</label>
                <input
                  type="range"
                  min="200"
                  max="500"
                  value={settings.size}
                  onChange={(e) => updateSetting('size', Number(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs text-gray-400">{settings.size}px</span>
              </div>

              <div>
                <label className="block text-sm mb-1">スタイル</label>
                <select
                  value={settings.clockStyle}
                  onChange={(e) => updateSetting('clockStyle', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm"
                >
                  <option value="modern">モダン</option>
                  <option value="classic">クラシック</option>
                  <option value="minimal">ミニマル</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">数字のフォント</label>
                <select
                  value={settings.numberFont}
                  onChange={(e) => updateSetting('numberFont', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm"
                >
                  <option value="sans-serif">サンセリフ</option>
                  <option value="serif">セリフ</option>
                  <option value="monospace">等幅</option>
                  <option value="rounded">丸ゴシック</option>
                  <option value="elegant">エレガント</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">背景色</label>
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(e) => updateSetting('backgroundColor', e.target.value)}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">文字盤の色</label>
                <input
                  type="color"
                  value={settings.faceColor}
                  onChange={(e) => updateSetting('faceColor', e.target.value)}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">時針の色</label>
                <input
                  type="color"
                  value={settings.hourHandColor}
                  onChange={(e) => updateSetting('hourHandColor', e.target.value)}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">分針の色</label>
                <input
                  type="color"
                  value={settings.minuteHandColor}
                  onChange={(e) => updateSetting('minuteHandColor', e.target.value)}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">秒針の色</label>
                <input
                  type="color"
                  value={settings.secondHandColor}
                  onChange={(e) => updateSetting('secondHandColor', e.target.value)}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">数字の色</label>
                <input
                  type="color"
                  value={settings.numbersColor}
                  onChange={(e) => updateSetting('numbersColor', e.target.value)}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.showNumbers}
                    onChange={(e) => updateSetting('showNumbers', e.target.checked)}
                    className="w-4 h-4"
                  />
                  数字を表示
                </label>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.showMarks}
                    onChange={(e) => updateSetting('showMarks', e.target.checked)}
                    className="w-4 h-4"
                  />
                  目盛りを表示
                </label>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.showBorder}
                    onChange={(e) => updateSetting('showBorder', e.target.checked)}
                    className="w-4 h-4"
                  />
                  外枠の円を表示
                </label>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.showSecondHand}
                    onChange={(e) => updateSetting('showSecondHand', e.target.checked)}
                    className="w-4 h-4"
                  />
                  秒針を表示
                </label>
              </div>

              <div>
                <label className="block text-sm mb-1">時針の太さ</label>
                <input
                  type="range"
                  min="4"
                  max="16"
                  value={settings.hourHandWidth}
                  onChange={(e) => updateSetting('hourHandWidth', Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">分針の太さ</label>
                <input
                  type="range"
                  min="3"
                  max="12"
                  value={settings.minuteHandWidth}
                  onChange={(e) => updateSetting('minuteHandWidth', Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">秒針の太さ</label>
                <input
                  type="range"
                  min="1"
                  max="6"
                  value={settings.secondHandWidth}
                  onChange={(e) => updateSetting('secondHandWidth', Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalogClock;