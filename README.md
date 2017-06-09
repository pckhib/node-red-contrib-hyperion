# node-red-contrib-hyperion

[Node-RED](http://nodered.org) Node to control a Hyperion server

## Install

Run the following command in the root directory of your Node-RED installation:
```
npm install node-red-contrib-hyperion
```

## Usage

Set the ```msg.payload``` according to your requested action.

### Set Color

Set the color using an array of RGB values.
```
{
    "color": [255, 100, 0] // [r, g, b]
}
```

### Set Brightness

Set the brightness using a value from 0 to 100.
```
{
    "bri": 80
}
```

### Set Effect

Set an effect using the effects' name.
```
{
    "effect": "Knight rider"
}
```

### Clear

Clear the data and switch off the LEDs.
```
{
    "clear": true
}
```

## Sample flow

```
[{"id":"79aecb29.a73e84","type":"Hyperion","z":"f8cb4d31.7e4e2","server":"db98cd21.6a2bb","x":340,"y":80,"wires":[]},{"id":"4064f27a.ee301c","type":"inject","z":"f8cb4d31.7e4e2","name":"","topic":"","payload":"{ \"color\": [20, 20, 0], \"bri\":50 }","payloadType":"json","repeat":"","crontab":"","once":false,"x":130,"y":80,"wires":[["79aecb29.a73e84"]]},{"id":"db98cd21.6a2bb","type":"Hyperion-Server-Conf","z":"","ip":"127.0.0.1","port":"19444","name":"Home"}]
```

## Copyright and license

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details