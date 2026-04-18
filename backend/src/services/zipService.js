const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const { v4: uuidv4 } = require('uuid');

// Point the temp directory safely inside your backend folder
const TMP_DIR = path.join(__dirname, '../../tmp');

// If the folder doesn't exist, create it automatically!
if (!fs.existsSync(TMP_DIR)) {
  fs.mkdirSync(TMP_DIR, { recursive: true });
}

async function createZipFromFiles(files) {
  return new Promise((resolve, reject) => {
    // Generate a random unique name for the zip file
    const zipFileName = `${uuidv4()}.zip`;
    const zipPath = path.join(TMP_DIR, zipFileName);

    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', {
      zlib: { level: 9 }, // Sets the compression level
    });

    // Listen for all archive data to be written
    output.on('close', () => {
      resolve(zipPath);
    });

    // Catch warnings and errors
    archive.on('warning', (err) => {
      if (err.code === 'ENOENT') {
        console.warn(err);
      } else {
        reject(err);
      }
    });

    archive.on('error', (err) => {
      reject(err);
    });

    // Pipe archive data to the file
    archive.pipe(output);

    // Loop through the AI's JSON object and add each file to the zip
    for (const [filename, content] of Object.entries(files)) {
      archive.append(content, { name: filename });
    }

    // Finalize the archive (this tells archiver we are done appending files)
    archive.finalize();
  });
}

module.exports = { createZipFromFiles };
