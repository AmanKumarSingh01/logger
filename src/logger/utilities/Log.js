import LocalStorage from './LocalStorage';
import {Actions} from 'react-native-router-flux';
class Log {
  constructor(limit) {
    this.limit = limit;
    this.logs = [];
    this.currentLoggertab = 'all';
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
              screen: Actions.currentScene,
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
              screen: Actions.currentScene,
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
              screen: Actions.currentScene,
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

export default Logger;
