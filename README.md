## One net API Manager

This is a simple frontend for making API calls to [OneNet](https://onenet.hk.chinamobile.com/subhk/doc/multiprotocol/book/develop/http/api/3.更新设备信息.html) for Creating Equipment, Updating Equipment & Querying Data Streams. Supports big screens only currently.

<!-- vscode-markdown-toc -->
* 1. [Docker Support](#DockerSupport)
	* 1.1. [Quick Start with Docker](#QuickStartwithDocker)
	* 1.2. [Building Locally w/ Docker](#BuildingLocallywDocker)
	* 1.3. [Docker Compose (Optional)](#DockerComposeOptional)
	* 1.4. [Environment Variables](#EnvironmentVariables)
	* 1.5. [Container Registry](#ContainerRegistry)
* 2. [API Documentation](#APIDocumentation)
	* 2.1. [New Equipment](#NewEquipment)
	* 2.2. [Update Equipment Information](#UpdateEquipmentInformation)
	* 2.3. [Query data flow information in batches](#Querydataflowinformationinbatches)
	* 2.4. [Query Device Historical Data](#QueryDeviceHistoricalData)

<!-- vscode-markdown-toc-config
	numbering=true
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc -->

##  1. <a name='DockerSupport'></a>Docker Support

This project is available as a Docker image. You can find it on Docker Hub at [ayazhankadessova/one-net-api](https://hub.docker.com/r/ayazhankadessova/one-net-api).

###  1.1. <a name='QuickStartwithDocker'></a>Quick Start with Docker

1. Pull the image:
```bash
docker pull ayazhankadessova/one-net-api
```

2. Run the container:
```bash
docker run -p 3000:3000 ayazhankadessova/one-net-api
```

The application will be available at `http://localhost:3000`

###  1.2. <a name='BuildingLocallywDocker'></a>Building Locally w/ Docker

If you want to build the Docker image locally:

1. Clone the repository:
```bash
git clone [your-repo-url]
cd [your-repo-name]
```

2. Build the image:
```bash
docker build -t one-net-api .
```

3. Run the container:
```bash
docker run -p 3000:3000 one-net-api
```

###  1.3. <a name='DockerComposeOptional'></a>Docker Compose (Optional)

Create a `docker-compose.yml` file:

```yaml
version: '3.8'
services:
  app:
    image: ayazhankadessova/one-net-api
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
```

Then run:
```bash
docker-compose up
```

###  1.4. <a name='EnvironmentVariables'></a>Environment Variables

The following environment variables can be set when running the container:

- `NODE_ENV`: Set to 'production' by default
- `PORT`: The port the application runs on (default: 3000)

Example with custom environment variables:
```bash
docker run -p 3000:3000 -e NODE_ENV=development ayazhankadessova/one-net-api
```

###  1.5. <a name='ContainerRegistry'></a>Container Registry

The Docker image is hosted on Docker Hub and automatically updated with new releases. You can find all available tags at:
[https://hub.docker.com/r/ayazhankadessova/one-net-api/tags](https://hub.docker.com/r/ayazhankadessova/one-net-api/tags)

##  2. <a name='APIDocumentation'></a>API Documentation

###  2.1. <a name='NewEquipment'></a>New Equipment

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

###  2.2. <a name='UpdateEquipmentInformation'></a>Update Equipment Information

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


###  2.3. <a name='Querydataflowinformationinbatches'></a>Query data flow information in batches

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

###  2.4. <a name='QueryDeviceHistoricalData'></a>Query Device Historical Data

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


### 2.5 <a name='BatchQueryDeviceInformation'></a>Batch query device information 

- Request method: GET
- URL: http://api.onenet.hk.chinamobile.com/devices
- URL parameters

| Parameter name | Format | Is it necessary | Description |
| -------------- | ------ | ---------------- | ----------- |
| Key_words	| String | No  | Match keywords, left match from the id and title fields |
| Auth_info	| String | No  | Information on rights |
| Tag	| Array-string | No  | Device label |
| Online	| Bool | No  | The online status of the device |
| Private	| Bool | No  | Device privacy |
| Page	| Int | No  | Specify the page number, and the maximum number of pages is 10,000. |
| Per_page	| Int | No  | Specify the number of output devices per page, the default is 30, and the maximum is 100. |
| Device_id	| String | No  | Specify the device ID, separated by commas, up to 100 |
| Begin	| String | No  | Start time, Beijing time, example: 6/20/2016 |
| End	| String | No  | End time, Beijing time, example: 6/20/2016 |


- Return the parameters

| Parameter name | Format | Description |
| -------------- | ------ | ----------- |
| errno	| Int	| The error code is calced, and 0 means the calcation is successful. |
| Error	| String	| Error description, "succ" means successful cal |
| Data	| Json	| For the device-related information returned after the interface is successfully called, please refer to the data description table. |

- data description table

| Parameter name | Format | Description |
| -------------- | ------ | ----------- |
| Total_count	| Int	| The number of devices in the query results |
| Page	| Int	| Current page |
| Per_page	| Int	| The number of equipment per page |
| Devices	| Array-json	| The json array of device information, see the devices description table |

- Devices description table

| Parameter name | Format | Description |
| -------------- | ------ | ----------- |
| Protocol	| String	| Device access protocol |
| Create_time	| String	| Equipment creation time, Beijing time |
| Online	| Bool	| The online status of the device |
| Id	| String	| Device ID |
| Auth_info	| String	| Device reference information, corresponding to the "sn" or "mac" parameters in the device registration interface |
| Title	| String	| Equipment name |
| Desc	| String	| Device description |
| Tags	| Array-string	| Device label |
| location	| Json	| Device position coordinate information, represented by longitude and latitude key value pairs: {"lon":xx, "lat":xx} |
| Other	| Json	| Custom information of other devices is represented in the format of key-value pairs, see the example. |

- Request Example 1

- Query online devices labeled with china from 2017-02-04 to 2017-06-04

- GET http://api.onenet.hk.chinamobile.com/devices? Begin=2017-02-04&end=2017-06-04&online=true&tag=ch

- Request Example 2

- Query two devices with device IDs of 35282992 and 35271941

- GET http://api.onenet.hk.chinamobile.com/devices? Device_id=35282992,35271941 HTTP/1.1

- Request Example 3

- Query all the devices under this product

- GET http://api.onenet.hk.chinamobile.com/devices HTTP/1.1

- Return to the example

```

{
    "errno": 0,
    "data": {
        "per_page": 30,
        "devices": [{
            "protocol": "EDP",
            "other": {
                "version": "1.0.0",
                "manufacturer": "china mobile"
            },
            "create_time": "2018-06-04 17:43:11",
            "online": true,
            "location": {
                "lat": 23.54,
                "lon": 109
            },
            "id": "35282992",
            "auth_info": "tes01235n82105",
            "title": "test_device",
            "desc": "test_desc",
            "tags": ["china", "mobile"]
        }, {
            "protocol": "EDP",
            "create_time": "2018-06-04 11:15:38",
            "online": true,
            "id": "35271941",
            "auth_info": "tes810372105",
            "title": "test_device",
            "tags": ["china"]
        }],
        "total_count": 2,
        "page": 1
    },
    "error": "succ"
}

```

### 2.6 <a name='UploadDeviceFile'></a>Upload device file

- Request method: POST
- URL: https://www.onenet.hk.chinamobile.com:2616/device/file-upload
- URL parameters

| Parameter name | Format | Is it necessary | Description |
| -------------- | ------ | ---------------- | ----------- |
| product_id |string | Product ID + device name or IMEI,one of them are required | Product ID |
| device_name |string | Product ID + device name or IMEI,one of them are required | Device name |
| imei |string | Product ID + device name or IMEI,one of them are required | Device imei |
| file | | Yes | File stream, support .jpg .jpeg .png .bmp .gif .webp .tiff .txt； The size should not exceed 20MB |

- Return the parameters

| Parameter name | Format | Description |
| -------------- | ------ | ----------- |
| code | int | The error code is calced, and 0 means the calcation is successful. |
| msg | string | Error description, "succ" means successful cal |
| request_id | string | Request ID |
| data | object | Return data details, see the data description table |
| data.fid | string | fileID |

- Example

```
Sample Request
POST https://www.onenet.hk.chinamobile.com:2616/device/file-upload?imei=***
Content-type: multipart/form-data

{
    "device_name": "device_name",
    "product_id": "qwdfbht",
    "imei": "xxx",
    "file": file
}
```
```
Example of Response
{
    "code": 0,
    "msg": "succ",
    "request_id": "a25087f46df04b69b29e90ef0acfd115",
    "data": {
        "fid": "asddgdg23g4t3443425v52v532v56"
    }
}
```


- make token stay 