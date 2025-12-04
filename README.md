# SkillBox - Advanced Learning Management System

Welcome to SkillBox, a comprehensive learning management system built with React Native and Expo. This application provides an immersive learning experience with AI-powered features, gamification, social learning, and advanced productivity tools.

## 🚀 Features

### Core Learning Management
- **Course Management**: Complete course creation, enrollment, and progress tracking
- **Interactive Lessons**: Video lessons, quizzes, assignments, and practical exercises
- **User Profiles**: Student and instructor dashboards with detailed analytics
- **Real-time Progress Tracking**: Advanced analytics and learning insights

### 🤖 AI-Powered Features
- **AI Study Assistant**: Intelligent tutoring system with contextual help
- **Smart Notes**: AI-enhanced note-taking with auto-summarization
- **Personalized Recommendations**: Course suggestions based on learning patterns
- **Cognitive Load Monitoring**: Bio-cognitive feedback for optimal learning

### 🎮 Gamification System
- **Achievement System**: Unlock badges and rewards for learning milestones
- **XP Points**: Earn experience points for completed activities
- **Learning Streaks**: Maintain daily learning habits
- **Leaderboards**: Compete with peers in a friendly environment
- **Skill Trees**: Visual progression paths for different subjects

### 🧠 Productivity Tools
- **Pomodoro Timer**: Focus sessions with break reminders
- **Study Scheduler**: AI-optimized study planning
- **Goal Setting**: SMART goals with progress tracking
- **Time Analytics**: Detailed learning time insights

### 👥 Social Learning
- **Study Groups**: Collaborative learning spaces
- **Discussion Forums**: Subject-specific communities
- **Peer Reviews**: Student-to-student feedback system

## 🏗️ Technical Architecture

### Frontend
- **React Native 0.75+** with Expo SDK 51
- **TypeScript** for type safety and better developer experience
- **Expo Router** for navigation with typed routes
- **NativeWind** for styling with Tailwind CSS
- **Zustand** for lightweight state management

### Backend & Services
- **Supabase** for backend infrastructure
  - PostgreSQL database with Row Level Security
  - Real-time subscriptions
  - Authentication & user management
  - File storage for media content
- **OpenAI API** for AI-powered features
- **Expo Notifications** for push notifications

### Key Dependencies
- **React Hook Form + Zod** for form validation
- **Expo AV** for video/audio playback
- **Expo Camera** for content creation
- **React Native Reanimated** for smooth animations
- **Lucide React Native** for consistent iconography

## 📱 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (Mac) or Android Emulator

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SkillBOx
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Fill in your Supabase and other API keys
   ```

4. **Start the development server**
   ```bash
   npx expo start
   ```

5. **Run on device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app for physical device

### Environment Configuration

Create a `.env` file with the following variables:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_OPENAI_API_KEY=your_openai_api_key
```

## 🏗️ Project Structure

```
SkillBOx/
├── app/                    # App screens (Expo Router)
│   ├── (auth)/            # Authentication screens
│   ├── (tabs)/            # Main tab navigation
│   ├── (student)/         # Student-specific screens
│   └── (creator)/         # Creator-specific screens
├── components/            # Reusable UI components
│   ├── ui/                # Base UI components
│   ├── auth/              # Authentication components
│   ├── learning/          # Learning-specific components
│   └── common/            # Shared components
├── lib/                   # Utilities and configurations
├── hooks/                 # Custom React hooks
├── services/              # API and external services
├── types/                 # TypeScript type definitions
├── constants/             # App constants and themes
└── context/               # React Context providers
```

## 🧪 Testing

Run the test suite:

```bash
npm test
```

For end-to-end testing:

```bash
npm run test:e2e
```

## 🚀 Build & Deployment

### Development Build
```bash
npx expo build:android --type development-build
npx expo build:ios --type development-build
```

### Production Build
```bash
npx expo build:android --type app-bundle
npx expo build:ios --type archive
```

### Expo Application Services (EAS)
```bash
npm install -g eas-cli
eas build --platform android
eas build --platform ios
```

## 📋 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Use TypeScript for all new code
- Follow the existing ESLint configuration
- Use conventional commit messages
- Add tests for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

- 📧 **Email**: support@skillbox.app
- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/skillbox/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/yourusername/skillbox/discussions)

---

<p align="center">
  <strong>SkillBox - Empowering Learning Through Technology</strong>
</p>