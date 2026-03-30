---
layout: page
title: "Contacts"
description: "Get in touch with {{ site.data.site.business.founder }} for traditional Javanese medicine consultations in Bali."
section_label: "Contact & Connect"
---

<div class="text-center mb-12">
  <h2>Start Your Healing</h2>
</div>

<div class="grid-3">

  <div class="card">
    <h3 class="mb-6">Direct Messengers</h3>
    <div class="flex flex-col gap-3">
      <a href="{{ site.data.site.contact.whatsapp.url }}" target="_blank" rel="noopener noreferrer" class="contact-link">
        <i class="bi bi-telephone-fill accent"></i> WhatsApp
      </a>
      <a href="{{ site.data.site.contact.telegram.url }}" target="_blank" rel="noopener noreferrer" class="contact-link">
        <i class="bi bi-send-fill icon-telegram"></i> {{ site.data.site.contact.telegram.label }} (Telegram)
      </a>
      <a href="mailto:{{ site.data.site.contact.email }}" class="contact-link">
        <i class="bi bi-envelope-fill primary"></i> {{ site.data.site.contact.email }}
      </a>
    </div>
  </div>

  <div class="card">
    <h3 class="mb-6">Social & Community</h3>
    <div class="flex flex-col gap-3">
      <a href="{{ site.data.site.social.instagram.primary.url }}" target="_blank" rel="noopener noreferrer" class="contact-link">
        <i class="bi bi-instagram primary"></i> {{ site.data.site.social.instagram.primary.handle }} (Live Cases)
      </a>
      <a href="{{ site.data.site.social.youtube.url }}" target="_blank" rel="noopener noreferrer" class="contact-link">
        <i class="bi bi-youtube accent"></i> {{ site.data.site.social.youtube.handle }} (Educational)
      </a>
      <a href="{{ site.data.site.contact.telegram.channel }}" target="_blank" rel="noopener noreferrer" class="contact-link">
        <i class="bi bi-send-fill icon-telegram"></i> Telegram Channel
      </a>
    </div>
  </div>

  <div class="card">
    <h3 class="mb-6">Locations</h3>
    <div class="flex flex-col gap-3 mb-6">
      {% for location in site.data.site.google_business.locations %}
      <a href="{{ location.gmb_url }}" target="_blank" rel="noopener noreferrer" class="contact-link">
        <i class="bi bi-geo-alt-fill primary"></i>
        <div>
          <div class="text-lg font-medium">{{ location.name }}</div>
          <div class="text-sm text-muted"><i class="bi bi-star-fill accent text-xs"></i> {{ location.rating | default: site.data.site.business.rating }}</div>
        </div>
      </a>
      {% endfor %}
    </div>
    <a href="{{ site.data.site.contact.whatsapp.url }}" target="_blank" rel="noopener noreferrer" class="btn btn-primary w-full justify-center">
      Book Now via WhatsApp <i class="bi bi-arrow-right"></i>
    </a>
  </div>

</div>
