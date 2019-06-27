const Wreck = require('wreck');
const FormData = require('form-data');
const UUID = require('uuid');
const Hoek = require('hoek');

async function makeRequest(method, url, options) {
    const response = await Wreck.request(method, url, options);
    let result = await Wreck.read(response, options);
    result = JSON.parse(result);
    if (result.success) {
        return result;
    } else {
        console.error(result.error || result);
        throw new Error(result.error || result);
    }
}

async function initiate(instanceID) {
    let url = `http://localhost:8077/workflowapi/createinstance/${instanceID}?schemeCode=SimpleWF&identityId=user`;
    let data = JSON.stringify({ "custom": "data" });
    let formData = new FormData();
    let method = "POST";
    let options = {
        headers: {
            "content-type": "application/x-www-form-urlencoded; charset=utf-8"
        }
    };
    options['payload'] = formData;
    formData.append("data", data);
    Hoek.merge(options.headers, formData.getHeaders());
    await makeRequest(method, url, options);
}

async function execute(instanceID, command) {
    let url = `http://localhost:8077/workflowapi/executecommand/${instanceID}?command=${command}&identityId=userOne`;
    let data = JSON.stringify({ "custom": "data" });
    let formData = new FormData();
    let method = "POST";
    let options = {
        headers: {
            "content-type": "application/x-www-form-urlencoded; charset=utf-8"
        }
    };
    options['payload'] = formData;
    formData.append("data", data);
    Hoek.merge(options.headers, formData.getHeaders());
    return makeRequest(method, url, options);
}

async function getInstanceDetails(instanceID) {
    let url = `http://localhost:8077/workflowapi/getinstanceinfo/${instanceID}`;
    let method = "GET";
    let options = {
        headers: {
            "content-type": "application/x-www-form-urlencoded; charset=utf-8"
        }
    };
    let instanceData = await makeRequest(method, url, options);
    //uncomment this line to view complete instance details on console log
    // console.log(instanceData.data);
    //view ProcessParameters on console log
    console.log(instanceData.data.ProcessParameters);
}

async function main() {
    let instanceID = UUID();
    await initiate(instanceID);
    await getInstanceDetails(instanceID);
    await execute(instanceID, "Send For Review");
    await getInstanceDetails(instanceID);
}
main();
