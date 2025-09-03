# React Authentication with Custom Backend

A complete React authentication system built with custom authentication logic, featuring sign up, sign in, email verification, forgot password, and a protected dashboard.

## Features

- ✅ User registration with email verification
- ✅ Secure sign in
- ✅ Email verification with OTP
- ✅ **Forgot password functionality**
- ✅ **Password reset with verification code**
- ✅ Protected routes
- ✅ User dashboard with profile information
- ✅ Sign out functionality
- ✅ Responsive design with modern UI
- ✅ **Custom authentication system (no external dependencies)**

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd class10
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables** (see Environment Setup below)

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## Environment Setup

### 1. Create Environment File

Create a `.env` file in the root directory:

```bash
# Copy the example file
cp .env.example .env
```

### 2. Configure OpenAI API Key

Edit the `.env` file and add your OpenAI API key:

```env
# OpenAI Configuration
VITE_OPENAI_API_KEY=meas

# API Configuration
VITE_OPENAI_API_URL=https://api.openai.com/v1

# App Configuration
VITE_APP_NAME=Rosie AI
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_REAL_AI=true
VITE_ENABLE_DEMO_MODE=true
```

### 3. Get Your OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key (starts with "sk-")
5. Paste it in your `.env` file

### 4. Restart Development Server

After adding the API key, restart your development server:

```bash
npm run dev
```

## Project Structure

```
src/
├── contexts/
│   └── AuthContext.tsx        # Custom authentication context
├── pages/
│   ├── auth/
│   │   ├── SignIn.tsx          # Sign in form
│   │   ├── SignUp.tsx          # Sign up form
│   │   ├── EmailVerification.tsx # Email verification
│   │   ├── ForgotPassword.tsx  # Forgot password form
│   │   └── ResetPassword.tsx   # Password reset form
│   └── Dashboard.tsx           # Protected dashboard
├── layouts/
│   └── AuthLayouts.tsx         # Authentication layout
├── router/
│   └── index.tsx               # Route configuration
├── sass/
│   ├── _auth.scss              # Authentication styles
│   ├── _colors.scss            # Color variables
│   └── index.scss              # Main styles
├── types/
│   └── otp-input-react.d.ts    # Type declarations
└── main.tsx                    # App entry point
```

## Authentication Flow

1. **Sign Up**: User creates account with email, username, and password
2. **Email Verification**: System generates verification code (stored in localStorage for demo)
3. **Verification**: User enters the code to verify their email
4. **Sign In**: User can now sign in with their credentials
5. **Dashboard**: Authenticated users access protected dashboard
6. **Sign Out**: Users can sign out and return to sign in page

### Password Recovery Flow

1. **Forgot Password**: User requests password reset via email
2. **Reset Code**: System generates reset code (stored in localStorage for demo)
3. **Reset Password**: User enters code and new password
4. **Sign In**: User can sign in with new password

## Technologies Used

- **React 19** - Modern React with hooks
- **TypeScript** - Type safety and better development experience
- **Custom Auth Context** - Built-in authentication system
- **React Router** - Client-side routing
- **Sass** - Advanced CSS preprocessing
- **Vite** - Fast build tool and dev server
- **localStorage** - Data persistence (demo purposes)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Security Features

- Protected routes using custom authentication context
- Automatic redirect to sign in for unauthenticated users
- Secure password handling
- Email verification required for account activation
- Session management with localStorage

## Demo Notes

This is a demo application that uses localStorage to simulate a backend:

- User data is stored in browser localStorage
- Verification codes are generated and stored locally
- In production, replace with real API calls and backend services

## Customization

- Modify styles in `src/sass/` directory
- Update authentication logic in `src/contexts/AuthContext.tsx`
- Customize dashboard layout and information display
- Add additional protected routes as needed

## Troubleshooting

- **Build errors**: Verify all dependencies are installed correctly
- **Authentication issues**: Check browser console for errors
- **Type errors**: Ensure TypeScript is properly configured

## Support

For project-specific issues, check the repository issues or contact the maintainer.
