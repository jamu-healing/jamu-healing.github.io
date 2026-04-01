---
title: "Hidden Posts"
layout: page
section_label: "Private"
description: "Access your personalized consultation results and instructions."
---

<section class="section-no-border">
  <div class="container">
    <div class="blog-list">
      {% for page in site.pages %}
      {% if page.url contains '/4-70-16/' and page.url != '/4-70-16/' %}
        <a href="{{ page.url }}" class="blog-card">
          <div class="blog-card-body">
            <div class="blog-meta">
              <span><i class="bi bi-lock"></i> Private</span>
              {% if page.date %}
                <span><i class="bi bi-calendar3"></i> {{ page.date | date: "%B %d, %Y" }}</span>
              {% endif %}
            </div>
            <h3>{{ page.title }}</h3>
            {% if page.excerpt %}
              <p>{{ page.excerpt | strip_html | truncatewords: 30 }}</p>
            {% endif %}
          </div>
          <i class="bi bi-arrow-right card-arrow"></i>
        </a>
      {% endif %}
      {% endfor %}
    </div>
  </div>
</section>
