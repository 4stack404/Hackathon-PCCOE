import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import { LoadingProvider } from './contexts/LoadingContext';
import { AppProvider } from './context/AppContext';
import LoginDebug from './components/LoginDebug';
import ScrollToTop from './components/common/ScrollToTop';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Box } from '@mui/material';
import ChatBot from './components/chatbot/ChatBot';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Appointments from './pages/Appointments';
import WeekPage from './pages/WeekPage';
import About from './pages/About';
import Care from './pages/Care';
import CareDetails from './pages/CareDetails';
import Community from './pages/Community';
import Diet from './pages/Diet';
import AuthPage from './pages/AuthPage';
import LoadingExample from './pages/LoadingExample';
import ResetPassword from './pages/ResetPassword';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import RouteChangeLoader from './components/common/RouteChangeLoader';
import DietPlanning from './pages/DietPlanning';
import HealthyRecipes from './pages/HealthyRecipes';
import MealLogging from './pages/MealLogging';
import PrenatalCare from './pages/care/PrenatalCare';
import WeeklyTips from './pages/care/prenatal/WeeklyTips';
import PrenatalInfo from './pages/care/prenatal/PrenatalInfo';
import PrenatalExercises from './pages/care/prenatal/PrenatalExercises';
import PrenatalDiet from './pages/care/prenatal/PrenatalDiet';
import PrenatalSymptoms from './pages/care/prenatal/PrenatalSymptoms';
import PrenatalSelfCare from './pages/care/prenatal/PrenatalSelfCare';
import LaborPrep from './pages/care/prenatal/LaborPrep';

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#5e35b1', // Deep purple
    },
    secondary: {
      main: '#ec407a', // Pink
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <LoadingProvider>
          <AppProvider>
            <Box sx={{ 
              bgcolor: '#FFF5F8',
              minHeight: '100vh'
            }}>
              <Router>
                <ScrollToTop />
                <Navbar />
                <RouteChangeLoader />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/appointments" element={<Appointments />} />
                  <Route path="/appointments/new" element={<Appointments newAppointment={true} />} />
                  <Route path="/care" element={<Care />} />
                  <Route path="/care/:type" element={<CareDetails />} />
                  <Route path="/week/:weekNumber" element={<WeekPage />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/debug-login" element={<LoginDebug />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/diet" element={<Diet />} />
                  <Route path="/diet-planning" element={<DietPlanning />} />
                  <Route path="/healthy-recipes" element={<HealthyRecipes />} />
                  <Route path="/meal-logging" element={<MealLogging />} />
                  <Route path="/loading-example" element={<LoadingExample />} />
                  <Route path="/care/prenatal" element={<PrenatalCare />} />
                  <Route path="/care/prenatal/weekly-tips" element={<WeeklyTips />} />
                  <Route path="/care/prenatal/information" element={<PrenatalInfo />} />
                  <Route path="/care/prenatal/exercises" element={<PrenatalExercises />} />
                  <Route path="/care/prenatal/diet" element={<PrenatalDiet />} />
                  <Route path="/care/prenatal/symptoms" element={<PrenatalSymptoms />} />
                  <Route path="/care/prenatal/self-care" element={<PrenatalSelfCare />} />
                  <Route path="/care/prenatal/labor-prep" element={<LaborPrep />} />
                </Routes>
                <Footer />
                <ChatBot />
                <ToastContainer
                  position="top-right"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="light"
                />
              </Router>
            </Box>
          </AppProvider>
        </LoadingProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;