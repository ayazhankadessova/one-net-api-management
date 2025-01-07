## One net API Swagger

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
