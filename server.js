const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Admin Credentials (Hidden in comments for convenience)
// Username: admin_himanshu
// Password: portfolio2025!secure
// Note: Change these credentials in production for security

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname)));

// MongoDB connection
const mongoURI = 'mongodb://localhost:27017/portfolio'; // Change to your MongoDB URI
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Contact schema
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  date: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Admin login route
app.post('/admin/login', (req, res) => {
  const { username, password } = req.body;

  // Admin credentials (same as in comments above)
  const adminUsername = 'admin_himanshu';
  const adminPassword = 'portfolio2025!secure';

  if (username === adminUsername && password === adminPassword) {
    res.json({
      success: true,
      message: 'Login successful!',
      redirect: '/admin/dashboard'
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
});

// Admin dashboard route
app.get('/admin/dashboard', (req, res) => {
  // In a real application, you'd check for authentication here
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin Dashboard - Himanshu Saini</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body>
        <div class="container mt-5">
            <h1>Admin Dashboard</h1>
            <div class="row">
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header">Contact Messages</div>
                        <div class="card-body">
                            <p>View and manage contact form submissions</p>
                            <a href="/admin/contacts" class="btn btn-primary">View Contacts</a>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header">Chat Messages</div>
                        <div class="card-body">
                            <p>View virtual assistant chat logs</p>
                            <a href="/admin/chats" class="btn btn-primary">View Chats</a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt-4">
                <a href="/" class="btn btn-secondary">Back to Website</a>
            </div>
        </div>
    </body>
    </html>
  `);
});

// Admin contacts route
app.get('/admin/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ date: -1 });
    let html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Admin - Contact Messages</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
      </head>
      <body>
          <div class="container mt-5">
              <h1>Contact Messages</h1>
              <a href="/admin/dashboard" class="btn btn-secondary mb-3">Back to Dashboard</a>
              <div class="table-responsive">
                  <table class="table table-striped">
                      <thead>
                          <tr>
                              <th>Name</th>
                              <th>Email</th>
                              <th>Message</th>
                              <th>Date</th>
                          </tr>
                      </thead>
                      <tbody>
    `;

    contacts.forEach(contact => {
      html += `
        <tr>
            <td>${contact.name}</td>
            <td>${contact.email}</td>
            <td>${contact.message}</td>
            <td>${contact.date.toLocaleDateString()}</td>
        </tr>
      `;
    });

    html += `
                      </tbody>
                  </table>
              </div>
          </div>
      </body>
      </html>
    `;

    res.send(html);
  } catch (error) {
    res.status(500).send('Error loading contacts');
  }
});

// Admin chats route
app.get('/admin/chats', async (req, res) => {
  try {
    const chats = await Chat.find().sort({ date: -1 });
    let html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Admin - Chat Messages</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
      </head>
      <body>
          <div class="container mt-5">
              <h1>Chat Messages</h1>
              <a href="/admin/dashboard" class="btn btn-secondary mb-3">Back to Dashboard</a>
              <div class="table-responsive">
                  <table class="table table-striped">
                      <thead>
                          <tr>
                              <th>Message</th>
                              <th>Date</th>
                          </tr>
                      </thead>
                      <tbody>
    `;

    chats.forEach(chat => {
      html += `
        <tr>
            <td>${chat.message}</td>
            <td>${chat.date.toLocaleDateString()}</td>
        </tr>
      `;
    });

    html += `
                      </tbody>
                  </table>
              </div>
          </div>
      </body>
      </html>
    `;

    res.send(html);
  } catch (error) {
    res.status(500).send('Error loading chats');
  }
});

app.post('/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newContact = new Contact({ name, email, message });
    await newContact.save();
    res.json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(500).json({ success: false, message: 'Error sending message' });
  }
});

// Chat messages schema (for virtual assistant)
const chatSchema = new mongoose.Schema({
  message: String,
  date: { type: Date, default: Date.now }
});

const Chat = mongoose.model('Chat', chatSchema);

app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const newChat = new Chat({ message });
    await newChat.save();
    res.json({ success: true, message: 'Chat message saved!' });
  } catch (error) {
    console.error('Error saving chat:', error);
    res.status(500).json({ success: false, message: 'Error saving chat' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});