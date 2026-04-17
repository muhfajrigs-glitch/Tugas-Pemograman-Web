// ===== STATE =====
let currentStep = 0;
const TOTAL_STEPS = 3;

// ===== STEP NAVIGATION =====
function goToStep(n) {
  // Validate all previous steps before jumping forward
  if (n > currentStep) {
    for (let i = 0; i < n; i++) {
      if (!validateStep(i)) return;
    }
  }
  document.getElementById('step' + currentStep).classList.remove('active');
  currentStep = n;
  document.getElementById('step' + currentStep).classList.add('active');
  updateProgress();
  updateButtons();
  autoFocusStep();
}

function nextStep() {
  if (!validateStep(currentStep)) return;
  if (currentStep < TOTAL_STEPS - 1) {
    goToStep(currentStep + 1);
  } else {
    submitForm();
  }
}

function prevStep() {
  if (currentStep > 0) goToStep(currentStep - 1);
}

// ===== VALIDATORS =====
function validateNama() {
  return document.getElementById('inp-nama').value.trim().length >= 2;
}
function validateUmur() {
  const v = parseInt(document.getElementById('inp-umur').value);
  return v >= 10 && v <= 99;
}
function validateInstansi() {
  return document.getElementById('inp-instansi').value.trim().length >= 3;
}
function validateEmail() {
  const v = document.getElementById('inp-email').value.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}
function validateRole() {
  return document.getElementById('inp-role').value !== '';
}

function validateStep(n) {
  const maps = [
    [['nama', validateNama], ['umur', validateUmur], ['instansi', validateInstansi]],
    [['email', validateEmail]],
    [['role', validateRole]],
  ];
  return maps[n].reduce((ok, [id, fn]) => applyValidation(id, fn()) && ok, true);
}

// ===== FIELD STATE HELPER =====
function applyValidation(id, isValid) {
  const f = document.getElementById('f-' + id);
  if (!f) return isValid;
  f.classList.toggle('valid', isValid);
  f.classList.toggle('error', !isValid);
  if (!isValid) {
    f.classList.add('shake');
    setTimeout(() => f.classList.remove('shake'), 400);
  }
  return isValid;
}

// ===== REAL-TIME VALIDATION =====
function setupField(id, validatorFn) {
  const el = document.getElementById('inp-' + id);
  if (!el) return;
  const field = document.getElementById('f-' + id);

  el.addEventListener('input', () => {
    if (el.value.trim()) applyValidation(id, validatorFn());
    else { field.classList.remove('valid', 'error'); }
    autoSave();
  });

  el.addEventListener('focus', () => field.querySelector('label').classList.add('focused'));
  el.addEventListener('blur', () => {
    field.querySelector('label').classList.remove('focused');
    if (el.value.trim()) applyValidation(id, validatorFn());
  });
}

// ===== SETUP ALL FIELDS =====
setupField('nama', validateNama);
setupField('umur', validateUmur);
setupField('instansi', validateInstansi);
setupField('email', validateEmail);
setupField('role', validateRole);

// ===== PHONE INPUT MASK =====
document.getElementById('inp-phone').addEventListener('input', function () {
  let v = this.value.replace(/\D/g, '');
  if (v.length > 4 && v.length <= 8) v = v.slice(0, 4) + '-' + v.slice(4);
  else if (v.length > 8) v = v.slice(0, 4) + '-' + v.slice(4, 8) + '-' + v.slice(8, 12);
  this.value = v;
  autoSave();
});

// ===== CHAR COUNT =====
document.getElementById('inp-saran').addEventListener('input', function () {
  const len = this.value.length;
  const cc = document.getElementById('cc');
  cc.textContent = len + ' / 300';
  cc.classList.toggle('warn', len > 250);
  autoSave();
});

