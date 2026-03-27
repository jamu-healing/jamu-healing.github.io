---
title: "Hidden Posts"
layout: default
---

<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

<style>
.post-list {
    list-style: none;
    padding: 0;
}

.post-item {
    background-color: #2d2d2d;
    border-radius: 8px;
    padding: 15px 20px;
    margin-bottom: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.post-info {
    flex: 1;
}

.post-title {
    margin: 0 0 5px 0;
    font-size: 1.2em;
}

.post-title a {
    color: #bb86fc;
    text-decoration: none;
}

.post-title a:hover {
    text-decoration: underline;
}

.post-date {
    color: #888;
    font-size: 0.9em;
    margin: 0;
}

.copy-url-btn {
    background-color: #373b41;
    color: #c5c8c6;
    border: none;
    border-radius: 5px;
    padding: 8px 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 0.9em;
    transition: background-color 0.2s;
}

.copy-url-btn:hover {
    background-color: #4a4e54;
}

.copy-url-btn .material-icons {
    font-size: 18px;
}

.copy-notification {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #4caf50;
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    display: none;
    animation: fadeInOut 2s ease-in-out;
}

@keyframes fadeInOut {
    0% { opacity: 0; transform: translateY(20px); }
    15% { opacity: 1; transform: translateY(0); }
    85% { opacity: 1; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(20px); }
}
</style>

# Hidden Posts

This is the index page for hidden posts.

<ul class="post-list">
{% for post in site.hdn %}
    <li class="post-item">
        <div class="post-info">
            <h3 class="post-title">
                <a href="{{ post.url }}">{{ post.title }}</a>
            </h3>
            <p class="post-date">{{ post.date | date: "%B %d, %Y" }}</p>
        </div>
        <button class="copy-url-btn" onclick="copyUrl('{{ post.url }}')">
            <span class="material-icons">content_copy</span>
            Copy URL
        </button>
    </li>
{% endfor %}
</ul>

<div id="copy-notification" class="copy-notification">URL copied to clipboard!</div>

<script>
function copyUrl(path) {
    const fullUrl = window.location.origin + path;
    navigator.clipboard.writeText(fullUrl).then(() => {
        const notification = document.getElementById('copy-notification');
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
        alert('Failed to copy URL');
    });
}
</script>