/**
 * نقطة الدخول الرئيسية لتطبيق متجر السيارات
 */
require('dotenv').config({ path: './.env' });

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const { setupConfig } = require('./infrastructure/config/config');

// تحميل متغيرات البيئة
setupConfig();

// استيراد المسارات
const setupRoutes = require('./interfaces/routes');

// استيراد الميدلويرات
const errorMiddleware = require('./interfaces/middlewares/errorMiddleware');

// إنشاء تطبيق Express
const app = express();
const PORT = process.env.PORT || 3000;

// إعداد الميدلويرات الأساسية
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// إعداد مجلد الملفات الثابتة
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// إعداد المسارات
setupRoutes(app);

// إعداد ميدلوير معالجة الأخطاء
app.use(errorMiddleware);
// قم بإضافة هذا الكود في بداية ملف index.js للتأكد من المسارات الصحيحة

console.log('=== معلومات تشغيل التطبيق ===');
console.log('المسار الحالي للعمل:', process.cwd());
console.log('مسار المجلد الحالي للسكريبت:', __dirname);
console.log('مسار الملف الحالي:', __filename);
console.log('--- متغيرات البيئة ---');
console.log('DATABASE_URL:', process.env.DATABASE_URL || 'غير محدد');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '[محدد]' : 'غير محدد');
console.log('NODE_ENV:', process.env.NODE_ENV || 'غير محدد');
console.log('PORT:', process.env.PORT || 'غير محدد');
console.log('UPLOAD_DIR:', process.env.UPLOAD_DIR || 'غير محدد');
console.log('============================');
// تشغيل الخادم
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

// التعامل مع الـ Unhandled Exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// التعامل مع الـ Unhandled Promise Rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

module.exports = app;