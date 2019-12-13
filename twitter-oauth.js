const inquirer = require('inquirer')

;(async function () {

  var twitterAppDetails = await inquirer.prompt([
    { type: 'input', name: 'consumerKey', message: "What's the consumer (API) key?" },
    { type: 'input', name: 'consumerSecret', message: "What's the consumer secret (API secret key)?" }
  ])

  var twitterPin = require('twitter-pin')(twitterAppDetails.consumerKey.trim(), twitterAppDetails.consumerSecret.trim())

  twitterPin.getUrl(async function (err, url) {
    if (err) throw err

    console.log(`Open ${url} and authorize the app. You should then get your PIN.`)

    var pin = await inquirer.prompt([
      {
        type: 'input',
        name: 'pin',
        message: "Enter the PIN:",
      }
    ])

    twitterPin.authorize(pin.pin.toString().trim(), function (err, result) {
      if (err) throw err

      console.log('Token: ' + result.token)
      console.log('Secret: ' + result.secret)
    })
  })

})();
