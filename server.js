const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const {xss} = require('express-xss-sanitizer');
const rateLimit = require('express-rate-limit');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

// Route files
const app = express();
app.use(cors());
const campgrounds = require('./routes/campgrounds');
const appointments = require('./routes/appointments');
const auth = require('./routes/auth');
const favorite  = require('./routes/favorite');
const { decodeStream } = require('iconv-lite');

// Swagger set up
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Library API',
      version: '1.0.0',
      description: 'A simple Express Library API'
    },
    servers: [
      {
        url: 'http://localhost:5003/api/v1'
      }
    ],
  },
  apis: ['./routes/*.js']
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Body parser
app.use(express.json());
app.set('query parser', 'extended');

// Cookie parser
app.use(cookieParser());

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100
});
app.use(limiter);

// Mount routers
app.use('/api/v1/campgrounds', campgrounds);
app.use('/api/v1/appointments', appointments);
app.use('/api/v1/auth', auth);
app.use('/api/v1/campgrounds/:campgroundId/favorite', favorite);
app.use('/api/v1/favorites', favorite);

const PORT = process.env.PORT || 5003;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  
  // Close server & exit process
  server.close(() => process.exit(1));
});