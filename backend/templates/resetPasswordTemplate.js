const resetPasswordTemplate = (resetLink) => {
  return `
    <html>
      <head>
        <style>
          .container {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 20px;
          }
          .button {
            background-color: #007bff;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            display: inline-block;
            margin-top: 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Reset Your Password</h2>
          <p>Click the button below to reset your password:</p>
          <a href="${resetLink}" class="button">Reset Password</a>
          <p>If you did not request this, please ignore this email.</p>
        </div>
      </body>
    </html>
  `;
};

// ✅ Use `export default` for ES module syntax
export default resetPasswordTemplate;
