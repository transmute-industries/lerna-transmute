#!/usr/bin/env node
/** @module TransmuteCLI */

// Performance
const { performance } = require('perf_hooks');

// Process env vars
const MY_ENV = process.env.USE_KUBASH || 'true';

// Vorpal
const vorpal = require('vorpal')();
const vorpalLog = require('vorpal-log');
const vorpalTour = require('vorpal-tour');
vorpal.use(vorpalLog);

// Utils
const { writeFile } = require('./utils');

// Commands
const ls = require('./commands/ls');
const init = require('./commands/init');
const provision = require('./commands/provision');
const telemetry = require('./commands/telemetry');

const listKeys = require('./commands/list-keys');
const generateKeys = require('./commands/generate-keys');
const generateRecoveryKey = require('./commands/generate-recovery-key');

const exportPrivateKey = require('./commands/export-private-key');

const login = require('./commands/login');

const debug = require('./commands/debug');

const logger = require('./logger');

// Mixpanel
const Mixpanel = require('mixpanel');
const mixpanelToken =
  process.env.MIXPANEL_PROJECT_ID || '535f9b3a8daba1dfe4777a7343e6e0f5';
const mixpanel = Mixpanel.init(mixpanelToken);
vorpal.telemetrySend = telemetry.send(mixpanel);

/** transmute login retrieves and stores a JWT for use with the Transmute API.
 * @name transmute login
 * @example transmute login
 * */
vorpal
  .command('login')
  .description('Login to the Transmute CLI')
  .action(async (args, callback) => {
    await login.okta.login();
    callback();
  });

/** transmute generate-keys creates and stores a primary and recovery secp256k1 key.
 * @name transmute generate-keys
 * @example transmute generate-keys
 * */
vorpal
  .command('generate-keys')
  .description('Generate primary and recovery keys with the Transmute CLI')
  .action(function (args, callback) {
    var promise = this.prompt([
      {
        type: 'password',
        name: 'passphrase',
        message: 'Password: '
      }
    ]);

    promise.then(async (res) => {
      await generateKeys.generateKeys(res);
      callback();
    });
  });

/** transmute generate-recovery-key creates and stores new recovery secp256k1 key.
 * @name transmute generate-recovery-key
 * @example transmute generate-recovery-key
 * */
vorpal
  .command('generate-recovery-key')
  .description('Generate new recovery key with the Transmute CLI')
  .action(function (args, callback) {
    var hasFingerprintPromise = this.prompt([
      {
        type: 'input',
        name: 'hasFingerprint',
        message: 'Before proceeding, you will need to have your recovery key fingerprint copied to your clipboard.\nYou can find this by running the `list-keys` command and copying the 40 character string below `pub` on the last entry.\n Do you have this value copied? (y/n): '
      }
    ]);

    hasFingerprintPromise.then(async (res) => {
      if (res.hasFingerprint.toLowerCase() === 'y') {
        var promise = this.prompt([
          {
            type: 'input',
            name: 'fingerprint',
            message: 'Recovery key fingerprint: '
          },
          {
            type: 'password',
            name: 'passphrase',
            message: 'New recovery key passphrase: '
          }
        ]);

        promise.then(async (res) => {
          await generateRecoveryKey.generateRecoveryKey(res);
          callback();
        });
      } else if (res.hasFingerprint.toLowerCase() === 'n') {
        console.error('Re-run this command after copying your recovery key fingerprint.');
        callback();
      } else {
        console.error('Invalid input, exiting...');
        callback();
      }
    });
  });

/** transmute export-private-key exports the private key for a specified GPG key
 * @name transmute export-private-key
 * @example transmute export-private-key
 * */
vorpal
  .command('export-private-key')
  .description('Export private key for a primary keypair')
  .action(function (args, callback) {
    var hasFingerprintPromise = this.prompt([
      {
        type: 'input',
        name: 'hasFingerprint',
        message: 'Before proceeding, you will need to have your primary key fingerprint copied to your clipboard.\nYou can find this by running the `list-keys` command and copying the 40 character string below `pub` on the second-to-last entry.\n Do you have this value copied? (y/n): '
      }
    ]);

    hasFingerprintPromise.then(async (res) => {
      if (res.hasFingerprint.toLowerCase() === 'y') {
        var promise = this.prompt([
          {
            type: 'input',
            name: 'fingerprint',
            message: 'Primary key fingerprint: '
          },
          {
            type: 'password',
            name: 'passphrase',
            message: 'Passphrase for primary key: '
          }
        ]);

        promise.then(async (res) => {
          await exportPrivateKey.exportPrivateKey(res);
          callback();
        });
      } else if (res.hasFingerprint.toLowerCase() === 'n') {
        console.error('Re-run this command after copying your recovery key fingerprint.');
        callback();
      } else {
        console.error('Invalid input, exiting...');
        callback();
      }
    });
  });

/** transmute list-keys lists all user GPG keys
 * @name transmute list-keys
 * @example transmute list-keys
 * */
vorpal
  .command('list-keys')
  .description('List all GPG keys')
  .action(async (args, callback) => {
    await listKeys.listKeys();
    callback();
  });

