/**
 * Rim-Bump-Ding: Main Application Engine
 * Optimized for South Island NZ Live Pothole Reporting
 */

document.addEventListener('DOMContentLoaded', () => {
  // Clock Initialization with Blinking Colon Rule
  initBlinkingClock();

  // App State
  let currentHighwayFilter = 'ALL';
  let currentSeverityFilter = 'ALL';
  let activeJourney = null;
  let journeyRouteLines = [];
  let userCoords = { lat: -43.5321, lng: 172.6362 }; // Default: Christchurch / Canterbury
  let userMarker = null;
  let reportMarkers = {};
  let currentSelectedSeverity = 'rim';
  let uploadedPhotoBase64 = null;
  let proximityCheckInterval = null;

  // Initialize Leaflet Map Centered on South Island
  const map = L.map('map', {
    center: [-43.60, 171.50],
    zoom: 7,
    minZoom: 6,
    maxZoom: 18,
    maxBounds: [
      [-47.5, 165.5], // Southwest bound
      [-39.8, 175.5]  // Northeast bound
    ],
    zoomControl: false
  });

  // OpenStreetMap Tile Layer
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  }).addTo(map);

  // Relocate zoom control to top-right
  L.control.zoom({ position: 'topright' }).addTo(map);

  // Render User Location Pin
  function updateUserMarker(lat, lng) {
    userCoords = { lat, lng };
    const carIcon = L.divIcon({
      className: 'car-icon-wrapper',
      html: '<div class="car-pos-pin" title="Current Location"></div>',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    if (!userMarker) {
      userMarker = L.marker([lat, lng], { icon: carIcon, zIndexOffset: 2000 }).addTo(map);
    } else {
      userMarker.setLatLng([lat, lng]);
    }

    // Update coordinates in report modal preview
    const locBox = document.getElementById('modal-coords-display');
    if (locBox) {
      locBox.textContent = `${lat.toFixed(4)}° S, ${lng.toFixed(4)}° E`;
    }

    checkProximityWarnings();
  }

  // Initial user marker
  updateUserMarker(userCoords.lat, userCoords.lng);

  // Try HTML5 Geolocation (fallback gracefully to South Island bounds)
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        // Verify if in/near South Island (-47 to -40 lat, 166 to 175 lng)
        if (latitude >= -47.5 && latitude <= -40.0 && longitude >= 166.0 && longitude <= 175.0) {
          updateUserMarker(latitude, longitude);
          map.setView([latitude, longitude], 12);
        }
      },
      (err) => {
        console.log('Using South Island center default', err.message);
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }

  // Create Custom Pothole Map Marker Icon
  function createPotholeIcon(severity) {
    const sev = SEVERITIES[severity] || SEVERITIES.rim;
    let iconClass = 'pin-rim';
    if (severity === 'bump') iconClass = 'pin-bump';
    if (severity === 'ding') iconClass = 'pin-ding';
    if (severity === 'repaired') iconClass = 'pin-repaired';

    return L.divIcon({
      className: 'pothole-pin-wrapper',
      html: `<div class="custom-pin ${iconClass}">${sev.icon}</div>`,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
      popupAnchor: [0, -18]
    });
  }

  // Render Map Markers & Feed Cards
  function renderAllReports() {
    const allReports = AppStorage.getReports();
    const feedContainer = document.getElementById('incident-feed');
    const countBadge = document.getElementById('total-reports-count');

    // Filter reports
    const filtered = allReports.filter(r => {
      const matchHw = activeJourney ? activeJourney.highways.includes(r.highway) : (currentHighwayFilter === 'ALL' || r.highway === currentHighwayFilter);
      const matchSev = currentSeverityFilter === 'ALL' || r.severity === currentSeverityFilter;
      return matchHw && matchSev;
    });

    if (countBadge) {
      countBadge.textContent = activeJourney ? `${filtered.length} on route` : `${filtered.length} hazards`;
    }

    // Clear old map markers
    Object.values(reportMarkers).forEach(m => map.removeLayer(m));
    reportMarkers = {};

    // Render Markers on Map
    filtered.forEach(rep => {
      const icon = createPotholeIcon(rep.severity);
      const marker = L.marker([rep.lat, rep.lng], { icon: icon }).addTo(map);

      const sev = SEVERITIES[rep.severity] || SEVERITIES.rim;
      const popupHtml = `
        <div style="min-width: 200px; color: #0f172a; font-family: -apple-system, sans-serif;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span style="background: #0f172a; color: #38bdf8; font-weight: 800; font-size: 11px; padding: 2px 6px; border-radius: 4px;">${escapeHtml(rep.highway)}</span>
            <span style="font-weight: 700; color: ${sev.color}; font-size: 12px;">${sev.icon} ${sev.label}</span>
          </div>
          <div style="font-weight: 800; font-size: 14px; margin-bottom: 4px; line-height: 1.2;">${escapeHtml(rep.title)}</div>
          <div style="font-size: 12px; color: #475569; margin-bottom: 8px;">${escapeHtml(rep.description || '')}</div>
          <div style="font-size: 11px; color: #64748b; margin-bottom: 8px;">
            <div>📍 ${escapeHtml(rep.nearestTown || 'South Island')} (${escapeHtml(rep.lane || 'Both Lanes')})</div>
            <div>⏱️ ${formatTimeAgo(rep.reportedAt)}</div>
          </div>
          <button onclick="window.confirmHazard('${rep.id}')" style="width: 100%; background: #0284c7; color: #fff; border: none; padding: 6px; border-radius: 6px; font-weight: 700; font-size: 12px; cursor: pointer;">
            👍 Still There (${rep.confirms || 1})
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml);
      reportMarkers[rep.id] = marker;
    });

    // Render Side Feed List
    if (feedContainer) {
      if (filtered.length === 0) {
        feedContainer.innerHTML = `
          <div style="text-align: center; padding: 40px 20px; color: var(--text-muted); font-size: 13px;">
            No potholes reported for the selected filters.
          </div>
        `;
        return;
      }

      feedContainer.innerHTML = filtered.map(rep => {
        const sev = SEVERITIES[rep.severity] || SEVERITIES.rim;
        return `
          <div class="report-card ${sev.badgeClass}" onclick="window.focusReport('${rep.id}', ${rep.lat}, ${rep.lng})">
            <div class="card-top">
              <span class="card-highway-badge">${escapeHtml(rep.highway)}</span>
              <span class="card-time">${formatTimeAgo(rep.reportedAt)}</span>
            </div>
            <div class="card-title">${escapeHtml(rep.title)}</div>
            <div class="card-meta">
              <span>${sev.icon} ${sev.label}</span>
              <span>•</span>
              <span class="truncate">📍 ${escapeHtml(rep.nearestTown || 'Route')}</span>
            </div>
            <div class="card-bottom-actions">
              <span class="confirms-count">${rep.confirms || 1} confirmed</span>
              <button class="btn-confirm" onclick="event.stopPropagation(); window.confirmHazard('${rep.id}')">
                👍 Still There
              </button>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // Global helper to center on report
  window.focusReport = (id, lat, lng) => {
    map.setView([lat, lng], 13, { animate: true });
    if (reportMarkers[id]) {
      reportMarkers[id].openPopup();
    }
  };

  // Global helper to confirm hazard
  window.confirmHazard = (id) => {
    const updated = AppStorage.confirmReport(id);
    if (updated) {
      SoundSystem.playDing();
      showToast(`Confirmed hazard on ${updated.highway}!`);
      renderAllReports();
    }
  };

  // Proximity Alert Detection Engine
  function checkProximityWarnings() {
    const reports = AppStorage.getReports();
    const hud = document.getElementById('proximity-hud');
    const hudTitle = document.getElementById('proximity-title');
    const hudDesc = document.getElementById('proximity-desc');
    if (!hud) return;

    let nearestHazard = null;
    let shortestDistKm = Infinity;

    reports.forEach(r => {
      if (r.severity === 'repaired') return;
      const distKm = computeDistanceKm(userCoords.lat, userCoords.lng, r.lat, r.lng);
      if (distKm < shortestDistKm) {
        shortestDistKm = distKm;
        nearestHazard = r;
      }
    });

    // Alert threshold: within 1.5 km
    if (nearestHazard && shortestDistKm <= 1.5) {
      const distM = Math.round(shortestDistKm * 1000);
      hud.style.display = 'block';
      const sev = SEVERITIES[nearestHazard.severity] || SEVERITIES.rim;
      hudTitle.innerHTML = `${sev.icon} ${sev.label.toUpperCase()} AHEAD: ${distM}M`;
      hudDesc.textContent = `${nearestHazard.highway} near ${nearestHazard.nearestTown || 'Route'} - ${nearestHazard.title}`;

      // Play alert tone if very close (< 600m)
      if (shortestDistKm <= 0.6) {
        SoundSystem.playProximityAlert();
      }
    } else {
      hud.style.display = 'none';
    }
  }

  // Great Circle Haversine Distance Calculation (km)
  function computeDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Listen for storage / cross-window updates
  AppStorage.onUpdate((payload) => {
    if (payload.type === 'NEW_REPORT') {
      showToast(`New ${payload.report.severity.toUpperCase()} reported on ${payload.report.highway}!`);
      if (payload.report.severity === 'rim') SoundSystem.playRimBender();
      else if (payload.report.severity === 'bump') SoundSystem.playBump();
      else SoundSystem.playDing();
    } else if (payload.type === 'LOCATION_UPDATE') {
      updateUserMarker(payload.location.lat, payload.location.lng);
    }
    renderAllReports();
    checkProximityWarnings();
  });

  // Highway Filter Chips Click Listeners
  document.querySelectorAll('.hw-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.hw-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentHighwayFilter = chip.dataset.highway;
      renderAllReports();
    });
  });

  // Severity Filter Buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => {
        b.className = 'filter-btn';
      });
      const sev = btn.dataset.severity;
      currentSeverityFilter = sev;
      if (sev === 'ALL') btn.classList.add('active-all');
      if (sev === 'rim') btn.classList.add('active-rim');
      if (sev === 'bump') btn.classList.add('active-bump');
      if (sev === 'ding') btn.classList.add('active-ding');
      renderAllReports();
    });
  });

  // Modal Dialog Open/Close Logic
  const reportModal = document.getElementById('report-modal');
  const openReportBtn = document.getElementById('open-report-btn');
  const closeReportBtn = document.getElementById('close-report-btn');
  const cancelReportBtn = document.getElementById('cancel-report-btn');

  function openModal() {
    reportModal.classList.add('active');
    updateUserMarker(userCoords.lat, userCoords.lng);
  }

  function closeModal() {
    reportModal.classList.remove('active');
    resetReportForm();
  }

  if (openReportBtn) openReportBtn.addEventListener('click', openModal);
  if (closeReportBtn) closeReportBtn.addEventListener('click', closeModal);
  if (cancelReportBtn) cancelReportBtn.addEventListener('click', closeModal);

  // Severity Selector Inside Modal
  document.querySelectorAll('.severity-choice').forEach(choice => {
    choice.addEventListener('click', () => {
      document.querySelectorAll('.severity-choice').forEach(c => {
        c.classList.remove('selected-rim', 'selected-bump', 'selected-ding');
      });
      currentSelectedSeverity = choice.dataset.severity;
      choice.classList.add(`selected-${currentSelectedSeverity}`);

      // Sound feedback on select
      if (currentSelectedSeverity === 'rim') SoundSystem.playRimBender();
      else if (currentSelectedSeverity === 'bump') SoundSystem.playBump();
      else SoundSystem.playDing();
    });
  });

  // Photo Attachment Handler
  const photoInput = document.getElementById('photo-input');
  const photoPreview = document.getElementById('photo-preview-box');

  if (photoInput) {
    photoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          uploadedPhotoBase64 = ev.target.result;
          if (photoPreview) {
            photoPreview.innerHTML = `<img src="${uploadedPhotoBase64}" alt="Pothole photo">`;
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Location Refresh Button
  const gpsRefreshBtn = document.getElementById('btn-gps-refresh');
  if (gpsRefreshBtn) {
    gpsRefreshBtn.addEventListener('click', () => {
      if (navigator.geolocation) {
        gpsRefreshBtn.textContent = 'Locating...';
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            updateUserMarker(pos.coords.latitude, pos.coords.longitude);
            gpsRefreshBtn.textContent = 'Updated!';
            setTimeout(() => { gpsRefreshBtn.textContent = 'Detect GPS'; }, 2000);
          },
          () => {
            gpsRefreshBtn.textContent = 'GPS Failed';
            setTimeout(() => { gpsRefreshBtn.textContent = 'Detect GPS'; }, 2000);
          }
        );
      }
    });
  }

  // Form Submission
  const reportForm = document.getElementById('pothole-report-form');
  if (reportForm) {
    reportForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const highway = document.getElementById('input-highway').value;
      const title = document.getElementById('input-title').value.trim();
      const description = document.getElementById('input-desc').value.trim();
      const lane = document.getElementById('input-lane').value;
      const nearestTown = document.getElementById('input-town').value.trim() || 'South Island Highway';

      if (!title) {
        alert('Please enter a short hazard title');
        return;
      }

      // Small jitter around user position if multiple reports in same spot
      const lat = userCoords.lat + (Math.random() - 0.5) * 0.003;
      const lng = userCoords.lng + (Math.random() - 0.5) * 0.003;

      const newReport = {
        highway,
        title,
        description,
        lane,
        nearestTown,
        severity: currentSelectedSeverity,
        lat,
        lng,
        confirms: 1,
        status: 'Reported',
        hasPhoto: !!uploadedPhotoBase64,
        photoUrl: uploadedPhotoBase64
      };

      AppStorage.saveReport(newReport);
      SoundSystem.playSuccess();
      showToast(`Report logged on ${highway}! NZTA notified.`);
      closeModal();
      renderAllReports();

      // Zoom to new report
      map.setView([lat, lng], 13, { animate: true });
    });
  }

  function resetReportForm() {
    if (reportForm) reportForm.reset();
    uploadedPhotoBase64 = null;
    if (photoPreview) {
      photoPreview.innerHTML = '<span>No Photo</span>';
    }
  }

  // Quick Map Recenter Control
  const btnRecenter = document.getElementById('btn-recenter');
  if (btnRecenter) {
    btnRecenter.addEventListener('click', () => {
      map.setView([userCoords.lat, userCoords.lng], 13, { animate: true });
      showToast('Centered on current location');
    });
  }

  // Sound Toggle Control
  const btnMute = document.getElementById('btn-sound-toggle');
  if (btnMute) {
    btnMute.addEventListener('click', () => {
      const isMuted = SoundSystem.toggleMute();
      btnMute.innerHTML = isMuted ? '🔇' : '🔊';
      showToast(isMuted ? 'Alert sounds muted' : 'Alert sounds active');
    });
  }

  // Emergency Waka Kotahi Info Modal
  const btnEmergency = document.getElementById('btn-emergency-info');
  const emergencyModal = document.getElementById('emergency-modal');
  const closeEmergency = document.getElementById('close-emergency-btn');

  if (btnEmergency && emergencyModal) {
    btnEmergency.addEventListener('click', () => emergencyModal.classList.add('active'));
  }
  if (closeEmergency && emergencyModal) {
    closeEmergency.addEventListener('click', () => emergencyModal.classList.remove('active'));
  }

  // Journey Selector Implementation
  const journeyModal = document.getElementById('journey-modal');
  const btnOpenJourney = document.getElementById('btn-open-journey');
  const btnCloseJourney = document.getElementById('close-journey-btn');
  const btnClearJourney = document.getElementById('btn-clear-journey');
  const btnChangeJourney = document.getElementById('btn-journey-change');

  function openJourneyModal() {
    renderJourneyModal();
    if (journeyModal) journeyModal.classList.add('active');
  }

  function closeJourneyModal() {
    if (journeyModal) journeyModal.classList.remove('active');
  }

  function renderJourneyModal() {
    const list = document.getElementById('journey-list-container');
    if (!list) return;
    const allReports = AppStorage.getReports();

    list.innerHTML = SOUTH_ISLAND_JOURNEYS.map(j => {
      const routeHazards = allReports.filter(r => j.highways.includes(r.highway));
      const rimCount = routeHazards.filter(r => r.severity === 'rim').length;
      const bumpCount = routeHazards.filter(r => r.severity === 'bump').length;
      const isActive = activeJourney && activeJourney.id === j.id;

      return `
        <div class="journey-card ${isActive ? 'active-journey' : ''}" onclick="window.triggerSelectJourney('${j.id}')">
          <div class="journey-card-top">
            <span class="journey-name">${escapeHtml(j.name)}</span>
            <span class="journey-dist">${j.distanceKm} km • ${j.estDriveTime}</span>
          </div>
          <div class="journey-corridors">
            ${j.highways.map(hw => `<span class="journey-badge-pill">${escapeHtml(hw)}</span>`).join('')}
            <span class="journey-passes">🏔️ Passes: ${escapeHtml(j.keyPasses.join(', '))}</span>
          </div>
          <div class="journey-hazards-summary">
            <span style="color: ${rimCount > 0 ? '#ef4444' : '#10b981'};">💥 ${rimCount} Rim Benders</span>
            <span>•</span>
            <span style="color: ${bumpCount > 0 ? '#f97316' : '#94a3b8'};">⚠️ ${bumpCount} Bumps</span>
            <span>•</span>
            <span style="color: var(--text-muted);">${routeHazards.length} total defects</span>
            ${isActive ? '<span style="margin-left: auto; color: #38bdf8; font-weight: 800;">ACTIVE CORRIDOR</span>' : ''}
          </div>
        </div>
      `;
    }).join('');
  }

  function selectJourney(journeyId) {
    const journey = SOUTH_ISLAND_JOURNEYS.find(j => j.id === journeyId);
    if (!journey) return;
    activeJourney = journey;

    // Clear previous polyline
    journeyRouteLines.forEach(l => map.removeLayer(l));
    journeyRouteLines = [];

    // Draw route glow and main line
    const shadowLine = L.polyline(journey.waypoints, {
      color: '#38bdf8',
      weight: 12,
      opacity: 0.35,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);

    const coreLine = L.polyline(journey.waypoints, {
      color: '#06b6d4',
      weight: 5,
      opacity: 0.95,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);

    journeyRouteLines.push(shadowLine, coreLine);

    // Fit map bounds to journey
    map.fitBounds(coreLine.getBounds(), { padding: [50, 50] });

    // Update HUD
    const hud = document.getElementById('journey-hud');
    const hudTitle = document.getElementById('journey-hud-title');
    const hudKm = document.getElementById('journey-hud-km');
    const hudTime = document.getElementById('journey-hud-time');
    const hudHazards = document.getElementById('journey-hud-hazards');
    const simLink = document.getElementById('btn-journey-sim-link');

    const allReports = AppStorage.getReports();
    const routeHazards = allReports.filter(r => journey.highways.includes(r.highway));
    const rimCount = routeHazards.filter(r => r.severity === 'rim').length;

    if (hud) {
      hud.style.display = 'block';
      hudTitle.textContent = `🛣️ ${journey.shortName}`;
      hudKm.textContent = `${journey.distanceKm} km`;
      hudTime.textContent = journey.estDriveTime;
      hudHazards.textContent = `${routeHazards.length} hazards (${rimCount} Rim Benders)`;
      if (simLink) {
        simLink.href = `remote.html?route=${journey.id}`;
      }
    }

    closeJourneyModal();
    renderAllReports();
    showToast(`Active Route: ${journey.shortName}`);
    SoundSystem.playDing();
  }

  function clearJourney() {
    activeJourney = null;
    journeyRouteLines.forEach(l => map.removeLayer(l));
    journeyRouteLines = [];
    const hud = document.getElementById('journey-hud');
    if (hud) hud.style.display = 'none';
    renderAllReports();
    showToast('Journey route cleared');
  }

  window.triggerSelectJourney = (journeyId) => {
    selectJourney(journeyId);
  };

  if (btnOpenJourney) btnOpenJourney.addEventListener('click', openJourneyModal);
  if (btnCloseJourney) btnCloseJourney.addEventListener('click', closeJourneyModal);
  if (btnClearJourney) btnClearJourney.addEventListener('click', clearJourney);
  if (btnChangeJourney) btnChangeJourney.addEventListener('click', openJourneyModal);

  // Initial render
  renderAllReports();
  checkProximityWarnings();

  // Periodic proximity check every 5 seconds
  proximityCheckInterval = setInterval(checkProximityWarnings, 5000);
});

