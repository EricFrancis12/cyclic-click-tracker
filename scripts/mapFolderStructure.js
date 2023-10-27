const fs = require('fs');
const path = require('path');

console.log('~~~~~ STARTING MAP FOLDER STRUCTURE ~~~~~');
console.log(mapFolderStructure(__dirname));
console.log('~~~~~ FINISHED MAP FOLDER STRUCTURE ~~~~~');



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
