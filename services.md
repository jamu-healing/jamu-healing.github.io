---
layout: page
title: "Services"
description: "Manual therapy, Jamu herbal medicine, and professional massage classes. Three paths to deep systemic healing in Bali."
section_label: "Solutions"
---

<section class="section-no-border">
  <div class="container">
    <div class="flex flex-wrap justify-between gap-6">
      <div>
        <p class="text-description font-serif">
          Three integrated paths to deep healing — body, chemistry, and professional skill.
        </p>
      </div>
      <a href="{{ site.data.site.contact.whatsapp.url }}" target="_blank" rel="noopener noreferrer" class="btn btn-primary flex-shrink-0">
        Book Now <i class="bi bi-arrow-right"></i>
      </a>
    </div>
  </div>
</section>

<section class="section-no-border">
  <div class="container">

    <!-- 01 Manual Therapy -->
<div class="service-block">
  <div class="service-block-inner">
    <div>
      <div class="flex items-center gap-4 mb-6">
        <div class="icon-box"><i class="bi bi-heart-pulse"></i></div>
        <div>
          <span class="font-mono text-sm text-muted">01</span>
        </div>
      </div>
      <p class="font-mono text-sm text-muted mb-2">{{ site.data.site.services.manual_therapy.subtitle }}</p>
      <h2 class="text-3xl mb-4">{{ site.data.site.services.manual_therapy.name }}</h2>
      <p class="text-lg text-primary font-serif italic mb-6">
        The Pareto Effect — 80% result from 20% precise intervention.
      </p>
      <p class="text-base mb-6">
        {{ site.data.site.services.manual_therapy.description }}
      </p>
      <div class="card-sm">
        <div class="text-3xl font-bold mb-2">{{ site.data.site.services.manual_therapy.price }}</div>
        <p class="text-sm mb-4">{{ site.data.site.services.manual_therapy.price_note }}</p>
        <a href="{{ site.data.site.contact.whatsapp.url }}" target="_blank" rel="noopener noreferrer" class="btn btn-outline">
          Book via WhatsApp <i class="bi bi-arrow-right"></i>
        </a>
      </div>
    </div>
    <div>
      <div class="mb-8">
        <p class="font-mono text-sm font-semibold text-muted uppercase tracking-wider mb-4">Methods</p>
        <ul class="check-list">
          {% for method in site.data.site.services.manual_therapy.methods %}
          <li><i class="bi bi-check-circle-fill"></i> {{ method }}</li>
          {% endfor %}
        </ul>
      </div>
      <div>
        <p class="font-mono text-sm font-semibold text-muted uppercase tracking-wider mb-4">Indicated For</p>
        <ul class="dot-list">
          <li>Chronic back & neck pain</li>
          <li>Restricted mobility</li>
          <li>Persistent tension & headaches</li>
          <li>Post-injury recovery</li>
          <li>Compressed joints & nerves</li>
        </ul>
      </div>
    </div>
  </div>
</div>

