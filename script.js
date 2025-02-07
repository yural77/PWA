/* Создать ключ WebAuthn */
async function createFIDOKey(KeyName, requireLargeBlobSupport = false,) 
{
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
  return JSON.stringify(clientExtensionResults, /*replacer=*/ undefined,/*space=*/ 2);
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
  
  /**
   * Converts a PaymentResponse or a PublicKeyCredential into a string.
   */
  function objectToString(input) {
    return JSON.stringify(objectToDictionary(input), undefined, 2);
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



///////////////////////////////////////////




   /**
   * Prints the given error message.
   * @param {string} msg - The error message to print.
   */
   function error(msg) {  // eslint-disable-line no-unused-vars
    let element = document.createElement('error_field');
    element.innerHTML = msg;
    element.className = 'error';
    document.getElementById('msg').appendChild(element);
  }
  
  /**
   * Prints the given informational message.
   * @param {string} msg - The information message to print.
   */
  function info(msg) {
    let element = document.createElement('info');
    element.innerHTML = msg;
    element.className = 'info';
    document.getElementById('msg').appendChild(element);
  }
  
  /**
   * Clears all messages.
   */
  function clearAllMessages() {  // eslint-disable-line no-unused-vars
    document.getElementById('info').innerHTML = '';
  }