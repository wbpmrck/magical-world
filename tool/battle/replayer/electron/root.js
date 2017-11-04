const electron = require('electron');
const proc = require('child_process');

// will print something similar to /Users/maf/.../Electron
console.log(electron);

// spawn Electron
const child = proc.spawn(electron, ["main.js", "--debug=5858", ], { cwd: __dirname});

