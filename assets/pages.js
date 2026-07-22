// Formulario de demo en páginas estáticas — mismo endpoint que el CTA del homepage (/api/contact)
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('form[data-demo-form]').forEach(function (form) {
    var input = form.querySelector('input[type="email"]');
    var button = form.querySelector('button[type="submit"]');
    var errorEl = form.querySelector('[data-form-error]');

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      var email = (input.value || '').trim();
      if (!email || button.disabled) return;
      button.disabled = true;
      button.textContent = 'Enviando…';
      errorEl.hidden = true;
      try {
        var r = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email }),
        });
        var data = await r.json().catch(function () { return {}; });
        if (!r.ok || !data.ok) {
          throw new Error(data.error || 'No se pudo enviar. Intenta nuevamente.');
        }
        var ok = document.createElement('div');
        ok.className = 'page-form-success';
        ok.setAttribute('role', 'status');
        ok.innerHTML = '<span class="tag"><span class="dot dot-ok"></span>Recibido</span><span class="msg">Gracias. Te contactaremos pronto.</span>';
        form.replaceWith(ok);
      } catch (err) {
        errorEl.textContent = (err && err.message && err.message !== 'Failed to fetch') ? err.message : 'Sin conexión. Intenta nuevamente.';
        errorEl.hidden = false;
        button.disabled = false;
        button.textContent = 'Solicitar demo';
      }
    });
  });
});
