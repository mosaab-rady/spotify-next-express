export function millisToSeconds(millis) {
  const mints = Math.floor(millis / 60000);
  const secs = ((millis % 60000) / 1000).toFixed(0);
  return secs === 60
    ? mints + 1 + ':00'
    : mints + ':' + (secs < 10 ? '0' : '') + secs;
}
