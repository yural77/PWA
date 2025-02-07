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