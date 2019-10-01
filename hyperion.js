module.exports = function (RED) {
    function HyperionServerConfNode(config) {
        RED.nodes.createNode(this, config);

        this.ip = config.ip;
        this.port = config.port;
        this.priority = config.priority;
        this.name = config.name;
    }
    RED.nodes.registerType('Hyperion-Server-Conf', HyperionServerConfNode);

    function HyperionNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        var Hyperion = require('hyperion-client');
        var Color = require('color');

        node.color = Color.rgb([0, 0, 0]);
        node.effects = [];

        this.server = RED.nodes.getNode(config.server);

        node.on('input', function (msg) {

            var hyperion = new Hyperion(this.server.ip, this.server.port, this.server.priority);
            hyperion.on('connect', function () {
                hyperion.getServerinfo(function (err, result) {
                    node.effects = result.info.effects;

                    if (result.info.activeLedColor.length > 0) {
                        node.color = Color.rgb(result.info.activeLedColor[0]["RGB Value"]);
                    } else {
                        node.color = Color.rgb([0, 0, 0]);
                    }

                    // set color [r, g, b]; 0 - 255
                    if ('color' in msg.payload) {
                        if (Array.isArray(msg.payload.color) && msg.payload.color.length === 3) {
                            setColor(Color.rgb(msg.payload.color));
                        }
                    }

                    // set brightness; 0 - 255
                    if ('bri' in msg.payload) {
                        var currentColor = node.color.rgb().array();
                        var v = Math.max(currentColor[0], currentColor[1], currentColor[2]) / 255 * 100;

                        var color = [];
                        color[0] = Math.round(currentColor[0] / v * msg.payload.bri);
                        color[1] = Math.round(currentColor[1] / v * msg.payload.bri);
                        color[2] = Math.round(currentColor[2] / v * msg.payload.bri);

                        setColor(Color.rgb(color));
                    }

                    // set hue; 0 - 360
                    if ('hue' in msg.payload) {
                        node.color.hue(msg.payload.hue);
                        setColor(node.color);
                    }

                    // set saturation (hsl); 0% - 100%
                    if ('saturation' in msg.payload) {
                        node.color.saturationl(msg.payload.saturation);
                        setColor(node.color);
                    }

                    // set lightness; 0% - 100%
                    if ('lightness' in msg.payload) {
                        node.color.lightness(msg.payload.lightness);
                        setColor(node.color);
                    }

                    // set effect; String - name of effect
                    if ('effect' in msg.payload) {
                        hyperion.setEffect(msg.payload.effect, msg.payload.args, function (err, result) {
                        });
                    }

                    if ('state' in msg.payload) {
                        if (msg.payload.state == 'on') {
                            setColor(node.color);
                        } else if (msg.payload.state == 'off') {
                            setColor(Color.rgb([0, 0, 0]));
                        }
                    }

                    if ('clear' in msg.payload && msg.payload.clear) {
                        hyperion.clear(function (err, result) {
                        });
                    }
                    if ('clearall' in msg.payload && msg.payload.clearall) {
                        hyperion.clearall(function (err, result) {
                        });
                    }

                });
            });
            hyperion.on('error', function () {
            });

            function setColor(color) {
                if (color.red() != 0 || color.green() != 0 || color.blue() != 0) {
                    node.color = color;
                }

                hyperion.setColor(color.rgb().array(), function (err, result) {
                });
            }
        });
    }
    RED.nodes.registerType('Hyperion', HyperionNode);
}
