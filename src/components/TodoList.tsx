import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { showAlert, showConfetti } from '../utils/notifications';
import { CheckSquare, Plus, Trash2, Check, Swords } from 'lucide-react';
import { format } from 'date-fns';
import techSword from '../assets/tech_sword.jpg';

export function TodoList() {
  const { state, dispatch, generateId } = useAppContext();
  const [form, setForm] = useState({
    task: '',
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
    priority: 'Medium' as 'High' | 'Medium' | 'Low',
    points: 10
  });

  const priorities = ['High', 'Medium', 'Low'] as const;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.task.trim()) {
      showAlert('Please enter a task description', 'warning');
      return;
    }

    const newTodo = {
      id: generateId(),
      task: form.task,
      dueDate: form.dueDate,
      priority: form.priority,
      status: 'Pending' as const,
      points: form.points
    };

    dispatch({ type: 'ADD_TODO', payload: newTodo });
    showAlert(`New quest added: ${form.task}`);

    // Reset form
    setForm({
      task: '',
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: 'Medium',
      points: 10
    });
  };

  const handleComplete = (todoId: number) => {
    const todo = state.todos.find(t => t.id === todoId);
    if (!todo) return;

    const newTask = {
      id: generateId(),
      date: new Date().toISOString().split('T')[0],
      category: 'Personal',
      task: `Completed: ${todo.task}`,
      points: todo.points,
      comment: `Completed quest: ${todo.task}`
    };

    dispatch({ type: 'COMPLETE_TODO', payload: { todoId, task: newTask } });
    showConfetti();
    showAlert(`Quest completed: ${todo.task} (+${todo.points} XP)`);
  };

  const handleDelete = (todoId: number) => {
    if (confirm('Are you sure you want to abandon this quest?')) {
      dispatch({ type: 'DELETE_TODO', payload: todoId });
      showAlert('Quest abandoned.');
    }
  };

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'High': return {
        bg: 'bg-red-950/30 border-red-500/50',
        text: 'text-red-400',
        badge: 'bg-red-900/50 text-red-200 border border-red-500/50',
        border: 'border-l-red-500'
      };
      case 'Medium': return {
        bg: 'bg-amber-950/30 border-amber-500/50',
        text: 'text-amber-400',
        badge: 'bg-amber-900/50 text-amber-200 border border-amber-500/50',
        border: 'border-l-amber-500'
      };
      case 'Low': return {
        bg: 'bg-emerald-950/30 border-emerald-500/50',
        text: 'text-emerald-400',
        badge: 'bg-emerald-900/50 text-emerald-200 border border-emerald-500/50',
        border: 'border-l-emerald-500'
      };
      default: return {
        bg: 'bg-slate-950/30 border-slate-500/50',
        text: 'text-slate-400',
        badge: 'bg-slate-900/50 text-slate-200 border border-slate-500/50',
        border: 'border-l-slate-500'
      };
    }
  };

  const sortedTodos = state.todos.sort((a, b) => {
    const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gold-200 mb-4 font-cinzel text-glow-sm flex items-center justify-center gap-3">
          <img src={techSword} alt="Sword" className="w-8 h-8 rounded-full border border-tech-gold" />
          Quest Board
          <img src={techSword} alt="Sword" className="w-8 h-8 rounded-full border border-tech-gold transform scale-x-[-1]" />
        </h2>
        <p className="text-slate-300 mb-6 font-inter">
          Track your daily quests and earn XP for your journey!
        </p>

        <div className="bg-void-950/40 border border-tech-cyan/30 rounded-xl p-4 backdrop-blur-md inline-block">
          <h4 className="text-tech-cyan font-bold mb-3 font-cinzel text-sm uppercase tracking-wider">Priority Levels</h4>
          <div className="flex gap-4 text-sm font-inter">
            <div className="flex items-center gap-2 text-red-400"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> High Priority</div>
            <div className="flex items-center gap-2 text-amber-400"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Medium Priority</div>
            <div className="flex items-center gap-2 text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Low Priority</div>
          </div>
        </div>
      </div>

      {/* Add New Todo */}
      <div className="bg-void-950/60 border border-white/10 rounded-2xl p-8 shadow-xl backdrop-blur-md relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-tech-magenta to-transparent opacity-50"></div>
        <div className="flex items-center mb-6">
          <Swords className="w-6 h-6 text-tech-magenta mr-3" />
          <h3 className="text-xl font-bold text-gold-100 font-cinzel">Post New Quest</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-tech-cyan mb-2 font-cinzel tracking-wide">Quest Description</label>
            <input
              type="text"
              value={form.task}
              onChange={(e) => setForm(prev => ({ ...prev, task: e.target.value }))}
              className="w-full px-4 py-3 bg-void-900/50 border border-tech-cyan/30 rounded-xl focus:ring-2 focus:ring-tech-cyan focus:border-transparent transition-all text-white placeholder-slate-500 font-inter"
              placeholder="What challenge awaits?"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-tech-cyan mb-2 font-cinzel tracking-wide">Deadline</label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm(prev => ({ ...prev, dueDate: e.target.value }))}
                className="w-full px-4 py-3 bg-void-900/50 border border-tech-cyan/30 rounded-xl focus:ring-2 focus:ring-tech-cyan focus:border-transparent transition-all text-white font-inter"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-tech-cyan mb-2 font-cinzel tracking-wide">Priority</label>
              <select
                value={form.priority}
                onChange={(e) => setForm(prev => ({ ...prev, priority: e.target.value as 'High' | 'Medium' | 'Low' }))}
                className="w-full px-4 py-3 bg-void-900/50 border border-tech-cyan/30 rounded-xl focus:ring-2 focus:ring-tech-cyan focus:border-transparent transition-all text-white font-inter"
              >
                {priorities.map(priority => (
                  <option key={priority} value={priority} className="bg-void-900 text-white">{priority}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-tech-cyan mb-2 font-cinzel tracking-wide">XP Reward</label>
            <input
              type="number"
              min="1"
              max="100"
              value={form.points}
              onChange={(e) => setForm(prev => ({ ...prev, points: parseInt(e.target.value) }))}
              className="w-full px-4 py-3 bg-void-900/50 border border-tech-cyan/30 rounded-xl focus:ring-2 focus:ring-tech-cyan focus:border-transparent transition-all text-white font-inter"
            />
            <p className="text-xs text-slate-400 mt-1 font-inter">
              XP awarded upon completion
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-tech-magenta to-purple-600 text-white py-3 px-6 rounded-xl hover:from-magenta-500 hover:to-purple-500 transition-all duration-300 font-bold flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,0,255,0.3)] hover:shadow-[0_0_25px_rgba(255,0,255,0.5)] font-cinzel tracking-wider transform hover:-translate-y-0.5"
          >
            <Plus size={20} />
            Add Quest
          </button>
        </form>
      </div>

      {/* Todo List */}
      <div className="bg-void-950/40 border border-white/5 rounded-2xl p-8 shadow-xl backdrop-blur-md">
        <h3 className="text-2xl font-bold text-gold-200 mb-6 font-cinzel flex items-center gap-2">
          <CheckSquare className="w-6 h-6 text-gold-400" />
          Active Quests
        </h3>
        <div className="space-y-4">
          {sortedTodos.length > 0 ? (
            sortedTodos.map((todo) => {
              const styles = getPriorityStyles(todo.priority);
              const isCompleted = todo.status === 'Completed';

              return (
                <div key={todo.id} className={`${styles.bg} border rounded-xl p-5 border-l-4 ${styles.border} hover:shadow-lg transition-all ${isCompleted ? 'opacity-50 grayscale' : 'hover:scale-[1.01]'}`}>
                  <div className="flex items-center justify-between">
                    <div className={`flex-1 ${isCompleted ? 'line-through decoration-slate-500' : ''}`}>
                      <h4 className={`font-bold text-lg ${isCompleted ? 'text-slate-500' : 'text-white'} font-cinzel`}>{todo.task}</h4>
                      <div className="flex items-center space-x-3 mt-2 text-sm font-inter">
                        <span className="text-slate-400">
                          Due: {format(new Date(todo.dueDate), 'MMM dd, yyyy')}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${styles.badge}`}>
                          {todo.priority}
                        </span>
                        <span className="bg-void-900/80 border border-tech-gold/30 text-tech-gold px-2 py-0.5 rounded text-xs font-bold">
                          {todo.points} XP
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 ml-4">
                      {!isCompleted && (
                        <button
                          onClick={() => handleComplete(todo.id)}
                          className="p-2 bg-emerald-900/30 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 hover:shadow-[0_0_10px_rgba(16,185,129,0.3)] rounded-lg transition-all"
                          title="Complete Quest"
                        >
                          <Check size={20} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(todo.id)}
                        className="p-2 bg-red-900/30 text-red-400 border border-red-500/30 hover:bg-red-500/20 hover:shadow-[0_0_10px_rgba(239,68,68,0.3)] rounded-lg transition-all"
                        title="Abandon Quest"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-slate-500 border-2 border-dashed border-slate-800 rounded-xl">
              <CheckSquare className="w-16 h-16 mx-auto mb-4 text-slate-700" />
              <p className="font-cinzel text-lg">No active quests. The realm is at peace... for now.</p>
              <p className="text-sm mt-2 font-inter">Add a new quest above to begin your adventure.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}