/** transmute k8s  init initializes a cluster with the transmute framework
 * @name transmute k8s init <clustername>
 * @example transmute k8s init myClusterName
 * */
vorpal
  .command('k8s init <clustername>')
  .description('Initialize k8s cluster')
  .option('--dryrun', 'Print out what would be done without executing anything')
  .action(function(args, callback) {
    var t0 = performance.now();
    // begin performance test
    let dryrun = 'false';
    if (args.options.dryrun) {
      dryrun = 'true';
    }
    init.k8s(dryrun, args.clustername);
    // end performance test
    var t1 = performance.now();
    vorpal.logger.info(
      'Call to transmute init took ' +
        ((t1 - t0) / 1000).toPrecision(4) +
        ' seconds.'
    );
    callback();
  });

/** transmute k8s provision-azure uses azure to provision a k8s cluster
 * @name transmute k8s provision-azure <clustername>
 * @example transmute k8s provision-azure myClusterName --gensshkeys
 * */
vorpal
  .command('k8s provision-azure <clustername> <group>')
  .description('Provision k8s cluster in Azure')
  .option('--gensshkeys', 'Generate SSH keys')
  .option('--dryrun', 'Print out what would be done without executing anything')
  .option('--nodes <nodes>', 'How many nodes to create the cluster with')
  .option(
    '--nodesize <nodesize>',
    'Specify the size of nodes to create the cluster with'
  )
  .action(function(args, callback) {
    var t0 = performance.now();
    // begin performance test
    let dryrun = 'false';
    if (args.options.dryrun) {
      dryrun = 'true';
    }
    let myNodeCount = 3;
    if (args.options.nodes) {
      myNodeCount = args.options.nodes;
    }
    let myNodeSize = 'Standard_D2_v2';
    if (args.options.nodesize) {
      myNodeSize = args.options.nodesize;
    }
    let GenSSHKeys = false;
    if (args.options.gensshkeys) {
      GenSSHKeys = true;
    }
    provision.aks(
      dryrun,
      args.group,
      args.clustername,
      myNodeCount,
      myNodeSize,
      GenSSHKeys
    );
    // end performance test
    var t1 = performance.now();
    vorpal.logger.info(
      'Call to transmute provision took ' +
        ((t1 - t0) / 1000).toPrecision(4) +
        ' seconds.'
    );
    callback();
  });

/** transmute k8s provision-minikube uses minikube to provision a k8s cluster
 * @name transmute k8s provision-minikube <clustername>
 * @example transmute k8s provision-minikube myClusterName
 * @param {string} clustername
 * */
vorpal
  .command('k8s provision-minikube <clustername>')
  .description('Provision k8s cluster')
  .option('--nodes <nodes>', 'How many nodes to create the cluster with')
  .option(
    '--vmdriver <vmdriver>',
    'The cluster name to create the cluster with'
  )
  .option('--dryrun', 'Print out what would be done without executing anything')
  .action(function(args, callback) {
    var t0 = performance.now();
    // begin performance test
    let dryrun = 'false';
    if (args.options.dryrun) {
      console.info('dry run');
      dryrun = 'true';
    }
    if (args.options.vmdriver) {
      provision.minikube(dryrun, args.clustername, args.options.vmdriver);
    } else {
      provision.minikube(dryrun, args.clustername);
    }
    // end performance test
    var t1 = performance.now();
    vorpal.logger.info(
      'Call to transmute provision took ' +
        ((t1 - t0) / 1000).toPrecision(4) +
        ' seconds.'
    );
    callback();
  });

/** transmute version prints out version info
 * @name transmute version
 * @example transmute version
 * */
vorpal
  .command('version', 'display version information')
  .action(async (args, callback) => {
    const version = require('../package.json').version;
    logger.log({
      level: 'info',
      message: `Transmute CLI Version Command: ${version}`
    });
    await vorpal.telemetrySend({
      event: 'command',
      properties: {
        command: 'version',
        args: args,
        result: {
          version
        }
      }
    });

    callback();
  });

/** transmute telemetry toggles telemetry on or off
 * @name transmute telemetry
 * @example transmute telemetry on
 * */
vorpal
  .command('telemetry <state>', 'toggles telemetry on or off')
  .autocompletion(function(text, iteration, cb) {
    var states = ['on', 'off'];
    if (iteration > 1) {
      cb(void 0, states);
    } else {
      var match = this.match(text, states);
      if (match) {
        cb(void 0, states);
      } else {
        cb(void 0, void 0);
      }
    }
  })
  .action(async (args, callback) => {
    var states = ['on', 'off'];
    if (states.indexOf(args.state) === -1) {
      return vorpal.logger.error(
        `state must be 'on' or 'off'. ${args.state} is not valid.`
      );
    }
    telemetry.toggle(vorpal, args);
    callback();
  });

/** transmute debug
 * @name transmute debug
 * @example transmute debug
 * */
vorpal
  .command(
    'debug',
    'used for debugging the cli and cluster configuration via js / bash.'
  )
  .action(async (args, callback) => {
    debug.debug();
  });

vorpal
  .delimiter('✨  $')
  .parse(process.argv)
  .show();
