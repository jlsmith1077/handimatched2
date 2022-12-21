const request = require('postman-request')
const chalk = require('chalk')

const forecast = (lat, longi, cb) => {
    const url = 'http://api.weatherstack.com/current?access_key=65dca7b5edcd6eab7c4114fdb4f697e3&query=' + lat + ',' + longi +'&units=f'
    
    request({ url: url, json: true }, (error, response) => {
        if(error) {
            cb('Unable to connect to weather service', undefined)
        } else if(response.body.error) {
            cb('Unable to find location from forecast', undefined)
        } else {
            cb(undefined, response.body.current.weather_descriptions + ' It is currently ' + response.body.current.temperature + ' degrees.')
        }
    })
}

module.exports = forecast