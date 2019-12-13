const inquirer = require('inquirer')

;(async function () {

  var twitterAppDetails = await inquirer.prompt([
    { type: 'input', name: 'consumerKey', message: "What's the consumer (API) key?" },
    { type: 'input', name: 'consumerSecret', message: "What's the consumer secret (API secret key)?" }
  ])

  var twitterPin = require('twitter-pin')(twitterAppDetails.consumerKey.trim(), twitterAppDetails.consumerSecret.trim())

  twitterPin.getUrl(async function (err, url) {
    if (err) {
      if (err.code === 32) {
        console.log('\nCould not authenticate you. Make sure your API keys are correct. You can get them from https://developer.twitter.com/en/apps.\n')
      } else {
        console.log(err.message)
      }
      process.exit(1)
    }

    console.log(`> Open ${url} and authorize the app to get your PIN.`)

    var pin = await inquirer.prompt({ type: 'input', name: 'pin', message: "Enter the PIN:" })

    twitterPin.authorize(pin.pin.toString().trim(), async function (err, result) {
      if (err) {
        if (err.message === 'Error processing your OAuth request: Invalid oauth_verifier parameter') {
          console.log('\nThe PIN is not correct.\n')
        } else {
          console.log(err.message)
        }
        process.exit(1)
      }    

      console.log('Token: ' + result.token)
      console.log('Secret: ' + result.secret)
    })
  })

})()
