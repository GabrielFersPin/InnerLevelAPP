import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export function Analytics() {
  const { state } = useAppContext();
  const [activeTab, setActiveTab] = useState<'productivity' | 'trends' | 'categories'>('productivity');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Productivity Analysis Data
  const getProductivityData = () => {
    const dayPoints: { [key: string]: number } = {};
    
    daysOfWeek.forEach(day => dayPoints[day] = 0);

    state.tasks.forEach(task => {
      const date = new Date(task.date);
      const dayName = daysOfWeek[date.getDay() === 0 ? 6 : date.getDay() - 1];
      dayPoints[dayName] += task.points;
    });

    return {
      labels: daysOfWeek,
      datasets: [{
        label: 'Points by Day of Week',
        data: Object.values(dayPoints),
        backgroundColor: 'rgba(102, 126, 234, 0.8)',
        borderColor: 'rgba(102, 126, 234, 1)',
        borderWidth: 1,
        borderRadius: 8,
      }]
    };
  };

  // Trends Data
  const getTrendsData = () => {
    const dailyData: { [key: string]: number } = {};
    
    state.tasks.forEach(task => {
      if (!dailyData[task.date]) {
        dailyData[task.date] = 0;
      }
      dailyData[task.date] += task.points;
    });

    const sortedDates = Object.keys(dailyData).sort();
    const points = sortedDates.map(date => dailyData[date]);

    return {
      labels: sortedDates.map(date => new Date(date).toLocaleDateString()),
      datasets: [{
        label: 'Daily Points',
        data: points,
        borderColor: 'rgba(102, 126, 234, 1)',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    };
  };

  // Categories Data
  const getCategoriesData = () => {
    const categoryData: { [key: string]: number } = {};
    
    state.tasks.forEach(task => {
      if (!categoryData[task.category]) {
        categoryData[task.category] = 0;
      }
      categoryData[task.category] += task.points;
    });

    const categories = Object.keys(categoryData);
    const points = Object.values(categoryData);
    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];

    return {
      labels: categories,
      datasets: [{
        data: points,
        backgroundColor: colors.slice(0, categories.length),
        borderWidth: 2,
        borderColor: '#fff'
      }]
    };
  };

  // Calculate insights
  const getProductivityInsights = () => {
    const data = getProductivityData();
    const dayPoints = data.datasets[0].data;
    const mostProductiveIndex = dayPoints.indexOf(Math.max(...dayPoints));
    const mostProductiveDay = data.labels[mostProductiveIndex];
    
    return {
      mostProductiveDay,
      points: dayPoints[mostProductiveIndex]
    };
  };

  const getActivityRate = () => {
    const dailyData: { [key: string]: number } = {};
    state.tasks.forEach(task => {
      if (!dailyData[task.date]) {
        dailyData[task.date] = 0;
      }
      dailyData[task.date] += task.points;
    });

    const sortedDates = Object.keys(dailyData).sort();
    if (sortedDates.length === 0) return 0;

    const activeDays = Object.keys(dailyData).length;
    const totalDays = Math.ceil(
      (new Date(sortedDates[sortedDates.length - 1]).getTime() - 
       new Date(sortedDates[0]).getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;
    
    return totalDays > 0 ? Math.round((activeDays / totalDays) * 100) : 0;
  };

  const getCategoryStats = () => {
    const categoryData: { [key: string]: number } = {};
    const categoryTasks: { [key: string]: number } = {};
    
    state.tasks.forEach(task => {
      if (!categoryData[task.category]) {
        categoryData[task.category] = 0;
        categoryTasks[task.category] = 0;
      }
      categoryData[task.category] += task.points;
      categoryTasks[task.category]++;
    });

    return Object.keys(categoryData).map(category => ({
      category,
      totalPoints: categoryData[category],
      avgPoints: Math.round(categoryData[category] / categoryTasks[category]),
      taskCount: categoryTasks[category]
    }));
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(102, 126, 234, 1)',
        borderWidth: 1,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        }
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        }
      }
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">📊 Performance Analytics</h2>
        <p className="text-gray-600 mb-4">
          Visualize your progress and identify patterns in your activities.
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h4 className="text-blue-800 font-semibold mb-2">📈 Track:</h4>
          <div className="grid grid-cols-2 gap-2 text-sm text-blue-700">
            <div>• Daily and weekly points</div>
            <div>• Most productive days</div>
            <div>• Category distribution</div>
            <div>• Activity streaks</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {[
          { id: 'productivity', label: 'Productivity Analysis' },
          { id: 'trends', label: 'Trends & Patterns' },
          { id: 'categories', label: 'Task Categories' }
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

      {/* Productivity Analysis Tab */}
      {activeTab === 'productivity' && (
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Daily Productivity Analysis</h3>
          {state.tasks.length > 0 ? (
            <>
              <div className="h-96 mb-6">
                <Bar data={getProductivityData()} options={chartOptions} />
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-blue-800">
                  📌 Your most productive day is <strong>{getProductivityInsights().mostProductiveDay}</strong> with {getProductivityInsights().points} total points!
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <p>No data available yet. Start logging activities to see your productivity patterns!</p>
            </div>
          )}
        </div>
      )}

      {/* Trends & Patterns Tab */}
      {activeTab === 'trends' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Trends & Patterns</h3>
            {state.tasks.length > 0 ? (
              <div className="h-96">
                <Line data={getTrendsData()} options={chartOptions} />
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📈</span>
                </div>
                <p>No data available yet. Start logging activities to see your trends!</p>
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">{getActivityRate()}%</div>
            <div className="text-gray-600 font-medium">Activity Rate</div>
          </div>
        </div>
      )}

      {/* Task Categories Tab */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Task Categories Analysis</h3>
            {state.tasks.length > 0 ? (
              <div className="h-96">
                <Doughnut 
                  data={getCategoriesData()} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom' as const
                      }
                    }
                  }} 
                />
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🍩</span>
                </div>
                <p>No data available yet. Start logging activities to see category breakdown!</p>
              </div>
            )}
          </div>

          {state.tasks.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h4 className="text-lg font-bold text-gray-800 mb-4">Category Statistics</h4>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 border">Category</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 border">Total Points</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 border">Avg Points</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 border">Tasks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getCategoryStats().map((stat) => (
                      <tr key={stat.category} className="hover:bg-gray-50">
                        <td className="px-4 py-3 border">{stat.category}</td>
                        <td className="px-4 py-3 border">{stat.totalPoints}</td>
                        <td className="px-4 py-3 border">{stat.avgPoints}</td>
                        <td className="px-4 py-3 border">{stat.taskCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}