---
layout: page
title: "Services"
description: "Manual therapy, Jamu herbal medicine, and professional massage classes. Three paths to deep systemic healing in Bali."
section_label: "Solutions"
---

<section class="section-no-border">
  <div class="container">

    <div class="service-block">
      <div class="service-block-inner">
        <div>
          <div class="service-header-flex">
            <div class="icon-box"><i class="bi bi-heart-pulse"></i></div>
            <div><span class="service-number">01</span></div>
          </div>
          <p class="service-subtitle">{{ site.data.site.services.manual_therapy.subtitle }}</p>
          <h2 class="service-title">{{ site.data.site.services.manual_therapy.name }}</h2>
          <p class="service-tagline">The Pareto Effect — 80% result from 20% precise intervention.</p>
          <p class="service-description">{{ site.data.site.services.manual_therapy.description }}</p>
          <div class="price-box">
            <div class="price">{{ site.data.site.services.manual_therapy.price }}</div>
            <p class="price-note">{{ site.data.site.services.manual_therapy.price_note }}</p>
            <a href="{{ site.data.site.contact.whatsapp.url }}" target="_blank" rel="noopener noreferrer" class="btn btn-outline">Book via WhatsApp <i class="bi bi-arrow-right"></i></a>
          </div>
        </div>
        <div>
          <div class="mb-8">
            <p class="methods-title">Methods</p>
            <ul class="check-list">{% for method in site.data.site.services.manual_therapy.methods %}<li><i class="bi bi-check-circle-fill"></i> {{ method }}</li>{% endfor %}</ul>
          </div>
          <div>
            <p class="indications-title">Indicated For</p>
            <ul class="dot-list"><li>Chronic back & neck pain</li><li>Restricted mobility</li><li>Persistent tension & headaches</li><li>Post-injury recovery</li><li>Compressed joints & nerves</li></ul>
          </div>
        </div>
      </div>
    </div>

    <div class="service-block featured relative">
      <div class="featured-bar"></div>
      <div class="service-block-inner">
        <div>
          <div class="service-header-flex">
            <div class="icon-box primary"><i class="bi bi-flower1"></i></div>
            <div><span class="service-number">02</span><span class="featured-badge">Featured</span></div>
          </div>
          <p class="service-subtitle">{{ site.data.site.services.herbal_medicine.subtitle }}</p>
          <h2 class="service-title">{{ site.data.site.services.herbal_medicine.name }}</h2>
          <p class="service-tagline">Restoring the body's natural chemistry with traditional Javanese phytotherapy.</p>
          <p class="service-description">{{ site.data.site.services.herbal_medicine.description }}</p>
          <div class="price-box featured-border">
            <div class="price">{{ site.data.site.services.herbal_medicine.price }}</div>
            <p class="price-note">{{ site.data.site.services.herbal_medicine.price_note }}</p>
            <a href="{{ site.data.site.contact.whatsapp.url }}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">Book via WhatsApp <i class="bi bi-arrow-right"></i></a>
          </div>
        </div>
        <div>
          <div class="mb-8">
            <p class="methods-title">Methods</p>
            <ul class="check-list">{% for method in site.data.site.services.herbal_medicine.methods %}<li><i class="bi bi-check-circle-fill"></i> {{ method }}</li>{% endfor %}</ul>
          </div>
          <div>
            <p class="indications-title">Indicated For</p>
            <ul class="dot-list"><li>Chronic GI distress</li><li>Hormonal imbalance</li><li>Supplement dependency</li><li>Metabolic fatigue</li><li>Inflammatory conditions</li></ul>
          </div>
        </div>
      </div>
    </div>

    <div class="service-block">
      <div class="service-block-inner">
        <div>
          <div class="service-header-flex">
            <div class="icon-box"><i class="bi bi-journal-text"></i></div>
            <div><span class="service-number">03</span></div>
          </div>
          <p class="service-subtitle">{{ site.data.site.services.professional_classes.subtitle }}</p>
          <h2 class="service-title">{{ site.data.site.services.professional_classes.name }}</h2>
          <p class="service-tagline">Anatomy-based training for high-precision manual practitioners.</p>
          <p class="service-description">{{ site.data.site.services.professional_classes.description }}</p>
          <div class="price-box">
            <div class="price">{{ site.data.site.services.professional_classes.price }}</div>
            <p class="price-note">{{ site.data.site.services.professional_classes.price_note }}</p>
            <a href="{{ site.data.site.contact.whatsapp.url }}" target="_blank" rel="noopener noreferrer" class="btn btn-outline">Book via WhatsApp <i class="bi bi-arrow-right"></i></a>
          </div>
        </div>
        <div>
          <div class="mb-8">
            <p class="structure-title">Course Structure</p>
            <ul class="check-list">{% for method in site.data.site.services.professional_classes.methods %}<li><i class="bi bi-check-circle-fill"></i> {{ method }}</li>{% endfor %}</ul>
          </div>
          <div>
            <p class="indications-title">Intended For</p>
            <ul class="dot-list"><li>Massage therapists</li><li>Manual therapy practitioners</li><li>Physiotherapists</li><li>Healthcare professionals</li><li>Anyone seeking professional mastery</li></ul>
          </div>
        </div>
      </div>
    </div>

  </div>
</section>

<section class="bg-alt text-center section-no-border">
  <div class="container">
    <h2 class="mb-4">Ready to Begin?</h2>
    <p class="max-w-2xl mx-auto mb-8">Most complex issues are resolved within 1–2 sessions. Reach out directly to discuss your case and book your first appointment.</p>
    <div class="cta-section">
      <a href="{{ site.data.site.contact.whatsapp.url }}" target="_blank" rel="noopener noreferrer" class="btn btn-primary"><i class="bi bi-telephone-fill"></i> Book via WhatsApp</a>
      <a href="{{ site.data.site.contact.telegram.url }}" target="_blank" rel="noopener noreferrer" class="btn btn-outline"><i class="bi bi-send-fill"></i> Telegram</a>
    </div>
  </div>
</section>