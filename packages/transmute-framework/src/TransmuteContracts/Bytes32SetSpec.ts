import { BigNumber } from 'bignumber.js'
import { W3, SoltsiceContract } from 'soltsice'

/**
 * Bytes32SetSpec API
 */
export class Bytes32SetSpec extends SoltsiceContract {
  static get Artifacts() {
    return require('../contracts/Bytes32SetSpec.json')
  }

  static get BytecodeHash() {
    // we need this before ctor, but artifacts are static and we cannot pass it to the base class, so need to generate
    let artifacts = Bytes32SetSpec.Artifacts
    if (!artifacts || !artifacts.bytecode) {
      return undefined
    }
    let hash = W3.sha3(JSON.stringify(artifacts.bytecode))
    return hash
  }

  // tslint:disable-next-line:max-line-length
  static async New(
    deploymentParams: W3.TX.TxParams,
    ctorParams?: {},
    w3?: W3,
    link?: SoltsiceContract[]
  ): Promise<Bytes32SetSpec> {
    let contract = new Bytes32SetSpec(deploymentParams, ctorParams, w3, link)
    await contract._instancePromise
    return contract
  }

  static async At(address: string | object, w3?: W3): Promise<Bytes32SetSpec> {
    let contract = new Bytes32SetSpec(address, undefined, w3, undefined)
    await contract._instancePromise
    return contract
  }

  protected constructor(
    deploymentParams: string | W3.TX.TxParams | object,
    ctorParams?: {},
    w3?: W3,
    link?: SoltsiceContract[]
  ) {
    // tslint:disable-next-line:max-line-length
    super(w3, Bytes32SetSpec.Artifacts, ctorParams ? [] : [], deploymentParams, link)
  }
  /*
        Contract methods
    */

