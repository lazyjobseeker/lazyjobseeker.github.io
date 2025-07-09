function updateUTCClock() {
  const now = new Date();

  // Format time
  const hours = now.getUTCHours().toString().padStart(2, '0');
  const minutes = now.getUTCMinutes().toString().padStart(2, '0');
  const seconds = now.getUTCSeconds().toString().padStart(2, '0');
  const timeStr = `${hours}:${minutes}:${seconds}`;

  // Format date as MM/DD/YYYY
  const month = (now.getUTCMonth() + 1).toString().padStart(2, '0'); // months are 0-indexed
  const day = now.getUTCDate().toString().padStart(2, '0');
  const year = now.getUTCFullYear();
  const dateStr = `${month}/${day}/${year}`;

  // Display both
  document.getElementById("utc-clock").textContent = `UTC ${dateStr} ${timeStr}`;
}

// Update immediately, then every second
updateUTCClock();
setInterval(updateUTCClock, 1000);