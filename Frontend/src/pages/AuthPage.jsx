import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import LoginForm from '../components/LoginForm';
import UserProfile from '../components/UserProfile';

const AuthPage = () => {
  const { currentUser, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="auth-page">
      {currentUser ? <UserProfile /> : <LoginForm />}
    </div>
  );
};

export default AuthPage; 