  // tslint:disable-next-line:max-line-length
  // tslint:disable-next-line:variable-name
  public getValues(txParams?: W3.TX.TxParams): Promise<string> {
    return new Promise((resolve, reject) => {
      this._instance.getValues
        .call(txParams || this._sendParams)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  }

  // tslint:disable-next-line:max-line-length
  // tslint:disable-next-line:variable-name
  public contains(value: string, txParams?: W3.TX.TxParams): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this._instance.contains
        .call(value, txParams || this._sendParams)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  }

  // tslint:disable-next-line:max-line-length
  // tslint:disable-next-line:variable-name
  public first(txParams?: W3.TX.TxParams): Promise<string> {
    return new Promise((resolve, reject) => {
      this._instance.first
        .call(txParams || this._sendParams)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  }

  // tslint:disable-next-line:member-ordering
  public add = Object.assign(
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    (value: string, txParams?: W3.TX.TxParams): Promise<W3.TX.TransactionResult> => {
      return new Promise((resolve, reject) => {
        this._instance
          .add(value, txParams || this._sendParams)
          .then(res => resolve(res))
          .catch(err => reject(err))
      })
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      sendTransaction: (value: string, txParams?: W3.TX.TxParams): Promise<string> => {
        return new Promise((resolve, reject) => {
          this._instance.add
            .sendTransaction(value, txParams || this._sendParams)
            .then(res => resolve(res))
            .catch(err => reject(err))
        })
      }
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      data: (value: string): Promise<string> => {
        return new Promise((resolve, reject) => {
          resolve(this._instance.add.request(value).params[0].data)
        })
      }
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      estimateGas: (value: string): Promise<number> => {
        return new Promise((resolve, reject) => {
          this._instance.add.estimateGas(value).then(g => resolve(g))
        })
      }
    }
  )

  // tslint:disable-next-line:max-line-length
  // tslint:disable-next-line:variable-name
  public last(txParams?: W3.TX.TxParams): Promise<string> {
    return new Promise((resolve, reject) => {
      this._instance.last
        .call(txParams || this._sendParams)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  }

  // tslint:disable-next-line:member-ordering
  public pop = Object.assign(
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    (index: BigNumber | number, txParams?: W3.TX.TxParams): Promise<W3.TX.TransactionResult> => {
      return new Promise((resolve, reject) => {
        this._instance
          .pop(index, txParams || this._sendParams)
          .then(res => resolve(res))
          .catch(err => reject(err))
      })
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      sendTransaction: (index: BigNumber | number, txParams?: W3.TX.TxParams): Promise<string> => {
        return new Promise((resolve, reject) => {
          this._instance.pop
            .sendTransaction(index, txParams || this._sendParams)
            .then(res => resolve(res))
            .catch(err => reject(err))
        })
      }
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      data: (index: BigNumber | number): Promise<string> => {
        return new Promise((resolve, reject) => {
          resolve(this._instance.pop.request(index).params[0].data)
        })
      }
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      estimateGas: (index: BigNumber | number): Promise<number> => {
        return new Promise((resolve, reject) => {
          this._instance.pop.estimateGas(index).then(g => resolve(g))
        })
      }
    }
  )

  // tslint:disable-next-line:member-ordering
  public set = Object.assign(
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    (
      index: BigNumber | number,
      value: string,
      txParams?: W3.TX.TxParams
    ): Promise<W3.TX.TransactionResult> => {
      return new Promise((resolve, reject) => {
        this._instance
          .set(index, value, txParams || this._sendParams)
          .then(res => resolve(res))
          .catch(err => reject(err))
      })
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      sendTransaction: (
        index: BigNumber | number,
        value: string,
        txParams?: W3.TX.TxParams
      ): Promise<string> => {
        return new Promise((resolve, reject) => {
          this._instance.set
            .sendTransaction(index, value, txParams || this._sendParams)
            .then(res => resolve(res))
            .catch(err => reject(err))
        })
      }
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      data: (index: BigNumber | number, value: string): Promise<string> => {
        return new Promise((resolve, reject) => {
          resolve(this._instance.set.request(index, value).params[0].data)
        })
      }
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      estimateGas: (index: BigNumber | number, value: string): Promise<number> => {
        return new Promise((resolve, reject) => {
          this._instance.set.estimateGas(index, value).then(g => resolve(g))
        })
      }
    }
  )

  // tslint:disable-next-line:max-line-length
  // tslint:disable-next-line:variable-name
  public indexOf(value: string, txParams?: W3.TX.TxParams): Promise<BigNumber> {
    return new Promise((resolve, reject) => {
      this._instance.indexOf
        .call(value, txParams || this._sendParams)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  }

  // tslint:disable-next-line:member-ordering
  public destroy = Object.assign(
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    (txParams?: W3.TX.TxParams): Promise<W3.TX.TransactionResult> => {
      return new Promise((resolve, reject) => {
        this._instance
          .destroy(txParams || this._sendParams)
          .then(res => resolve(res))
          .catch(err => reject(err))
      })
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      sendTransaction: (txParams?: W3.TX.TxParams): Promise<string> => {
        return new Promise((resolve, reject) => {
          this._instance.destroy
            .sendTransaction(txParams || this._sendParams)
            .then(res => resolve(res))
            .catch(err => reject(err))
        })
      }
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      data: (): Promise<string> => {
        return new Promise((resolve, reject) => {
          resolve(this._instance.destroy.request().params[0].data)
        })
      }
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      estimateGas: (): Promise<number> => {
        return new Promise((resolve, reject) => {
          this._instance.destroy.estimateGas().then(g => resolve(g))
        })
      }
    }
  )

  // tslint:disable-next-line:max-line-length
  // tslint:disable-next-line:variable-name
  public lastRemove(txParams?: W3.TX.TxParams): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this._instance.lastRemove
        .call(txParams || this._sendParams)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  }

  // tslint:disable-next-line:max-line-length
  // tslint:disable-next-line:variable-name
  public owner(txParams?: W3.TX.TxParams): Promise<string> {
    return new Promise((resolve, reject) => {
      this._instance.owner
        .call(txParams || this._sendParams)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  }

  // tslint:disable-next-line:max-line-length
  // tslint:disable-next-line:variable-name
  public lastPop(txParams?: W3.TX.TxParams): Promise<string> {
    return new Promise((resolve, reject) => {
      this._instance.lastPop
        .call(txParams || this._sendParams)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  }

  // tslint:disable-next-line:max-line-length
  // tslint:disable-next-line:variable-name
  public size(txParams?: W3.TX.TxParams): Promise<BigNumber> {
    return new Promise((resolve, reject) => {
      this._instance.size
        .call(txParams || this._sendParams)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  }

  // tslint:disable-next-line:max-line-length
  // tslint:disable-next-line:variable-name
  public get(index: BigNumber | number, txParams?: W3.TX.TxParams): Promise<string> {
    return new Promise((resolve, reject) => {
      this._instance.get
        .call(index, txParams || this._sendParams)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  }

  // tslint:disable-next-line:member-ordering
  public remove = Object.assign(
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    (value: string, txParams?: W3.TX.TxParams): Promise<W3.TX.TransactionResult> => {
      return new Promise((resolve, reject) => {
        this._instance
          .remove(value, txParams || this._sendParams)
          .then(res => resolve(res))
          .catch(err => reject(err))
      })
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      sendTransaction: (value: string, txParams?: W3.TX.TxParams): Promise<string> => {
        return new Promise((resolve, reject) => {
          this._instance.remove
            .sendTransaction(value, txParams || this._sendParams)
            .then(res => resolve(res))
            .catch(err => reject(err))
        })
      }
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      data: (value: string): Promise<string> => {
        return new Promise((resolve, reject) => {
          resolve(this._instance.remove.request(value).params[0].data)
        })
      }
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      estimateGas: (value: string): Promise<number> => {
        return new Promise((resolve, reject) => {
          this._instance.remove.estimateGas(value).then(g => resolve(g))
        })
      }
    }
  )

  // tslint:disable-next-line:member-ordering
  public transferOwnership = Object.assign(
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    (newOwner: string, txParams?: W3.TX.TxParams): Promise<W3.TX.TransactionResult> => {
      return new Promise((resolve, reject) => {
        this._instance
          .transferOwnership(newOwner, txParams || this._sendParams)
          .then(res => resolve(res))
          .catch(err => reject(err))
      })
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      sendTransaction: (newOwner: string, txParams?: W3.TX.TxParams): Promise<string> => {
        return new Promise((resolve, reject) => {
          this._instance.transferOwnership
            .sendTransaction(newOwner, txParams || this._sendParams)
            .then(res => resolve(res))
            .catch(err => reject(err))
        })
      }
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      data: (newOwner: string): Promise<string> => {
        return new Promise((resolve, reject) => {
          resolve(this._instance.transferOwnership.request(newOwner).params[0].data)
        })
      }
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      estimateGas: (newOwner: string): Promise<number> => {
        return new Promise((resolve, reject) => {
          this._instance.transferOwnership.estimateGas(newOwner).then(g => resolve(g))
        })
      }
    }
  )

  // tslint:disable-next-line:member-ordering
  public destroyAndSend = Object.assign(
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:variable-name
    (_recipient: string, txParams?: W3.TX.TxParams): Promise<W3.TX.TransactionResult> => {
      return new Promise((resolve, reject) => {
        this._instance
          .destroyAndSend(_recipient, txParams || this._sendParams)
          .then(res => resolve(res))
          .catch(err => reject(err))
      })
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      sendTransaction: (_recipient: string, txParams?: W3.TX.TxParams): Promise<string> => {
        return new Promise((resolve, reject) => {
          this._instance.destroyAndSend
            .sendTransaction(_recipient, txParams || this._sendParams)
            .then(res => resolve(res))
            .catch(err => reject(err))
        })
      }
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      data: (_recipient: string): Promise<string> => {
        return new Promise((resolve, reject) => {
          resolve(this._instance.destroyAndSend.request(_recipient).params[0].data)
        })
      }
    },
    {
      // tslint:disable-next-line:max-line-length
      // tslint:disable-next-line:variable-name
      estimateGas: (_recipient: string): Promise<number> => {
        return new Promise((resolve, reject) => {
          this._instance.destroyAndSend.estimateGas(_recipient).then(g => resolve(g))
        })
      }
    }
  )

  // tslint:disable-next-line:max-line-length
  // tslint:disable-next-line:variable-name
  public lastAdd(txParams?: W3.TX.TxParams): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this._instance.lastAdd
        .call(txParams || this._sendParams)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  }
}
