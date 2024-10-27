let isCreatePostButtonClicked = false;
$('#create-post').on('click', async function () {
  if (isCreatePostButtonClicked) return;
  isCreatePostButtonClicked = true;
  try {
    let url = '/';
    await fetch('/create-new-post')
      .then((res) => {
        if (!res.ok) throw new Error('Failed request on creating new post');
        return res.json();
      })
      .then((data) => {
        if (data.success) url = data.redirectUrl;
        isCreatePostButtonClicked = false;
        window.location.href = url;
        return;
      });
  } catch (e) {
    console.error("Error on fetching the '/create-new-post': ", e);
  }
  isCreatePostButtonClicked = true;
});
