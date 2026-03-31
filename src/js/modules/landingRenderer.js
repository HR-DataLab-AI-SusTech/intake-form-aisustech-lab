export function renderLanding(page, container, onStart) {
  container.innerHTML = '';

  const landing = document.createElement('div');
  landing.className = 'landing-page';

  // Hero section
  const hero = document.createElement('div');
  hero.className = 'landing-hero';

  const badge = document.createElement('span');
  badge.className = 'landing-badge';
  badge.textContent = page.estimatedTime
    ? `Estimated time: ${page.estimatedTime}`
    : 'Project Intake';

  const title = document.createElement('h2');
  title.className = 'landing-title';
  title.textContent = page.title;
  title.tabIndex = -1;

  const subtitle = document.createElement('p');
  subtitle.className = 'landing-subtitle';
  subtitle.textContent = page.subtitle || '';

  hero.appendChild(badge);
  hero.appendChild(title);
  hero.appendChild(subtitle);

  if (page.description) {
    const desc = document.createElement('p');
    desc.className = 'landing-description';
    desc.textContent = page.description;
    hero.appendChild(desc);
  }

  landing.appendChild(hero);

  // Feature cards
  if (page.features && page.features.length > 0) {
    const grid = document.createElement('div');
    grid.className = 'landing-features';

    for (const feature of page.features) {
      const card = document.createElement('div');
      card.className = 'landing-feature-card';

      const icon = document.createElement('div');
      icon.className = 'landing-feature-icon';
      icon.textContent = feature.icon;

      const cardTitle = document.createElement('h3');
      cardTitle.className = 'landing-feature-title';
      cardTitle.textContent = feature.title;

      const cardText = document.createElement('p');
      cardText.className = 'landing-feature-text';
      cardText.textContent = feature.text;

      card.appendChild(icon);
      card.appendChild(cardTitle);
      card.appendChild(cardText);
      grid.appendChild(card);
    }

    landing.appendChild(grid);
  }

  // CTA button
  const cta = document.createElement('div');
  cta.className = 'landing-cta';

  const startBtn = document.createElement('button');
  startBtn.className = 'btn btn-primary landing-start-btn';
  startBtn.textContent = page.startButtonText || 'Get Started';
  startBtn.addEventListener('click', onStart);

  cta.appendChild(startBtn);
  landing.appendChild(cta);

  container.appendChild(landing);
  title.focus();
}
