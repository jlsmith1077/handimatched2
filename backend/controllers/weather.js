const geocode = require("../weatherapp/geocode");
const forecast = require("../weatherapp/forecast");

exports.weather = (req, res, next) => {
    if (!req.query.address) {
        return res.send({
            error: 'Please provide valid City'
        })
    }

    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if (error) {
            return res.send({error: error})
        }
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({error})
            }
            res.send({
                forecastData,
                location: location,
                address: req.query.address
            })
        })
    })
}