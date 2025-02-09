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
  
  function PrintInfo(msg, color = 'limegreen') 
  {
    const terminal = document.getElementById('terminal');
    appendToTerminal(msg, color); 
  }
  
  // Функция для добавления текста в терминал
  function appendToTerminal(message, color = "limegreen") {
    const terminal = document.getElementById('terminal');
    const timestamp = new Date().toLocaleTimeString();

    // Создаем новый span элемент
    const span = document.createElement('span');
    span.style.color = color; // Устанавливаем цвет
    span.textContent = `\n>>> [${timestamp}] ${message}\n-----------------------\n\n`;

    // Добавляем span в div#terminal
    terminal.appendChild(span);

    terminal.scrollTop = terminal.scrollHeight; // Прокрутка вниз
}

      

  function printKeyData(key, selectedOption, mode)
  {
    if(key.response)
      {
        const KeyExtensions = key.getClientExtensionResults();
    
        if(selectedOption === 'credBlob')
        {
          if(KeyExtensions.credBlob !== undefined || KeyExtensions.getCredBlob !== undefined)
          {
            if(mode === 'create')
            {
              const data = String(KeyExtensions.credBlob); //bool to string
              PrintInfo('Creation Status: ' + data, 'lightblue');
              if(KeyExtensions.credBlob !== true) { PrintError("credBlob is not supported on this device"); }  
            }
            else
            {
              const data = new TextDecoder().decode(KeyExtensions.getCredBlob);
              PrintInfo('Secret data: ' + data, 'lightblue');
              if(KeyExtensions.getCredBlob == undefined || KeyExtensions.getCredBlob === '') { PrintError("credBlob is not supported on this device"); } 
            }
          }
          else {PrintError("credBlob is not supported on this device");}  
        }
           
          
        if(selectedOption === 'largeBlob')
        {
          if (KeyExtensions.largeBlob !== undefined)
          {
            if(mode === 'create')
            {
              const data = String(KeyExtensions.largeBlob['supported']);
              PrintInfo('Creation Status: ' + data, 'lightblue');
              if(KeyExtensions.largeBlob['supported'] !== true) { PrintError("largeBlob is not supported on this device"); }  
            }
            else if (mode === LargeBlobMode.Write)
            {
              const data = String(KeyExtensions.largeBlob['written']);
              PrintInfo('Write Status: ' + data, 'lightblue');
              if(KeyExtensions.largeBlob['written'] !== true) { PrintError("largeBlob is not supported on this device"); } 
            }
            else
            {
              const data = new TextDecoder().decode(KeyExtensions.largeBlob['blob']);
              PrintInfo('Secret Data: ' + data, 'lightblue');
              if(KeyExtensions.largeBlob['blob'] == undefined || KeyExtensions.largeBlob['blob'] === '') { PrintError("largeBlob is not supported on this device"); } 
            }
            
          }
    
          else {PrintError("largeBlob is not supported on this device");}  
              
        }
      }
    else {PrintError("Something went wrong, couldn't get authentication response");}    
  }

  