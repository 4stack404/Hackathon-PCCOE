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
      ['weightBeforePregnancy', 'currentWeight', 'medicalConditions', 'dietType'].forEach(field => {
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
      .matches(/^$|^\+?[0-9]{10,15}$/, 'Enter a valid phone number'),
  });

  const validationSchemaStep3 = Yup.object({
    weightBeforePregnancy: Yup.number()
      .positive('Weight must be positive')
      .required('Pre-pregnancy weight is required'),
    currentWeight: Yup.number()
      .positive('Weight must be positive'),
    medicalConditions: Yup.array(),
    dietType: Yup.string()
      .required('Please select your diet type'),
  });

  const validationSchemaStep4 = Yup.object({
    notificationPreference: Yup.string()
      .required('Please select your notification preference'),
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
      weightBeforePregnancy: '',
      currentWeight: '',
      medicalConditions: [],
      dietType: '',

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
        const result = await signup({
          name: values.fullName,
          email: values.email,
          password: values.password
        });
        
        if (result.success) {
          navigate('/dashboard');
        } else {
          setError(result.error || 'Registration failed. Please try again.');
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
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="weightBeforePregnancy"
                label="Weight Before Pregnancy (kg)"
                name="weightBeforePregnancy"
                type="number"
                value={formik.values.weightBeforePregnancy}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.weightBeforePregnancy && Boolean(formik.errors.weightBeforePregnancy)}
                helperText={formik.touched.weightBeforePregnancy && formik.errors.weightBeforePregnancy}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="currentWeight"
                label="Current Weight (kg) (Optional)"
                name="currentWeight"
                type="number"
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
              <FormControl fullWidth>
                <InputLabel id="medicalConditions-label">Medical Conditions (Optional)</InputLabel>
                <Select
                  labelId="medicalConditions-label"
                  id="medicalConditions"
                  name="medicalConditions"
                  multiple
                  value={formik.values.medicalConditions}
                  label="Medical Conditions (Optional)"
                  onChange={formik.handleChange}
                >
                  <MenuItem value="gestational-diabetes">Gestational Diabetes</MenuItem>
                  <MenuItem value="hypertension">High Blood Pressure</MenuItem>
                  <MenuItem value="thyroid">Thyroid Condition</MenuItem>
                  <MenuItem value="anemia">Anemia</MenuItem>
                  <MenuItem value="celiac">Celiac Disease</MenuItem>
                  <MenuItem value="lactose-intolerant">Lactose Intolerance</MenuItem>
                  <MenuItem value="preeclampsia">Preeclampsia</MenuItem>
                  <MenuItem value="gestational-hypertension">Gestational Hypertension</MenuItem>
                  <MenuItem value="hyperemesis-gravidarum">Hyperemesis Gravidarum</MenuItem>
                  <MenuItem value="placenta-previa">Placenta Previa</MenuItem>
                  <MenuItem value="preterm-labor">Preterm Labor</MenuItem>
                  <MenuItem value="fetal-growth-restriction">Fetal Growth Restriction</MenuItem>
                  <MenuItem value="chronic-kidney-disease">Chronic Kidney Disease</MenuItem>
                  <MenuItem value="autoimmune-disorder">Autoimmune Disorder</MenuItem>
                  <MenuItem value="morning-sickness">Severe Morning Sickness</MenuItem>
                  <MenuItem value="diabetes">Diabetes</MenuItem>
                  <MenuItem value="tuberculosis">Tuberculosis</MenuItem>
                  <MenuItem value="malaria">Malaria</MenuItem>
                  <MenuItem value="dengue">Dengue Fever</MenuItem>
                  <MenuItem value="cardiovascular-disease">Cardiovascular Disease</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                  <MenuItem value="none">None</MenuItem>
                </Select>
              </FormControl>
            </Grid>
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