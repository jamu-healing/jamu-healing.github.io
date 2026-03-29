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
            <div class="blog-meta">
              <span><i class="bi bi-calendar3"></i> {{ post.date | date: "%B %d, %Y" }}</span>
            </div>
            <h3>{{ post.title }}</h3>
            <p>{{ post.content | strip_html | slice: 0, 150 }}...</p>
          </div>
          <i class="bi bi-arrow-right card-arrow"></i>
        </a>
      {% endfor %}
    </div>

    {% if paginator.total_pages > 1 %}
    <div class="pagination flex jc-between mt-8">
      {% if paginator.previous_page %}
        <a href="{{ paginator.previous_page_path }}" class="btn btn-outline">Previous</a>
      {% else %}
        <span class="btn btn-outline is-disabled">Previous</span>
      {% endif %}
      
      <span class="pagination-info">Page {{ paginator.page }} of {{ paginator.total_pages }}</span>
      
      {% if paginator.next_page %}
        <a href="{{ paginator.next_page_path }}" class="btn btn-outline">Next</a>
      {% else %}
        <span class="btn btn-outline is-disabled">Next</span>
      {% endif %}
    </div>
    {% endif %}
  </div>
</div>

<script>
(function(){
  var tagBtns    = document.querySelectorAll('.tag-btn');
  var catBtns    = document.querySelectorAll('.cat-btn');
  var blogCards  = document.querySelectorAll('.blog-card');
  var toggle     = document.getElementById('filterToggle');
  var content    = document.getElementById('filterContent');

  var activeTag = 'all';
  var activeCat = 'all';

  function applyFilters() {
    blogCards.forEach(function(card) {
      var cardTags = card.getAttribute('data-tags') || '';
      var cardCats = card.getAttribute('data-categories') || '';
      var matchTag = (activeTag === 'all') || (cardTags.indexOf(activeTag) !== -1);
      var matchCat = (activeCat === 'all') || (cardCats.indexOf(activeCat) !== -1);
      card.classList.toggle('is-hidden', !(matchTag && matchCat));
    });
  }

  tagBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      activeTag = this.getAttribute('data-tag');
      tagBtns.forEach(function(b) {
        b.classList.remove('active', 'btn-primary');
        b.classList.add('btn-outline');
      });
      this.classList.add('active', 'btn-primary');
      this.classList.remove('btn-outline');
      applyFilters();
    });
  });

  catBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      activeCat = this.getAttribute('data-category');
      catBtns.forEach(function(b) {
        b.classList.remove('active', 'btn-primary');
        b.classList.add('btn-outline');
      });
      this.classList.add('active', 'btn-primary');
      this.classList.remove('btn-outline');
      applyFilters();
    });
  });

  if (toggle && content) {
    toggle.addEventListener('click', function() {
      var open = content.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open);
    });
  }
})();
</script>