import LocalStorage from './LocalStorage';
import {Actions} from 'react-native-router-flux';
class Log {
  constructor(limit) {
    this.limit = limit;
    this.logs = [];
    this.currentLoggertab = 'all';
    if (Log._instance) {
      throw new Error('Only one instance can be made');
    }
    Log._instance = this;
  }

  setCurrenttab = tab => {
    this.currentLoggertab = tab;
  };

  getcurrentTab = () => {
    return this.currentLoggertab;
  };

  setLimit = number => {
    this.limit = number;
  };

  getCurrentLimit = () => {
    return this.limit;
  };

  reset = () => {
    this.logs = [];
  };

  /**
   * Valid types:
   * information
   * error
   * warning
   */

  //normal log function
  log(data) {
    let type = 'information';
    let args = [...arguments];
    let date = new Date();
    //checking the local stroage
    LocalStorage.load({
      key: 'loggerdev',
    })
      .then(res => {
        if (res) {
          args.map(i => {
            if (this.logs.length >= this.limit) {
              this.reset();
            }
            this.logs.push({
              data: i,
              type,
              screen:
                Actions.currentScene +
                ' ' +
                date.toLocaleDateString() +
                ' ' +
                date.toLocaleTimeString(),
            });
          });
        }
      })
      .catch(error => {
        Logger.log(error);
      });
  }

  //error function
  err(data) {
    let type = 'error';
    let args = [...arguments];
    let date = new Date();
    LocalStorage.load({
      key: 'loggerdev',
    })
      .then(res => {
        if (res) {
          args.map(i => {
            if (this.logs.length >= this.limit) {
              this.reset();
            }
            if (i instanceof Error) {
              i = {
                name: i.name,
                stack: i.stack,
                message: i.message,
              };
            }
            this.logs.push({
              data: i,
              type,
              screen:
                Actions.currentScene +
                ' ' +
                date.toLocaleDateString() +
                '' +
                date.toLocaleTimeString(),
            });
          });
        }
      })
      .catch(err => {
        Logger.log(err);
      });
  }

  warning(data) {
    let type = 'warning';
    let args = [...arguments];
    let date = new Date();
    LocalStorage.load({
      key: 'loggerdev',
    })
      .then(res => {
        if (res) {
          args.map(i => {
            if (this.logs.length >= this.limit) {
              this.reset();
            }
            this.logs.push({
              data: i,
              type,
              screen:
                Actions.currentScene +
                ' ' +
                date.toLocaleDateString() +
                '' +
                date.toLocaleTimeString(),
            });
          });
        }
      })
      .catch(err => {
        Logger.log(err);
      });
  }

  deleteLog = async idx => {
    await this.logs.splice(idx, 1);
  };

  display = () => {
    return this.logs;
  };
}

const Logger = new Log(100);
//singolton instance

export default Logger;
