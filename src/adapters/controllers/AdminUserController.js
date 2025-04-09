/**
 * متحكم المستخدمين للإدارة
 * مسؤول عن معالجة طلبات إدارة المستخدمين
 */
class AdminUserController {
    constructor(userUseCases) {
      this.userUseCases = userUseCases;
    }
  
    /**
     * الحصول على قائمة المستخدمين
     * @param {Object} req - كائن الطلب
     * @param {Object} res - كائن الاستجابة
     * @param {Function} next - دالة التالي
     */
    async getUsers(req, res, next) {
      try {
        const { page = 1, limit = 10, role, isActive, search } = req.query;
  
        // إعداد مرشحات البحث
        const filters = {};
        
        if (role) filters.role = role;
        if (isActive !== undefined) filters.isActive = isActive === 'true';
        if (search) filters.search = search;
  
        // خيارات التصفح
        const pagination = {
          page: parseInt(page),
          limit: parseInt(limit)
        };
  
        // الحصول على قائمة المستخدمين
        const result = await this.userUseCases.getUsers(filters, pagination);
  
        res.status(200).json({
          success: true,
          data: result.data,
          pagination: result.pagination
        });
      } catch (error) {
        next(error);
      }
    }
  
    /**
     * الحصول على مستخدم بواسطة المعرف
     * @param {Object} req - كائن الطلب
     * @param {Object} res - كائن الاستجابة
     * @param {Function} next - دالة التالي
     */
    async getUserById(req, res, next) {
      try {
        const { id } = req.params;
        
        // الحصول على المستخدم
        const user = await this.userUseCases.getUserById(id);
  
        res.status(200).json({
          success: true,
          data: user
        });
      } catch (error) {
        if (error.message === 'المستخدم غير موجود') {
          return res.status(404).json({
            success: false,
            message: error.message
          });
        }
        next(error);
      }
    }
  
    /**
     * تعليق/إلغاء تعليق حساب مستخدم
     * @param {Object} req - كائن الطلب
     * @param {Object} res - كائن الاستجابة
     * @param {Function} next - دالة التالي
     */
    async toggleUserStatus(req, res, next) {
      try {
        const { id } = req.params;
        const { isActive } = req.body;
        
        // التحقق من البيانات المطلوبة
        if (isActive === undefined) {
          return res.status(400).json({
            success: false,
            message: 'الرجاء تحديد حالة النشاط'
          });
        }
        
        // تغيير حالة النشاط
        const user = await this.userUseCases.toggleUserStatus(id, isActive);
  
        const message = isActive
          ? 'تم إلغاء تعليق حساب المستخدم بنجاح'
          : 'تم تعليق حساب المستخدم بنجاح';
  
        res.status(200).json({
          success: true,
          message,
          data: user
        });
      } catch (error) {
        if (error.message === 'المستخدم غير موجود' || 
            error.message === 'لا يمكن تعليق حساب مشرف') {
          return res.status(400).json({
            success: false,
            message: error.message
          });
        }
        next(error);
      }
    }
  
    /**
     * حذف مستخدم
     * @param {Object} req - كائن الطلب
     * @param {Object} res - كائن الاستجابة
     * @param {Function} next - دالة التالي
     */
    async deleteUser(req, res, next) {
      try {
        const { id } = req.params;
        
        // التحقق من محاولة حذف المستخدم الحالي
        if (parseInt(id) === req.user.id) {
          return res.status(400).json({
            success: false,
            message: 'لا يمكنك حذف حسابك الحالي'
          });
        }
        
        // الحصول على المستخدم للتحقق من دوره
        const user = await this.userUseCases.getUserById(id);
        
        // التحقق من حذف مشرف آخر
        if (user.role === 'ADMIN' && req.user.id !== parseInt(id)) {
          return res.status(403).json({
            success: false,
            message: 'لا يمكنك حذف حساب مشرف آخر'
          });
        }
        
        // حذف المستخدم
        await this.userUseCases.deleteUser(id);
  
        res.status(200).json({
          success: true,
          message: 'تم حذف المستخدم بنجاح'
        });
      } catch (error) {
        if (error.message === 'المستخدم غير موجود') {
          return res.status(404).json({
            success: false,
            message: error.message
          });
        }
        next(error);
      }
    }
  }
  
  module.exports = AdminUserController;