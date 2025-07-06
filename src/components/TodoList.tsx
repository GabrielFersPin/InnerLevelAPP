import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { showAlert, showConfetti } from '../utils/notifications';
import { CheckSquare, Plus, Trash2, Check } from 'lucide-react';
import { format } from 'date-fns';

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
    showAlert(`New to-do item added: ${form.task}`);
    
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
      comment: `Completed to-do item: ${todo.task}`
    };

    dispatch({ type: 'COMPLETE_TODO', payload: { todoId, task: newTask } });
    showConfetti();
    showAlert(`Task completed: ${todo.task} (+${todo.points} points)`);
  };

  const handleDelete = (todoId: number) => {
    if (confirm('Are you sure you want to delete this to-do item?')) {
      dispatch({ type: 'DELETE_TODO', payload: todoId });
      showAlert('To-do item deleted successfully!');
    }
  };

  const getPriorityColors = (priority: string) => {
    switch (priority) {
      case 'High': return {
        bg: 'bg-red-50 border-red-200',
        text: 'text-red-700 bg-red-100',
        border: 'border-l-red-500'
      };
      case 'Medium': return {
        bg: 'bg-yellow-50 border-yellow-200',
        text: 'text-yellow-700 bg-yellow-100',
        border: 'border-l-yellow-500'
      };
      case 'Low': return {
        bg: 'bg-green-50 border-green-200',
        text: 'text-green-700 bg-green-100',
        border: 'border-l-green-500'
      };
      default: return {
        bg: 'bg-gray-50 border-gray-200',
        text: 'text-gray-700 bg-gray-100',
        border: 'border-l-gray-500'
      };
    }
  };

  const sortedTodos = state.todos.sort((a, b) => {
    const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">📋 To-Do List</h2>
        <p className="text-gray-600 mb-4">
          Keep track of your tasks and earn points for completing them!
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h4 className="text-blue-800 font-semibold mb-2">🎯 Priority Levels:</h4>
          <div className="space-y-1 text-sm text-blue-700">
            <div>🔴 <strong>High:</strong> Important and urgent</div>
            <div>🟠 <strong>Medium:</strong> Important but not urgent</div>
            <div>🟢 <strong>Low:</strong> Nice to have</div>
          </div>
        </div>
      </div>

      {/* Add New Todo */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center mb-6">
          <Plus className="w-6 h-6 text-purple-600 mr-2" />
          <h3 className="text-xl font-bold text-gray-800">Add New To-Do Item</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Task Description</label>
            <input
              type="text"
              value={form.task}
              onChange={(e) => setForm(prev => ({ ...prev, task: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="What needs to be done?"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm(prev => ({ ...prev, dueDate: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={form.priority}
                onChange={(e) => setForm(prev => ({ ...prev, priority: e.target.value as 'High' | 'Medium' | 'Low' }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                {priorities.map(priority => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Completion Points</label>
            <input
              type="number"
              min="1"
              max="100"
              value={form.points}
              onChange={(e) => setForm(prev => ({ ...prev, points: parseInt(e.target.value) }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
            <p className="text-sm text-gray-500 mt-1">
              Points awarded when you complete this task
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-6 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 font-medium flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Add To-Do Item
          </button>
        </form>
      </div>

      {/* Todo List */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Your To-Do List</h3>
        <div className="space-y-4">
          {sortedTodos.length > 0 ? (
            sortedTodos.map((todo) => {
              const colors = getPriorityColors(todo.priority);
              const isCompleted = todo.status === 'Completed';
              
              return (
                <div key={todo.id} className={`${colors.bg} border rounded-xl p-4 border-l-4 ${colors.border} hover:shadow-md transition-all ${isCompleted ? 'opacity-60' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className={`flex-1 ${isCompleted ? 'line-through' : ''}`}>
                      <h4 className="font-semibold text-gray-800">{todo.task}</h4>
                      <div className="flex items-center space-x-3 mt-2 text-sm">
                        <span className="text-gray-600">
                          Due: {format(new Date(todo.dueDate), 'MMM dd, yyyy')}
                        </span>
                        <span className="text-gray-600">Status: {todo.status}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors.text}`}>
                          {todo.priority}
                        </span>
                        <span className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-2 py-1 rounded-full text-xs font-medium">
                          {todo.points} pts
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {!isCompleted && (
                        <button
                          onClick={() => handleComplete(todo.id)}
                          className="p-2 bg-green-100 text-green-600 hover:bg-green-200 rounded-lg transition-colors"
                          title="Complete task"
                        >
                          <Check size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(todo.id)}
                        className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors"
                        title="Delete task"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-gray-500">
              <CheckSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>No to-do items yet. Add your first task above!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}