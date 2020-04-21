var pm2 = require('pm2');

pm2.connect(function(err) {
  if (err) {
    console.error(err);
    process.exit(2);
  }
  
  pm2.start({
    script    : 'server.js',         // Script to be run
    name: "lego",
    max_memory_restart : '10M'   // Optional: Restarts your app if it reaches 100Mo
  }, function(err, apps) {
    pm2.disconnect();   // Disconnects from PM2
    if (err) throw err
  });

  setTimeout(function worker() {
    console.log("Restarting lego...");
    pm2.restart('lego', function() {});
    setTimeout(worker, 1000 * 60 * 30)
  }, 1000 * 60 * 30);

});

