const request = require('postman-request')
const geoCode = (address, cb) => {
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'+ encodeURIComponent(address) + '.json?access_token=pk.eyJ1IjoiamVybWFpbiIsImEiOiJja2N0YTZ3d3ExZHJmMnhvY2ZpMmhjem9sIn0.b48YD56cWOfoFyLKfZ4TCQ&limit=1'
    request({url: url, json: true}, (error, { body }) => {
        if(error) {
            cb('Unable to connect to the geo services')
        } else if(body.features.length === 0) {
            cb('Unable to retrieve information')
        } else {
            cb(undefined, {
                latitude: body.features[0].center[1],
                longitude: body.features[0].center[0],
                location: body.features[0].place_name            
            })
        }
    })
    
}

module.exports = geoCode