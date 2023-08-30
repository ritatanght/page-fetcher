const request = require("request");
const fs = require("fs");

const fetcher = (url, filePath) => {
  request(url, (error, _response, body) => {
    // exit the process when there is an error in making the HTTP request
    if (error) {
      console.log(error);
      process.exit();
    }

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

const args = process.argv.slice(2);
argValidator(args, fetcher);
