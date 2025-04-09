/**
 * ملف إعدادات التطبيق
 * يقوم بتحميل متغيرات البيئة والإعدادات العامة
 */
const dotenv = require('dotenv');
const path = require('path');

/**
 * تحميل ملف البيئة والإعدادات
 */
const setupConfig = () => {
  // تحميل ملف البيئة
  dotenv.config();

  // التحقق من وجود متغيرات البيئة الأساسية
  const requiredEnvVars = [
    'DATABASE_URL',
    'JWT_SECRET'
  ];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      console.error(`Error: Environment variable ${envVar} is required but not set.`);
      process.exit(1);
    }
  }

  // إعداد مسارات التطبيق
  process.env.UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';
  process.env.UPLOAD_PATH = path.join(__dirname, '../../../', process.env.UPLOAD_DIR);
  
  // إعداد حجم الملف الأقصى للتحميل
  process.env.MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024; // 5MB افتراضيًا
};

/**
 * الحصول على إعدادات التطبيق
 */
const getConfig = () => {
  return {
    database: {
      url: process.env.DATABASE_URL
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN || '30d'
    },
    server: {
      port: parseInt(process.env.PORT) || 4000,
      env: process.env.NODE_ENV || 'development'
    },
    upload: {
      dir: process.env.UPLOAD_DIR,
      path: process.env.UPLOAD_PATH,
      maxSize: parseInt(process.env.MAX_FILE_SIZE)
    }
  };
};

module.exports = {
  setupConfig,
  getConfig
};