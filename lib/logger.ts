class ErrorLogger {
  private static instance: ErrorLogger;
  private isDevelopment = __DEV__;

  static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }

  log(message: string, context?: any): void {
    if (this.isDevelopment) {
      console.log(message, context);
    }
    // In production, could send to analytics service
  }

  error(message: string, error?: any): void {
    if (this.isDevelopment) {
      console.error(message, error);
    }
    // In production, could send to error tracking service like Sentry
  }

  warn(message: string, context?: any): void {
    if (this.isDevelopment) {
      console.warn(message, context);
    }
    // In production, could send to monitoring service
  }

  debug(message: string, context?: any): void {
    if (this.isDevelopment) {
      console.debug(message, context);
    }
  }
}

export const logger = ErrorLogger.getInstance();