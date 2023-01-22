const addNumber =  (number1, number2, callback) => {
    setTimeout(() => {
       callback(number1 * number2)
    }, 2000)
        }
    addNumber(2, 4, (callback) => {
        console.log('callback', callback);
    })