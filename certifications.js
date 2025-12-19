document.addEventListener('DOMContentLoaded', () => {
    // Certifications: lazy-load and render expanded list when user requests it.
    (function () {
        const btn = document.getElementById('cert-expand');
        const more = document.getElementById('certifications-more');
        let loaded = false;
        let itemsCache = null;

        // Render featured certificates into #cert-featured on load
        const featuredContainer = document.getElementById('cert-featured');

        function createCertCard(item) {
            const isLink = item.verify && item.verify.length > 0;
            // Determine icon based on type/category
            let iconClass = 'fas fa-certificate';
            // Basic mapping
            if (item.category === 'training' || item.type === 'training') iconClass = 'fas fa-chalkboard-teacher';
            if (item.category === 'masterclass') iconClass = 'fas fa-laptop-code';
            if (item.category === 'misc') iconClass = 'fas fa-trophy';

            // Specific overrides for branding
            if (item.org) {
                const lowerOrg = item.org.toLowerCase();
                if (lowerOrg.includes('microsoft')) iconClass = 'fab fa-microsoft';
                else if (lowerOrg.includes('ibm')) iconClass = 'fas fa-atom'; // closest for Quantum
                else if (lowerOrg.includes('aws')) iconClass = 'fab fa-aws';
                else if (lowerOrg.includes('google')) iconClass = 'fab fa-google';
            }

            return `
              <div class="cert-card">
                <div class="cert-card-left">
                  <div class="cert-icon">
                    <i class="${iconClass}"></i>
                  </div>
                  <div class="cert-info">
                    <div class="cert-card-title">
                      ${isLink ? `<a href="${item.verify}" target="_blank" rel="noopener noreferrer">${item.title}</a>` : item.title}
                    </div>
                    <div class="cert-card-org">
                      ${item.org} • ${item.date || ''}
                    </div>
                  </div>
                </div>
                ${isLink ? `
                <a href="${item.verify}" target="_blank" rel="noopener noreferrer" class="cert-card-badge" aria-label="Verify Certificate">
                  <i class="fas fa-external-link-alt"></i>
                </a>` : ''}
              </div>
            `;
        }

        // Fetch and load featured
        fetch('data/certifications.json')
            .then(response => response.json())
            .then(data => {
                itemsCache = data;
                if (featuredContainer && featuredContainer.innerHTML.indexOf('cert-card') === -1) {
                    const featured = data.filter(i => i.featured).slice(0, 6);
                    if (featured.length) featuredContainer.innerHTML = featured.map(createCertCard).join('');
                }
            })
            .catch(err => {
                console.error('Error loading certifications:', err);
                if (featuredContainer) featuredContainer.innerHTML = '<p class="muted">Failed to load certificates.</p>';
            });

        if (btn && more) {
            // "Show more" handler
            btn.addEventListener('click', function () {
                const isExpanded = btn.getAttribute('aria-expanded') === 'true';

                if (!isExpanded) {
                    // EXPAND
                    if (!loaded && itemsCache) {
                        // Filter non-featured items
                        const nonFeatured = itemsCache.filter(d => !d.featured);

                        // Categories map
                        const categories = {
                            'training': 'Training & Bootcamps',
                            'masterclass': 'Small Bootcamps & Masterclasses',
                            'misc': 'Miscellaneous & Awards'
                        };

                        // Group by category
                        const grouped = {
                            'training': [],
                            'masterclass': [],
                            'misc': []
                        };

                        nonFeatured.forEach(item => {
                            const cat = item.category || 'misc';
                            if (grouped[cat]) {
                                grouped[cat].push(item);
                            } else {
                                grouped['misc'].push(item);
                            }
                        });

                        // Render categories
                        let html = '';
                        // Order: Training, Masterclass, Misc
                        const order = ['training', 'masterclass', 'misc'];

                        order.forEach(catKey => {
                            if (grouped[catKey].length > 0) {
                                html += `
                                    <div class="cert-category-section">
                                        <h3 class="cert-category-title"><span>#</span> ${categories[catKey]}</h3>
                                        <div class="card-grid">
                                            ${grouped[catKey].map(createCertCard).join('')}
                                        </div>
                                    </div>
                                `;
                            }
                        });

                        more.innerHTML = html;
                        loaded = true;
                    }

                    more.hidden = false;
                    btn.setAttribute('aria-expanded', 'true');
                    btn.textContent = 'Show less';
                } else {
                    // COLLAPSE
                    more.hidden = true;
                    btn.setAttribute('aria-expanded', 'false');
                    btn.textContent = 'Show more';
                    // Scroll back to anchor
                    const certSection = document.getElementById('certifications-training') || document.getElementById('certifications');
                    if (certSection) certSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    })();
});
