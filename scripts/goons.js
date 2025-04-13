async function fetchGoonData() {
    try {
      const response = await fetch("https://goons.onrender.com/goons");
      const data = await response.json();
  
      const map = data["Current Map"]?.[0] || "Unkown";
      const time = data["Time"]?.[0] || "Unkown";
  
      document.getElementById("goon-status").innerHTML = `
        <strong>🗺️ ${map}</strong><br>
        Last seen: ${time}
      `;
    } catch (error) {
      console.error("Error getting Goons data:", error);
      document.getElementById("goon-status").textContent = "⚠️ Error fetching data";
    }
  }
  

  window.addEventListener("DOMContentLoaded", fetchGoonData);
  setInterval(fetchGoonData, 5 * 60 * 1000);