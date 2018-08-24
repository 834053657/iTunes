// import Rollbar from 'rollbar';

// Track error by rollbar.com
if (location.host === 'www.paean.net') {
  const fundebug = require("fundebug-javascript");
  fundebug.apikey = "dbcd45221f878a7a268731d2f44c542e8b6ae329cd69259ad71b53817da610ab";
  // Rollbar.init({
  //   accessToken: 'cecdbce666034b4fa14ec98fb1b69d60',
  //   captureUncaught: true,
  //   captureUnhandledRejections: true,
  //   payload: {
  //     environment: 'test',
  //   },
  // });
}
