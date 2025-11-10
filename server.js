require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

// connect DB
connectDB();

// serve uploads static
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const videoRoutes = require("./routes/videoRoutes");




// routes
app.use('/api/auth', require('./routes/auth'));
app.use("/api/stats", require("./routes/statsRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/upcoming-products", require("./routes/upcomingProductRoutes"));   
app.use("/api/facilities", require("./routes/facilityRoutes"));
app.use("/api/crop-solutions", require("./routes/cropSolutionRoutes"));
app.use("/api/videos", videoRoutes);
app.use("/api/pdfs", require("./routes/pdfRoutes"));
app.use("/api/contact", require("./routes/contactRoute"));




// app.use('/api/company', require('./routes/company'));
// app.use('/api/media', require('./routes/media'));
// app.use('/api/partners', require('./routes/partners'));
// app.use('/api/team', require('./routes/team'));
// app.use('/api/awards', require('./routes/awards'));
// app.use('/api/solutions', require('./routes/solutions'));

// basic health check
app.get('/', (req, res) => res.send('Agrywell Backend is up'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