<!-- 02 Herbal Medicine (featured) -->
<div class="service-block featured relative">
  <div class="featured-bar"></div>
  <div class="service-block-inner">
    <div>
      <div class="flex items-center gap-4 mb-6">
        <div class="icon-box primary"><i class="bi bi-flower1"></i></div>
        <div>
          <span class="font-mono text-sm text-muted">02</span>
          <span class="badge badge-primary ml-3">Featured</span>
        </div>
      </div>
      <p class="font-mono text-sm text-muted mb-2">{{ site.data.site.services.herbal_medicine.subtitle }}</p>
      <h2 class="text-3xl mb-4">{{ site.data.site.services.herbal_medicine.name }}</h2>
      <p class="text-lg text-primary font-serif italic mb-6">
        Restoring the body's natural chemistry with traditional Javanese phytotherapy.
      </p>
      <p class="text-base mb-6">
        {{ site.data.site.services.herbal_medicine.description }}
      </p>
      <div class="card-sm border-primary">
        <div class="text-3xl font-bold mb-2">{{ site.data.site.services.herbal_medicine.price }}</div>
        <p class="text-sm mb-4">{{ site.data.site.services.herbal_medicine.price_note }}</p>
        <a href="{{ site.data.site.contact.whatsapp.url }}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
          Book via WhatsApp <i class="bi bi-arrow-right"></i>
        </a>
      </div>
    </div>
    <div>
      <div class="mb-8">
        <p class="font-mono text-sm font-semibold text-muted uppercase tracking-wider mb-4">Methods</p>
        <ul class="check-list">
          {% for method in site.data.site.services.herbal_medicine.methods %}
          <li><i class="bi bi-check-circle-fill"></i> {{ method }}</li>
          {% endfor %}
        </ul>
      </div>
      <div>
        <p class="font-mono text-sm font-semibold text-muted uppercase tracking-wider mb-4">Indicated For</p>
        <ul class="dot-list">
          <li>Chronic GI distress</li>
          <li>Hormonal imbalance</li>
          <li>Supplement dependency</li>
          <li>Metabolic fatigue</li>
          <li>Inflammatory conditions</li>
        </ul>
      </div>
    </div>
  </div>
</div>

<!-- 03 Professional Classes -->
<div class="service-block">
  <div class="service-block-inner">
    <div>
      <div class="flex items-center gap-4 mb-6">
        <div class="icon-box"><i class="bi bi-journal-text"></i></div>
        <div>
          <span class="font-mono text-sm text-muted">03</span>
        </div>
      </div>
      <p class="font-mono text-sm text-muted mb-2">{{ site.data.site.services.professional_classes.subtitle }}</p>
      <h2 class="text-3xl mb-4">{{ site.data.site.services.professional_classes.name }}</h2>
      <p class="text-lg text-primary font-serif italic mb-6">
        Anatomy-based training for high-precision manual practitioners.
      </p>
      <p class="text-base mb-6">
        {{ site.data.site.services.professional_classes.description }}
      </p>
      <div class="card-sm">
        <div class="text-3xl font-bold mb-2">{{ site.data.site.services.professional_classes.price }}</div>
        <p class="text-sm mb-4">{{ site.data.site.services.professional_classes.price_note }}</p>
        <a href="{{ site.data.site.contact.whatsapp.url }}" target="_blank" rel="noopener noreferrer" class="btn btn-outline">
          Book via WhatsApp <i class="bi bi-arrow-right"></i>
        </a>
      </div>
    </div>
    <div>
      <div class="mb-8">
        <p class="font-mono text-sm font-semibold text-muted uppercase tracking-wider mb-4">Course Structure</p>
        <ul class="check-list">
          {% for method in site.data.site.services.professional_classes.methods %}
          <li><i class="bi bi-check-circle-fill"></i> {{ method }}</li>
          {% endfor %}
        </ul>
      </div>
      <div>
        <p class="font-mono text-sm font-semibold text-muted uppercase tracking-wider mb-4">Intended For</p>
        <ul class="dot-list">
          <li>Massage therapists</li>
          <li>Manual therapy practitioners</li>
          <li>Physiotherapists</li>
          <li>Healthcare professionals</li>
          <li>Anyone seeking professional mastery</li>
        </ul>
      </div>
      </div>
    </div>
  </div>
</div>
</section>

<section class="section-no-border bg-alt text-center">
  <div class="container">
    <h2 class="mb-4">Ready to Begin?</h2>
    <p class="max-w-2xl mx-auto mb-8">
      Most complex issues are resolved within 1–2 sessions. Reach out directly to discuss your case
      and book your first appointment.
    </p>
    <div class="flex flex-wrap gap-4 justify-center">
      <a href="{{ site.data.site.contact.whatsapp.url }}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
        <i class="bi bi-telephone-fill"></i> Book via WhatsApp
      </a>
      <a href="{{ site.data.site.contact.telegram.url }}" target="_blank" rel="noopener noreferrer" class="btn btn-outline">
        <i class="bi bi-send-fill"></i> Telegram
      </a>
    </div>
  </div>
</section>