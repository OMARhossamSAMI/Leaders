// Runs once before the test workers start, so they inherit it:
// run in UTC like the live server on Render (some date code depends on it).
module.exports = async () => {
  process.env.TZ = 'UTC';
};
