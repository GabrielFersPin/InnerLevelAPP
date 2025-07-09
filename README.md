InnerLevelAPP

# InnerLevel App

A comprehensive personal productivity and wellness tracking application built with React, TypeScript, and Tailwind CSS. Track your habits, manage goals, monitor wellbeing, and gamify your personal development journey.

## Features

### 🎯 **Goal Management**
- Create and track personal and professional goals
- Set target dates and monitor progress
- Categorize goals by type (Professional, Personal, Health, etc.)

### 📊 **Habit Tracking**
- Track daily habits across different categories
- Earn points for completing habits
- Built-in habits for professional development, self-care, and wellness

### ✅ **Task Management**
- Create and manage todo lists
- Complete tasks to earn points
- Track task completion history

### 🏆 **Gamification System**
- Earn points for completing habits and tasks
- Redeem points for custom rewards
- Track your progress streaks
- Weekly and total point summaries

### 💚 **Wellbeing Monitoring**
- Log emotional states and moods
- Track wellness metrics over time
- Monitor mental health patterns

### 📈 **Analytics Dashboard**
- Visual charts showing progress over time
- Streak tracking and statistics
- Point accumulation analysis
- Habit completion trends

### 🎁 **Rewards System**
- Create custom rewards to redeem with earned points
- Track redeemed rewards history
- Motivate yourself with personalized incentives

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Chart.js with react-chartjs-2
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Build Tool**: Vite
- **Development**: ESLint, TypeScript compiler

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd InnerLevelAPP
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Project Structure

```
src/
├── components/           # React components
│   ├── Analytics.tsx    # Analytics dashboard
│   ├── Dashboard.tsx    # Main dashboard view
│   ├── Goals.tsx        # Goal management
│   ├── Habits.tsx       # Habit tracking
│   ├── LogActivity.tsx  # Activity logging
│   ├── Rewards.tsx      # Rewards system
│   ├── Sidebar.tsx      # Navigation sidebar
│   ├── TodoList.tsx     # Task management
│   └── Wellbeing.tsx    # Wellbeing tracking
├── context/
│   └── AppContext.tsx   # Global state management
├── types/
│   └── index.ts         # TypeScript type definitions
├── utils/
│   └── notifications.ts # Notification utilities
└── types.ts             # Additional type definitions
```

## Features Overview

### Dashboard
The main dashboard provides an overview of your progress including:
- Total points earned
- Weekly point summary
- Current streak
- Recent activity

### Data Persistence
The app uses localStorage to persist your data across sessions, ensuring your progress is saved locally.

### Responsive Design
Built with Tailwind CSS for a responsive design that works on desktop and mobile devices.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting and tests
5. Submit a pull request

## License

This project is private and not currently licensed for public use.