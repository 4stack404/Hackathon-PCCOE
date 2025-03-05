import { useState, useEffect } from 'react';
import { appointmentAPI } from '../services/api';
import useApi from '../hooks/useApi';

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const { loading, error, execute: fetchAppointments } = useApi(appointmentAPI.getAppointments);

  useEffect(() => {
    const loadAppointments = async () => {
      const result = await fetchAppointments();
      if (result.success) {
        setAppointments(result.data);
      }
    };

    loadAppointments();
  }, [fetchAppointments]);

  if (loading) return <div>Loading appointments...</div>;
  if (error) return <div>Error loading appointments: {error}</div>;

  return (
    <div className="appointment-list">
      <h2>Your Appointments</h2>
      {appointments.length === 0 ? (
        <p>No appointments found. Schedule your first appointment now!</p>
      ) : (
        <ul>
          {appointments.map((appointment) => (
            <li key={appointment._id} className="appointment-item">
              <div className="appointment-date">
                <strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}
              </div>
              <div className="appointment-time">
                <strong>Time:</strong> {appointment.time}
              </div>
              <div className="appointment-doctor">
                <strong>Doctor:</strong> {appointment.doctor}
              </div>
              <div className="appointment-purpose">
                <strong>Purpose:</strong> {appointment.purpose}
              </div>
              <div className="appointment-status">
                <strong>Status:</strong> {appointment.status}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AppointmentList; 