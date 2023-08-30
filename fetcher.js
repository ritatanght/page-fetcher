const request = require("request");
const fs = require("fs");

const fetcher = (url, filePath) => {
  request(url, (error, _response, body) => {
    // exit the process when there is an error in making the HTTP request
    if (error) {
      console.log(error);
      process.exit();
    }
    // Try to read if the file exists
    fs.readFile(filePath, (err, data) => {
      // if data is undefined, it means there's no such file
      if (data) {
        console.log("File already exists, overwrite it? (y/n)");
        const stdin = process.stdin;
        stdin.setRawMode(true);
        stdin.setEncoding("utf8");

        //listen for key press
        stdin.on("data", (key) => {
          if (key === "\u0003") {
            process.exit();
          } else if (key === "N" || key === "n") {
            console.log("The file is not replaced, process ended.");
            process.stdin.pause();
          } else if (key === "Y" || key === "y") {
            console.log("File will be replaced.");
            process.stdin.pause();
            writeFile(filePath, body);
          } else {
            // when the input is neither n nor y, continue listen for keypress
            console.log("Invalid input:", key);
            process.stdin.resume();
          }
        });
      } else {
        writeFile(filePath, body);
      }
    });
  });
};

// argValidator function checks that there are exactly 2 args input by the user, otherwise reminds of usage
const argValidator = (args, fetchFunction) => {
  if (args.length !== 2) {
    console.log("Usage: node fetcher.js URL filePath");
    return;
  }
  const [url, filePath] = args;
  return fetchFunction(url, filePath);
};

// writeFile function takes the body downloaded from the URL and write to the filePath
const writeFile = (filePath, body) => {
  fs.writeFile(filePath, body, (err) => {
    // exit the writeFile process when there is an error in writing the file
    if (err) {
      console.error(err);
      process.exit();
    }
    // file written successfully
    // Output format: "Downloaded and saved 1235 bytes to ./index.html."
    console.log(`Downloaded and saved ${body.length} bytes to ${filePath}.`);
  });
};

const args = process.argv.slice(2);
argValidator(args, fetcher);
