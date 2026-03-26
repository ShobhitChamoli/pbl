# AuditX - PBL Project Evaluation System

A comprehensive web-based platform for managing and evaluating Project-Based Learning (PBL) submissions with AI-powered assessment capabilities.

## 🚀 Features

- **Multi-Role System**: Admin, Mentor, and Student dashboards
- **Project Submission**: Students can submit projects with team details and repository links
- **Automated Mentor Assignment**: Round-robin allocation based on course and workload
- **AI-Powered Viva Generation**: Automatic technical question generation using Google Gemini
- **Evaluation Management**: Comprehensive evaluation system with multiple criteria
- **Notification System**: Real-time notifications for deadlines and updates
- **Admin Controls**: System management, user creation, and evaluation period control
- **Cloud Database**: Firebase Firestore for scalable, production-ready data storage

## 🛠️ Tech Stack

### Frontend
- **React** (v19.2.3) with Vite
- **React Router** for navigation
- **Axios** for API calls
- **Framer Motion** for animations
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **Firebase Firestore** for cloud database
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Google Generative AI** (Gemini) for AI features

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account (for Firestore)
- Google AI API key (optional, for AI features)

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd auditx
```

### 2. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database
3. Generate service account credentials (Project Settings → Service Accounts → Generate New Private Key)
4. Download the JSON key file

### 4. Environment Configuration

#### Server Environment Variables

Create `/server/.env`:

```env
PORT=5001
JWT_SECRET=your_super_secret_jwt_key_here
OPENAI_API_KEY=your_openai_api_key_here

# Firebase Configuration
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
```

> **Note**: Get Firebase credentials from the downloaded service account JSON file.

#### Client Environment Variables

Create `/client/.env`:

```env
VITE_API_URL=http://localhost:5001
```

For production, update to your deployed API URL.

## 🚀 Running Locally

### Development Mode

```bash
# Terminal 1 - Start backend server
cd server
npm run dev

# Terminal 2 - Start frontend
cd client
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Default Admin Credentials

- **Email**: `admin@auditx.com`
- **Password**: `123456`


## 📁 Project Structure

```
auditx/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── modules/       # Feature modules (Auth, Dashboard, etc.)
│   │   ├── context/       # React context providers
│   │   └── App.jsx        # Main app component
│   └── package.json
│
├── server/                # Node.js backend
│   ├── config/           # Configuration files
│   │   └── firebaseConfig.js  # Firebase initialization
│   ├── controllers/      # Route controllers
│   ├── data/            # Database layer
│   │   └── firebaseDb.js # Firestore abstraction
│   ├── middleware/      # Express middleware
│   ├── routes/          # API routes
│   └── index.js         # Server entry point
│
├── vercel.json          # Vercel deployment config
├── DEPLOYMENT.md        # Deployment guide
└── README.md           # This file
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `GET /api/auth/mentors` - Get all mentors
- `GET /api/auth/courses` - Get public courses

### Projects
- `POST /api/projects` - Submit project (Student)
- `GET /api/projects` - Get all projects (Admin/Mentor)
- `GET /api/projects/me` - Get my project (Student)
- `GET /api/projects/:id` - Get project by ID

### Evaluations
- `POST /api/evaluations` - Submit evaluation (Mentor)
- `GET /api/evaluations/benchmarks` - Get evaluation statistics
- `POST /api/evaluations/session` - Create viva session

### Admin
- `GET /api/admin/stats` - Get dashboard statistics
- `POST /api/admin/users` - Create user
- `POST /api/admin/courses` - Create course
- `POST /api/admin/reset` - Reset system (preserves admins & courses)
- `POST /api/admin/evaluation-period` - Create evaluation period
- `POST /api/admin/extend-deadline` - Extend deadline
- `POST /api/admin/send-reminder` - Send reminders

### Notifications
- `GET /api/notifications` - Get my notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `DELETE /api/notifications/:id` - Delete notification

### AI
- `POST /api/ai/generate-viva` - Generate viva questions (requires Gemini API key)

## 🎯 User Roles

### Admin
- Manage users (create students, mentors)
- Create courses and batches
- View all projects and evaluations
- Create evaluation periods
- Send notifications and reminders
- Reset system data

### Mentor
- View assigned projects
- Evaluate student projects
- Generate AI-powered viva questions
- Create viva sessions
- Provide feedback

### Student
- Submit project details
- View assigned mentor
- Check evaluation status
- Receive notifications
- View evaluation results

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Role-based access control
- Environment variable protection
- Firebase Admin SDK for secure database access

## 📊 Database Schema

### Collections

- **users**: User accounts (admin, mentor, student)
- **courses**: Academic courses and batches
- **projects**: Student project submissions
- **evaluations**: Project evaluations and marks
- **notifications**: User notifications
- **vivaSessions**: Scheduled viva sessions
- **feedbacks**: Student feedback (optional)
- **settings**: System settings (evaluation periods)

See [implementation_plan.md](./implementation_plan.md) for detailed schema.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🐛 Troubleshooting

### Firebase Connection Issues
- Verify all three Firebase environment variables are set
- Check that private key is properly formatted with `\n` characters
- Ensure Firestore is enabled in Firebase Console

### CORS Errors
- Update `VITE_API_URL` to match your deployed backend URL
- Check CORS configuration in `server/index.js`

### Build Errors
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version (should be v16+)

For more troubleshooting, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## 📞 Support

For issues and questions:
1. Check existing issues in the repository
2. Review [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment help
3. Create a new issue with detailed description

## 🎓 Future Enhancements

- [ ] Mobile app (React Native)
- [ ] Real-time notifications with WebSockets
- [ ] Advanced analytics dashboard
- [ ] Batch evaluation features
- [ ] Export reports (PDF/Excel)
- [ ] Integration with GitHub API for repository analysis
- [ ] Video viva sessions
- [ ] Peer review system

---

**Built with ❤️ for enhancing PBL education**
