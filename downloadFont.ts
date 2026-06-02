import fs from 'fs';
import https from 'https';
import path from 'path';

const url = 'https://online-fonts.com/sites/default/files/2024-07/HelveticaNeue-Roman.otf';
const destFolder = path.join(process.cwd(), 'public', 'fonts');
const destFile = path.join(destFolder, 'HelveticaNeue-Roman.otf');

fs.mkdirSync(destFolder, { recursive: true });

const file = fs.createWriteStream(destFile);
https.get(url, (response) => {
  response.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log('Download completed.');
  });
}).on('error', (err) => { // Handle errors
  fs.unlink(destFile, () => {}); // Delete the file async. (But we don't check the result)
  console.error('Error downloading:', err.message);
});
