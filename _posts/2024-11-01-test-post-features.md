---
layout: post
title: "Testing All Blog Post Features"
description: "A comprehensive test of tables, code blocks, syntax highlighting, and other blog post capabilities."
date: 2024-11-01
author: Evi Sudarto
categories: [testing, features]
tags: [markdown, code, tables, syntax-highlighting]
---

## Introduction

This post demonstrates all available blog post features including tables, code blocks with syntax highlighting, and various other formatting options.

## Comparison Table

Here is a comparison of different treatment methods:

| Method | Duration | Effectiveness | Cost | Side Effects |
|--------|----------|---------------|------|--------------|
| Manual Therapy | 1-2 sessions | 85% | IDR 6.4M | Minimal |
| Herbal Medicine | 2 months | 78% | IDR 4M | None |
| Acupuncture | 4-6 sessions | 72% | IDR 3.2M | Rare |
| Physiotherapy | 8-12 sessions | 68% | IDR 8M | Mild |

## Code Examples

### JavaScript Example

<div class="code-block-wrapper">
<div class="code-block-header">
<span>javascript</span>
<div class="code-block-actions">
<button onclick="copyCode(this)"><i class="bi bi-clipboard"></i> Copy</button>
<button onclick="downloadCode(this)"><i class="bi bi-download"></i> Download</button>
</div>
</div>

```javascript
// Function to calculate treatment effectiveness
function calculateEffectiveness(method, sessions) {
  const baseRate = {
    manual: 0.85,
    herbal: 0.78,
    acupuncture: 0.72,
    physiotherapy: 0.68
  };
  
  return baseRate[method] * (sessions / recommendedSessions[method]);
}

// Export the function
module.exports = { calculateEffectiveness };
```
</div>

### Python Example

```python
# Patient data analysis
import pandas as pd
import numpy as np

def analyze_patient_data(data_file):
    """Analyze patient treatment outcomes."""
    df = pd.read_csv(data_file)
    
    # Calculate success rate by treatment type
    success_rates = df.groupby('treatment')['success'].mean()
    
    return success_rates.to_dict()

# Example usage
results = analyze_patient_data('patients.csv')
print(f"Success rates: {results}")
```

### CSS Example

```css
/* Custom styling for treatment cards */
.treatment-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 2.4rem;
  transition: all 0.2s;
}

.treatment-card:hover {
  border-color: rgba(249, 38, 114, 0.35);
  transform: translateY(-2px);
}
```

## Blockquotes

> "The body has an innate ability to heal itself. Our role is to remove obstacles and support this natural process."
> — Evi Sudarto

## Lists

### Treatment Benefits

- **Immediate Relief**: Most patients experience improvement within 1-2 sessions
- **Long-lasting Results**: Systemic approach addresses root causes
- **No Side Effects**: Natural methods without chemical intervention
- **Personalized Care**: Each treatment plan is customized

### Steps in Manual Therapy

1. Initial assessment and diagnosis
2. Identification of root imbalance
3. Targeted intervention using Fork Effect
4. Systemic release and realignment
5. Follow-up and prevention guidance

## Code Block with Download

The following configuration file demonstrates the site setup:

```yaml
# _config.yml
title: Jamu Healing
description: Traditional Javanese Medicine
baseurl: ""
url: "https://jamu-healing.github.io"

markdown: kramdown
highlighter: rouge

plugins:
  - jekyll-paginate

paginate: 10
paginate_path: "/blog/page:num/"
```

## Images and Links

For more information, visit our [services page](/services) or contact us via [WhatsApp](https://wa.me/message/EPF44RLLBUY4D1).

## Conclusion

This test post demonstrates all available formatting options including:

- Tables with proper styling
- Code blocks with syntax highlighting
- Blockquotes
- Ordered and unordered lists
- Links and images
- Various heading levels

All features are designed to work seamlessly with the dark theme and maintain visual consistency throughout the site.