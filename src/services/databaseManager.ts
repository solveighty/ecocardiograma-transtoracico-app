import { EcocardioDB } from './database';

class DatabaseManager {
  private static instance: EcocardioDB | null = null;
  private static initPromise: Promise<EcocardioDB> | null = null;

  static async getInstance(): Promise<EcocardioDB> {
    if (DatabaseManager.instance) {
      return DatabaseManager.instance;
    }

    if (DatabaseManager.initPromise) {
      return DatabaseManager.initPromise;
    }

    DatabaseManager.initPromise = EcocardioDB.create().then(db => {
      DatabaseManager.instance = db;
      return db;
    });

    return DatabaseManager.initPromise;
  }

  static async closeInstance(): Promise<void> {
    if (DatabaseManager.instance) {
      await DatabaseManager.instance.close();
      DatabaseManager.instance = null;
      DatabaseManager.initPromise = null;
    }
  }
}

export default DatabaseManager;
