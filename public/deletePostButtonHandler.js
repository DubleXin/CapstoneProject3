$('.delete-post-button').on('click', async function () {
  const parent = $(this).closest('.content-element');
  const postId = parseInt(parent.find('p').first().text());

  await fetch('/delete-post', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: postId }),
  })
    .then((res) => {
      if (res.ok) return res.json();
    })
    .then((data) => {
      if (data.success) return window.location.reload();
      window.location.href = '/';
    })
    .catch((e) => {
      console.error(`Error on deletion post id(${postId}) : ${e}`);
    });
});
