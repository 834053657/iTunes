// import Rollbar from 'rollbar';
import { getLocale } from './utils/authority';

const fundebug = require("fundebug-javascript");

// Track error by rollbar.com
if (location.host === 'www.paean.net') {
  fundebug.apikey = "dbcd45221f878a7a268731d2f44c542e8b6ae329cd69259ad71b53817da610ab";
  // fundebug.silentConsole = true;
  fundebug.silentResource = true;
  // fundebug.silentVideo = false;
  fundebug.metaData = {
    local: getLocale()
  };
  fundebug.filters = [
    // {
    //   req:
    //     {
    //       method: /^GET|POST$/
    //     },
    //   res:
    //     {
    //       status: /^401|403$/
    //     }
    // }
    {
      req:
        {
          method: /^GET$/
        },
      res:
        {
          status: /^401$/
        }
    }
    ]
  // Rollbar.init({
  //   accessToken: 'cecdbce666034b4fa14ec98fb1b69d60',
  //   captureUncaught: true,
  //   captureUnhandledRejections: true,
  //   payload: {
  //     environment: 'test',
  //   },
  // });
}
