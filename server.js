const express = require('express');
const connectDB = require('./config/db');

const app = express(); // app setup

// Connect DAtabase
connectDB();

//Init MiddleWare
app.use(express.json({ extended: false }));

app.get('/', (req, res) =>
    res.send(`Api is running`));
//difine routes 
app.use('/api/user', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));



const PORT = process.env.PORT || 6000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));