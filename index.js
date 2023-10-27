require('dotenv').config();

const fs = require('fs');
const path = require('path');

const cookieParser = require('cookie-parser');

const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET, { signed: true, httpOnly: false }));
app.use(express.static(path.join(__dirname, 'frontend', 'build')));
app.use(express.static('public'));



const routesDirPath = path.resolve(__dirname, 'backend', 'routes');
const routesDirContents = fs.readdirSync(routesDirPath);
routesDirContents.forEach(item => {
    const routePath = `${routesDirPath}/${item}/${item}.js`;
    if (fs.existsSync(routePath)) {
        app.use(`/${item}`, require(routePath));
    }
});



app.use(express.static(path.resolve(__dirname, 'frontend', 'build')));

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
});



const port = process.env.PORT || process.env.BACKEND_PORT || 3001;
app.listen(port, () => console.log(`Server running on port ${port}`));

