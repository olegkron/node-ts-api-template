/**
 * Execute a function regularly based on a specified interval.
 *
 * @param {Function} fn - The function to execute.
 * @param {number} interval - The interval (in milliseconds) to wait between executions.
 * @returns {Function} A function that, when called, will clear the interval and stop future executions.
 */

export function withInterval (fn, interval, initialFetch = false) {
  if (initialFetch) {
    try {
      fn()
    } catch (error) {
      console.error('Error encountered in initial execution of withInterval function:', error)
      // Depending on your needs, you might want to exit the entire function if an error occurs during initial fetch.
      // return;
    }
  }

  // This is the main interval handler.
  const intervalId = setInterval(() => {
    try {
      fn()
    } catch (error) {
      console.error('Error encountered in withInterval function:', error)
      // Depending on your needs, you might want to clear the interval if an error occurs.
      // clearInterval(intervalId);
    }
  }, interval)

  // Return a function that can be used to clear the interval.
  return () => {
    clearInterval(intervalId)
  }
}
