//to do: Node RED type definitions
declare var RED: any;

//
// -- amqp in --------------------------------------------------------------------------------------
//
RED.nodes.registerType("amqp in", {
    category: "input",
    defaults: {
        name: { value: "" },
        topic: { value: "" },
        iotype: { value: "4", required: true },
        ioname: { value: "" },
        server: { type: "amqp-server", required: true }
    },
    inputs: 1,
    outputs: 1,
    color: "#ff9933",
    icon: "bridge.png",
    label: function() {
        return this.name || this.ioname || "amqp in";
    },
    labelStyle: function() {
        return this.name ? "node_label_italic" : "";
    }
});
