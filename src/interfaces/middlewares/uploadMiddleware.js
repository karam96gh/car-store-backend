/**
 * ميدلوير تحميل الملفات
 * باستخدام multer لمعالجة تحميل الملفات
 */
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { getConfig } = require('../../infrastructure/config/config');

/**
 * إعداد تخزين الملفات
 * @param {string} subDirectory - المجلد الفرعي للتخزين
 * @returns {Object} - إعدادات التخزين
 */
const configStorage = (subDirectory = '') => {
  const config = getConfig();
  
  // إنشاء مسار التخزين
  const uploadPath = path.join(config.upload.path, subDirectory);
  
  // التأكد من وجود المجلد
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
  
  // إعداد تخزين الملفات
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      // إنشاء اسم فريد للملف
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, uniqueSuffix + ext);
    }
  });
};

/**
 * فلتر أنواع الملفات
 * @param {Array} allowedTypes - أنواع الملفات المسموح بها
 * @returns {Function} - دالة الفلتر
 */
const fileFilter = (allowedTypes = ['image/jpeg', 'image/png','image/jpg', 'image/webp']) => {
  return (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('نوع الملف غير مدعوم'), false);
    }
  };
};

/**
 * إعداد تحميل الملفات للصور
 * @param {string} subDirectory - المجلد الفرعي للتخزين
 * @returns {Object} - ميدلوير multer
 */
const uploadImage = (subDirectory = 'images') => {
  const config = getConfig();
  
  return multer({
    storage: configStorage(subDirectory),
    limits: {
      fileSize: config.upload.maxSize
    },
    fileFilter: fileFilter(['image/jpeg', 'image/png','image/jpg', 'image/webp'])
  });
};

/**
 * إعداد تحميل ملفات متعددة للصور
 * @param {string} subDirectory - المجلد الفرعي للتخزين
 * @param {number} maxCount - الحد الأقصى لعدد الملفات
 * @returns {Object} - ميدلوير multer
 */
const uploadMultipleImages = (subDirectory = 'images', maxCount = 5) => {
  const config = getConfig();
  
  return multer({
    storage: configStorage(subDirectory),
    limits: {
      fileSize: config.upload.maxSize
    },
    fileFilter: fileFilter(['image/jpeg', 'image/png', 'image/jpg','image/webp'])
  }).array('images', maxCount);
};

/**
 * ميدلوير لمعالجة أخطاء تحميل الملفات
 * @param {Object} req - كائن الطلب
 * @param {Object} res - كائن الاستجابة
 * @param {Function} next - دالة التالي
 */
const handleUploadErrors = (req, res, next) => {
  return (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'حجم الملف كبير جدًا'
        });
      }
      
      return res.status(400).json({
        success: false,
        message: err.message || 'حدث خطأ أثناء تحميل الملف'
      });
    }
    
    next();
  };
};

module.exports = {
  uploadImage,
  uploadMultipleImages,
  handleUploadErrors
};