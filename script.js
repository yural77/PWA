 /* Создать ключ WebAuthn */
async function webAuthnCreate() 
{
  const selectedOption = document.getElementById('selectedOptionField').value;
  
  let LSKeyName = '';
  if(selectedOption == 'credBlob') { LSKeyName = 'credBlobID';}
  else{ LSKeyName = 'largeBlobID';}

  console.log(selectedOption);
  try 
  {
    const publicKeyCredential = await createCredential(buildEnrollExtensions(selectedOption),);
    window.localStorage.setItem(LSKeyName, arrayBufferToBase64(publicKeyCredential.rawId));
    PrintInfo(
        'MainKeyData: ' + objectToString(publicKeyCredential) + '\n' +
        'Extensions: ' + extensionsOutputToString(publicKeyCredential)
        );

//Вывод в терминал
    if(publicKeyCredential.response)
    {
      if(selectedOption == 'credBlob' && publicKeyCredential.response.credBlob)
      {
        const data = new TextDecoder().decode(publicKeyCredential.response.credBlob);
        PrintInfo('credBlobCreationStatus: ' + data);
        if(data !== 'true') { PrintError("credBlob is not supported on this device"); }  
      }
      else {PrintError("credBlob is not supported on this device");}   
      
      if(selectedOption == 'largeBlob' && publicKeyCredential.response.largeBlob)
        {
          const data = new TextDecoder().decode(publicKeyCredential.response.largeBlob);
          PrintInfo('largeBlobCreationStatuc: ' + data);
        }
      else {PrintError("largeBlob is not supported on this device");}  

    }

    else {PrintError("Something went wrong, couldn't get authentication response");}    
  } 
  catch (err) 
  {
    PrintError(err);
  }
}

/**
 * Получает данные WebAuthn.
 */
async function webAuthnGet(largeBlobMode) 
{

  const selectedOption = document.getElementById('selectedOptionField').value;
  let LSKeyName = '';
  if(selectedOption == 'credBlob') { LSKeyName = 'credBlobID';}
  else{ LSKeyName = 'largeBlobID';}

  try 
  {
    const publicKey = 
    {
      challenge: new TextEncoder().encode('Authentication challenge'),
      userVerification: 'required',
      allowCredentials: 
      [
        {
          transports: ['internal'],
          type: 'public-key',
          id: base64ToArray(
              window.localStorage.getItem(LSKeyName)),
        },
      ],
      extensions: buildLoginExtensions(largeBlobMode, selectedOption),
    };
    const credentialInfoAssertion = await navigator.credentials.get({publicKey});
    PrintInfo(
        'Login: ' + objectToString(credentialInfoAssertion) + '\n' +
        'Extensions: ' + extensionsOutputToString(credentialInfoAssertion)
        );

    //Вывод в терминал
    if(credentialInfoAssertion.response)
    {
      if(selectedOption == 'credBlob' && credentialInfoAssertion.response.credBlob)
      {
        const data = new TextDecoder().decode(credentialInfoAssertion.response.credBlob);
        PrintInfo('credBlobData: ' + data);   
      }
      else {PrintError("credBlob is not supported on this device");}   
      
      if(selectedOption == 'largeBlob' && credentialInfoAssertion.response.largeBlob)
        {
          const data = new TextDecoder().decode(credentialInfoAssertion.response.largeBlob);
          PrintInfo('largeBlobData: ' + data);
        }
      else {PrintError("largeBlob is not supported on this device");}  

    }

    else {PrintError("Something went wrong, couldn't get authentication response");}
    
    
  } 
  catch (err) 
  {
    PrintError(err);
  }
}

/**
 * Режимы работы с большими бинарными данными.
 */
const LargeBlobMode = 
{
  None: 'None',
  Read: 'Read',
  Write: 'Write',
};

/**
 * Создает расширения для регистрации.
 */
function buildEnrollExtensions(selectedOption) 
{
  // Получаем значение из текстового поля
  const userInput = document.getElementById('secretInput').value;
  textToWrite = userInput || 'SecretExample'; // Запасной вариант

  if (selectedOption == 'largeBlob') { return { largeBlob: { support: 'required', } };} 

  else if (selectedOption == 'credBlob') 
  {
    const buffer = new TextEncoder().encode(textToWrite);
    return { credBlob: buffer, };
  }
  else { return {};}
}

/**
 * Создает расширения для входа.
 */
function buildLoginExtensions(LBmode, selectedOption, textToWrite) 
{
  // Получаем значение из текстового поля
  const userInput = document.getElementById('secretInput').value;
  textToWrite = userInput || 'SecretExample'; // Запасной вариант

  console.log(selectedOption);

  if(selectedOption == 'largeBlob')
  {
    if (LBmode === LargeBlobMode.None) { return {};} 
    else if (LBmode === LargeBlobMode.Write) 
    {
      const buffer = new TextEncoder().encode(textToWrite);
      return { largeBlob: { write: buffer, }, };
    } 
    else if (LBmode === LargeBlobMode.Read) 
    {
      return { largeBlob: { read: true, } };
    }
  }
  
  else if (selectedOption === 'credBlob')
  {
    return { getCredBlob: true, };
  }
}

/**
 * Преобразует результат расширений в строку.
 */
function extensionsOutputToString(credentialInfoAssertion) 
{
  const clientExtensionResults = credentialInfoAssertion.getClientExtensionResults();
  if (clientExtensionResults.largeBlob !== undefined && clientExtensionResults.largeBlob.blob !== undefined) 
  {
    clientExtensionResults.largeBlob.blob = arrayBufferToString(clientExtensionResults.largeBlob.blob);
  }
  return JSON.stringify(clientExtensionResults, /*replacer=*/ null,/*space=*/ 2);
}


async function createCredential(additionalExtensions) 
{

    const rp = 
    {
      id: window.location.hostname,
      name: 'UEK Demo',
    };
    const pubKeyCredParams = 
    [
    {
      type: 'public-key',
      alg: -7, // ECC
    }, 
    {
      type: 'public-key',
      alg: -257, // RSA
    }
    ];

    const user = 
    {
      name: 'Test User',
      displayName: '',
      id:  Uint8Array.from(String(Math.random()*999999999), c => c.charCodeAt(0)),
    }
  
    const publicKey = 
    {
      rp,
      user,
      challenge: new TextEncoder().encode('Data to sign'),
      pubKeyCredParams,
      authenticatorSelection: 
      {
        userVerification: 'required',
        authenticatorAttachment: 'platform',
      },
    };
  
    if (additionalExtensions !== undefined) 
    {
      publicKey['extensions'] = additionalExtensions;
    }
  
    return await navigator.credentials.create({publicKey});
  }
