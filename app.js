const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const axios = require('axios')
const app = express()

const https = require('https')

const parseString = require('xml2js').parseString;
const convert = require('xml-js');

const { hmacCounter } = require('./hmacCounter')
const { isNull } = require('util')
const { Console } = require('console')

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: 'true' }))
// require('body-parser-xml')(bodyParser);
// app.use(bodyParser.xml())
app.use(express.static(`${__dirname}/public`))
app.use((req,res,next) => {
    req.requestTime = new Date().toISOString();
    next();
})

const httpsAgent = new https.Agent({
    rejectUnauthorized: false
})

app.get('/AllLaneStatus',  async (req,res) => {
    try {
        axios
            .get('https://192.168.71.1:10011/AllLaneStatus',
            {
                httpsAgent,
                headers : {  
                    'Content-Type' : 'application/x-www-form-urlencoded',
                    'Authorization': hmacCounter('https://192.168.71.1:10011/AllLaneStatus')
                }
            }
            )
            .then(response => {
                // CONVERT RESULT FROM XML TO JSON
                parseString(response.data, function (err, cov) {
                    res.status(200).json({
                        status: 'success',
                        results: cov.AllLaneStatus.LaneStatusList[0].LaneStatus
                    })
                });
            })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: 'failed',
            results: `Cannot get Lanes list`
        })
    }
})

app.put('/PlayingLanes/:LaneNumber/Open', async (req,res) => {
    try {
        const { LaneNumber } = req.params
        const { players, timer } = req.body

        
        let str = `<Players>`
        players.map(player => str = str+'<Player>'+convert.js2xml(player,  {compact: true, ignoreComment: true, spaces: 4})+'</Player>')
        str = str+'</Players>'
        let xml = `<?xml version="1.0" encoding="utf-8"?><PlayingLanes xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"><DestinationLane>${LaneNumber}</DestinationLane><StartTime>0110</StartTime><Duration>${timer}</Duration><Games></Games><TimeToAdd>10</TimeToAdd><GamesToAdd>1</GamesToAdd><IsPair>No</IsPair>${str}<TeamName>H2C</TeamName><SwapLanes>Yes</SwapLanes><NoTap>7Pin</NoTap><ExternalKey>Test</ExternalKey></PlayingLanes>`
        xml = xml.replace( /[\r\n]+/gm, "")

        console.log(req.body)

        axios
            .put(`https://192.168.71.1:10011/PlayingLanes/${LaneNumber}/Open`, xml,
            {
                    httpsAgent,
                headers: {
                    'Content-Type': 'text/xml',
                    'Authorization': hmacCounter(`https://192.168.71.1:10011/PlayingLanes/${LaneNumber}/Open`)
                }
            })
            .then(response => {
                res.status(200).json({
                    status: 'success',
                    results: `Lane number ${LaneNumber} is opened`
                })
            })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: 'failed',
            results: `Cannot open Lane number ${LaneNumber}`
        })
    }
})

app.delete('/PlayingLanes/:LaneNumber', async (req,res) => {
    const { LaneNumber } = req.params
    try {
        axios
            .delete(`https://192.168.71.1:10011/PlayingLanes/${LaneNumber}`, {
                httpsAgent,
                headers : {  
                    'Content-Type' : 'text/xml',
                    'Authorization': hmacCounter(`https://192.168.71.1:10011/PlayingLanes/${LaneNumber}`)
                }
            })
            .then(response => {
                res.status(200).json({
                    status: 'success',
                    results: `Lane number ${LaneNumber} is closed`
                })
            })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: 'failed',
            results: `Cannot close Lane number ${LaneNumber}`
        })
    }
})

app.delete('/PlayingLanes/:LaneNumber/Players/:PlayerName', async (req,res) => {
    const { LaneNumber, PlayerName } = req.params
    try {
        axios
            .delete(`https://192.168.71.1:10011/PlayingLanes/${LaneNumber}/Players/${PlayerName}`, {
                httpsAgent,
                headers : {  
                    'Content-Type' : 'text/xml',
                    'Authorization': hmacCounter(`https://192.168.71.1:10011/PlayingLanes/${LaneNumber}/Players/${PlayerName}`)
                }
            })
            .then(response => {
                res.status(200).json({
                    status: 'success',
                    results: `Player ${PlayerName} from lane ${LaneNumber} has been deleted successfully`
                })
            })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: 'success',
            results: `Can't  delete player ${PlayerName} from lane ${LaneNumber}`
        })
    }
})

app.post('/PlayingLanes/:LaneNumber/Players/:PlayerName', async (req,res) => {
    const { LaneNumber, PlayerName } = req.params

    axios({
        url: `https://192.168.71.1:10011/PlayingLanes/${LaneNumber}/Players/${PlayerName}`,
        method: 'POST',
        headers: {
            'Content-Type' : 'text/xml',
            'Content-Security-Policy': 'upgrade-insecure-requests',
            'Authorization': hmacCounter(`https://192.168.71.1:10011/PlayingLanes/${LaneNumber}/Players/${PlayerName}`)
        },
        responseType: 'xml',
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
    })
    .then(response => {
        console.log(response)
        res.status(200).json({
            status: 'success',
            results: `Player ${PlayerName} from lane ${LaneNumber} has been added successfully`
        })
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({
            status: 'success',
            results: `Can't  add player ${PlayerName} to lane ${LaneNumber}`
        })
    })

})

app.put('/PlayingLanes/:LaneNumber/Transfer', async (req,res) => {
    try {
        const { LaneNumber } = req.params
        const { players, transferTo, timer } = req.body

        
        let str = `<Players>`
        players.map(player => str = str+'<Player>'+convert.js2xml(player,  {compact: true, ignoreComment: true, spaces: 4})+'</Player>')
        str = str+'</Players>'
        let xml = `<?xml version="1.0" encoding="utf-8"?><PlayingLanes xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"><DestinationLane>${transferTo}</DestinationLane><StartTime>0110</StartTime><Duration>${timer}</Duration><Games></Games><TimeToAdd>10</TimeToAdd><GamesToAdd>1</GamesToAdd><IsPair>No</IsPair>${str}<TeamName>H2C</TeamName><SwapLanes>Yes</SwapLanes><NoTap>7Pin</NoTap><ExternalKey>Test</ExternalKey></PlayingLanes>`
        xml = xml.replace( /[\r\n]+/gm, "")

        axios({
            url: `https://192.168.71.1:10011/PlayingLanes/${LaneNumber}/Transfer`,
            method: 'PUT',
            data: xml,
            headers: {
                'Content-Type' : 'text/xml',
                'Content-Security-Policy': 'upgrade-insecure-requests',
                'Authorization': hmacCounter(`https://192.168.71.1:10011/PlayingLanes/${LaneNumber}/Transfer`)
            },
            responseType: 'xml',
            httpsAgent: new https.Agent({ rejectUnauthorized: false })
        })
        .then(response => {
            console.log(response)
            res.status(200).json({
                status: 'success',
                results: `Lane ${LaneNumber} has been transfered to Lane ${transferTo} successfully`
            })
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({
                status: 'success',
                results: `Can't transfer Lane ${LaneNumber} to Lane ${transferTo}`
            })
        })

        console.log(xml)
    } catch (error) {
        console.log(error)
    }

})


module.exports = app