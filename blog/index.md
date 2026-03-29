---
layout: page
title: "Blog"
description: "Articles on traditional Javanese healing, osteopathy, herbal medicine, and the science behind systemic body work."
section_label: "Knowledge"
---

<!-- DEBUG TOASTER — remove after debugging -->
<div class="debug-toaster">
  <strong>Paginator Debug:</strong><br>
  page: <strong>{{ paginator.page }}</strong><br>
  total_pages: <strong>{{ paginator.total_pages }}</strong><br>
  previous_page: {{ paginator.previous_page }}<br>
  next_page: {{ paginator.next_page }}
</div>

<div class="blog-layout">
  <!-- MAIN COLUMN -->
  <div class="blog-main">
    <div id="blog-posts" class="blog-posts">
      {% for post in paginator.posts %}
        <a href="{{ post.url }}" class="blog-card" data-tags="{{ post.tags | join: ',' }}" data-categories="{{ post.categories | join: ',' }}">
          <div class="blog-card-body">
            <div class="blog-meta">
              <span><i class="bi bi-calendar3"></i> {{ post.date | date: "%B %d, %Y" }}</span>
              {% if post.categories.size > 0 %}
                <span class="cat">{{ post.categories | join: ", " }}</span>
              {% endif %}
            </div>
            <h3>{{ post.title }}</h3>
            <p>{{ post.content | strip_html | slice: 0, 150 }}...</p>
          </div>
          <i class="bi bi-arrow-right card-arrow"></i>
        </a>
      {% endfor %}
    </div>

    {% if paginator.total_pages > 1 %}
    <div class="pagination">
      {% if paginator.previous_page %}
        <a href="{{ paginator.previous_page_path }}" class="btn btn-outline">
          <i class="bi bi-arrow-left"></i> Previous
        </a>
      {% else %}
        <span class="btn btn-outline pagination-btn-disabled">
          <i class="bi bi-arrow-left"></i> Previous
        </span>
      {% endif %}
      
      <span class="pagination-info">
        Page {{ paginator.page }} of {{ paginator.total_pages }}
      </span>
      
      {% if paginator.next_page %}
        <a href="{{ paginator.next_page_path }}" class="btn btn-outline">
          Next <i class="bi bi-arrow-right"></i>
        </a>
      {% else %}
        <span class="btn btn-outline pagination-btn-disabled">
          Next <i class="bi bi-arrow-right"></i>
        </span>
      {% endif %}
    </div>
    {% endif %}
  </div>

  <!-- SIDEBAR -->
  <aside class="blog-sidebar">
    <!-- Mobile toggle -->
    <button class="filter-toggle" id="filterToggle" aria-expanded="false">
      <span><i class="bi bi-funnel"></i> Filters</span>
      <i class="bi bi-chevron-down"></i>
    </button>

    <div class="filter-content" id="filterContent">
      <!-- BY TAG -->
      <div class="mb-8">
        <p class="blog-sidebar-title">By Tag</p>
        <div id="tag-filter" class="tag-filter">
          <button class="btn btn-sm tag-btn active" data-tag="all">All</button>
          {% assign all_tags = site.posts | map: "tags" | join: "," | split: "," | uniq | sort %}
          {% for tag in all_tags %}
            {% if tag != "" %}
              <button class="btn btn-sm btn-outline tag-btn" data-tag="{{ tag }}">{{ tag }}</button>
            {% endif %}
          {% endfor %}
        </div>
      </div>

      <!-- BY CATEGORY -->
      <div class="mb-8">
        <p class="blog-sidebar-title">By Category</p>
        <div id="category-filter" class="tag-filter">
          <button class="btn btn-sm cat-btn active" data-category="all">All</button>
          {% assign all_categories = site.posts | map: "categories" | join: "," | split: "," | uniq | sort %}
          {% for cat in all_categories %}
            {% if cat != "" %}
              <button class="btn btn-sm btn-outline cat-btn" data-category="{{ cat }}">{{ cat }}</button>
            {% endif %}
          {% endfor %}
        </div>
      </div>
    </div>
  </aside>
</div>

<script>
(function(){
  // Elements
  var tagBtns    = document.querySelectorAll('.tag-btn');
  var catBtns    = document.querySelectorAll('.cat-btn');
  var blogCards  = document.querySelectorAll('.blog-card');
  var toggle     = document.getElementById('filterToggle');
  var content    = document.getElementById('filterContent');

  // Active filters
  var activeTag = 'all';
  var activeCat = 'all';

  function applyFilters() {
    blogCards.forEach(function(card) {
      var cardTags = card.getAttribute('data-tags') || '';
      var cardCats = card.getAttribute('data-categories') || '';
      var matchTag = (activeTag === 'all') || (cardTags.indexOf(activeTag) !== -1);
      var matchCat = (activeCat === 'all') || (cardCats.indexOf(activeCat) !== -1);
      card.style.display = (matchTag && matchCat) ? 'flex' : 'none';
    });
  }

  // Tag filter
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

  // Category filter
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

  // Collapsible toggle (mobile)
  if (toggle && content) {
    toggle.addEventListener('click', function() {
      var open = content.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open);
    });
  }
})();
</script>
