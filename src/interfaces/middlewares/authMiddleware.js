/**
 * ميدلوير المصادقة
 * للتحقق من توكن المستخدم والصلاحيات
 */
const jwt = require('jsonwebtoken');
const { getConfig } = require('../../infrastructure/config/config');

/**
 * التحقق من توكن المستخدم
 * @param {Object} req - كائن الطلب
 * @param {Object} res - كائن الاستجابة
 * @param {Function} next - دالة التالي
 */
const authenticateJWT = (req, res, next) => {
  try {
    // الحصول على رأس التخويل
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'غير مصرح، يرجى تسجيل الدخول'
      });
    }
    
    // استخراج التوكن
    const token = authHeader.split(' ')[1];
    
    // التحقق من التوكن
    const config = getConfig();
    const decoded = jwt.verify(token, config.jwt.secret);
    
    // إضافة بيانات المستخدم إلى الطلب
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };
    
    next();
  } catch (error) {
    // في حالة انتهاء صلاحية التوكن أو عدم صحته
    return res.status(401).json({
      success: false,
      message: 'غير مصرح، يرجى تسجيل الدخول مرة أخرى'
    });
  }
};

/**
 * التحقق من صلاحيات المشرف
 * @param {Object} req - كائن الطلب
 * @param {Object} res - كائن الاستجابة
 * @param {Function} next - دالة التالي
 */
const isAdmin = (req, res, next) => {
  // التحقق من وجود بيانات المستخدم
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'غير مصرح، يرجى تسجيل الدخول'
    });
  }
  
  // التحقق من صلاحيات المشرف
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'غير مسموح، هذه الصلاحية للمشرفين فقط'
    });
  }
  
  next();
};

/**
 * ميدلوير اختياري للتحقق من المستخدم
 * يستمر في حالة عدم وجود توكن أو عدم صحته
 * @param {Object} req - كائن الطلب
 * @param {Object} res - كائن الاستجابة
 * @param {Function} next - دالة التالي
 */
const optionalAuthenticateJWT = (req, res, next) => {
  try {
    // الحصول على رأس التخويل
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // استمر بدون معلومات المستخدم
      return next();
    }
    
    // استخراج التوكن
    const token = authHeader.split(' ')[1];
    
    // التحقق من التوكن
    const config = getConfig();
    const decoded = jwt.verify(token, config.jwt.secret);
    
    // إضافة بيانات المستخدم إلى الطلب
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };
  } catch (error) {
    // استمر بدون معلومات المستخدم في حالة حدوث خطأ
  }
  
  next();
};

module.exports = {
  authenticateJWT,
  isAdmin,
  optionalAuthenticateJWT
};