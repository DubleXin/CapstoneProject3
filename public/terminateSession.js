$('#log-out-button').on('click', function () {
  let proceedLoggingOut = false;
  if (confirm('Are you sure?')) proceedLoggingOut = true;
  if (!proceedLoggingOut) return;
  fetch('/log-out', {
    method: 'POST',
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) window.location.href = data.redirectUrl;
    })
    .catch((e) => {
      console.error('Logout failed:', e);
    });
});
