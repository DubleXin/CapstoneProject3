function setPreferences(data) {
  $('html').attr('data-theme', data.theme);
  $('.login-button').children('p').text(data.username);
  $('.personal-grid .option-container-title-box > p').text(data.username);
}
