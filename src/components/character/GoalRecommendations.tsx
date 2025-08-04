// filepath: /workspaces/InnerLevelAPP/src/components/character/GoalRecommendations.tsx
import React from 'react';

export default function GoalRecommendations({ character, existingGoals, onSelectGoal }) {
  const recommendedGoals = [
    {
      id: '1',
      title: 'Master Strategic Thinking',
      description: 'Develop advanced strategic thinking skills to excel in your role.',
      domain: 'career',
      category: 'skill-development',
      relatedSkills: ['planning', 'analysis'],
      classAlignment: ['strategist'],
    },
    {
      id: '2',
      title: 'Build a Morning Routine',
      description: 'Establish a consistent morning routine to boost productivity.',
      domain: 'personal-growth',
      category: 'habits',
      relatedSkills: ['discipline', 'focus'],
      classAlignment: ['strategist', 'warrior'],
    },
  ];

  // Filtrar objetivos ya existentes
  const filteredRecommendations = recommendedGoals.filter(
    (goal) => !existingGoals.some((existingGoal) => existingGoal.title === goal.title)
  );

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-amber-200">Recommended Goals</h2>
      {filteredRecommendations.length > 0 ? (
        filteredRecommendations.map((goal) => (
          <div
            key={goal.id}
            className="bg-slate-800 p-4 rounded-lg border border-slate-600 hover:bg-slate-700 cursor-pointer"
            onClick={() => onSelectGoal(goal)}
          >
            <h3 className="text-lg font-bold text-slate-200">{goal.title}</h3>
            <p className="text-slate-400">{goal.description}</p>
            <div className="text-sm text-slate-500 mt-2">
              Domain: {goal.domain} | Category: {goal.category}
            </div>
          </div>
        ))
      ) : (
        <p className="text-slate-400">No new recommendations available.</p>
      )}
    </div>
  );
}