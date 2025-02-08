 /* Создать ключ WebAuthn */
async function webAuthnCreate(KeyName, requireLargeBlobSupport = false,) 
{
  const selectedOption = document.getElementById('selectedOptionField').value;
  console.log(selectedOption);
  try 
  {
    const publicKeyCredential = await createCredential(buildEnrollExtensions(requireLargeBlobSupport),);
    window.localStorage.setItem(KeyName, arrayBufferToBase64(publicKeyCredential.rawId));
    info(
        'Enrolled: ' + objectToString(publicKeyCredential) + '\n' +
        'Extensions: ' + extensionsOutputToString(publicKeyCredential)
        );
  } 
  catch (err) 
  {
    //clearAllMessages();
    error(err);
  }
}

/**
 * Получает данные WebAuthn.
 */
async function webAuthnGet(KeyName, largeBlobMode) 
{
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
              window.localStorage.getItem(KeyName)),
        },
      ],
      extensions: buildLoginExtensions(largeBlobMode),
    };
    const credentialInfoAssertion = await navigator.credentials.get({publicKey});
    info(
        'Login: ' + objectToString(credentialInfoAssertion) + '\n' +
        'Extensions: ' + extensionsOutputToString(credentialInfoAssertion)
        );
  } 
  catch (err) 
  {
    error(err);
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
function buildEnrollExtensions(requireLargeBlobSupport) 
{
  if (requireLargeBlobSupport) { return { largeBlob: { support: 'required', } };} 
  else { return {};}
}

/**
 * Создает расширения для входа.
 */
function buildLoginExtensions(mode, textToWrite = 'UEK Secret') 
{
  // Получаем значение из текстового поля
  const userInput = document.getElementById('secretInput').value;
  textToWrite = userInput || 'Секрет по умолчанию'; // Запасной вариант

  if (mode === LargeBlobMode.None) { return {};} 
  else if (mode === LargeBlobMode.Write) 
  {
    const buffer = new TextEncoder().encode(textToWrite);
    return { largeBlob: { write: buffer, }, };
  } 
  else if (mode === LargeBlobMode.Read) 
  {
    return { largeBlob: { read: true, } };
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


////////////////////////////////////////////

/**
 * @param {object} optionalOverrides - a set of optional overrides for the
 *     default credential creation parameters.
 * @return {PublicKeyCredential} 
 */
async function createCredential(additionalExtensions) 
{
    const rp = 
    {
      //id: window.location.hostname,
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
      id: Uint8Array.from(String(Math.random()*999999999), c => c.charCodeAt(0)),
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