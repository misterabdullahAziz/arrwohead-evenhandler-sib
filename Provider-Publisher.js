const express = require('express');
const moment = require('moment');
const app = express();
const port = 3001;
const axios = require('axios');
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(bodyParser.raw());

const serviceregistryUrl = "http://localhost:8443";
const orchesrtationUrl = "http://localhost:8441";
const eventHandlerUrl = "http://localhost:8455";
const authorizationUrl = "http://localhost:8445";


//*********************Checkting the Echo from Service Registry, Authorization, Orchestrator and EventHandler */
app.get('/serviceregistryecho', (req, res) => {
    axios.get(serviceregistryUrl+'/serviceregistry/echo').then(resp => {
        console.log(resp.data);
        res.send('Service Registry Responded: '+ resp.data);
    });
    
});

app.get('/authorizationecho', (req, res) => {
    axios.get(serviceregistryUrl+'/serviceregistry/echo').then(resp => {
        console.log(resp.data);
        res.send('Authorization Responded: '+ resp.data);
    });
    
});

app.get('/orcherstratorecho', (req, res) => {
    axios.get(orchesrtationUrl+'/orchestrator/echo').then(resp => {
        console.log(resp.data);
        res.send('Orchestrator Responded: '+ resp.data);
    });
    
});

app.get('/eventhandlerecho', (req, res) => {
    axios.get(eventHandlerUrl+'/eventhandler/echo').then(resp => {
        console.log(resp.data);
        res.send('Event Handler Responded: '+ resp.data);
    }); 
});

//////////**************** End of Echo Messages */

//****************** Register Publisher System with Main Service */
const systemName = "PublisherSystem";
const systemAddress = "localhost";
const systemPort = port;
const systemMainService = "PublisherMainService";
const systemMainServiceUri = "PublisherMainServiceUri";

app.get('/registerpublisher', async (req, res) => {
    let result = await registerSystem();
    console.log(result);
    res.json(result);
});

async function registerSystem() {

    let body = {
            "serviceDefinition": systemMainService,
            "providerSystem": {
                    "systemName": systemName,
                    "address": systemAddress,
                    "port": systemPort,
            },
            "serviceUri":systemMainServiceUri ,
            "endOfValidity": "2021-01-09 04:14:13",
            "secure": "NOT_SECURE",
            "metadata": {
                "info": "Main service at the time of provider creation."
            },
            "interfaces": [
                "HTTP-INSECURE-JSON"
            ]
        }
    
    try {
            let res = await axios({
                method: 'post',
                url: serviceregistryUrl+'/serviceregistry/register',
                headers: {"content-type":"application/json"},
                data: body
            });
            return res.data;
        }
    catch(err){
        console.log(err.message);
    }
}

//****************** Register Service within Main Publisher System */

app.post('/registerservice', async (req, res) => {
    // console.log(req.body);
    let serviceName = req.body.serviceName;
    let serviceUri = req.body.serviceUri;
    let result = await registerService(serviceName, serviceUri);
    console.log(result);
    res.json(result);
});

async function registerService(serviceName, serviceUri) {

    let body = {
            "serviceDefinition": serviceName,
            "providerSystem": {
                    "systemName": systemName,
                    "address": systemAddress,
                    "port": systemPort,
            },
            "serviceUri":serviceUri ,
            "endOfValidity": "2021-01-09 04:14:13",
            "secure": "NOT_SECURE",
            "interfaces": [
                "HTTP-INSECURE-JSON"
            ]
        }
    
    try {
            let res = await axios({
                method: 'post',
                url: serviceregistryUrl+'/serviceregistry/register',
                headers: {"content-type":"application/json"},
                data: body
            });
            return res.data;
        }
    catch(err){
        console.log(err.message);
    }
}

//************* Event Publishsing */

app.post('/publishevent', async (req, res) => {
    // console.log(req.body);
    let eventType = req.body.eventType;
    let payload = req.body.payload;
    let result = await creatEvent(eventType, payload);
    console.log(result);
    res.json(result);
});

async function creatEvent(eventType, payload) {
    let timeStamp = moment.utc().format('YYYY-MM-DD HH:mm:ss');
    let body = {
        "eventType": eventType, 
        "payload": payload, 
        "source": {
            "address": systemAddress, 
            "port": systemPort,
            "systemName": systemName
        },
        "timeStamp":  timeStamp
        }
    try{
        let res = await axios({
            method: 'post',
            url: eventHandlerUrl+'/eventhandler/publish',
            headers: {"content-type":"application/json"},
            data: body
            });
        
            
            console.log(res.status);
    }
    catch(err){
        console.log(err.message);

    }
}

//*********** Creating Server......... */
app.listen(port, () => console.log(`Provider listening on port ${port}!`))













