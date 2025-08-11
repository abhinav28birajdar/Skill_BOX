# SkillBox - The Omni-Learner AI Ecosystem

## Recent Updates (August 12, 2025)

- Fixed all TypeScript errors in the codebase
- Enhanced TouchableCard component with proper theme integration and padding props
- Added missing color properties to Theme.ts (accent, textPrimary, card, cardSecondary, star, starEmpty)
- Updated Button and Text components to use correct theme properties
- Added missing properties to database types (NotificationType, Class, SignUpData, etc.)
- Fixed SearchBar component to use "outline" instead of "outlined" variant
- Fixed all imports and interfaces for proper type checking
- Fixed role properties in authentication and profile components

For a complete summary of all fixes, see [FIXES_SUMMARY.md](./FIXES_SUMMARY.md)

![SkillBox Logo](assets/images/icon.png)

A comprehensive learning platform built with React Native, Expo, and Supabase that combines traditional education with cutting-edge AI, AR/VR, and real-time features.

## 🚀 Features

### Core Learning Platform
- **Multi-format Content**: Videos, documents, interactive quizzes, AR/VR experiences
- **Live Classes**: Real-time one-on-one and group learning sessions
- **Course Management**: Structured learning paths with modules and lessons
- **Progress Tracking**: Detailed analytics and completion tracking
- **Skill-based Learning**: Organized by skills and difficulty levels

### Advanced Features
- **AI-Powered Recommendations**: Personalized content suggestions
- **Real-time Chat & Notifications**: Instant messaging and updates
- **Social Learning**: Follow creators, comments, reviews, and community features
- **Teacher Tools**: Content creation, analytics, and student management
- **Multi-language Support**: International content and interface
- **Offline Support**: Download content for offline viewing

### UI/UX Excellence
- **Modern Design**: Clean, responsive interface with dark/light themes
- **Native Performance**: Optimized for both iOS and Android
- **Accessibility**: Full screen reader and accessibility support
- **Smooth Animations**: Fluid transitions and micro-interactions

## 🛠 Tech Stack

### Frontend
- **React Native 0.79.2** - Cross-platform mobile development
- **Expo SDK 53** - Development platform and tools
- **TypeScript** - Type-safe development
- **Expo Router** - File-based routing system
- **React Navigation** - Navigation library
- **Reanimated 3** - High-performance animations
- **TailwindCSS** - Utility-first styling
- **React Query** - Data fetching and caching

### Backend & Database
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Relational database
- **Row Level Security** - Data protection
- **Real-time Subscriptions** - Live updates
- **Authentication** - Built-in auth system
- **File Storage** - Media and document storage

### Additional Libraries
- **React Hook Form** - Form handling
- **Zustand** - State management
- **React Native Paper** - UI components
- **React Native Video** - Video playback
- **Three.js** - 3D graphics (for AR/VR)
- **React Native SVG** - Vector graphics

## 📱 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (Mac) or Android Studio
- Supabase account

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/skillbox.git
   cd skillbox
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your Supabase credentials:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. **Set up the database**
   - Create a new Supabase project
   - Run the SQL script from `database/consolidated_schema.sql` in your Supabase SQL editor
   - Enable the required extensions (uuid-ossp, pgcrypto, pg_trgm, etc.)

5. **Start the development server**
   ```bash
   npm start
   ```

6. **Run on device/simulator**
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Use Expo Go app to scan QR code for physical device

## 🗄️ Database Setup

### Automatic Setup
The database is automatically configured when you run the consolidated schema. The setup includes:

- **User Management**: Authentication, profiles, and permissions
- **Content System**: Learning materials, courses, and modules
- **Social Features**: Comments, reviews, and following
- **Progress Tracking**: User progress and analytics
- **Real-time Features**: Chat, notifications, and live updates

### Manual Setup Steps
1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Navigate to the SQL Editor in your Supabase dashboard
3. Copy and paste the contents of `database/consolidated_schema.sql`
4. Execute the SQL script
5. Verify tables are created in the Table Editor

### Environment Configuration
Update your `.env` file with the database credentials from Supabase:
- Project URL (EXPO_PUBLIC_SUPABASE_URL)
- Anonymous key (EXPO_PUBLIC_SUPABASE_ANON_KEY)
- Service role key (SUPABASE_SERVICE_ROLE_KEY)

## 🏗️ Project Structure

```
SkillBox/
├── app/                          # App router pages
│   ├── (auth)/                   # Authentication screens
│   ├── (tabs)/                   # Main tab navigation
│   ├── (creator)/                # Creator dashboard
│   ├── courses/                  # Course pages
│   ├── classes/                  # Live class pages
│   └── _layout.tsx               # Root layout
├── components/                   # Reusable components
│   ├── ui/                       # UI component library
│   └── demos/                    # Demo components
├── context/                      # React contexts
├── hooks/                        # Custom hooks
├── lib/                          # Utility libraries
├── services/                     # API services
├── types/                        # TypeScript definitions
├── constants/                    # App constants
├── assets/                       # Static assets
├── database/                     # Database schema
└── docs/                         # Documentation
```

## 🎯 Key Components

### Authentication System
- Secure user registration and login
- Profile management and verification
- Role-based access control (Student, Teacher, Admin)

### Content Management
- Multi-format content support
- Skill-based categorization
- Version control and publishing workflow

### Learning Experience
- Adaptive learning paths
- Progress tracking and analytics
- Interactive quizzes and assessments

### Teacher Tools
- Content creation and editing
- Student management
- Performance analytics

## 🔧 Development

### Available Scripts
- `npm start` - Start development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run on web
- `npm run lint` - Lint code
- `npm run type-check` - TypeScript checking
- `npm test` - Run tests

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting
- Consistent naming conventions

### Testing
- Jest for unit testing
- React Native Testing Library
- End-to-end testing setup

## 🚀 Deployment

### Mobile Apps
1. **iOS App Store**
   ```bash
   expo build:ios
   ```

2. **Google Play Store**
   ```bash
   expo build:android
   ```

### Web Application
```bash
expo export -p web
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation
- Follow the existing code style

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Common Issues

**Build Errors**: Clear cache with `npx expo start --clear`
**Database Connection**: Verify environment variables and Supabase settings
**Authentication Issues**: Check Supabase auth configuration

### Getting Help
- Check the [Issues](https://github.com/your-username/skillbox/issues) page
- Join our [Discord Community](https://discord.gg/skillbox)
- Email support: support@skillbox.com

## 🎉 Acknowledgments

- Expo team for the amazing development platform
- Supabase for the backend infrastructure
- React Native community for excellent libraries
- All contributors and testers

---

**Built with ❤️ by the SkillBox Development Team**
