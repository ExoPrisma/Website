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
                    "Condition unmet");
  }
}

/** 
 * Assert equality (type & value)
 *  - If not fulfilled, throws Error with appropriate message 
 * @param {*} expectedValue expected value
 * @param {*} actualValue actual value
 * @param {string} message message to be displayed if condition failed
 */
function assertEqual(expectedValue, actualValue, message) {
  if(expectedValue !== actualValue) {
    throw new Error(message || "Not equal");
  }
}

module.exports = {
  assertCondition, 
  assertEqual,
}