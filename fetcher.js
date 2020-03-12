const args = process.argv.slice(2);

const uri = args[0];
const path = args[1];
const fs = require('fs');

const request = require('request');

const stdin = process.stdin;

// seperate directory path from path
const newPath = path.split('/');
newPath.pop();
const directoryPath = newPath.join('/');

const isFileExist = (callback) => {
  if (fs.existsSync(path)) {
    configureStdInt();
    stdin.on('data', (key) => {

      if (key === '\u0003') {
        process.stdout.write('\rOperation Cancelled.\n');
        process.exit();
      }
      if (key === 'y' || key === 'Y') {
        callback();
      }
      if (key === 'n' || key === 'N') {
        process.exit();
      }
    });
    // if path does not exist
  } else if (!fs.existsSync(path)) {
    // if directory exists
    if (fs.existsSync(directoryPath)) {
      callback();
      // if directory does not exist
    } else {
      console.log('The directory does not exist.');
      process.exit();
    }
  } else {
    callback();
  }
}

const configureStdInt = () => {
  stdin.setRawMode(true);
  stdin.setEncoding('utf8');
  console.log('The file already exists. Do you want to overwrite the file? (y/n)');
}

const writeFileAndPrint = () => {
  request(uri, (error, response, body) => {
    if (response !== undefined) {
      fs.writeFile(path, body, (err) => {
        if (err) {
          console.log(err);
          process.exit();
          
        } else {
          console.log(`Downloaded and saved ${body.length} bytes to ${path}`);
          process.exit();
        }
      });
    } else {
      console.log(`Failed to retreive data from the given url`);
      process.exit();
    }
  });
}


isFileExist(writeFileAndPrint);