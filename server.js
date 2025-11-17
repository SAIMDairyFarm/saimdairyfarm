const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  if (process.env.NODE_ENV === 'production') {
    console.log('Application is running in production mode');
  } else {
    console.log(`Access the application at http://localhost:${PORT}`);
  }
});
