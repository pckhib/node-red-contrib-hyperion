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

        node.color = [0, 0, 0];
        node.effects = [];

        var Hyperion = require('hyperion-client');

        this.server = RED.nodes.getNode(config.server);

        node.on('input', function (msg) {

            var hyperion = new Hyperion(this.server.ip, this.server.port, this.server.priority);
            hyperion.on('connect', function () {
                hyperion.getServerinfo(function (err, result) {
                    node.effects = result.info.effects;

                    if (result.info.activeLedColor.length > 0) {
                        node.color = result.info.activeLedColor[0]["RGB Value"];
                    } else {
                        node.color = [0, 0, 0];
                    }

                    // set color [r, g, b]; 0 - 255
                    if ('color' in msg.payload) {
                        if (Array.isArray(msg.payload.color) && msg.payload.color.length === 3) {
                            setColor(msg.payload.color);
                        }
                    }

                    // set brightness; 0 - 255
                    if ('bri' in msg.payload) {
                        var v = Math.max(node.color[0], node.color[1], node.color[2]) / 255 * 100;

                        var color = [];
                        color[0] = Math.round(node.color[0] / v * msg.payload.bri);
                        color[1] = Math.round(node.color[1] / v * msg.payload.bri);
                        color[2] = Math.round(node.color[2] / v * msg.payload.bri);

                        setColor(color);
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
                            setColor([0, 0, 0]);
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
                color[0] = Math.min(color[0], 255);
                color[1] = Math.min(color[1], 255);
                color[2] = Math.min(color[2], 255);

                color[0] = Math.max(color[0], 0);
                color[1] = Math.max(color[1], 0);
                color[2] = Math.max(color[2], 0);

                if (color[0] != 0 || color[1] != 0 || color[2] != 0) {
                    node.color = color;
                }

                hyperion.setColor(color, function (err, result) {
                });
            }
        });
    }
    RED.nodes.registerType('Hyperion', HyperionNode);
}
