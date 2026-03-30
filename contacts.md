---
layout: page
title: "Contacts"
description: "Get in touch with Evi Sudarto for traditional Javanese medicine consultations in Bali."
section_label: "Contact & Connect"
---

<div class="text-center mb-16">
  <h2>Start Your Healing</h2>
</div>

<div class="grid-3">

  <div class="card">
    <h3 class="mb-6">Direct Contacts</h3>
    <div class="flex flex-col gap-4">
      <a href="{{ site.data.site.contact.whatsapp.url }}" target="_blank" rel="noopener noreferrer" class="contact-link-v">
        <div class="contact-link-header">
          <i class="bi bi-whatsapp accent contact-link-icon"></i>
          <span class="font-medium contact-link-title">WhatsApp</span>
        </div>
        <div class="contact-link-sub">Booking & Appointments</div>
        <div class="contact-link-phone accent">{{ site.data.site.contact.phone }}</div>
      </a>
      <a href="{{ site.data.site.contact.telegram.url }}" target="_blank" rel="noopener noreferrer" class="contact-link-v">
        <div class="contact-link-header">
          <i class="bi bi-telegram icon-telegram contact-link-icon"></i>
          <span class="font-medium contact-link-title">Telegram</span>
        </div>
        <div class="contact-link-sub">{{ site.data.site.contact.telegram.label }} — Booking & Appointments</div>
      </a>
      <a href="mailto:{{ site.data.site.contact.email }}" class="contact-link-v">
        <div class="contact-link-header">
          <i class="bi bi-envelope-fill primary contact-link-icon"></i>
          <span class="font-medium contact-link-title">Gmail Evi Sudarto</span>
        </div>
        <div class="contact-link-sub">{{ site.data.site.contact.email }}</div>
      </a>
    </div>
  </div>

  <div class="card">
    <h3 class="mb-6">Social & Community</h3>
    <div class="flex flex-col gap-4">
      <a href="{{ site.data.site.social.instagram.primary.url }}" target="_blank" rel="noopener noreferrer" class="contact-link-v">
        <div class="contact-link-header">
          <i class="bi bi-instagram primary contact-link-icon"></i>
          <span class="font-medium contact-link-title">{{ site.data.site.social.instagram.primary.handle }}</span>
        </div>
        <div class="contact-link-sub">Instagram — Live Cases</div>
        <div class="contact-link-desc">{{ site.data.site.social.instagram.primary.followers }} followers, {{ site.data.site.social.instagram.primary.posts }} posts — live cases, therapy sessions, educational content</div>
        <span class="contact-link-badge">since {{ site.data.site.social.instagram.primary.since }}</span>
      </a>
      <a href="{{ site.data.site.social.facebook.url }}" target="_blank" rel="noopener noreferrer" class="contact-link-v">
        <div class="contact-link-header">
          <i class="bi bi-facebook primary contact-link-icon"></i>
          <span class="font-medium contact-link-title">Facebook</span>
        </div>
        <div class="contact-link-sub">Community Page</div>
        <div class="contact-link-desc">Videos, photos, patient stories</div>
        <span class="contact-link-badge">since {{ site.data.site.social.facebook.since }}</span>
      </a>
      <a href="{{ site.data.site.social.youtube.url }}" target="_blank" rel="noopener noreferrer" class="contact-link-v">
        <div class="contact-link-header">
          <i class="bi bi-youtube icon-youtube contact-link-icon"></i>
          <span class="font-medium contact-link-title">{{ site.data.site.social.youtube.handle }}</span>
        </div>
        <div class="contact-link-sub">YouTube — Educational</div>
        <div class="contact-link-desc">Educational videos, therapy demonstrations</div>
      </a>
      <a href="{{ site.data.site.social.telegram_channel.url }}" target="_blank" rel="noopener noreferrer" class="contact-link-v">
        <div class="contact-link-header">
          <i class="bi bi-telegram icon-telegram contact-link-icon"></i>
          <span class="font-medium contact-link-title">Telegram Channel</span>
        </div>
        <div class="contact-link-sub">Health Updates</div>
        <div class="contact-link-desc">Health updates and wellness tips for Bali</div>
      </a>
    </div>
  </div>

  <div class="card">
    <h3 class="mb-6">Google My Business</h3>
    <div class="flex flex-col gap-4 mb-6">
      <a href="{{ site.data.site.google_business.sites_url }}" target="_blank" rel="noopener noreferrer" class="contact-link-v">
        <div class="contact-link-header">
          <i class="bi bi-globe primary contact-link-icon"></i>
          <span class="font-medium contact-link-title">Google Sites</span>
        </div>
        <div class="contact-link-sub">Official Website</div>
        <div class="contact-link-desc">Detailed information about services and methodology</div>
        <span class="contact-link-badge">since 2016</span>
      </a>
      {% for location in site.data.site.google_business.locations %}
      <a href="{{ location.gmb_url }}" target="_blank" rel="noopener noreferrer" class="gmb-card">
        <div class="flex items-center gap-3 mb-2">
          <img src="{{ location.logo }}" alt="{{ location.name }}" class="gmb-logo" />
          <div>
            <h3 class="text-lg mb-0">{{ location.name }}</h3>
            <div class="text-xs font-mono text-primary">by Evi Sudarto</div>
          </div>
        </div>
        <div class="flex flex-col gap-1 text-sm">
          <div><i class="bi bi-geo-alt primary text-xs"></i> {{ location.address }}</div>
          <div><i class="bi bi-clock accent text-xs"></i> {{ location.hours | default: site.data.site.business.hours }}</div>
          <div><i class="bi bi-star-fill accent text-xs"></i> {{ location.rating | default: site.data.site.business.rating }}</div>
        </div>
      </a>
      {% endfor %}
    </div>
    <a href="{{ site.data.site.contact.whatsapp.url }}" target="_blank" rel="noopener noreferrer" class="btn btn-primary w-full justify-center">
      Book Now via WhatsApp <i class="bi bi-arrow-right"></i>
    </a>
  </div>

</div>
