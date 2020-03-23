//to do: Node RED type definitions
declare var RED: any;

//
// -- amqp server ----------------------------------------------------------------------------------
//
RED.nodes.registerType("amqp-server", {
    category: "config",
    defaults: {
        host: { value: "localhost" },
        port: { value: 5672, validate: RED.validators.number() },
        vhost: { value: ""},
        keepalive: { value: 30, validate: RED.validators.number() },
        usetls: { value: false },
        verifyservercert: { value: true },
		useca: { value: false },
		ca: { value: "" },
        usetopology: { value: false },
        topology: { value: "{\n" +
                            "\t\"exchanges\": [\n" +
                            "\t\t{\"name\": \"exchange1\", \"type\": \"direct\", \"options\": {\"durable\": false}},\n" +
                            "\t\t{\"name\": \"exchange2\"}\n" +
                            "\t],\n" +
                            "\t\"queues\": [\n" +
                            "\t\t{\"name\": \"queue1\", \"options\": {\"messageTtl\": 60000}},\n" +
                            "\t\t{\"name\": \"queue2\"}\n" +
                            "\t],\n" +
                            "\t\"bindings\": [\n" +
                            "\t\t{\"source\": \"exchange1\", \"queue\": \"queue1\", \"pattern\": \"debug\", \"args\": {}},\n" +
                            "\t\t{\"source\": \"exchange1\", \"exchange\": \"exchange2\", \"pattern\": \"error\"},\n" +
                            "\t\t{\"source\": \"exchange2\", \"queue\": \"queue2\"}\n" +
                            "\t]\n" +
                            "}"},
        prefetch: { value: false},
        prefetchvalue: { value: 1, validate: RED.validators.number() },
        prefetchack: { value: false},
        prefetchvalueack: { value: 10, validate: RED.validators.number() }
    },
    credentials: {
        user: {type: "text"},
        password: {type: "password"}
    },
    label: function() {
        return (this.host || "localhost") + (this.port ? ":" + this.port : "");
    },
    oneditprepare: function () {
        var tabs = RED.tabs.create({
            id: "node-config-amqp-server-tabs",
            onchange: function (tab) {
                $("#node-config-amqp-server-tabs-content").children().hide();
                $("#" + tab.id).show();
                if (tab.id === "amqp-server-tab-topology") {
                    functionDialogResize();
                }
            }
        });
        tabs.addTab({
            id: "amqp-server-tab-connection",
            label: "Connection"
        });
        tabs.addTab({
            id: "amqp-server-tab-security",
            label: "Security"
        });
        tabs.addTab({
            id: "amqp-server-tab-topology",
            label: "Topology"
        });
        tabs.addTab({
            id: "amqp-server-tab-prefetch",
            label: "Prefetch"
        });
        setTimeout(function() { tabs.resize(); }, 0);

		function updateCAStatus() {
		    //node-config-input-useca
			if ($("#node-config-input-useca").is(":checked")) {
				$("#node-config-input-ca").prop("disabled", false);
			} else {
				$("#node-config-input-ca").prop("disabled", true);
			}
		}

		updateCAStatus();

		$("#node-config-input-useca").on("click", function() {
			updateCAStatus();
		});

        function updateTLSOptions() {
            if ($("#node-config-input-usetls").is(":checked")) {
                $("#node-config-input-useca").prop("disabled", false);
                $("#node-config-input-ca").prop("disabled", false);
                $("#node-config-input-ca").next().css("color", "");
            } else {
                $("#node-config-input-useca").prop("disabled", true);
                $("#node-config-input-ca").prop("disabled", true);
                $("#node-config-input-ca").next().css("color", "#aaa");
            }
        }
        updateTLSOptions();
        $("#node-config-input-usetls").on("click", function() {
            updateTLSOptions();
        });

		function updatePrefetchStatus() {
		    //node-config-input-prefetch
			if ($("#node-config-input-prefetch").is(":checked")) {
                $("#node-config-input-prefetchvalue").prop("disabled", false);
                $("#node-config-input-prefetchack").prop("disabled", false);
                $("#node-config-input-prefetchackvalue").prop("disabled", false);
			} else {
                $("#node-config-input-prefetchvalue").prop("disabled", true);
                $("#node-config-input-prefetchack").prop("disabled", true);
                $("#node-config-input-prefetchackvalue").prop("disabled", true);
			}
		}

		updatePrefetchStatus();

		$("#node-config-input-prefetch").on("click", function() {
			updatePrefetchStatus();
        });

		function updatePrefetchACKStatus() {
		    //node-config-input-prefetchack
			if ($("#node-config-input-prefetchack").is(":checked")) {
				$("#node-config-input-prefetchvalueack").prop("disabled", false);
			} else {
				$("#node-config-input-prefetchvalueack").prop("disabled", true);
			}
		}

		updatePrefetchACKStatus();

		$("#node-config-input-prefetchack").on("click", function() {
			updatePrefetchACKStatus();
		});

        // use editor
        var topologyField = $("#node-config-input-topology");
        this.editor = RED.editor.createEditor({
            id: "node-config-input-topology-editor",
            mode: "ace/mode/json",
            value: topologyField.val()
        });

        // update editor changes to topology field
        var editor = this.editor;
        this.editor.getSession().on("change", function() {
          topologyField.val(editor.getSession().getValue());
        });

        // this.editor.focus();

        // resize editor area to fit the edit window
        function functionDialogResize() {
            // var topologyTab = $("#amqp-server-tab-topology");
            // if(topologyTab.)
            var height = $("#dialog-config-form").height();
            if (height === null) {
                height = $(".editor-tray-body").height();
            }
            height -= $("#node-config-amqp-server-tabs").outerHeight(true);
            console.log("height:" + height + "px");
            var rows = $("#amqp-server-tab-topology>div:not(.node-text-editor-row)");
            for (var i = 0; i < rows.length; i++) {
                height -= $(rows[i]).outerHeight(true);
            }
            console.log("height:" + height + "px");
            var editorRow = $("#dialog-config-form>div.node-text-editor-row");
            if (editorRow.css("marginTop")) {
                height -= parseInt(editorRow.css("marginTop"), 10);
            }
            if (editorRow.css("marginBottom")) {
                height -= parseInt(editorRow.css("marginBottom"), 10);
            }
            height -= 5;
            console.log(height);
            if (height < 100) {
                height = 400;
            }
            $(".node-text-editor").css("height", height + "px");
            console.log("height:" + height + "px");
            editor.resize();
        }
        $("#node-config-dialog").on("dialogresize", functionDialogResize);
        $("#node-config-dialog").one("dialogopen", function(ev) {
            var size = $("#node-config-dialog").dialog("option", "sizeCache-function");
            if (size) {
                $("#node-config-dialog").dialog("option", "width", size.width);
                $("#node-config-dialog").dialog("option", "height", size.height);
                functionDialogResize();
            }
        });
        $("#node-config-dialog").one("dialogclose", function(ev) {
            var height = $("#node-config-dialog").dialog("option", "height");
            $("#node-config-dialog").off("dialogresize", functionDialogResize);
        });
    }
});

