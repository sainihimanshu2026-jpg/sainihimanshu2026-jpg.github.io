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

// Skill schema
const skillSchema = new mongoose.Schema({
  name: String,
  percentage: Number,
  date: { type: Date, default: Date.now }
});

const Skill = mongoose.model('Skill', skillSchema);

// Certificate schema
const certificateSchema = new mongoose.Schema({
  title: String,
  description: String,
  imageUrl: String,
  date: { type: Date, default: Date.now }
});

const Certificate = mongoose.model('Certificate', certificateSchema);

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
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-header">Contact Messages</div>
                        <div class="card-body">
                            <p>View and manage contact form submissions</p>
                            <a href="/admin/contacts" class="btn btn-primary">View Contacts</a>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-header">Chat Messages</div>
                        <div class="card-body">
                            <p>View virtual assistant chat logs</p>
                            <a href="/admin/chats" class="btn btn-primary">View Chats</a>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-header">Edit Skills</div>
                        <div class="card-body">
                            <p>Update your skills section</p>
                            <a href="/admin/edit-skills" class="btn btn-primary">Edit Skills</a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row mt-3">
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header">Edit Certificates</div>
                        <div class="card-body">
                            <p>Manage your certificates</p>
                            <a href="/admin/edit-certificates" class="btn btn-primary">Edit Certificates</a>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header">Site Settings</div>
                        <div class="card-body">
                            <p>Configure website settings</p>
                            <a href="/admin/settings" class="btn btn-primary">Settings</a>
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

// Admin edit skills route
app.get('/admin/edit-skills', async (req, res) => {
  try {
    const skills = await Skill.find().sort({ date: -1 });
    let html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Admin - Edit Skills</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
      </head>
      <body>
          <div class="container mt-5">
              <h1>Edit Skills</h1>
              <a href="/admin/dashboard" class="btn btn-secondary mb-3">Back to Dashboard</a>
              <form action="/admin/add-skill" method="POST" class="mb-4">
                  <div class="row">
                      <div class="col-md-6">
                          <input type="text" name="name" class="form-control" placeholder="Skill Name" required>
                      </div>
                      <div class="col-md-4">
                          <input type="number" name="percentage" class="form-control" placeholder="Percentage" min="0" max="100" required>
                      </div>
                      <div class="col-md-2">
                          <button type="submit" class="btn btn-success">Add Skill</button>
                      </div>
                  </div>
              </form>
              <h3>Current Skills</h3>
              <div class="table-responsive">
                  <table class="table table-striped">
                      <thead>
                          <tr>
                              <th>Skill</th>
                              <th>Percentage</th>
                              <th>Actions</th>
                          </tr>
                      </thead>
                      <tbody>
    `;

    skills.forEach(skill => {
      html += `
        <tr>
            <td>${skill.name}</td>
            <td>${skill.percentage}%</td>
            <td>
                <a href="/admin/delete-skill/${skill._id}" class="btn btn-danger btn-sm">Delete</a>
            </td>
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
    res.status(500).send('Error loading skills');
  }
});

// Add skill route
app.post('/admin/add-skill', async (req, res) => {
  try {
    const { name, percentage } = req.body;
    const newSkill = new Skill({ name, percentage: parseInt(percentage) });
    await newSkill.save();
    res.redirect('/admin/edit-skills');
  } catch (error) {
    console.error('Error adding skill:', error);
    res.status(500).send('Error adding skill');
  }
});

// Delete skill route
app.get('/admin/delete-skill/:id', async (req, res) => {
  try {
    await Skill.findByIdAndDelete(req.params.id);
    res.redirect('/admin/edit-skills');
  } catch (error) {
    console.error('Error deleting skill:', error);
    res.status(500).send('Error deleting skill');
  }
});

// Admin edit certificates route
app.get('/admin/edit-certificates', async (req, res) => {
  try {
    const certificates = await Certificate.find().sort({ date: -1 });
    let html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Admin - Edit Certificates</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
      </head>
      <body>
          <div class="container mt-5">
              <h1>Edit Certificates</h1>
              <a href="/admin/dashboard" class="btn btn-secondary mb-3">Back to Dashboard</a>
              <form action="/admin/add-certificate" method="POST" class="mb-4">
                  <div class="mb-3">
                      <input type="text" name="title" class="form-control" placeholder="Certificate Title" required>
                  </div>
                  <div class="mb-3">
                      <textarea name="description" class="form-control" placeholder="Description" rows="3" required></textarea>
                  </div>
                  <div class="mb-3">
                      <input type="url" name="imageUrl" class="form-control" placeholder="Image URL" required>
                  </div>
                  <button type="submit" class="btn btn-success">Add Certificate</button>
              </form>
              <h3>Current Certificates</h3>
              <div class="table-responsive">
                  <table class="table table-striped">
                      <thead>
                          <tr>
                              <th>Title</th>
                              <th>Description</th>
                              <th>Image</th>
                              <th>Actions</th>
                          </tr>
                      </thead>
                      <tbody>
    `;

    certificates.forEach(cert => {
      html += `
        <tr>
            <td>${cert.title}</td>
            <td>${cert.description}</td>
            <td><img src="${cert.imageUrl}" alt="${cert.title}" style="width: 50px; height: 50px;"></td>
            <td>
                <a href="/admin/delete-certificate/${cert._id}" class="btn btn-danger btn-sm">Delete</a>
            </td>
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
    res.status(500).send('Error loading certificates');
  }
});

// Add certificate route
app.post('/admin/add-certificate', async (req, res) => {
  try {
    const { title, description, imageUrl } = req.body;
    const newCert = new Certificate({ title, description, imageUrl });
    await newCert.save();
    res.redirect('/admin/edit-certificates');
  } catch (error) {
    console.error('Error adding certificate:', error);
    res.status(500).send('Error adding certificate');
  }
});

// Delete certificate route
app.get('/admin/delete-certificate/:id', async (req, res) => {
  try {
    await Certificate.findByIdAndDelete(req.params.id);
    res.redirect('/admin/edit-certificates');
  } catch (error) {
    console.error('Error deleting certificate:', error);
    res.status(500).send('Error deleting certificate');
  }
});

// Admin settings route
app.get('/admin/settings', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin - Settings</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body>
        <div class="container mt-5">
            <h1>Site Settings</h1>
            <a href="/admin/dashboard" class="btn btn-secondary mb-3">Back to Dashboard</a>
            <div class="alert alert-info">
                <strong>Admin Credentials:</strong><br>
                Username: admin_himanshu<br>
                Password: portfolio2025!secure<br>
                <small class="text-muted">Change these in the server.js file for security.</small>
            </div>
            <div class="alert alert-warning">
                <strong>Note:</strong> To fully control the website content, use the Edit Skills and Edit Certificates sections. The frontend currently shows static content, but you can manage data here for future dynamic updates.
            </div>
        </div>
    </body>
    </html>
  `);
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

// API routes for dynamic content
app.get('/api/skills', async (req, res) => {
  try {
    const skills = await Skill.find().sort({ date: -1 });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching skills' });
  }
});

app.get('/api/certificates', async (req, res) => {
  try {
    const certificates = await Certificate.find().sort({ date: -1 });
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching certificates' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});