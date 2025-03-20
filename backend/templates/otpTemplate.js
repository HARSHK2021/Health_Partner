const otpEmailTemplate = (otpCode) => {
    return `
      <html>
        <head>
          <style>
            .container {
              font-family: Arial, sans-serif;
              text-align: center;
              padding: 20px;
            }
            .otp-code {
              font-size: 24px;
              font-weight: bold;
              color: #007bff;
              margin: 10px 0;
            }
            .note {
              color: #555;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Your OTP Code</h2>
            <p>Use the following OTP code to verify your identity:</p>
            <p class="otp-code">${otpCode}</p>
            <p class="note">This OTP is valid for a limited time. Do not share it with anyone.</p>
          </div>
        </body>
      </html>
    `;
  };
  
  // ✅ Use `export default` for ES module syntax
  export default otpEmailTemplate;
  