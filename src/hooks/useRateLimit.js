import { useState, useEffect } from "react";

/**
 * Custom hook for rate limiting login attempts
 * Tracks failed attempts and blocks further attempts after threshold is reached
 *
 * @param {number} maxAttempts - Maximum number of attempts allowed (default: 5)
 * @param {number} windowMs - Time window in milliseconds (default: 300000 = 5 minutes)
 * @returns {Object} - Rate limit state and methods
 */
const useRateLimit = (maxAttempts = 5, windowMs = 300000) => {
  const [attempts, setAttempts] = useState([]);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimeRemaining, setBlockTimeRemaining] = useState(0);

  useEffect(() => {
    const now = Date.now();

    // Filter attempts within the time window
    const recentAttempts = attempts.filter((time) => now - time < windowMs);

    if (recentAttempts.length >= maxAttempts) {
      setIsBlocked(true);

      // Calculate when the block will be lifted
      const oldestAttempt = Math.min(...recentAttempts);
      const unblockTime = oldestAttempt + windowMs;
      setBlockTimeRemaining(Math.ceil((unblockTime - now) / 1000));

      // Set up countdown timer
      const timer = setInterval(() => {
        const remaining = Math.ceil((unblockTime - Date.now()) / 1000);

        if (remaining <= 0) {
          // Unblock and reset
          setIsBlocked(false);
          setBlockTimeRemaining(0);
          setAttempts([]);
          clearInterval(timer);
        } else {
          setBlockTimeRemaining(remaining);
        }
      }, 1000);

      // Cleanup timer on unmount or when dependencies change
      return () => clearInterval(timer);
    } else {
      setIsBlocked(false);
      setBlockTimeRemaining(0);
    }
  }, [attempts, maxAttempts, windowMs]);

  /**
   * Records a failed login attempt
   * Call this function after each failed login
   */
  const recordAttempt = () => {
    setAttempts((prev) => [...prev, Date.now()]);
  };

  /**
   * Manually resets all attempts
   * Useful for clearing the rate limit after successful login
   */
  const resetAttempts = () => {
    setAttempts([]);
    setIsBlocked(false);
    setBlockTimeRemaining(0);
  };

  /**
   * Gets the number of remaining attempts before blocking
   */
  const getRemainingAttempts = () => {
    const now = Date.now();
    const recentAttempts = attempts.filter((time) => now - time < windowMs);
    return Math.max(0, maxAttempts - recentAttempts.length);
  };

  return {
    isBlocked,
    blockTimeRemaining,
    recordAttempt,
    resetAttempts,
    getRemainingAttempts,
    attemptsCount: attempts.length,
  };
};

export default useRateLimit;
