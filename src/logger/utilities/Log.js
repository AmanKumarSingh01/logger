import LocalStorage from './LocalStorage';
import {Actions} from 'react-native-router-flux';
class Log {
  constructor(limit) {
    this.limit = limit;
    this.logs = [];
    this._bytes = 0;
    this._maxBytes = 1024;
    this._warningAlertTriggered = false;
    this._limitExceededAlertTriggered = false;
    this.currentLoggertab = 'all';
    this._LIMIT_EXCEEDED_MESSAGE =
      'LIMIT EXCEEDED: You tried logging above system capacity, logs below size limit will still be logged and logs above size limit will not be logged. To avoid such failure reset logs.';
    this._WARNING_MESSAGE =
      'WARNING: About to reach maximum system size limit for logs, kindly reset the logs from the Log screen to avoid failure.';
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
    this._bytes = 0;
    this._warningAlertTriggered = false;
    this._limitExceededAlertTriggered = false;
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
              // eslint-disable-next-line no-alert
              // alert(
              //   'You have reached the maximum logging limit please increase the size',
              // );
              return;
            }
            let dataSize = this.sizeOf(i);
            // if 70<=size <=100
            if (
              this._bytes + dataSize > 0.7 * this._maxBytes &&
              this._bytes + dataSize < this._maxBytes &&
              !this._warningAlertTriggered
            ) {
              // eslint-disable-next-line no-alert
              alert(this._WARNING_MESSAGE);
              this._warningAlertTriggered = true;
            } else if (
              this._bytes + dataSize > this._maxBytes &&
              !this._limitExceededAlertTriggered
            ) {
              // eslint-disable-next-line no-alert
              alert(this._LIMIT_EXCEEDED_MESSAGE);
              this._limitExceededAlertTriggered = true;
            }

            if (this._bytes + dataSize <= this._maxBytes) {
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
              this._bytes += dataSize;
            }
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
              // eslint-disable-next-line no-alert
              // alert(
              //   'You have reached the maximum logging limit please increase the size',
              // );
              return;
            }
            if (i instanceof Error) {
              i = {
                name: i.name,
                stack: i.stack,
                message: i.message,
              };
            }
            let dataSize = this.sizeOf(i);
            if (
              this._bytes + dataSize > 0.7 * this._maxBytes &&
              this._bytes + dataSize < this._maxBytes &&
              !this._warningAlertTriggered
            ) {
              // eslint-disable-next-line no-alert
              alert(this._WARNING_MESSAGE);
              this._warningAlertTriggered = true;
            } else if (
              this._bytes + dataSize > this._maxBytes &&
              !this._limitExceededAlertTriggered
            ) {
              // eslint-disable-next-line no-alert
              alert(this._LIMIT_EXCEEDED_MESSAGE);
              this._limitExceededAlertTriggered = true;
            }
            if (this._bytes + dataSize <= this._maxBytes) {
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
              this._bytes += dataSize;
            }
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
              // eslint-disable-next-line no-alert
              // alert(
              //   'You have reached the maximum logging limit please increase the size',
              // );
              return;
            }

            let dataSize = this.sizeOf(i);
            if (
              this._bytes + dataSize > 0.7 * this._maxBytes &&
              this._bytes + dataSize < this._maxBytes &&
              !this._warningAlertTriggered
            ) {
              // eslint-disable-next-line no-alert
              alert(this._WARNING_MESSAGE);
              this._warningAlertTriggered = true;
            } else if (
              this._bytes + dataSize > this._maxBytes &&
              !this._limitExceededAlertTriggered
            ) {
              // eslint-disable-next-line no-alert
              alert(this._LIMIT_EXCEEDED_MESSAGE);
              this._limitExceededAlertTriggered = true;
            }
            if (this._bytes + dataSize <= this._maxBytes) {
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
              this._bytes += dataSize;
            }
          });
        }
      })
      .catch(err => {
        Logger.log(err);
      });
  }

  deleteLog = async idx => {
    let deletedLog = await this.logs.splice(idx, 1);
    this._bytes -= this.sizeOf(deletedLog);
    if (this._bytes < this._maxBytes * 0.7) {
      this._limitExceededAlertTriggered = false;
      this._warningAlertTriggered = false;
    } else if (
      this._bytes > this._maxBytes * 0.7 &&
      this._bytes < this._maxBytes
    ) {
      this._limitExceededAlertTriggered = false;
    }
  };

  display = () => {
    return this.logs;
  };

  //bytes conversion
  typeSizes = {
    undefined: () => 0,
    boolean: () => 4,
    number: () => 8,
    string: item => 2 * item.length,
    object: item =>
      !item
        ? 0
        : Object.keys(item).reduce(
            (total, key) => this.sizeOf(key) + this.sizeOf(item[key]) + total,
            0,
          ),
  };

  sizeOf = value => this.typeSizes[typeof value](value);

  getSizeLimit = () => {
    return this._limitExceededAlertTriggered
      ? 'limitExceeded'
      : this._warningAlertTriggered && !this._limitExceededAlertTriggered
      ? 'warning'
      : 'normal';
  };
  getDataSize = () => {
    return this._bytes;
  };
}

//singelton instance
const Logger = new Log(100);

export default Logger;
