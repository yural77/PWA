/**
   * Converts a PaymentResponse or a PublicKeyCredential into a string.
   */
  function objectToString(input) {
    return JSON.stringify(objectToDictionary(input), null, 2);
  }
  
  /**
   * Converts a base64 encoded string into Unit8Array.
   */
  function base64ToArray(input) {
    return Uint8Array.from(atob(input), c => c.charCodeAt(0))
  }
  
  /**
   * Converts an ArrayBuffer into a base64 encoded string.
   */
  function arrayBufferToBase64(input) {
    return btoa(arrayBufferToString(input));
  }
  
  /**
   * Converts an ArrayBuffer into a string.
   */
  function arrayBufferToString(input) {
    return String.fromCharCode(...new Uint8Array(input));
  }


  function objectToDictionary(input) {
    let output = {};
    if (input.requestId) {
      output.requestId = input.requestId;
    }
    if (input.id) {
      output.id = input.id;
    }
    if (input.rawId && input.rawId.constructor === ArrayBuffer) {
      output.rawId = arrayBufferToBase64(input.rawId);
    }
    if (input.response && (input.response.constructor ===
        AuthenticatorAttestationResponse || input.response.constructor ===
        AuthenticatorAssertionResponse || input.response.constructor === Object
        )) {
      output.response = objectToDictionary(input.response);
    }
    if (input.attestationObject && input.attestationObject.constructor ===
      ArrayBuffer) {
      output.attestationObject = arrayBufferToBase64(input.attestationObject);
    }
    if (input.authenticatorData && input.authenticatorData.constructor ===
      ArrayBuffer) {
      output.authenticatorData = arrayBufferToBase64(input.authenticatorData);
    }
    if (input.authenticatorData && input.authenticatorData.constructor ===
      String) {
      output.authenticatorData = input.authenticatorData;
    }
    if (input.clientDataJSON && input.clientDataJSON.constructor ===
      ArrayBuffer) {
      output.clientDataJSON = arrayBufferToString(input.clientDataJSON);
    }
    if (input.clientDataJSON && input.clientDataJSON.constructor ===
      String) {
      output.clientDataJSON = atob(input.clientDataJSON);
    }
    if (input.info) {
      output.info = objectToDictionary(input.info);
    }
    if (input.signature && input.signature.constructor === ArrayBuffer) {
      output.signature = arrayBufferToBase64(input.signature);
    }
    if (input.signature && input.signature.constructor === String) {
      output.signature = input.signature;
    }
    if (input.userHandle && input.userHandle.constructor === ArrayBuffer) {
      output.userHandle = arrayBufferToBase64(input.userHandle);
    }
    if (input.userHandle && input.userHandle.constructor === String) {
      output.userHandle = input.userHandle;
    }
    if (input.type) {
      output.type = input.type;
    }
    if (input.methodName) {
      output.methodName = input.methodName;
    }
    if (input.details) {
      output.details = objectToDictionary(input.details);
    }
    if (input.appid_extension) {
      output.appid_extension = input.appid_extension;
    }
    if (input.challenge) {
      output.challenge = input.challenge;
    }
    if (input.echo_appid_extension) {
      output.echo_appid_extension = input.echo_appid_extension;
    }
    if (input.echo_prf) {
      output.echo_prf = input.echo_prf;
    }
    if (input.prf_not_evaluated) {
      output.prf_not_evaluated = input.prf_not_evaluated;
    }
    if (input.prf_results) {
      output.prf_results = objectToDictionary(input.prf_results);
    }
    if (input.user_handle) {
      output.user_handle = input.user_handle;
    }
    if (input.authenticator_data) {
      output.authenticator_data = input.authenticator_data;
    }
    if (input.client_data_json) {
      output.client_data_json = atob(input.client_data_json);
    }
    if (input.shippingAddress) {
      output.shippingAddress = input.shippingAddress;
    }
    if (input.shippingOption) {
      output.shippingOption = input.shippingOption;
    }
    if (input.payerName) {
      output.payerName = input.payerName;
    }
    if (input.payerEmail) {
      output.payerEmail = input.payerEmail;
    }
    if (input.payerPhone) {
      output.payerPhone = input.payerPhone;
    }
    return output;
  }



///////////////////////////////////////////




   /**
   * Prints the given error message.
   * @param {string} msg - The error message to print.
   */
   function error(msg) {  // eslint-disable-line no-unused-vars
    /*let element = document.createElement('error_field');
    element.innerHTML = msg;
    element.className = 'error';
    document.getElementById('msg').appendChild(element);*/

    const terminal = document.getElementById('terminal');

    appendToTerminal(msg, "red");

  }
  
  /**
   * Prints the given informational message.
   * @param {string} msg - The information message to print.
   */
  function info(msg) {
    /*let element = document.createElement('info');
    element.innerHTML = msg;
    element.className = 'info';
    document.getElementById('msg').appendChild(element); 
    */

    const terminal = document.getElementById('terminal');
        appendToTerminal(`$ echo "${msg}" >> written.txt`);
        appendToTerminal(`Текст записан: ${msg}`, "blue");
      
  }
  
  /**
   * Clears all messages.
   */
  function clearAllMessages() {  // eslint-disable-line no-unused-vars
    document.getElementById('msg').innerHTML = '';
  }


  // Функция для добавления текста в терминал
    function appendToTerminal(message, color = "limegreen") {
      const terminal = document.getElementById('terminal');
      const timestamp = new Date().toLocaleTimeString(); // Время действия
      const line = `>>> %c[${timestamp}] %c${message} %c\n-----------------------\n`;
      terminal.innerHTML += line;
      terminal.style.cssText += `
        --line-color: ${color};
      `;
      terminal.scrollTop = terminal.scrollHeight; // Прокрутка вниз
    }