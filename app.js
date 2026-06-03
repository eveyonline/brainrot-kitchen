const state = {
  apiKey: '',
  stock: '',
  lastQuery: '',
  lastSuggestions: [],
  chosenMeal: null,
  activeChips: new Set(),
};

const FAMILY = `Family constraints (always apply, never override):
- No pork, no alcohol in cooking
- Mum: vegetarian + fish, loves seeds and fat
- Dad (53): eats some meat, dislikes rice / peppers / chorizo, watching calories
- Terence (14): vegetarian + fish, dislikes spinach
- James (12, ADHD): eats everything`;

function load() {
  state.apiKey = window.BRAINROT_CONFIG?.GEMINI_API_KEY || '';
  state.stock   = localStorage.getItem('bk_stock')  || '';
  if (state.apiKey) document.getElementById('api-key-input').value = state.apiKey;
  if (state.stock)  document.getElementById('stock-input').value   = state.stock;
  updateStockBar();
}
function save() {
  localStorage.setItem('bk_stock',  state.stock);
}
function updateStockBar() {
  const el = document.getElementById('stock-preview');
  el.textContent = state.stock
    ? state.stock.split(',').slice(0, 5).map(s => s.trim()).join(' · ') + (state.stock.split(',').length > 5 ? ' …' : '')
    : 'tap settings to add ingredients';
}

document.getElementById('btn-settings').addEventListener('click', () => {
  document.getElementById('settings-panel').classList.toggle('visible');
});
document.getElementById('btn-save-settings').addEventListener('click', () => {
  state.apiKey = document.getElementById('api-key-input').value.trim();
  state.stock  = document.getElementById('stock-input').value.trim();
  save();
  updateStockBar();
  document.getElementById('settings-panel').classList.remove('visible');
});

document.querySelectorAll('.chip').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.toggle('selected');
    const p = btn.dataset.prompt;
    state.activeChips.has(p) ? state.activeChips.delete(p) : state.activeChips.add(p);
  });
});

const micBtn   = document.getElementById('mic-btn');
const micLabel = document.getElementById('mic-label');
let recognition = null;

if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SR();
  recognition.lang = 'fr-FR';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = e => {
    const text = e.results[0][0].transcript;
    document.getElementById('text-input').value = text;
    micBtn.classList.remove('listening');
    micLabel.textContent = `"${text}"`;
    askGemini(text);
  };
  recognition.onerror = () => {
    micBtn.classList.remove('listening');
    micLabel.textContent = 'tap & speak — or type below';
  };
  recognition.onend = () => {
    micBtn.classList.remove('listening');
  };

  micBtn.addEventListener('click', () => {
    if (micBtn.classList.contains('listening')) {
      recognition.stop();
    } else {
      micBtn.classList.add('listening');
      micLabel.textContent = 'listening…';
      recognition.start();
    }
  });
} else {
  micBtn.innerHTML = '<span class="pixel-keyboard"></span>';
  micLabel.textContent = 'speech not supported — type below';
}

document.getElementById('send-btn').addEventListener('click', () => {
  const val = document.getElementById('text-input').value.trim();
  if (val) askGemini(val);
});
document.getElementById('text-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const val = e.target.value.trim();
    if (val) askGemini(val);
  }
});

document.getElementById('btn-other').addEventListener('click', () => {
  askGemini(state.lastQuery + ' — give me different ideas from the previous ones');
});

async function askGemini(userMessage) {

  const chipContext = [...state.activeChips].join('; ');
  const fullQuery = [userMessage, chipContext].filter(Boolean).join('. ');
  state.lastQuery = fullQuery;

  showLoader(true);
  hideSuggestions();
  hidePostmeal();
  hideError();
  micBtn.classList.add('thinking');

  const prompt = `${FAMILY}

Current stock / fridge: ${state.stock || 'unknown — suggest flexible meals'}

User says: "${fullQuery}"

Respond ONLY with a JSON array of exactly 3 meal suggestions. Each object:
{
  "title": "meal name",
  "time": "cook time in minutes as number",
  "notes": "one short sentence about why it fits tonight",
  "ok_for": ["Mum","Dad","Terence","James"],
  "ingredients_needed": ["ingredient1","ingredient2"]
}

Rules:
- Respect ALL family constraints
- Prefer ingredients already in stock
- Keep notes under 12 words
- Return ONLY the JSON array, no other text`;

try {
    const res = await fetch('/api/recipes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) throw new Error(`API ${res.status}`);

  const meals = await res.json();

    state.lastSuggestions = meals;
    showSuggestions(meals);
  } catch (err) {
    showError('Something went wrong: ' + err.message);
  } finally {
    showLoader(false);
    micBtn.classList.remove('thinking');
    micLabel.textContent = 'tap & speak — or type below';
    document.getElementById('text-input').value = '';
  }
}

function showSuggestions(meals) {
  const container = document.getElementById('suggestions');
  container.querySelectorAll('.suggestion').forEach(el => el.remove());

  meals.forEach((meal) => {
    const el = document.createElement('div');
    el.className = 'suggestion';
    el.innerHTML = `
      <span class="s-ok">${meal.ok_for.join(' · ')}</span>
      <div class="s-title">${meal.title}</div>
      <div class="s-meta">${meal.time} min &nbsp;·&nbsp; ${meal.notes}</div>
    `;
    el.addEventListener('click', () => chooseMeal(meal));
    container.appendChild(el);
  });

  container.classList.add('visible');
}
function hideSuggestions() { document.getElementById('suggestions').classList.remove('visible'); }

function chooseMeal(meal) {
  state.chosenMeal = meal;
  hideSuggestions();
  document.getElementById('postmeal-title').textContent = `${meal.title} — how was it?`;
  document.getElementById('used-ingredients').textContent =
    'Used: ' + (meal.ingredients_needed || []).join(', ');
  document.getElementById('postmeal').classList.add('visible');
}

document.querySelectorAll('.emoji-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const rating = btn.dataset.rating;
    saveFeedback(state.chosenMeal, rating);
    btn.style.transform = 'translate(4px, 4px) scale(1.1)';
    setTimeout(() => { btn.style.transform = ''; }, 300);
  });
});

document.getElementById('btn-update-stock').addEventListener('click', () => {
  if (!state.chosenMeal) return;
  const used = state.chosenMeal.ingredients_needed || [];
  if (used.length && state.stock) {
    let stockArr = state.stock.split(',').map(s => s.trim().toLowerCase());
    used.forEach(u => {
      stockArr = stockArr.filter(s => !s.includes(u.toLowerCase()));
    });
    state.stock = stockArr.join(', ');
    document.getElementById('stock-input').value = state.stock;
    save();
    updateStockBar();
  }
  hidePostmeal();
  showDone();
});

function saveFeedback(meal, rating) {
  const history = JSON.parse(localStorage.getItem('bk_history') || '[]');
  history.push({ date: new Date().toISOString(), meal: meal.title, rating });
  localStorage.setItem('bk_history', JSON.stringify(history.slice(-50)));
}
function hidePostmeal() { document.getElementById('postmeal').classList.remove('visible'); }
function showDone() {
  micLabel.textContent = 'stock updated — ready for next time';
  setTimeout(() => { micLabel.textContent = 'tap & speak — or type below'; }, 3000);
}
function showLoader(on) { document.getElementById('loader').classList.toggle('visible', on); }
function showError(msg) {
  const el = document.getElementById('error-msg');
  el.textContent = msg;
  el.classList.add('visible');
}
function hideError() { document.getElementById('error-msg').classList.remove('visible'); }

load();