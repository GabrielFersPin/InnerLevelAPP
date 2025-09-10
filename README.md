# InnerLevel App 🎮

![GitHub last commit](https://img.shields.io/github/last-commit/tuusuario/InnerLevelAPP)
![License](https://img.shields.io/github/license/tuusuario/InnerLevelAPP)
![Made with](https://img.shields.io/badge/Made%20with-❤️-ff69b4)

**Level up your real life, not just your avatar.**

_InnerLevel_ is a gamified personal development app that transforms your everyday goals into quests, your habits into stats, and your progress into power-ups.

## 🌟 Why InnerLevel?

InnerLevel was built to solve a personal need: finding a motivational system that blends personal well-being with goal tracking using game mechanics and AI. 

It's also an opportunity to demonstrate:
- My full-stack development skills (React, TypeScript, Tailwind)
- Design thinking applied to user motivation
- AI integration for smart goal planning
- Data persistence and gamified UX

Feel free to reach out if you'd like to contribute or discuss collaboration!

## Features

### 🎮 Core RPG Features
- 🏠 **Character Hub** - Your personal dashboard and adventure overview
- 🎴 **Card Deck** - Manage your collection of action cards with rarity system
- 🧠 **Mystic Forge** - AI-powered card generation for personalized goals
- ⚔️ **Training Ground** - Execute cards with Pomodoro timer and gain XP
- 🏆 **Character Sheet** - Track stats, levels, and character progression
- ⚙️ **Guild Settings** - Configure your gaming experience
- 🎭 **Character Classes** - 5 unique classes: Strategist, Warrior, Creator, Connector, Sage

### 🤖 AI-Powered Features
- **Smart Goal Planning** - AI generates personalized action card sequences
- **Contextual Recommendations** - Cards tailored to your character class and situation
- **Dynamic Card Generation** - Create goal-specific cards with detailed actions
- **Intelligent Quota Management** - 8 AI generations per month with upgrade options
- **Token Optimization** - 2000 tokens per request for complete responses

### 💳 Payment & Subscription System
- **Stripe Integration** - Secure payment processing
- **Premium Upgrade** - $9.99/month for unlimited AI generations
- **Quota Management** - Automatic payment modal when limits reached
- **Webhook Handling** - Real-time payment success processing
- **Usage Tracking** - Monitor generations and token consumption

### 👤 User Management
- **Supabase Authentication** - Secure email/password login system
- **User Profiles** - Persistent character and progress data
- **Session Management** - Automatic login/logout handling
- **Data Persistence** - All progress saved to cloud database
- **Character Onboarding** - Personality-based class selection

### 🎯 Gamification Elements
- **Energy System** - 100 energy points with daily regeneration
- **Experience Points** - Level progression and skill development
- **Rewards System** - Point-based reward redemption
- **Achievement Tracking** - Progress milestones and accomplishments
- **Card Rarity System** - Common, rare, epic, and legendary cards

### 📊 Personal Development Tools
- **Activity Logging** - Track daily achievements and progress
- **Habit Management** - Build and maintain positive habits
- **Goal Tracking** - AI-powered goal setting and monitoring
- **Progress Analytics** - Visualize your character development
- **Reward Redemption** - Motivational reward system

## 🧰 Technologies Used

### Frontend Core
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS 3.0 with custom UI components
- **Build Tool**: Vite for faster development and optimized builds
- **State Management**: React Context API + Reducers

### Backend & API
- **Server**: Node.js + Express
- **AI Integration**: OpenAI GPT-4o-mini API
- **Payment Processing**: Stripe API integration
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)

### AI & Intelligence
- **AI Engine**: OpenAI GPT-4o-mini
- **Token Management**: 2000 tokens per request
- **Smart Features**: 
  - Goal planning assistance
  - Character class-specific recommendations
  - Dynamic card generation
  - Contextual action sequences

### Data Management
- **Cloud Storage**: Supabase PostgreSQL database
- **Real-time Sync**: Automatic data persistence
- **User Data**: Character progress, cards, goals, achievements
- **Type Safety**: Strong TypeScript typing throughout

### Payment & Monetization
- **Payment Gateway**: Stripe Checkout
- **Subscription Model**: $9.99/month premium tier
- **Quota System**: 8 AI generations per month (free tier)
- **Webhook Processing**: Real-time payment success handling

### Development Tools
- **IDE**: VS Code with recommended extensions
- **Testing**: Jest + React Testing Library
- **Linting**: ESLint + Prettier
- **Version Control**: Git + GitHub
- **Hot Reload**: Nodemon for backend development

## Getting Started

1. Clone the repository
```bash
# Clone the repository
git clone <repository-url>
cd InnerLevelAPP

# Install dependencies
npm install
cd server && npm install && cd ..

# Set up environment variables
cp .env.example .env
# Add your Supabase, OpenAI, and Stripe API credentials

# Start both frontend and backend servers
npm run dev:all
```

### Environment Variables Required
```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI API
OPENAI_API_KEY=your_openai_api_key

# Stripe Configuration (for payments)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PRICE_ID=your_stripe_price_id
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Server Configuration
FRONTEND_URL=http://localhost:5176
MONTHLY_GENERATION_LIMIT=8
MAX_TOKENS_PER_REQUEST=2000
```

### Production Deployment
```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to your hosting platform
npm run deploy
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details on how to submit pull requests, report issues, and suggest improvements.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎮 Start Your Quest Today!

Ready to transform your life into an epic adventure? Create your account and discover which character class matches your personality. Your journey to becoming the hero of your own story starts now!

*"Every master was once a beginner. Every legend was once just a dream."*

## 🖼️ Demo

![InnerLevel Screenshot](./screenshots/dashboard.png)

Try the live demo 👉 [https://innerlevel-demo.vercel.app](https://innerlevel-demo.vercel.app)
