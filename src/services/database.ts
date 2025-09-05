import * as sqlite3 from 'sqlite3';
import { app } from 'electron';
import * as path from 'path';
import { Paciente, Examen, EstadisticasDashboard, ResumenMensual } from '../types/database';
import { getFechaLocalHoy } from '../lib/dateUtils';

export class EcocardioDB {
  private db!: sqlite3.Database;
  private dbPath: string;

  private constructor() {
    const userDataPath = app.getPath('userData');
    this.dbPath = path.join(userDataPath, 'ecocardio.db');
  }

  static async create(): Promise<EcocardioDB> {
    const instance = new EcocardioDB();
    await instance.initialize();
    return instance;
  }

  private async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          console.error('Error al abrir la base de datos:', err);
          reject(err);
        } else {
          console.log('Base de datos SQLite inicializada correctamente en:', this.dbPath);
          this.initializeTables()
            .then(() => resolve())
            .catch(reject);
        }
      });
    });
  }

  private async initializeTables(): Promise<void> {
    return new Promise((resolve, reject) => {
      const schema = `
        -- Tabla de pacientes
        CREATE TABLE IF NOT EXISTS pacientes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombres TEXT NOT NULL,
          edad INTEGER NOT NULL,
          sexo TEXT CHECK(sexo IN ('M', 'F')) NOT NULL,
          ci TEXT NOT NULL,
          fechaNacimiento TEXT NOT NULL,
          peso REAL NOT NULL,
          talla REAL NOT NULL,
          superficieCorporal REAL NOT NULL
        );

        -- Tabla de exámenes ecocardiográficos
        CREATE TABLE IF NOT EXISTS examenes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          pacienteId INTEGER NOT NULL,
          estado TEXT CHECK(estado IN ('pendiente', 'completado', 'cancelado')) DEFAULT 'pendiente',
          fecha TEXT NOT NULL,
          diagnostico TEXT,
          datos TEXT,
          
          FOREIGN KEY (pacienteId) REFERENCES pacientes(id) ON DELETE CASCADE
        );

        -- Índices para mejorar rendimiento
        CREATE INDEX IF NOT EXISTS idx_pacientes_nombres ON pacientes(nombres);
        CREATE INDEX IF NOT EXISTS idx_examenes_paciente ON examenes(pacienteId);
        CREATE INDEX IF NOT EXISTS idx_examenes_fecha ON examenes(fecha);
        CREATE INDEX IF NOT EXISTS idx_examenes_estado ON examenes(estado);
      `;

      this.db.exec(schema, (err) => {
        if (err) {
          console.error('Error al crear las tablas:', err);
          reject(err);
        } else {
          console.log('Tablas inicializadas correctamente');
          resolve();
        }
      });
    });
  }

  async close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  // CRUD Pacientes
  async savePaciente(paciente: Omit<Paciente, 'id'>): Promise<number> {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO pacientes (nombres, edad, sexo, ci, fechaNacimiento, peso, talla, superficieCorporal)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      this.db.run(sql, [
        paciente.nombres,
        paciente.edad,
        paciente.sexo,
        paciente.ci,
        paciente.fechaNacimiento,
        paciente.peso,
        paciente.talla,
        paciente.superficieCorporal
      ], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
    });
  }

  async updatePaciente(id: number, paciente: Partial<Omit<Paciente, 'id'>>): Promise<void> {
    return new Promise((resolve, reject) => {
      const sets: string[] = [];
      const params: any[] = [];
      
      if (paciente.nombres !== undefined) {
        sets.push('nombres = ?');
        params.push(paciente.nombres);
      }
      if (paciente.edad !== undefined) {
        sets.push('edad = ?');
        params.push(paciente.edad);
      }
      if (paciente.sexo !== undefined) {
        sets.push('sexo = ?');
        params.push(paciente.sexo);
      }
      if (paciente.ci !== undefined) {
        sets.push('ci = ?');
        params.push(paciente.ci);
      }
      if (paciente.fechaNacimiento !== undefined) {
        sets.push('fechaNacimiento = ?');
        params.push(paciente.fechaNacimiento);
      }
      if (paciente.peso !== undefined) {
        sets.push('peso = ?');
        params.push(paciente.peso);
      }
      if (paciente.talla !== undefined) {
        sets.push('talla = ?');
        params.push(paciente.talla);
      }
      if (paciente.superficieCorporal !== undefined) {
        sets.push('superficieCorporal = ?');
        params.push(paciente.superficieCorporal);
      }
      
      params.push(id);
      
      const sql = `UPDATE pacientes SET ${sets.join(', ')} WHERE id = ?`;
      
      this.db.run(sql, params, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async getPaciente(id: number): Promise<Paciente | null> {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM pacientes WHERE id = ?';
      
      this.db.get(sql, [id], (err, row: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(row || null);
        }
      });
    });
  }

  async getPacientes(filtros?: {
    nombres?: string;
    ci?: string;
    limite?: number;
    pagina?: number;
  }): Promise<Paciente[]> {
    return new Promise((resolve, reject) => {
      let sql = 'SELECT * FROM pacientes';
      const params: any[] = [];
      const whereConditions: string[] = [];
      
      if (filtros?.nombres) {
        whereConditions.push('nombres LIKE ?');
        params.push(`%${filtros.nombres}%`);
      }
      
      if (filtros?.ci) {
        whereConditions.push('ci = ?');
        params.push(filtros.ci);
      }
      
      if (whereConditions.length > 0) {
        sql += ' WHERE ' + whereConditions.join(' AND ');
      }
      
      sql += ' ORDER BY nombres ASC';
      
      if (filtros?.limite) {
        sql += ' LIMIT ?';
        params.push(filtros.limite);
        
        if (filtros.pagina) {
          sql += ' OFFSET ?';
          params.push((filtros.pagina - 1) * filtros.limite);
        }
      }
      
      this.db.all(sql, params, (err, rows: any[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows || []);
        }
      });
    });
  }

  async deletePaciente(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM pacientes WHERE id = ?';
      
      this.db.run(sql, [id], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  // CRUD Exámenes
  async saveExamen(examen: Omit<Examen, 'id'>): Promise<number> {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO examenes (pacienteId, estado, fecha, diagnostico, datos)
        VALUES (?, ?, ?, ?, ?)
      `;
      
      this.db.run(sql, [
        examen.pacienteId,
        examen.estado,
        examen.fecha,
        examen.diagnostico,
        JSON.stringify(examen.datos)
      ], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
    });
  }

  async updateExamen(id: number, examen: Partial<Omit<Examen, 'id'>>): Promise<void> {
    return new Promise((resolve, reject) => {
      const sets: string[] = [];
      const params: any[] = [];
      
      if (examen.pacienteId !== undefined) {
        sets.push('pacienteId = ?');
        params.push(examen.pacienteId);
      }
      if (examen.estado !== undefined) {
        sets.push('estado = ?');
        params.push(examen.estado);
      }
      if (examen.fecha !== undefined) {
        sets.push('fecha = ?');
        params.push(examen.fecha);
      }
      if (examen.diagnostico !== undefined) {
        sets.push('diagnostico = ?');
        params.push(examen.diagnostico);
      }
      if (examen.datos !== undefined) {
        sets.push('datos = ?');
        params.push(JSON.stringify(examen.datos));
      }
      
      params.push(id);
      
      const sql = `UPDATE examenes SET ${sets.join(', ')} WHERE id = ?`;
      
      this.db.run(sql, params, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async getExamen(id: number): Promise<Examen | null> {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM examenes WHERE id = ?';
      
      this.db.get(sql, [id], (err, row: any) => {
        if (err) {
          reject(err);
        } else if (row) {
          const examen = {
            ...row,
            datos: row.datos ? JSON.parse(row.datos) : null
          };
          resolve(examen);
        } else {
          resolve(null);
        }
      });
    });
  }

  async getExamenes(filtros?: {
    pacienteId?: number;
    estado?: string;
    fecha_desde?: string;
    fecha_hasta?: string;
    limite?: number;
    pagina?: number;
  }): Promise<Examen[]> {
    return new Promise((resolve, reject) => {
      let sql = 'SELECT * FROM examenes WHERE 1=1';
      const params: any[] = [];
      
      if (filtros?.pacienteId) {
        sql += ' AND pacienteId = ?';
        params.push(filtros.pacienteId);
      }
      if (filtros?.estado) {
        sql += ' AND estado = ?';
        params.push(filtros.estado);
      }
      if (filtros?.fecha_desde) {
        sql += ' AND fecha >= ?';
        params.push(filtros.fecha_desde);
      }
      if (filtros?.fecha_hasta) {
        sql += ' AND fecha <= ?';
        params.push(filtros.fecha_hasta);
      }
      
      sql += ' ORDER BY fecha DESC';
      
      if (filtros?.limite) {
        sql += ' LIMIT ?';
        params.push(filtros.limite);
        
        if (filtros?.pagina) {
          sql += ' OFFSET ?';
          params.push((filtros.pagina - 1) * filtros.limite);
        }
      }
      
      this.db.all(sql, params, (err, rows: any[]) => {
        if (err) {
          reject(err);
        } else {
          const examenes = rows.map(row => ({
            ...row,
            datos: row.datos ? JSON.parse(row.datos) : null
          }));
          resolve(examenes);
        }
      });
    });
  }

  async deleteExamen(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM examenes WHERE id = ?';
      
      this.db.run(sql, [id], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  // Estadísticas y reportes
  async getEstadisticasDashboard(): Promise<EstadisticasDashboard> {
    return new Promise((resolve, reject) => {
      const hoy = getFechaLocalHoy();
      
      const sql = `
        SELECT 
          COUNT(CASE WHEN DATE(fecha) = ? THEN 1 END) as examenesHoy,
          COUNT(CASE WHEN estado = 'pendiente' THEN 1 END) as examenesPendientes,
          COUNT(CASE WHEN estado = 'completado' THEN 1 END) as examenesCompletados,
          COUNT(DISTINCT pacienteId) as pacientesAtendidos
        FROM examenes
      `;
      
      this.db.get(sql, [hoy], (err, row: any) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            examenesHoy: row.examenesHoy || 0,
            examenesPendientes: row.examenesPendientes || 0,
            examenesCompletados: row.examenesCompletados || 0,
            pacientesAtendidos: row.pacientesAtendidos || 0
          });
        }
      });
    });
  }

  async getExamenesPorEstado(): Promise<{ estado: string; cantidad: number }[]> {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT estado, COUNT(*) as cantidad
        FROM examenes
        GROUP BY estado
        ORDER BY cantidad DESC
      `;
      
      this.db.all(sql, [], (err, rows: any[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows || []);
        }
      });
    });
  }

  async getExamenesByEstado(estado: string): Promise<Examen[]> {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          e.*,
          p.nombres as paciente_nombres,
          p.ci as paciente_ci,
          p.edad as paciente_edad,
          p.sexo as paciente_sexo,
          p.fechaNacimiento as paciente_fechaNacimiento,
          p.peso as paciente_peso,
          p.talla as paciente_talla,
          p.superficieCorporal as paciente_superficieCorporal
        FROM examenes e
        LEFT JOIN pacientes p ON e.pacienteId = p.id
        WHERE e.estado = ?
        ORDER BY e.fecha DESC
      `;
      
      this.db.all(sql, [estado], (err, rows: any[]) => {
        if (err) {
          reject(err);
        } else {
          const examenes = rows.map(row => ({
            id: row.id,
            pacienteId: row.pacienteId,
            fecha: row.fecha,
            estado: row.estado,
            diagnostico: row.diagnostico,
            datos: row.datos ? JSON.parse(row.datos) : null,
            paciente: {
              id: row.pacienteId,
              nombres: row.paciente_nombres,
              ci: row.paciente_ci,
              edad: row.paciente_edad,
              sexo: row.paciente_sexo,
              fechaNacimiento: row.paciente_fechaNacimiento,
              peso: row.paciente_peso,
              talla: row.paciente_talla,
              superficieCorporal: row.paciente_superficieCorporal
            }
          }));
          resolve(examenes);
        }
      });
    });
  }

  async getExamenesPorMes(meses: number = 12): Promise<ResumenMensual[]> {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          CAST(strftime('%m', fecha) as INTEGER) as mes,
          COUNT(*) as total
        FROM examenes
        WHERE date(fecha) >= date('now', '-${meses} months')
        GROUP BY strftime('%Y-%m', fecha)
        ORDER BY fecha DESC
      `;
      
      this.db.all(sql, [], (err, rows: any[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows || []);
        }
      });
    });
  }

  async getExamenesHoy(): Promise<Examen[]> {
    return new Promise((resolve, reject) => {
      const hoy = getFechaLocalHoy();
      
      const sql = `
        SELECT 
          e.*,
          p.nombres as paciente_nombres,
          p.ci as paciente_ci,
          p.edad as paciente_edad,
          p.sexo as paciente_sexo,
          p.fechaNacimiento as paciente_fechaNacimiento,
          p.peso as paciente_peso,
          p.talla as paciente_talla,
          p.superficieCorporal as paciente_superficieCorporal
        FROM examenes e
        LEFT JOIN pacientes p ON e.pacienteId = p.id
        WHERE DATE(e.fecha) = ?
        ORDER BY e.fecha ASC
      `;
      
      this.db.all(sql, [hoy], (err, rows: any[]) => {
        if (err) {
          reject(err);
        } else {
          const examenes = rows.map(row => ({
            id: row.id,
            pacienteId: row.pacienteId,
            fecha: row.fecha,
            estado: row.estado,
            diagnostico: row.diagnostico,
            datos: row.datos ? JSON.parse(row.datos) : null,
            paciente: {
              id: row.pacienteId,
              nombres: row.paciente_nombres,
              ci: row.paciente_ci,
              edad: row.paciente_edad,
              sexo: row.paciente_sexo,
              fechaNacimiento: row.paciente_fechaNacimiento,
              peso: row.paciente_peso,
              talla: row.paciente_talla,
              superficieCorporal: row.paciente_superficieCorporal
            }
          }));
          resolve(examenes);
        }
      });
    });
  }
}
