$('#change-theme').on('click', function () {
  let currentTheme = $('html').attr('data-theme');
  fetch('/set-user-theme', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      theme: currentTheme,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (!data.success)
        console.error('There was a problem with getting user theme.');
    })
    .catch((error) => {
      console.error('There was a problem with the fetch operation:', error);
    });
});
