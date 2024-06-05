/**
 * Javascript that handles assertions 
 */

/**
 * Assert a condition 
 *  - If not fulfilled, throws Error with appropriate message
 * @param {boolean} condition condition to be fulfilled
 * @param {string} message message to be displayed if condition failed
 * @param {*} errorValue value of the error
 */
function assertCondition(condition, message, errorValue) {
  if(!condition){
    throw new Error(message + "\nError value :" + errorValue || 
                    message ||
                    "Error value :" + errorValue ||
                    "Assertion failed");
  }
}