// ===== PROGRESS INDICATOR =====
function updateProgress() {
  for (let i = 0; i < TOTAL_STEPS; i++) {
    const dot = document.getElementById('d' + i);
    const lbl = document.getElementById('l' + i);
    dot.classList.toggle('active', i === currentStep);
    dot.classList.toggle('done', i < currentStep);
    lbl.classList.toggle('active', i === currentStep);
    dot.innerHTML = i < currentStep
      ? '<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
      : (i + 1);
    if (i < TOTAL_STEPS - 1)
      document.getElementById('pl' + i).classList.toggle('done', i < currentStep);
  }
  document.getElementById('btnText').textContent =
    currentStep === TOTAL_STEPS - 1 ? 'Kirim Data →' : 'Lanjutkan →';
}

function updateButtons() {
  document.getElementById('btnBack').style.display = currentStep > 0 ? 'flex' : 'none';
}

function autoFocusStep() {
  const inputs = document.getElementById('step' + currentStep)
    .querySelectorAll('input, select, textarea');
  if (inputs.length) setTimeout(() => inputs[0].focus(), 80);
}

// ===== AUTO-SAVE (localStorage) =====
function autoSave() {
  try {
    const data = {
      nama: document.getElementById('inp-nama').value,
      umur: document.getElementById('inp-umur').value,
      instansi: document.getElementById('inp-instansi').value,
      email: document.getElementById('inp-email').value,
      phone: document.getElementById('inp-phone').value,
      role: document.getElementById('inp-role').value,
      saran: document.getElementById('inp-saran').value,
    };
    localStorage.setItem('form_draft', JSON.stringify(data));
    const badge = document.getElementById('saveBadge');
    badge.style.display = 'flex';
    clearTimeout(window._saveTimer);
    window._saveTimer = setTimeout(() => badge.style.display = 'none', 2500);
  } catch (e) {}
}

function loadDraft() {
  try {
    const d = JSON.parse(localStorage.getItem('form_draft'));
    if (!d) return;
    if (d.nama)     document.getElementById('inp-nama').value = d.nama;
    if (d.umur)     document.getElementById('inp-umur').value = d.umur;
    if (d.instansi) document.getElementById('inp-instansi').value = d.instansi;
    if (d.email)    document.getElementById('inp-email').value = d.email;
    if (d.phone)    document.getElementById('inp-phone').value = d.phone;
    if (d.role)     document.getElementById('inp-role').value = d.role;
    if (d.saran) {
      document.getElementById('inp-saran').value = d.saran;
      document.getElementById('cc').textContent = d.saran.length + ' / 300';
    }
  } catch (e) {}
}

// ===== SUBMIT =====
function submitForm() {
  const btn = document.getElementById('btnNext');
  btn.classList.add('loading');
  // Replace timeout with your actual fetch/axios call to proses.php
  setTimeout(() => {
    btn.classList.remove('loading');
    document.getElementById('mainCard').style.display = 'none';
    const ss = document.getElementById('successScreen');
    ss.classList.add('show');
    document.getElementById('successName').textContent =
      document.getElementById('inp-nama').value;
    document.getElementById('s-instansi').textContent =
      document.getElementById('inp-instansi').value;
    document.getElementById('s-email').textContent =
      document.getElementById('inp-email').value;
    try { localStorage.removeItem('form_draft'); } catch (e) {}
  }, 1600);
}

// ===== RESTART =====
function restartForm() {
  document.getElementById('successScreen').classList.remove('show');
  document.getElementById('mainCard').style.display = '';
  currentStep = 0;
  ['step0','step1','step2'].forEach((s, i) =>
    document.getElementById(s).classList.toggle('active', i === 0));
  ['inp-nama','inp-umur','inp-instansi','inp-email','inp-phone','inp-saran']
    .forEach(id => document.getElementById(id).value = '');
  document.getElementById('inp-role').value = '';
  document.getElementById('cc').textContent = '0 / 300';
  ['nama','umur','instansi','email','role'].forEach(id => {
    const f = document.getElementById('f-' + id);
    if (f) f.classList.remove('valid', 'error');
  });
  updateProgress();
  updateButtons();
  document.getElementById('inp-nama').focus();
}

// ===== DARK MODE =====
document.getElementById('dmToggle').addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

// ===== KEYBOARD: Enter to advance =====
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
    e.preventDefault();
    nextStep();
  }
});

// ===== INIT =====
loadDraft();