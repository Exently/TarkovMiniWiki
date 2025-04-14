async function fetchGoonData() {
    try {
        const response = await fetch("https://goons.onrender.com/goons");
        const data = await response.json();

        const map = data["Current Map"]?.[0] || "Unknown";
        const time = data["Time"]?.[0] || "Unknown";
        //Response Time is in EST, convert to UTC to calculate local time

        const localTime = convertAPIFromESTToVisitorLocal(time);

        const seenDate = convertAPIFromESTToVisitorLocal(time, true);
        const now = new Date();
        const diffInHours = (now - seenDate) / (1000 * 60 * 60);

        const mapNote = diffInHours > 3
            ? `<div style="color:#999; font-size: 0.9em;">⚠️ Likely on another map</div>`
            : "";

        document.getElementById("goon-status").innerHTML = `
            <strong>🗺️ ${map}</strong><br>
            Last seen: ${localTime}
            ${mapNote}
        `;
    } catch (error) {
        console.error("Error getting Goons data:", error);
        document.getElementById("goon-status").textContent = "⚠️ Error fetching data";
    }
}

window.addEventListener("DOMContentLoaded", fetchGoonData);
setInterval(fetchGoonData, 5 * 60 * 1000);

function convertAPIFromESTToVisitorLocal(rawTime, returnDateObject = false) {
    const parts = rawTime.match(/(\w+) (\d+), (\d+), (\d+):(\d+) (am|pm)/i);
    if (!parts) return returnDateObject ? null : rawTime;

    const [, monthName, day, year, hourRaw, minute, ampm] = parts;

    const months = {
        January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
        July: 6, August: 7, September: 8, October: 9, November: 10, December: 11
    };

    let hour = parseInt(hourRaw, 10);
    if (ampm.toLowerCase() === "pm" && hour !== 12) hour += 12;
    if (ampm.toLowerCase() === "am" && hour === 12) hour = 0;

    const utcDate = new Date(Date.UTC(
        parseInt(year),
        months[monthName],
        parseInt(day),
        hour + 5, // EST → UTC
        parseInt(minute)
    ));

    if (returnDateObject) return utcDate;

    return utcDate.toLocaleString("en-EN", {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    });
}
