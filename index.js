const DiscoveryService = require("./discovery");
const Monitor = require("./monitor");

const discovery = new DiscoveryService();
const monitor = new Monitor();

discovery.bind();
monitor.start();
