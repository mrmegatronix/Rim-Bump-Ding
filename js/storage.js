/**
 * Rim-Bump-Ding: Storage & Real-Time Sync Engine
 * Uses LocalStorage + BroadcastChannel for multi-window live synchronization
 */

const STORAGE_KEYS = {
  REPORTS: 'rbd_reports_v1',
  USER_LOCATION: 'rbd_user_location_v1',
  SIMULATION: 'rbd_sim_state_v1'
};

class ReportStorage {
  constructor() {
    this.channel = new BroadcastChannel('rbd_live_sync');
    this.listeners = [];

    this.channel.onmessage = (event) => {
      this._notifyListeners(event.data);
    };

    // Ensure initial seed data is loaded
    this._ensureInitialData();
  }

  _ensureInitialData() {
    const raw = localStorage.getItem(STORAGE_KEYS.REPORTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(SEED_REPORTS));
    }
  }

  getReports() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.REPORTS);
      return raw ? JSON.parse(raw) : [...SEED_REPORTS];
    } catch (e) {
      console.error('Failed reading reports', e);
      return [...SEED_REPORTS];
    }
  }

  saveReport(report) {
    const reports = this.getReports();
    // Add unique ID and timestamp if not present
    if (!report.id) {
      report.id = 'rbd-' + Math.random().toString(36).substring(2, 9);
    }
    if (!report.reportedAt) {
      report.reportedAt = new Date().toISOString();
    }
    if (report.confirms === undefined) {
      report.confirms = 1;
    }
    if (!report.status) {
      report.status = 'Reported';
    }

    reports.unshift(report);
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));

    // Broadcast change
    this.channel.postMessage({
      type: 'NEW_REPORT',
      report: report
    });

    return report;
  }

  confirmReport(reportId) {
    const reports = this.getReports();
    const target = reports.find(r => r.id === reportId);
    if (target) {
      target.confirms = (target.confirms || 0) + 1;
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
      this.channel.postMessage({
        type: 'UPDATE_REPORT',
        report: target
      });
      return target;
    }
    return null;
  }

  updateStatus(reportId, newStatus) {
    const reports = this.getReports();
    const target = reports.find(r => r.id === reportId);
    if (target) {
      target.status = newStatus;
      if (newStatus === 'Repaired') {
        target.severity = 'repaired';
      }
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
      this.channel.postMessage({
        type: 'UPDATE_REPORT',
        report: target
      });
      return target;
    }
    return null;
  }

  deleteReport(reportId) {
    let reports = this.getReports();
    reports = reports.filter(r => r.id !== reportId);
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
    this.channel.postMessage({
      type: 'DELETE_REPORT',
      reportId: reportId
    });
  }

  resetSeedData() {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(SEED_REPORTS));
    this.channel.postMessage({
      type: 'RESET_DATA'
    });
  }

  onUpdate(callback) {
    this.listeners.push(callback);
  }

  _notifyListeners(payload) {
    this.listeners.forEach(cb => {
      try {
        cb(payload);
      } catch (e) {
        console.error('Storage listener error', e);
      }
    });
  }

  // Location broadcasting for simulated drive telemetry
  broadcastLocation(loc) {
    localStorage.setItem(STORAGE_KEYS.USER_LOCATION, JSON.stringify(loc));
    this.channel.postMessage({
      type: 'LOCATION_UPDATE',
      location: loc
    });
  }

  getUserLocation() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.USER_LOCATION);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }
}

const AppStorage = new ReportStorage();
