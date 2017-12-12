var dgram = require("dgram");

var server = dgram.createSocket("udp4");

server.on("message", function (message, rinfo) {
  try {
    const json = JSON.parse(message);
    if(json.discover) {
      const replay = {
        service: "ethystucked",
        data: {
        }
      };

      const message = new Buffer(JSON.stringify(replay));
      server.send(message, 0, message.length, rinfo.port, rinfo.address);
    }
  } catch(e) {
    console.log(e);
  }
});

server.on("listening", function () {
  var address = server.address();
  console.log("server listening " + address.address + ":" + address.port);
});


function DiscoveryService() {
  this._bound = false;
}

DiscoveryService.prototype.bind = function () {
  if(!this._bound) {
    this._bound = true;
    server.bind(1732);
  }
}

module.exports = DiscoveryService;
