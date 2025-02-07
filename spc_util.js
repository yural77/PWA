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