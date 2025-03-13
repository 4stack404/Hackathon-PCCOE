import { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  FormControlLabel, 
  Checkbox, 
  Link, 
  Paper, 
  Stepper, 
  Step, 
  StepLabel,
  Grid,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Alert,
  CircularProgress,
  LinearProgress,
  Radio,
  RadioGroup,
  Stack,
  Tooltip
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  CloudUpload, 
  CheckCircle,
  Info as InfoIcon
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../hooks/useAuth';

// Password strength indicator component
const PasswordStrength = ({ password }) => {
  const getStrength = (password) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const strength = getStrength(password);
  
  const getColor = () => {
    if (strength === 0) return 'error.main';
    if (strength === 1) return 'error.main';
    if (strength === 2) return 'warning.main';
    if (strength === 3) return 'success.light';
    return 'success.main';
  };

  const getLabel = () => {
    if (strength === 0) return 'Very Weak';
    if (strength === 1) return 'Weak';
    if (strength === 2) return 'Fair';
    if (strength === 3) return 'Good';
    return 'Strong';
  };

  return (
    <Box sx={{ mt: 1, mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
        <Typography variant="body2" sx={{ mr: 1 }}>
          Password Strength:
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600, color: getColor() }}>
          {getLabel()}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        {[...Array(4)].map((_, i) => (
          <Box
            key={i}
            sx={{
              height: 4,
              borderRadius: 1,
              width: '25%',
              bgcolor: i < strength ? getColor() : 'grey.300',
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

// Update the calculateBMRAndCalories function to also calculate macronutrients
const calculateBMRAndCalories = (weight, height, age, dueDate) => {
  // Calculate BMR using the formula: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) - 161
  const bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
  
  // Calculate trimester based on due date
  let trimester = 1;
  let extraCalories = 0;
  
  if (dueDate) {
    const today = new Date();
    const dueDateTime = new Date(dueDate);
    
    // Calculate weeks of pregnancy (assuming 40 weeks total)
    const pregnancyDuration = 40 * 7 * 24 * 60 * 60 * 1000; // 40 weeks in milliseconds
    const timeUntilDue = dueDateTime.getTime() - today.getTime();
    const timePregnant = pregnancyDuration - timeUntilDue;
    const weeksPregnant = Math.floor(timePregnant / (7 * 24 * 60 * 60 * 1000));
    
    // Determine trimester and extra calories
    if (weeksPregnant >= 27) {
      trimester = 3;
      extraCalories = 450;
    } else if (weeksPregnant >= 13) {
      trimester = 2;
      extraCalories = 300;
    } else {
      trimester = 1;
      extraCalories = 0;
    }
  }
  
  // Calculate total calories
  const calories = Math.round(bmr + extraCalories);
  
  // Calculate macronutrients
  // Protein: 25% of calories (1g protein = 4 calories)
  const protein = Math.round((calories * 0.25) / 4);
  
  // Carbohydrates: 45% of calories (1g carbs = 4 calories)
  const carbohydrates = Math.round((calories * 0.45) / 4);
  
  // Fats: 30% of calories (1g fat = 9 calories)
  const fats = Math.round((calories * 0.30) / 9);
  
  return { 
    bmr: Math.round(bmr), 
    calories, 
    trimester,
    protein,
    carbohydrates,
    fats
  };
};

function Signup() {
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const steps = [
    'Account Setup',
    'Pregnancy Details',
    'Health Information',
    'Preferences'
  ];

  const calculateProgress = (values, step) => {
    let filledFields = 0;
    let totalFields = 0;
    
    const countField = (value) => {
      totalFields++;
      if (value !== '' && value !== null && value !== undefined) filledFields++;
    };

    if (step === 0) {
      ['fullName', 'email', 'password', 'confirmPassword', 'phone'].forEach(field => {
        countField(values[field]);
      });
    } else if (step === 1) {
      ['isPregnant', 'dueDate', 'firstPregnancy', 'doctorName', 'doctorContact'].forEach(field => {
        countField(values[field]);
      });
    } else if (step === 2) {
      ['age', 'currentWeight', 'height', 'medicalConditions', 'dietType', 'hasJointPain', 'jointPainType'].forEach(field => {
        countField(values[field]);
      });
    } else if (step === 3) {
      ['notificationPreference', 'termsAccepted'].forEach(field => {
        countField(values[field]);
      });
    }

    return (filledFields / totalFields) * 100;
  };

  const validationSchemaStep1 = Yup.object({
    fullName: Yup.string()
      .required('Full name is required')
      .min(2, 'Name must be at least 2 characters'),
    email: Yup.string()
      .email('Enter a valid email')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters'),
    confirmPassword: Yup.string()
      .required('Please confirm your password')
      .oneOf([Yup.ref('password'), null], 'Passwords must match'),
    phone: Yup.string()
      .matches(/^\+?[0-9]{10,15}$/, 'Enter a valid phone number'),
  });

  const validationSchemaStep2 = Yup.object({
    isPregnant: Yup.string()
      .required('Please indicate if you are currently pregnant'),
    dueDate: Yup.date()
      .when('isPregnant', {
        is: 'yes',
        then: () => Yup.date()
          .required('Due date is required')
          .min(new Date(), 'Due date cannot be in the past')
      }),
    firstPregnancy: Yup.string()
      .required('Please indicate if this is your first pregnancy'),
    doctorName: Yup.string(),
    doctorContact: Yup.string()
      .matches(/^$|^\+?[0-9]{10,15}$/, 'Enter a valid phone number')
  });

  const validationSchemaStep3 = Yup.object({
    age: Yup.number()
      .required('Age is required')
      .positive('Age must be positive')
      .integer('Age must be a whole number')
      .min(18, 'You must be at least 18 years old')
      .max(50, 'Please consult with your doctor for pregnancies over 50')
      .typeError('Age must be a number'),
    height: Yup.number()
      .required('Height is required')
      .positive('Height must be positive')
      .typeError('Height must be a number'),
    currentWeight: Yup.number()
      .required('Current weight is required')
      .positive('Weight must be positive')
      .typeError('Weight must be a number'),
    medicalConditions: Yup.array()
      .min(1, 'Please select at least one medical condition or "None"')
      .required('Please select your medical conditions'),
    dietType: Yup.string()
      .required('Please select your diet type')
      .oneOf(['vegetarian', 'non-vegetarian'], 'Please select a valid diet type'),
    hasJointPain: Yup.string()
      .required('Please indicate if you have joint pain')
      .oneOf(['yes', 'no'], 'Please select Yes or No'),
    jointPainType: Yup.string()
      .when('hasJointPain', {
        is: 'yes',
        then: () => Yup.string()
          .required('Please select the type of joint pain')
          .oneOf(['knee', 'hip', 'ankle', 'wrist', 'elbow', 'shoulder', 'back', 'neck', 'other'], 'Please select a valid joint pain type')
      })
  });

  const validationSchemaStep4 = Yup.object({
    notificationPreference: Yup.string()
      .required('Please select your notification preference')
      .oneOf(['email', 'sms', 'both'], 'Please select a valid notification preference'),
    termsAccepted: Yup.boolean()
      .oneOf([true], 'You must accept the terms and conditions')
  });

  const getValidationSchema = (step) => {
    switch (step) {
      case 0:
        return validationSchemaStep1;
      case 1:
        return validationSchemaStep2;
      case 2:
        return validationSchemaStep3;
      case 3:
        return validationSchemaStep4;
      default:
        return validationSchemaStep1;
    }
  };

  const formik = useFormik({
    initialValues: {
      // Account Setup
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',

      // Pregnancy Details
      isPregnant: '',
      dueDate: '',
      firstPregnancy: '',
      doctorName: '',
      doctorContact: '',

      // Health Information
      age: '',
      currentWeight: '',
      height: '',
      medicalConditions: [],
      dietType: '',
      hasJointPain: '',
      jointPainType: '',

      // Preferences
      notificationPreference: '',
      termsAccepted: false
    },
    validationSchema: getValidationSchema(activeStep),
    validateOnMount: false,
    onSubmit: async (values) => {
      if (activeStep < steps.length - 1) {
        setActiveStep(activeStep + 1);
        return;
      }
      
      setLoading(true);
      setError('');
      
      try {
        // Force age to be a number (default to 25 if not provided)
        const age = values.age ? Number(values.age) : 25;
        
        // Calculate BMR, calories, and macronutrients
        const { bmr, calories, trimester, protein, carbohydrates, fats } = calculateBMRAndCalories(
          Number(values.currentWeight),
          Number(values.height),
          age,
          values.isPregnant === 'yes' ? values.dueDate : null
        );
        
        // Create userData object with all required fields including macronutrients
        const userData = {
          name: values.fullName,
          email: values.email,
          password: values.password,
          phone: values.phone || '',
          age: age,
          height: Number(values.height),
          weight: Number(values.currentWeight),
          bmr: bmr,
          calories: calories,
          protein: protein,
          carbohydrates: carbohydrates,
          fats: fats,
          pregnancyDetails: {
            dueDate: values.isPregnant === 'yes' ? values.dueDate : new Date().toISOString().split('T')[0],
            firstPregnancy: values.firstPregnancy === 'yes',
            trimester: trimester
          },
          dietType: values.dietType,
          notificationPreference: values.notificationPreference,
          healthInfo: {
            age: age,
            medicalConditions: values.medicalConditions || [],
            hasJointPain: values.hasJointPain === 'yes',
            jointPainType: values.hasJointPain === 'yes' ? values.jointPainType : null,
            nutrition: {
              calories: calories,
              protein: protein,
              carbohydrates: carbohydrates,
              fats: fats
            }
          }
        };

        console.log('Sending user data with macronutrients:', userData);
        
        // Make API call
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${API_URL}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });
        
        const data = await response.json();
        
        if (data.success) {
          navigate('/dashboard');
        } else {
          setError(data.message || 'Registration failed. Please try again.');
        }
      } catch (err) {
        console.error('Signup error:', err);
        setError('An unexpected error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    },
  });

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="fullName"
                label="Full Name"
                name="fullName"
                autoComplete="name"
                autoFocus
                value={formik.values.fullName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.fullName && Boolean(formik.errors.fullName)}
                helperText={formik.touched.fullName && formik.errors.fullName}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="new-password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <PasswordStrength password={formik.values.password} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                autoComplete="new-password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowConfirmPassword}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="phone"
                label="Phone Number (Optional)"
                name="phone"
                autoComplete="tel"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
                placeholder="+1 (123) 456-7890"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="For SMS notifications and reminders">
                        <InfoIcon color="action" />
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl component="fieldset" required>
                <Typography variant="subtitle1" gutterBottom>
                  Are you currently pregnant?
                </Typography>
                <RadioGroup
                  name="isPregnant"
                  value={formik.values.isPregnant}
                  onChange={formik.handleChange}
                >
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
                {formik.touched.isPregnant && formik.errors.isPregnant && (
                  <FormHelperText error>{formik.errors.isPregnant}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            {formik.values.isPregnant === 'yes' && (
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="dueDate"
                  label="Due Date (EDD)"
                  name="dueDate"
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={formik.values.dueDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.dueDate && Boolean(formik.errors.dueDate)}
                  helperText={formik.touched.dueDate && formik.errors.dueDate}
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <FormControl component="fieldset" required>
                <Typography variant="subtitle1" gutterBottom>
                  Is this your first pregnancy?
                </Typography>
                <RadioGroup
                  name="firstPregnancy"
                  value={formik.values.firstPregnancy}
                  onChange={formik.handleChange}
                >
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
                {formik.touched.firstPregnancy && formik.errors.firstPregnancy && (
                  <FormHelperText error>{formik.errors.firstPregnancy}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="doctorName"
                label="Doctor's Name (Optional)"
                name="doctorName"
                value={formik.values.doctorName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="doctorContact"
                label="Doctor's Contact (Optional)"
                name="doctorContact"
                value={formik.values.doctorContact}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.doctorContact && Boolean(formik.errors.doctorContact)}
                helperText={formik.touched.doctorContact && formik.errors.doctorContact}
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box sx={{ border: '2px solid #f50057', p: 2, borderRadius: 1, mb: 2 }}>
                <Typography variant="subtitle1" color="error" gutterBottom>
                  Important: Please enter your age
                </Typography>
                <TextField
                  required
                  fullWidth
                  id="age"
                  label="Age (years)"
                  name="age"
                  type="number"
                  inputProps={{ min: 18, max: 50, step: "1" }}
                  value={formik.values.age}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.age && Boolean(formik.errors.age)}
                  helperText={formik.touched.age && formik.errors.age}
                />
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="height"
                label="Height (cm)"
                name="height"
                type="number"
                inputProps={{ min: 0, step: "1" }}
                value={formik.values.height}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.height && Boolean(formik.errors.height)}
                helperText={formik.touched.height && formik.errors.height}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="currentWeight"
                label="Current Weight (kg)"
                name="currentWeight"
                type="number"
                inputProps={{ min: 0, step: "0.1" }}
                value={formik.values.currentWeight}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.currentWeight && Boolean(formik.errors.currentWeight)}
                helperText={formik.touched.currentWeight && formik.errors.currentWeight}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel id="dietType-label">Preferred Diet Type</InputLabel>
                <Select
                  labelId="dietType-label"
                  id="dietType"
                  name="dietType"
                  value={formik.values.dietType}
                  label="Preferred Diet Type"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.dietType && Boolean(formik.errors.dietType)}
                >
                  <MenuItem value="vegetarian">Vegetarian</MenuItem>
                  <MenuItem value="non-vegetarian">Non-Vegetarian</MenuItem>
                </Select>
                {formik.touched.dietType && formik.errors.dietType && (
                  <FormHelperText error>{formik.errors.dietType}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth required error={formik.touched.medicalConditions && Boolean(formik.errors.medicalConditions)}>
                <InputLabel id="medicalConditions-label">Medical Conditions</InputLabel>
                <Select
                  labelId="medicalConditions-label"
                  id="medicalConditions"
                  name="medicalConditions"
                  multiple
                  value={formik.values.medicalConditions}
                  label="Medical Conditions"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Box 
                          key={value} 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            border: '1px solid #e0e0e0',
                            borderRadius: 1,
                            px: 1,
                            py: 0.5
                          }}
                        >
                          {value === 'none' ? 'None' : value.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </Box>
                      ))}
                    </Box>
                  )}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300
                      }
                    }
                  }}
                >
                  <MenuItem value="gestational-diabetes">
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                      Gestational Diabetes
                      {formik.values.medicalConditions.includes('gestational-diabetes') && (
                        <CheckCircle sx={{ fontSize: 14, ml: 1, color: 'primary.main' }} />
                      )}
                    </Box>
                  </MenuItem>
                  <MenuItem value="hypertension">
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                      High Blood Pressure
                      {formik.values.medicalConditions.includes('hypertension') && (
                        <CheckCircle sx={{ fontSize: 14, ml: 1, color: 'primary.main' }} />
                      )}
                    </Box>
                  </MenuItem>
                  <MenuItem value="thyroid">
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                      Thyroid Condition
                      {formik.values.medicalConditions.includes('thyroid') && (
                        <CheckCircle sx={{ fontSize: 14, ml: 1, color: 'primary.main' }} />
                      )}
                    </Box>
                  </MenuItem>
                  <MenuItem value="anemia">
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                      Anemia
                      {formik.values.medicalConditions.includes('anemia') && (
                        <CheckCircle sx={{ fontSize: 14, ml: 1, color: 'primary.main' }} />
                      )}
                    </Box>
                  </MenuItem>
                  <MenuItem value="celiac">
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                      Celiac Disease
                      {formik.values.medicalConditions.includes('celiac') && (
                        <CheckCircle sx={{ fontSize: 14, ml: 1, color: 'primary.main' }} />
                      )}
                    </Box>
                  </MenuItem>
                  <MenuItem value="lactose-intolerant">
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                      Lactose Intolerance
                      {formik.values.medicalConditions.includes('lactose-intolerant') && (
                        <CheckCircle sx={{ fontSize: 14, ml: 1, color: 'primary.main' }} />
                      )}
                    </Box>
                  </MenuItem>
                  <MenuItem value="preeclampsia">
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                      Preeclampsia
                      {formik.values.medicalConditions.includes('preeclampsia') && (
                        <CheckCircle sx={{ fontSize: 14, ml: 1, color: 'primary.main' }} />
                      )}
                    </Box>
                  </MenuItem>
                  <MenuItem value="gestational-hypertension">
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                      Gestational Hypertension
                      {formik.values.medicalConditions.includes('gestational-hypertension') && (
                        <CheckCircle sx={{ fontSize: 14, ml: 1, color: 'primary.main' }} />
                      )}
                    </Box>
                  </MenuItem>
                  <MenuItem value="other">
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                      Other
                      {formik.values.medicalConditions.includes('other') && (
                        <CheckCircle sx={{ fontSize: 14, ml: 1, color: 'primary.main' }} />
                      )}
                    </Box>
                  </MenuItem>
                  <MenuItem value="none">
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                      None
                      {formik.values.medicalConditions.includes('none') && (
                        <CheckCircle sx={{ fontSize: 14, ml: 1, color: 'primary.main' }} />
                      )}
                    </Box>
                  </MenuItem>
                </Select>
                {formik.touched.medicalConditions && formik.errors.medicalConditions && (
                  <FormHelperText error>{formik.errors.medicalConditions}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl component="fieldset" required>
                <Typography variant="subtitle1" gutterBottom>
                  Do you have joint pain?
                </Typography>
                <RadioGroup
                  name="hasJointPain"
                  value={formik.values.hasJointPain}
                  onChange={formik.handleChange}
                >
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
                {formik.touched.hasJointPain && formik.errors.hasJointPain && (
                  <FormHelperText error>{formik.errors.hasJointPain}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            {formik.values.hasJointPain === 'yes' && (
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel id="jointPainType-label">Type of Joint Pain</InputLabel>
                  <Select
                    labelId="jointPainType-label"
                    id="jointPainType"
                    name="jointPainType"
                    value={formik.values.jointPainType}
                    label="Type of Joint Pain"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.jointPainType && Boolean(formik.errors.jointPainType)}
                  >
                    <MenuItem value="knee">
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                        Knee Pain
                        {formik.values.jointPainType === 'knee' && (
                          <CheckCircle sx={{ fontSize: 14, ml: 1, color: 'primary.main' }} />
                        )}
                      </Box>
                    </MenuItem>
                    <MenuItem value="hip">
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                        Hip Pain
                        {formik.values.jointPainType === 'hip' && (
                          <CheckCircle sx={{ fontSize: 14, ml: 1, color: 'primary.main' }} />
                        )}
                      </Box>
                    </MenuItem>
                    <MenuItem value="ankle">
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                        Ankle Pain
                        {formik.values.jointPainType === 'ankle' && (
                          <CheckCircle sx={{ fontSize: 14, ml: 1, color: 'primary.main' }} />
                        )}
                      </Box>
                    </MenuItem>
                    <MenuItem value="wrist">
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                        Wrist Pain
                        {formik.values.jointPainType === 'wrist' && (
                          <CheckCircle sx={{ fontSize: 14, ml: 1, color: 'primary.main' }} />
                        )}
                      </Box>
                    </MenuItem>
                    <MenuItem value="elbow">
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                        Elbow Pain
                        {formik.values.jointPainType === 'elbow' && (
                          <CheckCircle sx={{ fontSize: 14, ml: 1, color: 'primary.main' }} />
                        )}
                      </Box>
                    </MenuItem>
                    <MenuItem value="shoulder">
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                        Shoulder Pain
                        {formik.values.jointPainType === 'shoulder' && (
                          <CheckCircle sx={{ fontSize: 14, ml: 1, color: 'primary.main' }} />
                        )}
                      </Box>
                    </MenuItem>
                    <MenuItem value="back">
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                        Back Pain
                        {formik.values.jointPainType === 'back' && (
                          <CheckCircle sx={{ fontSize: 14, ml: 1, color: 'primary.main' }} />
                        )}
                      </Box>
                    </MenuItem>
                    <MenuItem value="neck">
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                        Neck Pain
                        {formik.values.jointPainType === 'neck' && (
                          <CheckCircle sx={{ fontSize: 14, ml: 1, color: 'primary.main' }} />
                        )}
                      </Box>
                    </MenuItem>
                    <MenuItem value="other">
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                        Other
                        {formik.values.jointPainType === 'other' && (
                          <CheckCircle sx={{ fontSize: 14, ml: 1, color: 'primary.main' }} />
                        )}
                      </Box>
                    </MenuItem>
                  </Select>
                  {formik.touched.jointPainType && formik.errors.jointPainType && (
                    <FormHelperText error>{formik.errors.jointPainType}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
            )}

            {formik.values.hasJointPain === 'no' && (
              <Grid item xs={12}>
                <Box sx={{ 
                  p: 2, 
                  border: '1px solid #e0e0e0', 
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <Typography>None</Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        );

      case 3:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl component="fieldset" required>
                <Typography variant="subtitle1" gutterBottom>
                  Notification Preferences
                </Typography>
                <RadioGroup
                  name="notificationPreference"
                  value={formik.values.notificationPreference}
                  onChange={formik.handleChange}
                >
                  <FormControlLabel value="email" control={<Radio />} label="Email Only" />
                  <FormControlLabel value="sms" control={<Radio />} label="SMS Only" />
                  <FormControlLabel value="both" control={<Radio />} label="Both Email and SMS" />
                </RadioGroup>
                {formik.touched.notificationPreference && formik.errors.notificationPreference && (
                  <FormHelperText error>{formik.errors.notificationPreference}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox 
                    name="termsAccepted" 
                    color="primary" 
                    checked={formik.values.termsAccepted}
                    onChange={formik.handleChange}
                  />
                }
                label={
                  <Typography variant="body2">
                    I agree to the{' '}
                    <Link component={RouterLink} to="/terms-of-service">
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link component={RouterLink} to="/privacy-policy">
                      Privacy Policy
                    </Link>
                  </Typography>
                }
              />
              {formik.touched.termsAccepted && formik.errors.termsAccepted && (
                <FormHelperText error>{formik.errors.termsAccepted}</FormHelperText>
              )}
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Box 
      sx={{ 
        py: 8, 
        minHeight: 'calc(100vh - 64px - 300px)',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <Container maxWidth="md">
        <Paper 
          elevation={3} 
          sx={{ 
            p: { xs: 3, md: 5 },
            borderRadius: 2,
            animation: 'fadeIn 0.5s ease-out',
            '@keyframes fadeIn': {
              '0%': {
                opacity: 0,
                transform: 'translateY(20px)'
              },
              '100%': {
                opacity: 1,
                transform: 'translateY(0)'
              }
            }
          }}
        >
          <Typography 
            variant="h4" 
            component="h1" 
            align="center" 
            gutterBottom
            sx={{ fontWeight: 700, mb: 4 }}
          >
            Create Your Account
          </Typography>

          <Stepper 
            activeStep={activeStep} 
            sx={{ 
              mb: 4,
              '& .MuiStepLabel-root .Mui-completed': {
                color: 'success.main',
              },
              '& .MuiStepLabel-label.Mui-completed': {
                color: 'text.primary',
              }
            }}
          >
            {steps.map((label, index) => {
              const progress = calculateProgress(formik.values, index);
              return (
                <Step key={label}>
                  <StepLabel>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      {label}
                      {index <= activeStep && (
                        <LinearProgress 
                          variant="determinate" 
                          value={progress} 
                          sx={{ 
                            width: '100%', 
                            mt: 1,
                            height: 4,
                            borderRadius: 2
                          }}
                        />
                      )}
                    </Box>
                  </StepLabel>
                </Step>
              );
            })}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={formik.handleSubmit} noValidate>
            {renderStepContent(activeStep)}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              {activeStep > 0 ? (
                <Button
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
              ) : (
                <Box /> /* Empty box for spacing */
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={loading}
                sx={{ 
                  py: 1.5,
                  px: 4,
                  position: 'relative'
                }}
              >
                {loading ? (
                  <CircularProgress 
                    size={24} 
                    sx={{ 
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      marginTop: '-12px',
                      marginLeft: '-12px',
                    }} 
                  />
                ) : activeStep === steps.length - 1 ? 'Create Account' : 'Next'}
              </Button>
            </Box>
          </Box>
          
          {activeStep === 0 && (
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2">
                Already have an account?{' '}
                <Link component={RouterLink} to="/login" variant="body2" sx={{ fontWeight: 600 }}>
                  Login instead
                </Link>
              </Typography>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}

export default Signup; 