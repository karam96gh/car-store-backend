/**
 * خدمة تخزين الملفات
 * تستخدم للتعامل مع تخزين الملفات والصور
 */
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { getConfig } = require('../config/config');

// تحويل دوال fs إلى وعود Promise
const mkdir = promisify(fs.mkdir);
const unlink = promisify(fs.unlink);
const exists = promisify(fs.exists);

class FileStorageService {
  constructor() {
    this.config = getConfig();
  }

  /**
   * رفع ملف
   * @param {Object} file - ملف للتحميل
   * @param {string} subDirectory - المجلد الفرعي للتخزين
   * @returns {Promise<Object>} - معلومات الملف المرفوع
   */
  async uploadFile(file, subDirectory = '') {
    try {
      // التحقق من صحة الملف
      if (!file) {
        throw new Error('لم يتم توفير ملف للتحميل');
      }
  
      console.log('معالجة ملف للتحميل:', {
        originalname: file.originalname,
        path: file.path,
        size: file.size,
        mimetype: file.mimetype
      });
  
      // إنشاء مسار الملف
      const uploadPath = path.join(this.config.upload.path, subDirectory);
      await this._ensureDirectoryExists(uploadPath);
  
      // إنشاء اسم ملف فريد
      const timestamp = Date.now();
      const extension = path.extname(file.originalname);
      const fileName = `${timestamp}_${this._sanitizeFileName(path.basename(file.originalname, extension))}${extension}`;
      const filePath = path.join(uploadPath, fileName);
  
      // إذا كان الملف قد تم حفظه بالفعل بواسطة multer، فلا نحتاج إلى نسخه مرة أخرى
      // بدلاً من ذلك، نقوم بإنشاء رابط للملف فقط
      if (file.path && file.path.includes(this.config.upload.dir)) {
        console.log('الملف تم تحميله بالفعل بواسطة multer في:', file.path);
        
        // استخراج المسار النسبي من المسار المطلق
        let relativePath = file.path.split(this.config.upload.path)[1];
        if (relativePath.startsWith('/') || relativePath.startsWith('\\')) {
            relativePath = relativePath.substring(1);
        }
        
        // بناء URL الملف
        const fileUrl = `/${this.config.upload.dir}/${relativePath.replace(/\\/g, '/')}`;
        
        console.log('استخدام المسار الحالي للملف:', fileUrl);
        
        return {
            url: fileUrl,
            fileName: path.basename(file.path),
            originalName: file.originalname,
            size: file.size,
            mimetype: file.mimetype
        };
    }
      console.log('نسخ الملف من:', file.path, 'إلى:', filePath);
      
      // حفظ الملف - اعتماداً على نوع الملف المقدم
      if (file.buffer) {
        await fs.promises.writeFile(filePath, file.buffer);
      } else if (file.path) {
        await fs.promises.copyFile(file.path, filePath);
      } else {
        throw new Error('صيغة الملف غير مدعومة');
      }
  
      // إعداد URL الملف النسبي
      const fileUrl = path.join(
        '/',
        this.config.upload.dir,
        subDirectory,
        fileName
      ).replace(/\\/g, '/');
  
      return {
        url: fileUrl,
        fileName,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype
      };
    } catch (error) {
      console.error('خطأ في تحميل الملف:', error);
      throw new Error(`فشل تحميل الملف: ${error.message}`);
    }
  }

  /**
   * حذف ملف
   * @param {string} fileUrl - رابط الملف
   * @returns {Promise<boolean>} - هل تم الحذف بنجاح
   */
  async deleteFile(fileUrl) {
    try {
      // طباعة للتصحيح
      console.log(`محاولة حذف الملف: ${fileUrl}`);
      
      // تحويل URL إلى مسار الملف
      const uploadDirName = `/${this.config.upload.dir}/`;
      let filePath;

      if (fileUrl.startsWith(uploadDirName)) {
        const relativePath = fileUrl.substring(uploadDirName.length);
        filePath = path.join(this.config.upload.path, '..', relativePath);
      } else {
        filePath = path.join(this.config.upload.path, path.basename(fileUrl));
      }
      
      console.log(`المسار المستخرج للملف: ${filePath}`);

      // التحقق من وجود الملف
      const fileExists = await exists(filePath);
      
      if (!fileExists) {
        console.warn(`الملف غير موجود: ${filePath}`);
        return true; // اعتبر أن الحذف تم بنجاح
      }

      // حذف الملف
      console.log(`جاري حذف الملف الموجود: ${filePath}`);
      await unlink(filePath);
      console.log(`تم حذف الملف بنجاح: ${filePath}`);
      return true;
    } catch (error) {
      console.error(`خطأ في حذف الملف: ${error.message}`);
      throw new Error(`فشل حذف الملف: ${error.message}`);
    }
  }

  /**
   * التأكد من وجود المجلد
   * @private
   * @param {string} directory - مسار المجلد
   * @returns {Promise<void>}
   */
  async _ensureDirectoryExists(directory) {
    try {
      await mkdir(directory, { recursive: true });
    } catch (error) {
      if (error.code !== 'EEXIST') {
        throw error;
      }
    }
  }

  /**
   * تنظيف اسم الملف
   * @private
   * @param {string} fileName - اسم الملف
   * @returns {string} - اسم الملف المنظف
   */
  _sanitizeFileName(fileName) {
    // إزالة الأحرف غير الآمنة من اسم الملف
    return fileName
      .replace(/[^\w\s.\-]/g, '')
      .replace(/\s+/g, '_')
      .toLowerCase();
  }
}

module.exports = FileStorageService;