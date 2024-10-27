let username = '';
$(document).ready(function () {
  loadUserData();
});

function loadUserData() {
  fetch('/get-user-session')
    .then((res) => {
      if (!res.ok) throw new Error('User is undefiend!');
      return res.json();
    })
    .then((data) => {
      if (!data.success) return;
      setPreferences(data);
      username = data.username;
    })
    .catch((e) => {
      //console.error('The global login erorr: ' + e);
    });
}
