import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const UserProfile = () => {
  const { currentUser, logout } = useContext(AuthContext);

  if (!currentUser) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      
      <div className="profile-info">
        <div className="profile-field">
          <strong>Name:</strong> {currentUser.name}
        </div>
        
        <div className="profile-field">
          <strong>Email:</strong> {currentUser.email}
        </div>
        
        {currentUser.phone && (
          <div className="profile-field">
            <strong>Phone:</strong> {currentUser.phone}
          </div>
        )}
        
        {currentUser.dateOfBirth && (
          <div className="profile-field">
            <strong>Date of Birth:</strong> {new Date(currentUser.dateOfBirth).toLocaleDateString()}
          </div>
        )}
        
        {currentUser.gender && (
          <div className="profile-field">
            <strong>Gender:</strong> {currentUser.gender}
          </div>
        )}
        
        {currentUser.address && (
          <div className="profile-field">
            <strong>Address:</strong> {currentUser.address}
          </div>
        )}
        
        {currentUser.pregnancyDetails?.dueDate && (
          <div className="profile-field">
            <strong>Due Date:</strong> {new Date(currentUser.pregnancyDetails.dueDate).toLocaleDateString()}
          </div>
        )}
        
        {currentUser.pregnancyDetails?.weeksPregnant && (
          <div className="profile-field">
            <strong>Weeks Pregnant:</strong> {currentUser.pregnancyDetails.weeksPregnant}
          </div>
        )}
      </div>
      
      <button onClick={logout} className="logout-button">
        Logout
      </button>
    </div>
  );
};

export default UserProfile; 