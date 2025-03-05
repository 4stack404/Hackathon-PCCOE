import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import { users, resources, appointments } from './data/seedData.js';
import User from './models/userModel.js';
import Resource from './models/resourceModel.js';
import Appointment from './models/appointmentModel.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Resource.deleteMany();
    await Appointment.deleteMany();

    // Import users
    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;

    // Add user reference to appointments
    const sampleAppointments = appointments.map(appointment => {
      return { ...appointment, user: adminUser };
    });

    // Import resources and appointments
    await Resource.insertMany(resources);
    await Appointment.insertMany(sampleAppointments);

    console.log('Data Imported!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Resource.deleteMany();
    await Appointment.deleteMany();

    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
} 