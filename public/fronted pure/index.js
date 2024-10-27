$(document).ready(function () {
  const selectorsAnimationList = [
    '.content-container',
    '.option-container-grid',
    '.recent-posts-grid',
  ];
  initAnimation(selectorsAnimationList);
});
function animateButtonSwitch(button, selector, action) {
  const $button = $(button);
  const $children = $button.children();
  const $toShow = $children.filter('.hidden-from-layout');
  const $toHide = $children.not('.hidden-from-layout').not('p');

  const isSelectorHidden = $button
    .children(selector)
    .hasClass('hidden-from-layout');

  action($button, isSelectorHidden);
  $toShow.removeClass('hidden-from-layout');
  $toHide.addClass('hidden-from-layout');
}
function initAnimation(selector) {
  for (let i = 0; i < selector.length; i++) $(selector[i]).hide().fadeIn(500);
}
$('.reaction-container').click(function () {
  animateButtonSwitch(this, '.full-heart', (button, isLiked) => {
    let number = parseInt($(button).children('p').text(), 10);
    $(button)
      .children('p')
      .text(isLiked ? number + 1 : number - 1);
  });
});
$('.change-theme-button').click(function () {
  animateButtonSwitch(this, '.switch-on', (_button, isActive) => {
    $('html').attr('data-theme', isActive ? 'dark' : 'light');
  });
});
