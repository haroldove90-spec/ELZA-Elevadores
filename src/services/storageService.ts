import { ServiceSheet, SupabaseConfig } from '../types/serviceSheet';
import { SAMPLE_SERVICE_SHEET } from '../data/sampleData';

const STORAGE_KEY = 'elze_service_sheets_v1';
const HIDE_SAMPLE_KEY = 'elze_hide_sample_data';
const SUPABASE_CONFIG_KEY = 'elze_supabase_config_v1';
const ACTIVE_ROLE_KEY = 'elze_active_role';

export const storageService = {
  // Check if sample data is permanently hidden
  isSampleDataHidden(): boolean {
    return localStorage.getItem(HIDE_SAMPLE_KEY) === 'true';
  },

  // Set flag to permanently hide sample data
  setSampleDataHidden(hidden: boolean): void {
    if (hidden) {
      localStorage.setItem(HIDE_SAMPLE_KEY, 'true');
    } else {
      localStorage.removeItem(HIDE_SAMPLE_KEY);
    }
  },

  // Get all service sheets
  getSheets(): ServiceSheet[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    const isHidden = this.isSampleDataHidden();

    if (!raw) {
      if (isHidden) {
        return [];
      }
      // Seed with sample sheet from user photo
      localStorage.setItem(STORAGE_KEY, JSON.stringify([SAMPLE_SERVICE_SHEET]));
      return [SAMPLE_SERVICE_SHEET];
    }

    try {
      const sheets: ServiceSheet[] = JSON.parse(raw);
      if (isHidden) {
        return sheets.filter((s) => !s.esMuestra);
      }
      return sheets;
    } catch {
      return isHidden ? [] : [SAMPLE_SERVICE_SHEET];
    }
  },

  // Save new or update existing sheet
  saveSheet(sheet: ServiceSheet): void {
    const sheets = this.getSheets();
    const index = sheets.findIndex((s) => s.id === sheet.id);

    let updated: ServiceSheet[];
    if (index >= 0) {
      updated = [...sheets];
      updated[index] = sheet;
    } else {
      updated = [sheet, ...sheets];
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Async sync to Supabase if configured
    this.syncToSupabase(sheet).catch(() => {});
  },

  // Delete sheet
  deleteSheet(id: string): void {
    const sheets = this.getSheets();
    const updated = sheets.filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Delete in Supabase if configured
    this.deleteFromSupabase(id).catch(() => {});
  },

  // Permanently clear sample data from entire system
  clearSampleData(): { countCleared: number } {
    this.setSampleDataHidden(true);
    const current = this.getSheets();
    const filtered = current.filter((s) => !s.esMuestra);
    const countCleared = current.length - filtered.length;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return { countCleared };
  },

  // Clear ALL records (including custom ones)
  clearAllRecords(): void {
    this.setSampleDataHidden(true);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  },

  // Restore the sample sheet for testing
  restoreSampleData(): void {
    this.setSampleDataHidden(false);
    const current = this.getSheets();
    const exists = current.some((s) => s.id === SAMPLE_SERVICE_SHEET.id);
    if (!exists) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([SAMPLE_SERVICE_SHEET, ...current]));
    }
  },

  // Role persistence
  getActiveRole(): string | null {
    return localStorage.getItem(ACTIVE_ROLE_KEY);
  },

  setActiveRole(role: string | null): void {
    if (role) {
      localStorage.setItem(ACTIVE_ROLE_KEY, role);
    } else {
      localStorage.removeItem(ACTIVE_ROLE_KEY);
    }
  },

  // Supabase Config
  getSupabaseConfig(): SupabaseConfig {
    const raw = localStorage.getItem(SUPABASE_CONFIG_KEY);
    if (!raw) {
      return {
        url: '',
        anonKey: '',
        tableName: 'hojas_servicio',
        habilitado: false,
      };
    }
    try {
      return JSON.parse(raw);
    } catch {
      return {
        url: '',
        anonKey: '',
        tableName: 'hojas_servicio',
        habilitado: false,
      };
    }
  },

  saveSupabaseConfig(config: SupabaseConfig): void {
    localStorage.setItem(SUPABASE_CONFIG_KEY, JSON.stringify(config));
  },

  // Supabase REST operations
  async syncToSupabase(sheet: ServiceSheet): Promise<boolean> {
    const cfg = this.getSupabaseConfig();
    if (!cfg.habilitado || !cfg.url || !cfg.anonKey) return false;

    const normalizedUrl = cfg.url.replace(/\/+$/, '');
    const endpoint = `${normalizedUrl}/rest/v1/${cfg.tableName || 'hojas_servicio'}`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: cfg.anonKey,
          Authorization: `Bearer ${cfg.anonKey}`,
          Prefer: 'resolution=merge-duplicates',
        },
        body: JSON.stringify({
          id: sheet.id,
          orden_servicio: sheet.ordenServicio,
          equipos: sheet.equipos,
          nombre_cliente: sheet.nombreCliente,
          direccion_cliente: sheet.direccionCliente,
          data: sheet,
          updated_at: new Date().toISOString(),
        }),
      });
      return response.ok;
    } catch (err) {
      console.warn('Supabase sync warning:', err);
      return false;
    }
  },

  async deleteFromSupabase(sheetId: string): Promise<boolean> {
    const cfg = this.getSupabaseConfig();
    if (!cfg.habilitado || !cfg.url || !cfg.anonKey) return false;

    const normalizedUrl = cfg.url.replace(/\/+$/, '');
    const endpoint = `${normalizedUrl}/rest/v1/${cfg.tableName || 'hojas_servicio'}?id=eq.${encodeURIComponent(sheetId)}`;

    try {
      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          apikey: cfg.anonKey,
          Authorization: `Bearer ${cfg.anonKey}`,
        },
      });
      return response.ok;
    } catch (err) {
      console.warn('Supabase delete warning:', err);
      return false;
    }
  },

  async clearAllSupabaseRecords(): Promise<boolean> {
    const cfg = this.getSupabaseConfig();
    if (!cfg.habilitado || !cfg.url || !cfg.anonKey) return false;

    const normalizedUrl = cfg.url.replace(/\/+$/, '');
    // Delete all records where id is not null
    const endpoint = `${normalizedUrl}/rest/v1/${cfg.tableName || 'hojas_servicio'}?id=not.is.null`;

    try {
      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          apikey: cfg.anonKey,
          Authorization: `Bearer ${cfg.anonKey}`,
        },
      });
      return response.ok;
    } catch (err) {
      console.warn('Supabase clear all warning:', err);
      return false;
    }
  },
};
