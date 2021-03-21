const crypto = require('crypto')

exports.hmacCounter = URL => {
    const secret    = 'C7DD662A-8AAD-4EA0-BE7F-5CE43586E950'
    const algorithm = 'sha1'
    
    let hmac = crypto.createHmac(algorithm, secret)  
    hmac.write(URL)
    hmac.end()

    let hash = hmac.read().toString('base64')
    return `Conqueror:${hash}`
}