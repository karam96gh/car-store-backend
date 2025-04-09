/**
 * متحكم المصادقة
 * مسؤول عن معالجة طلبات المصادقة وإدارة الجلسات
 */
class AuthController {
    constructor(userUseCases) {
      this.userUseCases = userUseCases;
    }
  
    /**
     * تسجيل مستخدم جديد
     * @param {Object} req - كائن الطلب
     * @param {Object} res - كائن الاستجابة
     * @param {Function} next - دالة التالي
     */
    async register(req, res, next) {
      try {
        console.log('hiii');
        
        const { name, email, phone, password } = req.body;
  
        // التحقق من البيانات المطلوبة
        if (!name || !email || !password) {
          return res.status(400).json({
            success: false,
            message: 'الرجاء توفير جميع البيانات المطلوبة'
          });
        }
  
        // تسجيل المستخدم
        const result = await this.userUseCases.registerUser({
          name,
          email,
          phone,
          password
        });
  
        res.status(201).json({
          success: true,
          message: 'تم إنشاء الحساب بنجاح',
          data: {
            user: result.user,
            token: result.token
          }
        });
      } catch (error) {
        next(error);
      }
    }
  
    /**
     * تسجيل الدخول
     * @param {Object} req - كائن الطلب
     * @param {Object} res - كائن الاستجابة
     * @param {Function} next - دالة التالي
     */
    async login(req, res, next) {
      try {
        const { email, password } = req.body;
  
        // التحقق من البيانات المطلوبة
        if (!email || !password) {
          return res.status(400).json({
            success: false,
            message: 'الرجاء توفير البريد الإلكتروني وكلمة المرور'
          });
        }
  
        // تسجيل الدخول
        const result = await this.userUseCases.loginUser(email, password);
  
        res.status(200).json({
          success: true,
          message: 'تم تسجيل الدخول بنجاح',
          data: {
            user: result.user,
            token: result.token
          }
        });
      } catch (error) {
        if (error.message === 'بيانات الدخول غير صحيحة' || 
            error.message === 'هذا الحساب محظور') {
          return res.status(401).json({
            success: false,
            message: error.message
          });
        }
        next(error);
      }
    }
  
    /**
     * الحصول على المستخدم الحالي
     * @param {Object} req - كائن الطلب
     * @param {Object} res - كائن الاستجابة
     * @param {Function} next - دالة التالي
     */
    async getCurrentUser(req, res, next) {
      try {
        const userId = req.user.id;
  
        // الحصول على بيانات المستخدم
        const user = await this.userUseCases.getUserById(userId);
  
        res.status(200).json({
          success: true,
          data: { user }
        });
      } catch (error) {
        next(error);
      }
    }
  
    /**
     * تغيير كلمة المرور
     * @param {Object} req - كائن الطلب
     * @param {Object} res - كائن الاستجابة
     * @param {Function} next - دالة التالي
     */
    async changePassword(req, res, next) {
      try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;
  
        // التحقق من البيانات المطلوبة
        if (!currentPassword || !newPassword) {
          return res.status(400).json({
            success: false,
            message: 'الرجاء توفير كلمة المرور الحالية والجديدة'
          });
        }
  
        // تغيير كلمة المرور
        await this.userUseCases.changePassword(userId, currentPassword, newPassword);
  
        res.status(200).json({
          success: true,
          message: 'تم تغيير كلمة المرور بنجاح'
        });
      } catch (error) {
        if (error.message === 'كلمة المرور الحالية غير صحيحة') {
          return res.status(400).json({
            success: false,
            message: error.message
          });
        }
        next(error);
      }
    }
  
    /**
     * تحديث بيانات المستخدم
     * @param {Object} req - كائن الطلب
     * @param {Object} res - كائن الاستجابة
     * @param {Function} next - دالة التالي
     */
    async updateProfile(req, res, next) {
      try {
        const userId = req.user.id;
        const { name, phone } = req.body;
  
        // تحديث البيانات
        const updatedUser = await this.userUseCases.updateUser(userId, {
          name,
          phone
        });
  
        res.status(200).json({
          success: true,
          message: 'تم تحديث الملف الشخصي بنجاح',
          data: { user: updatedUser }
        });
      } catch (error) {
        next(error);
      }
    }
  }
  
  module.exports = AuthController;