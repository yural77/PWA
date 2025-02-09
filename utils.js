  function objectToString(input) {
    return JSON.stringify(objectToDictionary(input), null, 2);
  }
  
  function base64ToArray(input) {
    return Uint8Array.from(atob(input), c => c.charCodeAt(0))
  }
  
  function arrayBufferToBase64(input) {
    return btoa(arrayBufferToString(input));
  }
  
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
    if (input.challenge) {
      output.challenge = input.challenge;
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

    return output;
  }

   function PrintError(msg) 
   { 
    const terminal = document.getElementById('terminal');
    appendToTerminal(msg, 'red');

  }
  
  function PrintInfo(msg) 
  {
    const terminal = document.getElementById('terminal');
    appendToTerminal(msg, 'limegreen'); 
  }
  
  // Функция для добавления текста в терминал
    function appendToTerminal(message, color = "limegreen") {
      const terminal = document.getElementById('terminal');
      const timestamp = new Date().toLocaleTimeString(); // Время действия
      const line = `\n>>> [${timestamp}] ${message}\n-----------------------\n\n`;
      terminal.innerHTML += line;

      terminal.style.color = color;
      terminal.scrollTop = terminal.scrollHeight; // Прокрутка вниз
    }

    function printKeyData(key)
    {
      if(createdKey.response)
        {
          const clientExtensionResults = createdKey.getClientExtensionResults();
    
          if(selectedOption === 'credBlob')
          {
            if(clientExtensionResults.credBlob !== undefined)
            {
              const data = String(clientExtensionResults.credBlob); //bool to string
              PrintInfo('credBlobCreationStatus: ' + data);
              if(clientExtensionResults.credBlob !== true) { PrintError("credBlob is not supported on this device"); }  
            }
            else {PrintError("credBlob is not supported on this device");}  
          }
           
          
          if(selectedOption === 'largeBlob')
          {
            if (clientExtensionResults.largeBlob !== undefined && clientExtensionResults.largeBlob.blob !== undefined)
            {
              const data = String(clientExtensionResults.largeBlob.blob['supported']);
              PrintInfo('largeBlobCreationStatus: ' + data);
            }
    
            else {PrintError("largeBlob is not supported on this device");}  
              
          }
        }
    
        else {PrintError("Something went wrong, couldn't get authentication response");}    
    }