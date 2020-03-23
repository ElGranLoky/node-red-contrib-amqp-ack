//to do: Node RED type definitions
declare var RED: any;

//
// -- amqp ack --------------------------------------------------------------------------------------
//
RED.nodes.registerType("amqp ack", {
    category: "output",
    defaults: {
        name: { value: "" },
        topic: { value: "" },
        iotype: { value: "1", required: true },
        ioname: { value: "" },
        server: { type: "amqp-server", required: true }
    },
    inputs: 1,
    outputs: 1,
    color: "#2e8b57",
    icon: "font-awesome/fa-flag-o",
    label: function() {
        return this.name || this.ioname || "amqp ack";
    },
    labelStyle: function() {
        return this.name ? "node_label_italic" : "";
    }
});