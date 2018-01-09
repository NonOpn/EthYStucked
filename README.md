# EthYStucked
Monitor geth/parity activity in any server/desktop


[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)


# Install

```
git clone https://github.com/NonOpn/EthYStucked ethystucked
cd ethystucked
npm install
```

# Configuration

Copy the .env.example file into .env

edit the .env file and change the start and stop command with the correct command line you want to use.
for example :
```
DAEMON_STOP=systemctl stop gethc.service
DAEMON_START=systemctl start gethc.service
```

# Roadmap

- .env variable to make the endpoint change
- possibility to monitor multiple instances
- realtime notification of events

# Usage example

It can be easily put into service mode in any linux / windows / mac / etc... environments

Two example services are in the example folder :

  - gethc.service provides a simple way to start (in this case) a go-ethereum classic node (change it according to your parity, geth, geth classic, ubiq etc...)
  - ethystucked.service provides a service to start this project if forked in a /usr/local/ethystucked folder


# Contributing

When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change.

# License

This project is licensed under the GPL v3 License - see the [LICENSE](LICENSE) file for details
