import { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, signup, error } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setIsLoading(true);

    try {
      let result;
      
      // Use the API service through the AuthContext
      if (isLogin) {
        if (!email || !password) {
          setFormError('Please enter both email and password');
          setIsLoading(false);
          return;
        }
        
        result = await login({ email, password });
      } else {
        if (!name || !email || !password) {
          setFormError('Please fill in all fields');
          setIsLoading(false);
          return;
        }
        
        if (password.length < 6) {
          setFormError('Password must be at least 6 characters');
          setIsLoading(false);
          return;
        }
        
        result = await signup({ name, email, password });
      }

      if (!result.success) {
        setFormError(result.error || 'Authentication failed');
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setFormError(err.response?.data?.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormError('');
  };

  return (
    <div className="auth-form-container">
      <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
      
      {(formError || error) && (
        <div className="error-message">
          {formError || error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>
        
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
        </button>
      </form>
      
      <p className="toggle-form">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button type="button" onClick={toggleForm} className="toggle-button">
          {isLogin ? 'Sign Up' : 'Login'}
        </button>
      </p>
    </div>
  );
};

export default LoginForm; 