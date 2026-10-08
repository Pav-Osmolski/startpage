(function() {
  const element = document.getElementById('Date');
  if (!element) return;
  const time = element.querySelector('time') || element;
  const zeroFill = value => String(value).padStart(2, '0');
  let timer;

  function update() {
    const now = new Date();
    time.textContent = `${zeroFill(now.getMonth() + 1)}/${zeroFill(now.getDate())}/${now.getFullYear()} ${zeroFill(now.getHours())}:${zeroFill(now.getMinutes())}:${zeroFill(now.getSeconds())}`;
    time.setAttribute('datetime', now.toISOString());
  }

  function sync() {
    clearInterval(timer);
    if (!document.hidden) {
      update();
      timer = setInterval(update, 1000);
    }
  }

  document.addEventListener('visibilitychange', sync);
  sync();
})();