/**
 * MANDATORY RULE: ALL CLOCKS MUST HAVE BLINKING COLONS!
 * Format: HH<span class="blinking-colon">:</span>MM<span class="blinking-colon">:</span>SS (NZST/NZDT)
 */
function initBlinkingClock() {
  const clockElements = document.querySelectorAll('.blinking-clock');
  if (clockElements.length === 0) return;

  function update() {
    const now = new Date();
    // Format in New Zealand time
    const nzTimeStr = now.toLocaleTimeString('en-NZ', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Pacific/Auckland'
    });

    const parts = nzTimeStr.split(':');
    if (parts.length === 3) {
      const html = `${parts[0]}<span class="blinking-colon">:</span>${parts[1]}<span class="blinking-colon">:</span>${parts[2]} <span style="font-size: 10px; color: var(--text-muted);">NZST</span>`;
      clockElements.forEach(el => {
        el.innerHTML = html;
      });
    }
  }

  update();
  setInterval(update, 1000);
}

// Utility: Relative Time Formatting
function formatTimeAgo(isoString) {
  if (!isoString) return 'Just now';
  const diffSec = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  return `${Math.floor(diffHour / 24)}d ago`;
}

// Toast notification helper
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>🔔</span> <span class="no-wrap">${escapeHtml(message)}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Security: Escape HTML strings
function escapeHtml(text) {
  if (typeof text !== 'string') return text;
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
