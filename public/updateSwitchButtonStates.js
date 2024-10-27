$(document).ready(async () => {
  updateThemeButton();

  await fetch('/get-user-likes')
    .then((res) => {
      if (res.ok) return res.json();
      throw new Error('Server refused to fetch /get-user-likes request');
    })
    .then((data) => {
      if (!data.success) return;
      updateLikesButtons(data);
      updateFullLikeButtos(data);
    })
    .catch((e) => {
      console.error('The error on updating like buttons: ', e);
    });
});

function updateLikesButtons(data) {
  $('.content-element').each(function () {
    const reactionContainer = $(this)
      .children('.content-container')
      .children('.content-info')
      .children('.reaction-container');
    const likeIconFull = reactionContainer.children('.full-heart');
    const likeIconEmpty = reactionContainer.children('.empty-heart');
    const postID = parseInt($(this).children('p').first().text());
    const isPostLiked = data.data.find((item) => item == postID) != null;
    if (!isPostLiked) return;
    likeIconEmpty.addClass('hidden-from-layout');
    likeIconFull.removeClass('hidden-from-layout');
  });
}
function updateFullLikeButtos(data) {
  const reactionContainer = $('.post-grid')
    .children('.post-credits')
    .children('.reaction-container-post');
  const likeIconFull = reactionContainer.children('.full-heart-post');
  const likeIconEmpty = reactionContainer.children('.empty-heart-post');
  const postID = parseInt($('.post-grid').children('p').first().text());
  const isPostLiked = data.data.find((item) => item == postID) != null;
  if (!isPostLiked) return;
  likeIconEmpty.addClass('hidden-from-layout');
  likeIconFull.removeClass('hidden-from-layout');
}
async function updateThemeButton() {
  await new Promise(() =>
    setTimeout(() => {
      let currentTheme = $('html').attr('data-theme');
      let isDarkTheme = currentTheme == 'dark';
      if (isDarkTheme) return;
      let switchOn = $('#change-theme').children('.switch-on');
      let switchOff = $('#change-theme').children('.switch-off');

      switchOn.addClass('hidden-from-layout');
      switchOff.removeClass('hidden-from-layout');
    }, 100)
  );
}
