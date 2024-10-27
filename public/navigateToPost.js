$('.content-container').on('click', async function () {
  const parent = $(this).closest('.content-element');
  const postId = parseInt(parent.find('p').first().text());

  await goToPostRequest(postId);
});
$('.post-banner-jump-icon').on('click', async function () {
  const parent = $(this).closest('.post-banner');
  const postId = parseInt(parent.find('p').first().text());

  await goToPostRequest(postId);
});
async function goToPostRequest(postId) {
  try {
    await fetch('/open-post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ID: postId,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Server failed to response');
        return res.json();
      })
      .then((data) => {
        if (data.success) return (window.location.href = data.redirectUrl);
        console.error('Failed to redirect on post page');
        if (data.redirectUrl) window.location.href = data.redirectUrl;
      });
  } catch (e) {
    console.error('Error on opening post!\nError: ', e);
  }
}
