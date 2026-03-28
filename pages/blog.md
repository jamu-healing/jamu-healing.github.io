---
layout: page
title: "Blog"
description: "Articles on traditional Javanese healing, osteopathy, herbal medicine, and the science behind systemic body work."
section_label: "Knowledge"
---

<div style="margin-bottom:3.2rem;">
  <div id="tag-filter" style="display:flex;flex-wrap:wrap;gap:0.8rem;">
    <button class="btn btn-sm tag-btn active" data-tag="all">All</button>
    {% assign all_tags = site.posts | map: "tags" | join: "," | split: "," | uniq | sort %}
    {% for tag in all_tags %}
      {% if tag != "" %}
        <button class="btn btn-sm btn-outline tag-btn" data-tag="{{ tag }}">{{ tag }}</button>
      {% endif %}
    {% endfor %}
  </div>
</div>

<div id="blog-posts" style="display:flex;flex-direction:column;gap:2rem;">
  {% for post in paginator.posts %}
    <a href="{{ post.url }}" class="blog-card" data-tags="{{ post.tags | join: ',' }}">
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
      <i class="bi bi-arrow-right" style="color:var(--fg-muted);font-size:2rem;flex-shrink:0;align-self:center;"></i>
    </a>
  {% endfor %}
</div>

{% if paginator.total_pages > 1 %}
<div class="pagination" style="display:flex;justify-content:center;align-items:center;gap:1.6rem;margin-top:4rem;padding-top:2.4rem;border-top:1px solid var(--border);">
  {% if paginator.previous_page %}
    <a href="{{ paginator.previous_page_path }}" class="btn btn-outline">
      <i class="bi bi-arrow-left"></i> Previous
    </a>
  {% else %}
    <span class="btn btn-outline" style="opacity:0.5;cursor:default;">
      <i class="bi bi-arrow-left"></i> Previous
    </span>
  {% endif %}
  
  <span style="font-family:var(--font-mono);font-size:1.4rem;color:var(--fg-muted);">
    Page {{ paginator.page }} of {{ paginator.total_pages }}
  </span>
  
  {% if paginator.next_page %}
    <a href="{{ paginator.next_page_path }}" class="btn btn-outline">
      Next <i class="bi bi-arrow-right"></i>
    </a>
  {% else %}
    <span class="btn btn-outline" style="opacity:0.5;cursor:default;">
      Next <i class="bi bi-arrow-right"></i>
    </span>
  {% endif %}
</div>
{% endif %}

<script>
(function(){
  var tagBtns = document.querySelectorAll('.tag-btn');
  var blogCards = document.querySelectorAll('.blog-card');
  
  tagBtns.forEach(function(btn){
    btn.addEventListener('click', function(){
      var tag = this.getAttribute('data-tag');
      
      tagBtns.forEach(function(b){
        b.classList.remove('active');
        b.classList.remove('btn-primary');
        b.classList.add('btn-outline');
      });
      this.classList.add('active');
      this.classList.remove('btn-outline');
      this.classList.add('btn-primary');
      
      blogCards.forEach(function(card){
        var cardTags = card.getAttribute('data-tags');
        if(tag === 'all' || (cardTags && cardTags.indexOf(tag) !== -1)){
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
})();
</script>