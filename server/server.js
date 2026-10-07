import dotenv from 'dotenv';
dotenv.config();

import app from './src/app.js';

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🚀 DocuSaathi Backend Server running on port ${PORT}`);
  console.log(`🔗 Health endpoint: http://localhost:${PORT}/api/health`);
  console.log(`=========================================`);
});
