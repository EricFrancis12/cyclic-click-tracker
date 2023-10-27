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



app.get('/test', (req, res) => {
    const rootPath = path.join(__dirname);
    const rootFolderStructure = mapFolderStructure(rootPath);

    res.json({
        rootFolderStructure
    });

    function mapFolderStructure(dir) {
        const folderStructure = {};
        const files = fs.readdirSync(dir);

        files.forEach(file => {
            const filePath = path.join(dir, file);
            const fileStat = fs.statSync(filePath);

            if (fileStat.isDirectory()) {
                folderStructure[file] = mapFolderStructure(filePath);
            } else {
                folderStructure[file] = 'File';
            }
        });

        return folderStructure;
    }
});



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

