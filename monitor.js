const config = require("./config/monitor.js"),
dotenv = require("dotenv"),
cmd = require("node-cmd"),
moment = require('moment'),
Web3 = require("web3"),
web3 = new Web3(new Web3.providers.HttpProvider(config.rpc));

dotenv.config();

const WAITING = "WAITING";
const SYNC = "SYNC";
const FETCH = "FETCH";

function Monitor() {
  this._started = false;
  this._last_type = WAITING;
}

Monitor.prototype.start = function() {
  if(!this._started) {
    this._started = true;
    this.internalStart()
  }
}

Monitor.prototype.internalStart = function() {
  this.waitForStart()
  .then(result => { return this.isSyncing(); })
  .then(bool => {
    console.log("syncing = ", bool);
    if(bool) {
      this.waitForEndSyncing()
      .then(finished => this.internalRestart());
    } else {
      this.waitForBlock()
      .then(should_restart => {
        return this.restartSoftware();
      })
      .then(result => {
        console.log("restarted", result);
        this.internalRestart();
      })
    }
  })
}

Monitor.prototype.waitForEndSyncing = function() {
  return new Promise((resolve, reject) => {
    const callback = () => {
      this.isSyncing()
      .then(is_syncing => {
        if(is_syncing) {
          setTimeout(() => callback(), 10000);
        } else {
          resolve(true);
        }
      })
    };
    callback();
  });
}

Monitor.prototype.waitForBlock = function() {
  return new Promise((resolve, reject) => {
    var last_block = undefined;
    var last_date = moment();
    const callback = () => {
      this.getBlockNumber()
      .then(block_number => {
        if(block_number && block_number != last_block) {
          console.log("new block number", block_number)
          last_block = block_number;
          last_date = moment();
          setTimeout(() => callback(), 1000);
        } else if(moment().diff(last_date, "minutes") > 5) { //60
          console.log("should restart ...");
          resolve(true);
        } else {
          setTimeout(() => callback(), 1000);
        }
      })
      .catch(err => console.log(err));
    }

    callback();
  });
}

Monitor.prototype.getBlockNumber = function() {
  return new Promise((resolve, reject) => {
    var finished = false;
    setTimeout(() => {
      if(!finished) {
        finished = true;
        resolve(undefined);
      };
    },  10 * 1000);

    web3.eth.getBlockNumber()
    .then(block_number => {
      if(!finished) {
        finished = true;
        resolve(block_number);
      }
    });
  });
}
Monitor.prototype.waitForStart = function() {
  return new Promise((resolve, reject) => {
    var callback = () => {
      web3.eth.net.isListening()
      .then(result => {
        if(result === true) resolve(true);
        else throw "retry";
      })
      .catch(err => {
        setTimeout(() => callback(), 5000);
      });
    }

    callback();
  });
}

Monitor.prototype.isSyncing = function() {
  return new Promise((resolve, reject) => {
    web3.eth.isSyncing()
    .then(result => {
      if(result && result.currentBlock) {
        console.log("currently syncing ...");
        resolve(true);
      } else {
        resolve(false);
      }
    })
    .catch(err => {
      reject(err);
    });
  });
}

Monitor.prototype.restartSoftware = function() {
  return new Promise((resolve, reject) => {
    cmd.get(process.env.DAEMON_STOP, (err, data, stderr) => {
      setTimeout(() => {
        cmd.get(process.env.DAEMON_START, (err, data, stderr) => {
          resolve(true);
        });
      }, 30 * 1000);
    });
  });
}

Monitor.prototype.internalRestart = function() {
  setTimeout(() => this.internalStart(), 5000);
}


module.exports = Monitor;
