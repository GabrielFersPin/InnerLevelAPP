import React, { useState } from 'react';
import { Target, Sparkles, Plus, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { showAlert } from '../utils/notifications';

// Real AI function using window.claude.complete
const generateGoalPlan = async (goalTitle: string, goalDescription: string, timeframe: string) => {
  try {
    const prompt = `Eres un experto en desarrollo personal y productividad. Analiza el siguiente objetivo y crea un plan personalizado.

OBJETIVO: "${goalTitle}"
DESCRIPCIÓN: "${goalDescription}"
TIMEFRAME: ${timeframe}

Crea un plan completo que incluya:
1. Hábitos específicos y accionables
2. Sistema de puntos balanceado (5-25 puntos según dificultad)
3. Recompensas motivadoras y contextualmente relevantes
4. Milestones progresivos

RESPONDE ÚNICAMENTE CON UN OBJETO JSON VÁLIDO EN ESTE FORMATO EXACTO:
{
  "habits": [
    {"name": "nombre del hábito", "category": "Professional|Personal|Self-Care|Learning", "points": número, "description": "descripción específica del hábito"}
  ],
  "rewards": [
    {"name": "nombre recompensa", "description": "descripción de la recompensa", "points": número, "category": "Small Treat|Entertainment|Learning|Self-Care|Shopping|Social|Excursion"}
  ],
  "milestones": [
    {"title": "nombre milestone", "description": "descripción del logro", "points": número}
  ]
}

NO INCLUYAS TEXTO ADICIONAL, SOLO EL JSON. ASEGÚRATE DE QUE SEA JSON VÁLIDO.`;

    const response = await window.claude.complete(prompt);
    
    // Parse the JSON response
    const aiPlan = JSON.parse(response);
    
    // Validate that the response has the expected structure
    if (!aiPlan.habits || !aiPlan.rewards || !aiPlan.milestones) {
      throw new Error('Invalid AI response structure');
    }
    
    return aiPlan;
    
  } catch (error) {
    console.error('Error generating AI plan:', error);
    
    // Fallback to default plan if AI fails
    const fallbackPlan = {
      habits: [
        { name: 'Planificación diaria', category: 'Personal', points: 10, description: 'Organizar y priorizar actividades del día' },
        { name: 'Trabajo enfocado', category: 'Professional', points: 15, description: 'Dedicar tiempo concentrado al objetivo principal' },
        { name: 'Reflexión y ajuste', category: 'Self-Care', points: 10, description: 'Evaluar progreso y ajustar estrategia' },
        { name: 'Aprendizaje continuo', category: 'Learning', points: 20, description: 'Estudiar y mejorar habilidades relevantes' }
      ],
      rewards: [
        { name: 'Descanso merecido', description: 'Tiempo libre para relajarse', points: 40, category: 'Self-Care' },
        { name: 'Treat especial', description: 'Algo que disfrutes mucho', points: 60, category: 'Small Treat' },
        { name: 'Actividad divertida', description: 'Hacer algo que te emocione', points: 100, category: 'Entertainment' },
        { name: 'Inversión personal', description: 'Comprar algo que apoye tu crecimiento', points: 200, category: 'Learning' }
      ],
      milestones: [
        { title: 'Primeros pasos', description: 'Completar primera semana de hábitos', points: 50 },
        { title: 'Construcción de momentum', description: 'Mantener consistencia por 2 semanas', points: 100 },
        { title: 'Progreso sólido', description: 'Un mes de trabajo consistente', points: 200 }
      ]
    };
    
    return fallbackPlan;
  }
};

export default function Goals() {
  const { state, dispatch, generateId } = useAppContext();
  const [activeTab, setActiveTab] = useState('create');
  const [loading, setLoading] = useState(false);
  
  const [goalForm, setGoalForm] = useState({
    title: '',
    description: '',
    timeframe: '3 months',
    priority: 'High' as 'High' | 'Medium' | 'Low'
  });

  const [generatedPlan, setGeneratedPlan] = useState<any>(null);

  const handleSubmit = async () => {
    if (!goalForm.title.trim() || !goalForm.description.trim()) {
      showAlert('Please fill in all required fields', 'warning');
      return;
    }

    setLoading(true);
    try {
      const aiPlan = await generateGoalPlan(goalForm.title, goalForm.description, goalForm.timeframe);
      
      const newGoal = {
        id: generateId(),
        ...goalForm,
        createdAt: new Date().toISOString().split('T')[0],
        status: 'Active' as const,
        aiPlan,
        progress: 0
      };

      dispatch({ type: 'ADD_GOAL', payload: newGoal });
      setGeneratedPlan(aiPlan);
      setActiveTab('plan');
      showAlert(`Goal created: ${goalForm.title}!`);
      
      // Reset form
      setGoalForm({
        title: '',
        description: '',
        timeframe: '3 months',
        priority: 'High'
      });
    } catch (error) {
      console.error('Error generating plan:', error);
      showAlert('Error creating goal plan. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const addHabitsToApp = (habits: any[]) => {
    habits.forEach(habit => {
      const newHabit = {
        id: generateId(),
        name: habit.name,
        category: habit.category,
        points: habit.points
      };
      dispatch({ type: 'ADD_HABIT', payload: newHabit });
    });
    showAlert(`Added ${habits.length} habits to your app!`);
  };

  const addRewardsToApp = (rewards: any[]) => {
    rewards.forEach(reward => {
      const newReward = {
        id: generateId(),
        name: reward.name,
        description: reward.description,
        points: reward.points,
        category: reward.category,
        redeemed: false
      };
      dispatch({ type: 'ADD_REWARD', payload: newReward });
    });
    showAlert(`Added ${rewards.length} rewards to your app!`);
  };

  const timeframes = ['1 month', '3 months', '6 months', '1 year'];
  const priorities = ['High', 'Medium', 'Low'];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">🎯 Smart Goals</h2>
        <p className="text-gray-600 mb-4">
          Set meaningful goals and let AI create personalized habits, rewards, and milestones for you.
        </p>
        
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
          <div className="flex items-start">
            <Sparkles className="w-5 h-5 text-purple-600 mt-0.5 mr-3" />
            <div>
              <h4 className="text-purple-800 font-semibold">AI-Powered Personalization</h4>
              <p className="text-purple-700 text-sm">
                Our AI analyzes your goal and creates custom habits, point systems, and rewards tailored specifically for your objective.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {[
          { id: 'create', label: 'Create Goal', icon: Plus },
          { id: 'plan', label: 'AI Plan', icon: Sparkles },
          { id: 'progress', label: 'My Goals', icon: TrendingUp }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Create Goal Tab */}
      {activeTab === 'create' && (
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center mb-6">
            <Target className="w-6 h-6 text-purple-600 mr-2" />
            <h3 className="text-xl font-bold text-gray-800">Define Your Goal</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Goal Title *
              </label>
              <input
                type="text"
                value={goalForm.title}
                onChange={(e) => setGoalForm(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="e.g., Conseguir un trabajo en tecnología, Perder 10kg, Aprender Python..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Detailed Description *
              </label>
              <textarea
                value={goalForm.description}
                onChange={(e) => setGoalForm(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Describe your goal in detail. What exactly do you want to achieve? What does success look like? Any specific requirements or constraints?"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timeframe
                </label>
                <select
                  value={goalForm.timeframe}
                  onChange={(e) => setGoalForm(prev => ({ ...prev, timeframe: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                >
                  {timeframes.map(timeframe => (
                    <option key={timeframe} value={timeframe}>{timeframe}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={goalForm.priority}
                  onChange={(e) => setGoalForm(prev => ({ ...prev, priority: e.target.value as 'High' | 'Medium' | 'Low' }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                >
                  {priorities.map(priority => (
                    <option key={priority} value={priority}>{priority}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-6 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  AI is creating your personalized plan...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Generate AI Plan
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* AI Plan Tab */}
      {activeTab === 'plan' && (
        <div className="space-y-6">
          {generatedPlan ? (
            <>
              {/* Suggested Habits */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Sparkles className="w-5 h-5 text-purple-600 mr-2" />
                  AI-Suggested Habits
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {generatedPlan.habits.map((habit: any, index: number) => (
                    <div key={index} className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-800">{habit.name}</h4>
                        <span className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                          {habit.points} pts
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{habit.description}</p>
                      <span className="inline-block bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                        {habit.category}
                      </span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => addHabitsToApp(generatedPlan.habits)}
                  className="mt-4 w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-2 px-4 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 font-medium"
                >
                  Add All Habits to My App
                </button>
              </div>

              {/* Suggested Rewards */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Sparkles className="w-5 h-5 text-green-600 mr-2" />
                  AI-Suggested Rewards
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {generatedPlan.rewards.map((reward: any, index: number) => (
                    <div key={index} className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-800">{reward.name}</h4>
                        <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                          {reward.points} pts
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{reward.description}</p>
                      <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                        {reward.category}
                      </span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => addRewardsToApp(generatedPlan.rewards)}
                  className="mt-4 w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-2 px-4 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 font-medium"
                >
                  Add All Rewards to My App
                </button>
              </div>

              {/* Milestones */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Sparkles className="w-5 h-5 text-blue-600 mr-2" />
                  AI-Generated Milestones
                </h3>
                <div className="space-y-4">
                  {generatedPlan.milestones.map((milestone: any, index: number) => (
                    <div key={index} className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <CheckCircle className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{milestone.title}</h4>
                          <p className="text-sm text-gray-600">{milestone.description}</p>
                        </div>
                      </div>
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {milestone.points} pts
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center py-12">
              <Sparkles className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">Create a goal first to see your personalized AI plan!</p>
            </div>
          )}
        </div>
      )}

      {/* My Goals Tab */}
      {activeTab === 'progress' && (
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-6">My Goals</h3>
          {state.goals.length > 0 ? (
            <div className="space-y-4">
              {state.goals.map((goal) => {
                const priorityColors = {
                  High: 'border-red-500 bg-red-50',
                  Medium: 'border-yellow-500 bg-yellow-50',
                  Low: 'border-green-500 bg-green-50'
                };
                
                return (
                  <div key={goal.id} className={`${priorityColors[goal.priority]} border-l-4 rounded-xl p-4`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-800">{goal.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                          {goal.status}
                        </span>
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                          {goal.priority}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mt-2">
                      <Clock className="w-4 h-4 mr-1" />
                      {goal.timeframe} | Created: {new Date(goal.createdAt).toLocaleDateString()}
                    </div>
                    {goal.aiPlan && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="text-center">
                            <div className="font-semibold text-purple-600">{goal.aiPlan.habits.length}</div>
                            <div className="text-gray-500">AI Habits</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-green-600">{goal.aiPlan.rewards.length}</div>
                            <div className="text-gray-500">AI Rewards</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-blue-600">{goal.aiPlan.milestones.length}</div>
                            <div className="text-gray-500">Milestones</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Target className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>No goals created yet. Start by creating your first goal!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}