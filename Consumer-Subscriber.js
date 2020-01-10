const express = require('express');
const app = express();
const port = 3002;
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

//****************** Register Consumer System with Main Service */
const systemName = "ConsumerSystem";
const systemAddress = "localhost";
const systemPort = port;
const systemMainService = "ConsumerMainService";
const systemMainServiceUri = "ConsumerMainServiceUri";

app.get('/registerconsumer', async (req, res) => {
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
                "info": "Main service at the time of consumer creation."
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

//****************** Register Service within Main Consumer System */

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

//******** Authorize consumer with provider for event notification */
app.post('/authorize', async (req, res) => {
    let consumerID = req.body.consumerID;
    let providerID = req.body.providerID;
    let interfaceID = req.body.interfaceID;
    let serviceID = req.body.interfaceID;


    let result = await Authorize(consumerID, providerID,interfaceID,serviceID);
    console.log(result);
    res.json(result);
});
async function Authorize(consumerID, providerID,interfaceID,serviceID) {

    let body = {
            "consumerId": consumerID,
            "interfaceIds": [
                interfaceID
            ],
            "providerIds": [
                providerID
            ],
            "serviceDefinitionIds": [
                serviceID
            ]
        }
    
    try {
            let res = await axios({
                method: 'post',
                url: authorizationUrl+'/authorization/mgmt/intracloud',
                headers: {"content-type":"application/json"},
                data: body
            });
            return res.data;
        }
    catch(err){
        console.log(err.message);
    }
}

//******** Subscribe to publisher */

app.post('/subscribe', async (req, res) => {
    let eventType = req.body.eventType;
    let notifyUri = req.body.notifyUri;
    console.log(eventType);
    console.log(notifyUri);

    let result = await Subscribe(eventType, notifyUri);
    console.log(result);
    res.send("sucsess");
});
async function Subscribe(eventType, notifyUri) {

    let body = {
            "eventType": eventType,
            "matchMetaData": false,
            "notifyUri": notifyUri,
            "subscriberSystem": {
                "address": systemAddress,
                "port":systemPort,
                "systemName": systemName
            }
        }
    
    try {
            let res = await axios({
                method: 'post',
                url: eventHandlerUrl+'/eventhandler/subscribe',
                headers: {"content-type":"application/json"},
                data: body
            });
            return res.data;
        }
    catch(err){
        console.log(err.message);
    }
}

//********** get Notification */
app.post('/notify', async (req, res) => {
    console.log("got the notification: "+req);
    res.send("sucsess");
});
//**** Starting Server */
app.listen(port, () => console.log(`Consumer listening on port ${port}!`))
