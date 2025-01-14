## One net API Manager

This is a simple frontend for making API calls to [OneNet](https://onenet.hk.chinamobile.com/subhk/doc/multiprotocol/book/develop/http/api/3.更新设备信息.html) for Creating Equipment, Updating Equipment & Querying Data Streams. Supports big screens only currently.

## 1. New Equipment

- `POST` http://api.onenet.hk.chinamobile.com/devices

- Request header -> See API usage

- http body parameters

| Parameter name | Format | Is it necessary | Description |
| -------------- | ------ | ---------------- | ----------- |
| title | string | yes | device name |
| desc | string | no | device description |
| tags | array-string | no | device tag, it can be one or more, see example |
| location | json | no | device location coordinate information, represented by longitude and latitude key-value pairs: {"lon":xx,"lat":xx} |
| private | bool | no | device privacy, determines the visibility of device information in the sharing link of the application editor, the default is true |
| auth_info | string | no | authentication information, it is recommended to carry it and set it to the product serial number of the device |
| other | json | no | other device custom information, expressed in key-value pair format, see example |

- Return parameters

| Parameter name | Format | Description |
| -------------- | ------ | ----------- |
| errno | int | call error code, 0 means the call is successful |
| error | string | error description, "succ" means the call is successful |
| data | json | The device-related information returned after the data json interface is successfully called, see the data description table |

- data description

| Parameter name | Format | Description |
| -------------- | ------ | ----------- |
| device_id | string | device ID |

- Example Body

```
{
 "title": "test_device",
 "desc": "test_desc",
 "tags": ["china", "mobile"],
 "location": {
 "lon": 109,
 "lat": 23.54
 },
 "auth_info": "tes01235n82105",
 "other": {
 "version": "1.0.0",
 "manufacturer": "china mobile"
 }
}
```

- Return example

```
{
 "errno": 0,
 "data": {
 "device_id": "35270468"
 },
 "error": "succ"
}
```

## 2. Update Equipment Information

- `PUT` http://api.onenet.hk.chinamobile.com/devices/device_id

* device_id: needs to be replaced with device lD

- Request head -> See the use of API

- http body parameters

| Parameter name | Format | Is it necessary | Description |
| -------------- | ------ | ---------------- | ----------- |
| title | string | no | device name |
| desc | string | no | device description |
| tags | array-string | no | device tag, it can be one or more, see example |
| location | json | no | device location coordinate information, represented by longitude and latitude key-value pairs: {"lon":xx,"lat":xx} |
| private | bool | no | device privacy, determines the visibility of device information in the sharing link of the application editor, the default is true |
| auth_info | string | no | authentication information, it is recommended to carry it and set it to the product serial number of the device |
| other | json | no | other device custom information, expressed in key-value pair format, see example |

- Return parameters

| Parameter name | Format | Description |
| -------------- | ------ | ----------- |
| errno | int | call error code, 0 means the call is successful |
| error | string | error description, "succ" means the call is successful |

- Example Body

```
{
"title": "test_device",
"desc": "test_desc",
"tags": ["china", "mobile"],
"location": {
"lon": 109,
"lat": 23.54
},
"auth_info": "tes01235n82105",
"other": {
"version": "1.0.0",
"manufacturer": "china mobile"
}
}
```

- Return to the example

```
{
"errno": 0,
"error": "succ"
}
```


## 3. Query data flow information in batches

- `GET` http://api.onenet.hk.chinamobile.com/devices/device_id/datastreams

* device_id: needs to be replaced with device ID

- URL request parameters

| Parameter name | Format | Is it necessary | Description |
| -------------- | ------ | ---------------- | ----------- |
| datastream_ids | string | no | data stream ID, separate multiple IDs with commas. By default, all data streams are queried. |

- HTTP request parameters

| Parameter name | Format | Is it necessary | Description |
| -------------- | ------ | ---------------- | ----------- |
| api-key | string | yes | must be masterkey or an apikey with access rights to the device |

- Return parameters

| Parameter name | Format | Is it necessary | Description |
| -------------- | ------ | ---------------- | ----------- |
| errno | int | call error code, 0 means the call is successful |
| error | string | error description, "succ" means the call is successful |
| data | array-json | data stream information, see the data description table |

- Data

| Parameter name | Format |  Description |
| -------------- | ------ |----------- |
| id | string | data stream ID |
| create_time | string | data flow creation time |
| update_at | string | latest data upload time |
| current_value | string/int/json... | latest data point |


- Request example

- `GET` http://api.onenet.hk.chinamobile.com/devices/20474930/datastreams?datastream_ids=aaa,bbb HTTP/1

- Return example

{
 "errno": 0,
 "data": [{
 "update_at": "2017-11-20 10:03:10",
 "id": "aaa",
 "create_time": "2017-11-20 09:59:35",
 "current_value": {
 "Header": {
 "CipherType": 1,
 "DevType": 1
 },
 "Body": 3
 }
 }, {
 "update_at": "2017-12-22 10:30:22",
 "id": "bbb",
 "create_time": "2017-12-22 10:12:36",
 "current_value": 1
 }],
 "error": "succ"
}

## 4. Query Device Historical Data

- `GET` http://api.onenet.hk.chinamobile.com/devices/{device_id}/datapoints

* device_id: needs to be replaced with device ID

- http body parameters

| Parameter name | Format | Is it necessary | Description |
| -------------- | ------ | ---------------- | ----------- |
| datastream_id | string | no | data stream ID | Data flow ID, separate multiple IDs with commas. By default, all data flows are queried. |
| start | string | no | The start time of extracting data points, accurate to seconds, example: 2015-01-10T08:00:35 |
| end | string | no | The end time of extracting data points, accurate to seconds, example: 2015-01-10T08:00:35 |
| duration | int | no | The duration of the data point to be extracted, in seconds, the start time is the end time minus the duration |
| limit | int | no | Limit the maximum number of data points returned by this request, the default is 100, the range is 0, 6000 |
| cursor | string | no | Specify that this request will continue to extract data from the cursor location. |
| sort | enum | no | Time sorting method, DESC: reverse order, ASC: ascending power, the default is ASC |

- Return parameters

| Parameter name | Format | Description |
| -------------- | ------ | ----------- |
| errno | int | call error code, 0 means the call is successful |
| error | string | error description, "succ" means the call is successful |
| data | json | data point information, see the data description table |

- Data description table

| Parameter name | Format | Description |
| -------------- | ------ | ----------- |
| count | string | The number of data points returned this time |
| cursor | string | If this request fails to return all data, the cursor parameter will be returned. The user can make another request with the cursor parameter to obtain the remaining data. |
| datastreams | array-json | data stream information, see the data description table |

- Datastreams description table

| Parameter name | Format | Description |
| -------------- | ------ | ----------- |
| id | string | Data flow name |
| datapoints | array-json | data point information, see the data description table |

- Datapoints description table

| Parameter name | Format | Description |
| -------------- | ------ | ----------- |
| at | string | Data recording time |
| value | string/int/json... | data point |

- Request example 1

* Request example 1

- Request device 8029377 from the 1st to 100th data of data stream ds since midnight on January 1, 2017

- GET http://api.onenet.hk.chinamobile.com/devices/8029377/datapoints?datastream_id=ds&start=2017-01-

- Return example 1

```
{
    "errno": 0,
    "data": {
        "cursor": "83900_8029377_1498708525203",
        "count": 100,
        "datastreams": [{
            "datapoints": [{
                "at": "2017-06-23 11:09:46.281",
                "value": "112312"
            }, {
                "at": "2017-06-23 11:09:58.799",
                "value": "112312"
            }, {
                "at": "2017-06-23 11:09:58.802",
                "value": "1213"
            }, {
                "at": "2017-06-23 11:10:17.962",
                "value": "1"
            }, 
            ...
            {
                "at": "2017-06-29 11:55:20.198",
                "value": "hello"
            }],
            "id": "ds"
        }]
    },
    "error": "succ"
}
```

In this example, only the first 100 pieces of data since midnight on January 1, 2017 are returned. If you need to continue to obtain the next data, you need to

- Request example 2

- Get the 101st piece of data since midnight on January 1, 2017, to the 1100th piece of data

- `GET` http://api.onenet.hk.chinamobile.com/devices/8029377/datapoints?datastream_id=ds&start=2017-01-

```
{
    "errno": 0,
    "data": {
        "count": 1000,
        "datastreams": [{
            "datapoints": [{
                "at": "2017-06-23 11:10:41.475",
                "value": "awefa"
            }, {
                "at": "2017-06-23 11:11:12.839",
                "value": "ad3"
            }, 
            ...
            {
                "at": "2017-06-25 11:13:54.249",
                "value": "RA414124124124"
            }, {
                "at": "2017-06-25 21:07:43.024",
                "value": "13dfadfafzfadf#123affad"
            }],
            "id": "ds"
        }]
    },
    "error": "succ"
}
```

