var schedule = require('node-schedule'),
  readline = require('readline'),
  rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  }),
  fs = require('fs'),
  spawn = require('child_process').spawn;


setInterval(function(){
var proc = spawn('xvfb-run', ['-a', 'node', '--harmony', 'core2.js']);
  proc.stdout.on('data', function(data) {
    console.log(data.toString());
  });
},300000);