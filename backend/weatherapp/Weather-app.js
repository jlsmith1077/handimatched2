const request = require('postman-request')
const geocode = require('./geocode')
const forcast = require('./forecast')

const address = process.argv[2]
    if (!address) {
        console.log('Please provide city, state')
    } else {
        geocode(address, (error, {latitude, longitude, location} = {}) => {
            if(error) {
              return  console.log(error)
            } 
            forcast(latitude, longitude, (error, forecastData) => {
                if(error) {
                   return console.log(error)
                } 
                getWeather = forecastData  
            })
        })
    }

