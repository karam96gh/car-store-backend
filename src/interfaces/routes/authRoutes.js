/**
 * مسارات المصادقة
 * مسارات API الخاصة بتسجيل الدخول وتسجيل المستخدمين
 */
const express = require('express');
const { authenticateJWT } = require('../middlewares/authMiddleware');

/**
 * إعداد مسارات المصادقة
 * @param {Object} authController - متحكم المصادقة
 * @returns {Object} - جسر المسارات
 */
const setupAuthRoutes = (authController) => {
  const router = express.Router();

  /**
   * تسجيل مستخدم جديد
   * @route POST /api/auth/register
   * @group المصادقة - عمليات المصادقة
   * @param {Object} userData - بيانات المستخدم
   * @returns {Object} - المستخدم المنشأ مع التوكن
   */
  router.post('/register', authController.register.bind(authController));

  /**
   * تسجيل الدخول
   * @route POST /api/auth/login
   * @group المصادقة - عمليات المصادقة
   * @param {Object} credentials - بيانات الدخول
   * @returns {Object} - المستخدم مع التوكن
   */
  router.post('/login', authController.login.bind(authController));

  /**
   * الحصول على المستخدم الحالي
   * @route GET /api/auth/me
   * @group المصادقة - عمليات المصادقة
   * @returns {Object} - المستخدم الحالي
   */
  router.get('/me', authenticateJWT, authController.getCurrentUser.bind(authController));

  /**
   * تغيير كلمة المرور
   * @route POST /api/auth/change-password
   * @group المصادقة - عمليات المصادقة
   * @param {Object} passwords - كلمات المرور
   * @returns {Object} - رسالة التأكيد
   */
  router.post('/change-password', authenticateJWT, authController.changePassword.bind(authController));

  /**
   * تحديث بيانات المستخدم
   * @route PUT /api/auth/profile
   * @group المصادقة - عمليات المصادقة
   * @param {Object} userData - بيانات المستخدم
   * @returns {Object} - المستخدم المحدث
   */
  router.put('/profile', authenticateJWT, authController.updateProfile.bind(authController));

  return router;
};

module.exports = setupAuthRoutes;