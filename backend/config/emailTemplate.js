export const WELCOME_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
  <style>
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      font-family: Arial, sans-serif;
    }
    .header {
      background-color: #f8bbd0;
      padding: 20px;
      text-align: center;
      border-radius: 5px;
    }
    .content {
      padding: 20px;
      line-height: 1.6;
    }
    .button {
      display: inline-block;
      padding: 10px 20px;
      background-color: #e91e63;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      margin-top: 20px;
    }
    .footer {
      text-align: center;
      margin-top: 20px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to Pregnancy App!</h1>
    </div>
    <div class="content">
      <p>Dear {{name}},</p>
      <p>Thank you for joining Pregnancy App! We're excited to have you on board.</p>
      <p>Your account has been successfully created with the following credentials:</p>
      <ul>
        <li>Email: {{email}}</li>
        <li>Password: {{password}}</li>
      </ul>
      <p>For security reasons, we recommend changing your password after your first login.</p>
      <a href="{{welcome_link}}" class="button">Get Started</a>
      <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
    </div>
    <div class="footer">
      <p>© 2024 Pregnancy App. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

export const PASSWORD_RESET_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
  <style>
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      font-family: Arial, sans-serif;
    }
    .header {
      background-color: #f8bbd0;
      padding: 20px;
      text-align: center;
      border-radius: 5px;
    }
    .content {
      padding: 20px;
      line-height: 1.6;
    }
    .otp {
      font-size: 24px;
      font-weight: bold;
      color: #e91e63;
      text-align: center;
      margin: 20px 0;
      letter-spacing: 2px;
    }
    .footer {
      text-align: center;
      margin-top: 20px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Password Reset Request</h1>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>We received a request to reset the password for your Pregnancy App account ({{email}}).</p>
      <p>Your password reset OTP is:</p>
      <div class="otp">{{otp}}</div>
      <p>This OTP will expire in 15 minutes.</p>
      <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
    </div>
    <div class="footer">
      <p>© 2024 Pregnancy App. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

