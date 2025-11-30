const express = require('express');
const app = express();

app.use(express.json());

app.get('/api/users', (req, res) => {
  res.json({ users: [{id:1, name:'John Dark'}] });
});

app.post('/api/login', (req, res) => {
  res.json({ token: 'dark-token-123' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Dark app on ${PORT}`));
