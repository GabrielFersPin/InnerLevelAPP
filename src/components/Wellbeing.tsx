import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { showAlert } from '../utils/notifications';
import { Heart, Clock, Wind, BookOpen } from 'lucide-react';

export function Wellbeing() {
  const { state, dispatch, generateId } = useAppContext();
  const [activeTab, setActiveTab] = useState<'checkin' | 'patterns' | 'exercises'>('checkin');
  const [mindfulnessActive, setMindfulnessActive] = useState(false);
  const [breathingActive, setBreathingActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [breathingStep, setBreathingStep] = useState('');
  const [gratitudeText, setGratitudeText] = useState('');
  
  const [checkinForm, setCheckinForm] = useState({
    morningEmotion: 'Peaceful',
    morningEnergy: 3,
    morningNotes: '',
    eveningEmotion: 'Peaceful',
    eveningEnergy: 3,
    eveningNotes: '',
    gratitude: ''
  });

  const emotions = ['Anxious', 'Motivated', 'Tired', 'Sad', 'Peaceful', 'Euphoric'];

  const handleCheckinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const today = new Date().toISOString().split('T')[0];
    const newLog = {
      id: generateId(),
      date: today,
      morningEmotion: checkinForm.morningEmotion,
      morningEnergy: checkinForm.morningEnergy,
      morningNotes: checkinForm.morningNotes,
      eveningEmotion: checkinForm.eveningEmotion,
      eveningEnergy: checkinForm.eveningEnergy,
      eveningNotes: checkinForm.eveningNotes,
      gratitude: checkinForm.gratitude
    };

    dispatch({ type: 'ADD_EMOTIONAL_LOG', payload: newLog });
    showAlert('Daily check-in saved successfully!');
    
    // Reset form
    setCheckinForm({
      morningEmotion: 'Peaceful',
      morningEnergy: 3,
      morningNotes: '',
      eveningEmotion: 'Peaceful',
      eveningEnergy: 3,
      eveningNotes: '',
      gratitude: ''
    });
  };

  const startMindfulness = () => {
    setMindfulnessActive(true);
    setTimeLeft(300); // 5 minutes

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setMindfulnessActive(false);
          showAlert('Mindfulness session complete! Well done! 🧘‍♂️');
          return 300;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startBreathing = () => {
    setBreathingActive(true);
    
    const cycle = [
      { text: 'Inhale...', duration: 4000 },
      { text: 'Hold...', duration: 7000 },
      { text: 'Exhale...', duration: 8000 }
    ];

    let currentCycle = 0;
    let cycleCount = 0;

    function nextStep() {
      if (cycleCount >= 4) {
        setBreathingStep('Exercise complete! Well done! 🌬️');
        setTimeout(() => {
          setBreathingActive(false);
          setBreathingStep('');
        }, 2000);
        return;
      }

      const step = cycle[currentCycle];
      setBreathingStep(step.text);

      setTimeout(() => {
        currentCycle = (currentCycle + 1) % 3;
        if (currentCycle === 0) cycleCount++;
        nextStep();
      }, step.duration);
    }

    nextStep();
  };

  const saveGratitude = () => {
    if (gratitudeText.trim()) {
      showAlert('Reflections saved. Thank you for practicing gratitude! 🙏');
      setGratitudeText('');
    } else {
      showAlert('Please write your reflections before saving.', 'warning');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">😌 Emotional Well-being</h2>
        <p className="text-gray-600 mb-4">
          Monitor and improve your emotional well-being over time.
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h4 className="text-blue-800 font-semibold mb-2">🌟 Features:</h4>
          <div className="space-y-1 text-sm text-blue-700">
            <div>• Daily emotion tracking</div>
            <div>• Emotional pattern analysis</div>
            <div>• Personalized recommendations</div>
            <div>• Mindfulness exercises</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {[
          { id: 'checkin', label: 'Daily Check-in' },
          { id: 'patterns', label: 'Emotional Patterns' },
          { id: 'exercises', label: 'Exercises' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Daily Check-in Tab */}
      {activeTab === 'checkin' && (
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Daily Emotion Check-in</h3>
          <form onSubmit={handleCheckinSubmit} className="space-y-8">
            {/* Morning Check-in */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">🌅 Morning Check-in</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">How are you feeling this morning?</label>
                  <select
                    value={checkinForm.morningEmotion}
                    onChange={(e) => setCheckinForm(prev => ({ ...prev, morningEmotion: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    {emotions.map(emotion => (
                      <option key={emotion} value={emotion}>{emotion}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Energy Level: {checkinForm.morningEnergy}/5
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={checkinForm.morningEnergy}
                    onChange={(e) => setCheckinForm(prev => ({ ...prev, morningEnergy: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Very Low</span>
                    <span>Low</span>
                    <span>Medium</span>
                    <span>High</span>
                    <span>Very High</span>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes or thoughts</label>
                <textarea
                  value={checkinForm.morningNotes}
                  onChange={(e) => setCheckinForm(prev => ({ ...prev, morningNotes: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="How are you starting your day? Any thoughts or concerns?"
                />
              </div>
            </div>

            {/* Evening Check-in */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">🌙 Evening Check-in</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">How are you feeling this evening?</label>
                  <select
                    value={checkinForm.eveningEmotion}
                    onChange={(e) => setCheckinForm(prev => ({ ...prev, eveningEmotion: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    {emotions.map(emotion => (
                      <option key={emotion} value={emotion}>{emotion}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Energy Level: {checkinForm.eveningEnergy}/5
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={checkinForm.eveningEnergy}
                    onChange={(e) => setCheckinForm(prev => ({ ...prev, eveningEnergy: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Very Low</span>
                    <span>Low</span>
                    <span>Medium</span>
                    <span>High</span>
                    <span>Very High</span>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Day's reflections</label>
                <textarea
                  value={checkinForm.eveningNotes}
                  onChange={(e) => setCheckinForm(prev => ({ ...prev, eveningNotes: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="How was your day? What went well? What could be improved?"
                />
              </div>
            </div>

            {/* Gratitude Practice */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">🙏 Gratitude Practice</h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Three things you're grateful for today</label>
                <textarea
                  value={checkinForm.gratitude}
                  onChange={(e) => setCheckinForm(prev => ({ ...prev, gratitude: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="1. ...&#10;2. ...&#10;3. ..."
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-6 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 font-medium"
            >
              Save Daily Check-in
            </button>
          </form>
        </div>
      )}

      {/* Emotional Patterns Tab */}
      {activeTab === 'patterns' && (
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Emotional Patterns</h3>
          <div className="text-center py-12 text-gray-500">
            <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>Emotional pattern analysis will be available once you start logging your daily check-ins.</p>
          </div>
        </div>
      )}

      {/* Exercises Tab */}
      {activeTab === 'exercises' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mindfulness Exercise */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <Heart className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">🧘‍♂️ Mindfulness Exercise</h3>
            </div>
            <div className="mb-4">
              <p className="font-semibold mb-2">5-minute exercise:</p>
              <ol className="text-sm text-gray-600 space-y-1">
                <li>1. Find a comfortable position</li>
                <li>2. Gently close your eyes</li>
                <li>3. Focus on your breath</li>
                <li>4. Observe your thoughts without judgment</li>
                <li>5. Return to your breath when distracted</li>
              </ol>
            </div>
            {mindfulnessActive ? (
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-4">
                  {formatTime(timeLeft)}
                </div>
                <p className="text-gray-600">Breathe deeply and stay present...</p>
              </div>
            ) : (
              <button
                onClick={startMindfulness}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium"
              >
                Start Timer
              </button>
            )}
          </div>

          {/* Breathing Exercise */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <Wind className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">🌬️ 4-7-8 Breathing</h3>
            </div>
            <div className="mb-4">
              <p className="font-semibold mb-2">Instructions:</p>
              <ol className="text-sm text-gray-600 space-y-1">
                <li>1. Inhale through your nose for 4 counts</li>
                <li>2. Hold your breath for 7 counts</li>
                <li>3. Exhale through your mouth for 8 counts</li>
              </ol>
              <p className="text-sm text-gray-600 italic mt-2">Repeat 4 times</p>
            </div>
            {breathingActive ? (
              <div className="text-center">
                <div className="text-xl font-semibold text-green-600 mb-4">
                  {breathingStep || 'Ready to begin...'}
                </div>
              </div>
            ) : (
              <button
                onClick={startBreathing}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-2 px-4 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 font-medium"
              >
                Start Exercise
              </button>
            )}
          </div>

          {/* Gratitude Exercise */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                <BookOpen className="w-5 h-5 text-yellow-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">🙏 Gratitude Exercise</h3>
            </div>
            <div className="mb-4">
              <p className="font-semibold mb-2">Instructions:</p>
              <ol className="text-sm text-gray-600 space-y-1">
                <li>1. Think of three things you're grateful for today</li>
                <li>2. Write why each one is meaningful</li>
                <li>3. Reflect on how they make you feel</li>
              </ol>
            </div>
            <div className="space-y-3">
              <textarea
                value={gratitudeText}
                onChange={(e) => setGratitudeText(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all text-sm"
                placeholder="Write your reflections here..."
              />
              <button
                onClick={saveGratitude}
                className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 text-white py-2 px-4 rounded-lg hover:from-yellow-700 hover:to-yellow-800 transition-all duration-300 font-medium"
              >
                Save Reflections
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}