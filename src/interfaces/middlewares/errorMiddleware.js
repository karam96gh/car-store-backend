/**
 * ميدلوير معالجة الأخطاء
 * للتعامل مع الأخطاء في التطبيق
 * @param {Error} err - كائن الخطأ
 * @param {Object} req - كائن الطلب
 * @param {Object} res - كائن الاستجابة
 * @param {Function} next - دالة التالي
 */
const errorMiddleware = (err, req, res, next) => {
    // طباعة الخطأ في وضع التطوير
    if (process.env.NODE_ENV === 'development') {
      console.error(err);
    }
  
    // الرسالة الافتراضية
    let message = 'حدث خطأ في الخادم';
    let statusCode = 500;
  
    // أخطاء التحقق من صحة البيانات
    if (err.name === 'ValidationError') {
      statusCode = 400;
      message = err.message;
    }
  
    // أخطاء Prisma
    if (err.name === 'PrismaClientKnownRequestError') {
      statusCode = 400;
      
      // خطأ في المفتاح الفريد
      if (err.code === 'P2002') {
        message = 'البيانات المدخلة موجودة بالفعل';
      }
      // خطأ في العلاقات
      else if (err.code === 'P2003') {
        message = 'العنصر المرتبط غير موجود';
      }
      // خطأ في العنصر المطلوب
      else if (err.code === 'P2025') {
        message = 'العنصر غير موجود';
      }
      // أخطاء أخرى
      else {
        message = 'خطأ في قاعدة البيانات';
      }
    }
  
    // أخطاء JWT
    if (err.name === 'JsonWebTokenError') {
      statusCode = 401;
      message = 'توكن غير صالح';
    }
  
    // انتهاء صلاحية JWT
    if (err.name === 'TokenExpiredError') {
      statusCode = 401;
      message = 'انتهت صلاحية التوكن';
    }
  
    // أخطاء Multer
    if (err.name === 'MulterError') {
      statusCode = 400;
      
      if (err.code === 'LIMIT_FILE_SIZE') {
        message = 'حجم الملف كبير جدًا';
      } else {
        message = 'خطأ في تحميل الملف';
      }
    }
  
    // أخطاء مخصصة
    if (err.statusCode) {
      statusCode = err.statusCode;
    }
  
    // استخدام رسالة الخطأ إذا كانت موجودة
    if (err.message) {
      message = err.message;
    }
  
    // الرد بالخطأ
    res.status(statusCode).json({
      success: false,
      message,
      // إضافة التفاصيل في وضع التطوير فقط
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  };
  
  module.exports = errorMiddleware;