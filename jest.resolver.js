// Custom Jest resolver to handle rpc-websockets and Solana packages
// that use .cjs extensions in their dist folders
const path = require('path');
const fs = require('fs');

module.exports = (request, options) => {
  // Use the default resolver first
  try {
    return options.defaultResolver(request, options);
  } catch (error) {
    // If the module isn't found and it's from rpc-websockets dist/lib, try adding .cjs
    if (request.includes('rpc-websockets/dist/lib/')) {
      try {
        return options.defaultResolver(request + '.cjs', options);
      } catch (e) {
        // If that doesn't work either, throw the original error
        throw error;
      }
    }
    
    // For rpc-websockets main module from nested node_modules, try to find it
    if (request === 'rpc-websockets') {
      const basedir = options.basedir;
      // Try to find rpc-websockets in nested node_modules
      const possiblePaths = [
        path.join(basedir, 'node_modules', 'rpc-websockets'),
        path.join(basedir, '..', 'node_modules', 'rpc-websockets'),
        path.join(basedir, '..', '..', 'node_modules', 'rpc-websockets'),
        path.join(basedir, '..', '..', '..', 'node_modules', 'rpc-websockets'),
        path.join(basedir, '..', '..', '..', '..', 'node_modules', 'rpc-websockets'),
      ];
      
      for (const possiblePath of possiblePaths) {
        if (fs.existsSync(possiblePath)) {
          const packageJsonPath = path.join(possiblePath, 'package.json');
          if (fs.existsSync(packageJsonPath)) {
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
            const mainFile = packageJson.main || 'index.js';
            const resolved = path.join(possiblePath, mainFile);
            if (fs.existsSync(resolved)) {
              return resolved;
            }
          }
        }
      }
    }
    
    // For any other errors, rethrow
    throw error;
  }
};

