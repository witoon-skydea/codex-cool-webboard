(function() {
  const postsKey = 'webboard-posts';

  function loadPosts() {
    const data = localStorage.getItem(postsKey);
    return data ? JSON.parse(data) : [];
  }

  function savePosts(posts) {
    localStorage.setItem(postsKey, JSON.stringify(posts));
  }

  function renderPosts() {
    const posts = loadPosts();
    const list = document.getElementById('posts');
    list.innerHTML = '';
    posts.forEach((post, index) => {
      const li = document.createElement('li');
      const fav = document.createElement('span');
      fav.textContent = post.favorite ? '★' : '☆';
      fav.className = 'favorite';
      fav.onclick = () => {
        posts[index].favorite = !posts[index].favorite;
        savePosts(posts);
        renderPosts();
      };
      li.appendChild(fav);
      li.appendChild(document.createTextNode(' ' + post.content + ' '));
      if (post.tag) {
        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.textContent = '#' + post.tag;
        li.appendChild(tag);
      }
      list.appendChild(li);
    });
  }

  document.getElementById('post-button').onclick = () => {
    const content = document.getElementById('post-content').value.trim();
    const tag = document.getElementById('post-tag').value.trim();
    if (!content) return;
    const posts = loadPosts();
    posts.unshift({ content, tag, favorite: false });
    savePosts(posts);
    document.getElementById('post-content').value = '';
    document.getElementById('post-tag').value = '';
    renderPosts();
  };

  renderPosts();
})();
