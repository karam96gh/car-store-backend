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

      // إنشاء مسار الملف
      const uploadPath = path.join(this.config.upload.path, subDirectory);

      // إنشاء المجلد إذا لم يكن موجودًا
      await this._ensureDirectoryExists(uploadPath);

      // إنشاء اسم ملف فريد
      const timestamp = Date.now();
      const extension = path.extname(file.originalname);
      const fileName = `${timestamp}_${this._sanitizeFileName(path.basename(file.originalname, extension))}${extension}`;
      
      // مسار الملف الكامل
      const filePath = path.join(uploadPath, fileName);
      
      // حفظ الملف
      if (file.buffer) {
        // إذا كان الملف هو كائن Buffer من Multer
        await fs.promises.writeFile(filePath, file.buffer);
      } else if (file.path) {
        // إذا كان الملف مرفوعًا مسبقًا
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
      // تحويل URL إلى مسار الملف
      const uploadDirName = `/${this.config.upload.dir}/`;
      let filePath;

      if (fileUrl.startsWith(uploadDirName)) {
        const relativePath = fileUrl.substring(uploadDirName.length);
        filePath = path.join(this.config.upload.path, '..', relativePath);
      } else {
        filePath = path.join(this.config.upload.path, path.basename(fileUrl));
      }

      // التحقق من وجود الملف
      const fileExists = await exists(filePath);
      
      if (!fileExists) {
        console.warn(`الملف غير موجود: ${filePath}`);
        return true; // اعتبر أن الحذف تم بنجاح
      }

      // حذف الملف
      await unlink(filePath);
      return true;
    } catch (error) {
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