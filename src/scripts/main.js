/**
 * Adds animation delays to each element which matches 'q'
 * by a factor of 'delta'.
 *
 * @param {string} config.q - Query selector value to match against.
 * @param {number} config.delta - Multiplier (in s) between animation delays.
 */
const addAnimationDelay = ({ q, delta }) => {
  const animatedNodes = document.querySelectorAll(q);
  const animationDelta = delta;
  animatedNodes.forEach((node, i) => {
    node.style = `animation-delay: ${i * animationDelta}s`;
  });
};

// Add animation delays once DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  addAnimationDelay({ q: ".animated", delta: 0.02 });
});
