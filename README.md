# CommunityFTSO
Request an API key by emailing `tim@av.ax`.

Endpoint: `https://vrzrc8ucp5.execute-api.ap-southeast-2.amazonaws.com` (24 Jul 21)
Resource: `/ftso`
Methods:
 - GET `/latest` - Get latest Epoch timings
 - POST `/submit` - Submit data
 - GET `/epoch` Parameters: `id` - Get data for specified Epoch ID 

**Examples**

 - GET `<endpoint>/ftso/latest`
 - Response: `{"epochId":"1627121643", "revealEndTime":"1627121943", "submitEndTime":"1627121763"}`

 - POST `<endpoint>/ftso/submit`
 - Payload Expected: Epoch ID (Integer) for current period, provider name (String) and Array of objects [{pair: <pair|STRING>, price: "price|STRING"}, ...] 
 - Responses: 

*Success*
 - `{ error: false, message: 'Submission accepted.' }`

*Missing Data*
 - `{ error: true, message: "Empty submissions.."}`

*Missed Submit End Time*
 - `{error: true, message: "You have missed the submit end time by n seconds."}`

*Submited to Wrong EpochId*
 - {error: true, message: `Submitting for incorrect epochId: <epochId> vs submitted: <x_epochId>"}`

**Guideline**

Request Epoch data from `/latest` method to assess if a submission can be made (must submit before `submitEndTime`), if missed `submitEndTime` then wait until `revealEndTime` which is teh end of the epoch period and moments before start of new epoch period.

Make one submission during the submission period, your submission must be an array of objects following below model:

```
{
epochId: <epochId|Integer>,
provider: <name|String>,
submission: [
{pair: <pair1|STRING|FORMAT:'SYMBOL/USD'>, price: "price1|STRING"},
{pair: <pair2|STRING|FORMAT:'SYMBOL/USD'>, price: "price2|STRING"}
...
]
}
```
Example:
```
{
epochId: 1627113843,
provider: PurpleMoose,
submission: [
{pair: "XRP/USD", price: "0.53300"},
{pair: "XLM/USD", price: "0.86600"}
...
]
}
```

See `submit-data-example.js` for more details.

