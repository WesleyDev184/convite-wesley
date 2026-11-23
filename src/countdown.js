const DAY = 86_400_000;

const dayIn = (date, timeZone) =>
  new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);

export function getCountdown(now, event) {
  const start = new Date(event.start);
  const today = dayIn(now, event.timeZone);
  const eventDay = dayIn(start, event.timeZone);
  if (today === eventDay) return { state: 'today', days: 0, hours: 0, minutes: 0 };
  if (today > eventDay) return { state: 'after', days: 0, hours: 0, minutes: 0 };
  const ms = start - now;
  return {
    state: 'before',
    days: Math.floor(ms / DAY),
    hours: Math.floor((ms % DAY) / 3_600_000),
    minutes: Math.floor((ms % 3_600_000) / 60_000),
  };
}

const MESSAGES = { today: 'É hoje!', after: 'Obrigado por fazer parte' };

function render(el, c) {
  if (c.state !== 'before') {
    const p = document.createElement('p');
    p.className = 'cd-message';
    p.textContent = MESSAGES[c.state];
    el.replaceChildren(p);
    return;
  }
  const units = [
    [String(c.days), c.days === 1 ? 'dia' : 'dias'],
    [String(c.hours).padStart(2, '0'), 'horas'],
    [String(c.minutes).padStart(2, '0'), 'min'],
  ];
  el.replaceChildren(...units.map(([num, label]) => {
    const unit = document.createElement('div');
    unit.className = 'cd-unit';
    unit.innerHTML = '<span class="cd-num"></span><span class="cd-label"></span>';
    unit.firstChild.textContent = num;
    unit.lastChild.textContent = label;
    return unit;
  }));
}

export function startCountdown(el, event, now = () => new Date()) {
  const tick = () => render(el, getCountdown(now(), event));
  tick();
  const id = setInterval(tick, 30_000);
  return () => clearInterval(id);
}
