const shell = require('shelljs');
const ps = require('child_process');

export function ner(command2run) {
  let result = shell.exec(command2run);

  if (result.code !== 0) {
    throw new Error('Command FAILED');
  }
  return result;
  // console.log(command2run);
}

export function spawn(command2run, this_arg1, this_arg2) {
  return ps.execFileSync(command2run, [this_arg1, this_arg2], {
    stdio: 'inherit'
  });
  // console.log(command2run, this_arg1, this_arg2);
}
