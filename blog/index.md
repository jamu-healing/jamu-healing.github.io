---
layout: default
title: "Blog"
---

<div class="debug-toaster">
  <strong>Paginator Debug:</strong><br>
  page: <strong>{{ paginator.page }}</strong><br>
  total_pages: <strong>{{ paginator.total_pages }}</strong>
</div>

<div class="blog-layout">
  <div class="blog-main">
    <div id="blog-posts" class="blog-posts">
      {% for post in paginator.posts %}
        <a href="{{ post.url }}" class="blog-card" data-tags="{{ post.tags | join: ',' }}" data-categories="{{ post.categories | join: ',' }}">
          <div class="blog-card-body">
            <h3>{{ post.title }}</h3>
            <p>{{ post.content | strip_html | slice: 0, 150 }}...</p>
          </div>
        </a>
      {% endfor %}
    </div>

    {% if paginator.total_pages > 1 %}
    <div class="pagination flex jc-between mt-8">
      {% if paginator.previous_page %}
        <a href="{{ paginator.previous_page_path }}" class="btn btn-outline">Previous</a>
      {% endif %}
      
      <span class="pagination-info">Page {{ paginator.page }} of {{ paginator.total_pages }}</span>
      
      {% if paginator.next_page %}
        <a href="{{ paginator.next_page_path }}" class="btn btn-outline">Next</a>
      {% endif %}
    </div>
    {% endif %}
  </div>
</div>