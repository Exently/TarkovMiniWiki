const tarkovRatio = 7;

window.addEventListener("load", () => {
    setTimeout(() => setInterval(updateClock, 1000), 100);
  });

function hrs(num) {
    return 1000 * 60 * 60 * num;
}

function realTimeToTarkovTime(nowMs, left) {
    const oneDay = hrs(24);
    const russia = hrs(3); // MSK timezone offset
    const offset = russia + (left ? 0 : hrs(12));

    const tarkovMs = (offset + nowMs * tarkovRatio) % oneDay;
    return new Date(tarkovMs);
}

function pad(n) {
    return String(n).padStart(2, '0');
}

function formatTime(date) {
    return `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`;
}

function animate() {
    const nowMs = Date.now();
    const leftTarkov = realTimeToTarkovTime(nowMs, true);
    const rightTarkov = realTimeToTarkovTime(nowMs, false);

    document.getElementById("tarkov-left").textContent = formatTime(leftTarkov);
    document.getElementById("tarkov-right").textContent = formatTime(rightTarkov);

    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
