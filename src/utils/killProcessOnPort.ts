export function killProcessOnPort (port, callback) {
  const exec = require('child_process').exec
  exec(`lsof -t -i:${port}`, (err, stdout, stderr) => {
    if (stdout) {
      exec(`kill -9 ${stdout}`, callback)
    } else {
      callback() // Nothing to kill
    }
  })
}
