 /* Создать ключ WebAuthn */
async function webAuthnCreate() 
{
  const selectedOption = document.getElementById('selectedOptionField').value;
  
  let LSKeyName = '';
  if(selectedOption == 'credBlob') { LSKeyName = 'credBlobID';}
  else{ LSKeyName = 'largeBlobID';}

  console.log(selectedOption);

  let userVerificationType = 'required';
  if (document.getElementById('isDiscouraged').value === 'false')
  {
    userVerificationType = 'discouraged';
  }

  try 
  {
    const createdKey = await createCredential(buildEnrollExtensions(selectedOption), userVerificationType);
    window.localStorage.setItem(LSKeyName, arrayBufferToBase64(createdKey.rawId));
    PrintInfo(
        'MainKeyData: ' + objectToString(createdKey) + '\n' +
        'Extensions: ' + extensionsOutputToString(createdKey)
        );

//Вывод в терминал
    printKeyData(createdKey, selectedOption, 'create');
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

  let userVerificationType = 'required';
  if (document.getElementById('isDiscouraged').value === 'false')
  {
    userVerificationType = 'discouraged';
  }

  console.log(userVerificationType);

  try 
  {
    const publicKey = 
    {
      challenge: new TextEncoder().encode('Authentication challenge'),
      userVerification: userVerificationType,
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
    const assertion = await navigator.credentials.get({publicKey});
    PrintInfo(
        'MainKeyData: ' + objectToString(assertion) + '\n' +
        'Extensions: ' + extensionsOutputToString(assertion)
        );
        
    printKeyData(assertion, selectedOption, largeBlobMode);
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


async function createCredential(additionalExtensions, userVerificationType) 
{
    console.log(userVerificationType);

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
        userVerification: userVerificationType,
        authenticatorAttachment: 'platform',
      },
    };
  
    if (additionalExtensions !== undefined) 
    {
      publicKey['extensions'] = additionalExtensions;
    }
  
    return await navigator.credentials.create({publicKey});
  }
