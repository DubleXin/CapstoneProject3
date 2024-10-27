$('.reaction-container').on('click', async function () {
  const postID = parseInt($(this).children('p').first().text());
  await sendLikeRequest(postID);
});
$('.reaction-container-post').on('click', async function () {
  const postID = parseInt($('.post-grid').children('p').first().text());
  await sendLikeRequest(postID);
});
async function sendLikeRequest(post) {
  try {
    await fetch('/like-post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        postID: post,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Server refused request');
        return res.json();
      })
      .then((data) => {
        if (data.success) window.location.reload();
        throw new Error('Server did not prove request');
      })
      .catch((e) => {
        console.error('Inner error on procesing like fetch request: ', e);
      });
  } catch (e) {
    console.error('Error on procesing like fetch request: ', e);
  }
}
