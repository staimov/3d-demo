class WinCCOAWebSocket {
	websocket;
	onValueReceived;
	onClose;
	onMessage;
	onError;
	onOpen;

	#opened;
	
	constructor(url) {
		this.#opened = false;
		this.websocket = new WebSocket(url);
		var self = this;
        this.websocket.onopen = function(evt) { self.#onOpen(evt); };
        this.websocket.onclose = function(evt) { self.#onClose(evt); };
        this.websocket.onmessage = function(evt) { self.#onMessage(evt); };
        this.websocket.onerror = function(evt) { self.#onError(evt); };
	};
	
	#onOpen(evt) {
		this.#opened = true;
		console.log("Socket opened");
		if (typeof this.onOpen === "function") { 
			this.onOpen(evt);
		}			
	};
	
	#onClose(evt) {
		this.#opened = false;
		if (evt.wasClean) {
			console.log("Socket closed clean");
		} else {
			console.log("Socket closed with error");
		}
		if (typeof this.onClose === "function") { 
			this.onClose(evt);
		}			
	};

	#onMessage(evt) {
		console.log("Message received: " + evt.data);
		var obj = JSON.parse(evt.data);
		if (typeof this.onMessage === "function") { 
			this.onMessage(evt);
		}			
		if (typeof this.onValueReceived === "function") { 
			this.onValueReceived(obj.dpname, obj.value);
		}		
	};

	#onError(evt) {
		console.log("Socket error: " + evt.message);
		if (typeof this.onError === "function") { 
			this.onError(evt);
		}			
	};	
	
	dpGet(name) {
		if (this.#opened) {
			var msg_obj = {
				type:"dpGet",
				dpname:name,
			};
			console.log("Reading: " + name);
			this.sendMessage(msg_obj);
		}
	};	
	
	dpSet(name, value) {
		if (this.#opened) {
			var msg_obj = {
				type:"dpSet",
				dpname:name,
				value:value
			};
			console.log("Writing: " + name);
			this.sendMessage(msg_obj);
		}
	};	
	
	dpConnect(name) {
		if (this.#opened) {
			var msg_obj = {
				type:"dpConnect",
				dpname:name,
			};
			console.log("Subscribing: " + name);
			this.sendMessage(msg_obj);
		}

	};	
	
	dpDisconnect(name) {
		if (this.#opened) {
			var req_msg = {
				type:"dpDisconnect",
				dpname:name,
			};
			console.log("Unsubscribing: " + name);
			this.sendMessage(req_msg);
		}
	};	
	
	sendMessage(msg_obj) {
		if (this.#opened) {
			var msg_str = JSON.stringify(msg_obj);				
			console.log("JSON Message: " + msg_str);
			this.websocket.send(msg_str);
		}
	};
	
	close() {
		if (this.websocket.readyState == WebSocket.OPEN)
		{
			this.websocket.close();
		}
		else
		{
			console.log("Socket not open, state: " + this.websocket.readyState);
		}		
	};	
}

export { WinCCOAWebSocket };