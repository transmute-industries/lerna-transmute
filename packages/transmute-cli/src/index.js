#!/usr/bin/env node
/** @module TransmuteCLI */

// Process env vars
const MY_ENV = process.env.USE_KUBASH || 'true';

// Vorpal
const vorpal = require('vorpal')();
const vorpalLog = require('vorpal-log');
const vorpalTour = require('vorpal-tour');
vorpal.use(vorpalLog);

// Okta
// import auth from './auth0/index';
const auth = require('./okta/index');

// Utils
const { writeFile } = require('./utils');

// Commands
const login = require('./commands/login');
const aks = require('./commands/aks');
const minikube = require('./commands/minikube');

// Mixpanel
const Mixpanel = require('mixpanel');
const mixpanel = process.env.MIXPANEL_PROJECT_ID
  ? Mixpanel.init(process.env.MIXPANEL_PROJECT_ID)
  : null;

auth(vorpal);

vorpal
  .command('login')
  .description(
    'Login with okta, and save session to ~/.transmute/cli-secrets/session.json'
  )
  .alias('l')
  .action(async (args, callback) => {
    const response = await login.default.withOkta();
    console.log('\n', response, '\n');
    callback();
  });

vorpal
  .command('k8s provision <clusterName>')
  .description('Provision k8s cluster')
  .option('--gke', 'Use gcloud GKE')
  .option('--nodes <nodes>', 'How many nodes to create the cluster with')
  .option(
    '--clustername <clustername>',
    'The cluster name to create the cluster with'
  )
  .option('--group <group>', 'The group to create the cluster with')
  .option('--gensshkeys', 'Generate SSH keys')
  .option('--aks', 'Use Azure AKS')
  .option('--aws', 'Use Amazon AWS')
  .option('--minikube', 'Use minikube')
  .action(function(args, callback) {
    if (args.options.gke) {
      // gke.provision()
      this.log('has not been implemented yet');
    } else if (args.options.aks) {
      var myResourceGroup = args.options.group;
      var myAKSCluster = args.options.clustername;
      var myNodeCount = args.options.nodes;
      if (args.options.gensshkeys) {
        var GenSSHKeys = true;
      } else {
        var GenSSHKeys = false;
      }
      aks.register;
      aks.provision(myResourceGroup, myAKSCluster, myNodeCount, GenSSHKeys);
    } else if (args.options.aws) {
      //aws.provision()
      this.log('has not been implemented yet');
    } else if (args.options.minikube) {
      minikube.provision();
    }
    callback();
  });

vorpal
  .command('k8s ls <clusterName>')
  .description('List k8s clusters')
  .option('--gke', 'Use gcloud GKE')
  .option('--aks', 'Use Azure AKS')
  .option('--aws', 'Use Amazon AWS')
  .option('--minikube', 'Use minikube')
  .action(function(args, callback) {
    if (args.options.gke) {
      // gkels()
      this.log('has not been implemented yet');
    } else if (args.options.aks) {
      aks.ls();
    } else if (args.options.aws) {
      //awsls()
      this.log('has not been implemented yet');
    } else if (args.options.minikube) {
      minikube.ls();
    }
    callback();
  });

vorpal
  .command('dapp create')
  .description('create a new distributed app')
  .alias('d')
  .action(function(args, callback) {
    this.log('dapp has not been implemented yet');
    callback();
  });

vorpal
  .command('generate gpgkey', 'Assists in the generation of an GPG key')
  .alias('g')
  .action(function(args, callback) {
    this.log('generate gpgkey has not been implemented yet');
    callback();
  });

vorpal
  .command('generate sshkey', 'Assists in the generation of an SSH key')
  .action(function(args, callback) {
    this.log('generate sshkey has not been implemented yet');
    callback();
  });

vorpal
  .command('group add <member>', 'Adds member to group')
  .action(function(args, callback) {
    this.log('group add <member> has not been implemented yet');
    callback();
  });

vorpal
  .command('group delete <member>', 'Deletes member to group')
  .action(function(args, callback) {
    this.log('group delete <member> has not been implemented yet');
    callback();
  });

vorpal
  .command('push', 'Pushes objects into the cloud')
  .alias('p')
  .action(function(args, callback) {
    this.log('push has not been implemented yet');
    callback();
  });

vorpal
  .command('tunnel <clusterName>')
  .option('-p, --port', 'Tunnel port')
  .option('-s, --svc', 'Tunnel service')
  .action(function(args, callback) {
    this.log('push has not been implemented yet');
    callback();
  });

vorpal
  .delimiter('T$')
  .parse(process.argv)
  .show();
