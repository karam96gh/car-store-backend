/**
 * مسارات الإدارة
 * مسارات API الخاصة بلوحة تحكم الإدارة
 */
const express = require('express');
const { uploadImage } = require('../middlewares/uploadMiddleware');

/**
 * إعداد مسارات الإدارة
 * @param {Object} adminCarController - متحكم السيارات للإدارة
 * @param {Object} adminUserController - متحكم المستخدمين للإدارة
 * @param {Object} staticContentController - متحكم المحتوى الثابت
 * @param {Object} statisticsController - متحكم الإحصاءات
 * @returns {Object} - جسر المسارات
 */
const setupAdminRoutes = (
  adminCarController,
  adminUserController,
  staticContentController,
  statisticsController
) => {
  const router = express.Router();

  // ==================== إدارة السيارات ====================

  /**
   * إنشاء سيارة جديدة
   * @route POST /api/admin/cars
   * @group الإدارة - عمليات لوحة التحكم
   * @returns {Object} - السيارة المنشأة
   */
  router.post('/cars', adminCarController.createCar.bind(adminCarController));

  /**
   * تحديث سيارة
   * @route PUT /api/admin/cars/:id
   * @group الإدارة - عمليات لوحة التحكم
   * @returns {Object} - السيارة المحدثة
   */
  router.put('/cars/:id', adminCarController.updateCar.bind(adminCarController));

  /**
   * حذف سيارة
   * @route DELETE /api/admin/cars/:id
   * @group الإدارة - عمليات لوحة التحكم
   * @returns {Object} - رسالة التأكيد
   */
  router.delete('/cars/:id', adminCarController.deleteCar.bind(adminCarController));

  /**
   * إضافة صورة للسيارة
   * @route POST /api/admin/cars/:id/images
   * @group الإدارة - عمليات لوحة التحكم
   * @returns {Object} - الصورة المضافة
   */
  router.post('/cars/:id/images', 
    uploadImage('car-images').single('image'), 
    adminCarController.addCarImage.bind(adminCarController)
  );

  /**
   * حذف صورة من السيارة
   * @route DELETE /api/admin/cars/images/:imageId
   * @group الإدارة - عمليات لوحة التحكم
   * @returns {Object} - رسالة التأكيد
   */
  router.delete('/cars/images/:imageId', adminCarController.deleteCarImage.bind(adminCarController));

  /**
   * إضافة مواصفة للسيارة
   * @route POST /api/admin/cars/:id/specifications
   * @group الإدارة - عمليات لوحة التحكم
   * @returns {Object} - المواصفة المضافة
   */
  router.post('/cars/:id/specifications', adminCarController.addCarSpecification.bind(adminCarController));

  /**
   * حذف مواصفة من السيارة
   * @route DELETE /api/admin/cars/specifications/:specId
   * @group الإدارة - عمليات لوحة التحكم
   * @returns {Object} - رسالة التأكيد
   */
  router.delete('/cars/specifications/:specId', adminCarController.deleteCarSpecification.bind(adminCarController));

  // ==================== إدارة المستخدمين ====================

  /**
   * الحصول على قائمة المستخدمين
   * @route GET /api/admin/users
   * @group الإدارة - عمليات لوحة التحكم
   * @returns {Object} - قائمة المستخدمين
   */
  router.get('/users', adminUserController.getUsers.bind(adminUserController));

  /**
   * الحصول على مستخدم بواسطة المعرف
   * @route GET /api/admin/users/:id
   * @group الإدارة - عمليات لوحة التحكم
   * @returns {Object} - المستخدم
   */
  router.get('/users/:id', adminUserController.getUserById.bind(adminUserController));

  /**
   * تعليق/إلغاء تعليق حساب مستخدم
   * @route PUT /api/admin/users/:id/status
   * @group الإدارة - عمليات لوحة التحكم
   * @returns {Object} - المستخدم المحدث
   */
  router.put('/users/:id/status', adminUserController.toggleUserStatus.bind(adminUserController));

  /**
   * حذف مستخدم
   * @route DELETE /api/admin/users/:id
   * @group الإدارة - عمليات لوحة التحكم
   * @returns {Object} - رسالة التأكيد
   */
  router.delete('/users/:id', adminUserController.deleteUser.bind(adminUserController));

  // ==================== إدارة الصفحات الثابتة ====================

  /**
   * إنشاء صفحة ثابتة
   * @route POST /api/admin/pages
   * @group الإدارة - عمليات لوحة التحكم
   * @returns {Object} - الصفحة المنشأة
   */
  router.post('/pages', staticContentController.createStaticPage.bind(staticContentController));

  /**
   * الحصول على كافة الصفحات الثابتة
   * @route GET /api/admin/pages
   * @group الإدارة - عمليات لوحة التحكم
   * @returns {Object} - قائمة الصفحات
   */
  router.get('/pages', staticContentController.getAllStaticPages.bind(staticContentController));

  /**
   * الحصول على صفحة ثابتة بواسطة المعرف
   * @route GET /api/admin/pages/:id
   * @group الإدارة - عمليات لوحة التحكم
   * @returns {Object} - الصفحة
   */
  router.get('/pages/:id', staticContentController.getStaticPageById.bind(staticContentController));

  /**
   * تحديث صفحة ثابتة
   * @route PUT /api/admin/pages/:id
   * @group الإدارة - عمليات لوحة التحكم
   * @returns {Object} - الصفحة المحدثة
   */
  router.put('/pages/:id', staticContentController.updateStaticPage.bind(staticContentController));

  /**
   * حذف صفحة ثابتة
   * @route DELETE /api/admin/pages/:id
   * @group الإدارة - عمليات لوحة التحكم
   * @returns {Object} - رسالة التأكيد
   */
  router.delete('/pages/:id', staticContentController.deleteStaticPage.bind(staticContentController));

  // ==================== إدارة الإعلانات ====================

  /**
   * إنشاء إعلان جديد
   * @route POST /api/admin/promotions
   * @group الإدارة - عمليات لوحة التحكم
   * @returns {Object} - الإعلان المنشأ
   */
  router.post('/promotions', 
    uploadImage('promotions').single('image'), 
    staticContentController.createPromotion.bind(staticContentController)
  );

  /**
   * الحصول على كافة الإعلانات
   * @route GET /api/admin/promotions
   * @group الإدارة - عمليات لوحة التحكم
   * @returns {Object} - قائمة الإعلانات
   */
  router.get('/promotions', staticContentController.getAllPromotions.bind(staticContentController));

  /**
   * الحصول على إعلان بواسطة المعرف
   * @route GET /api/admin/promotions/:id
   * @group الإدارة - عمليات لوحة التحكم
   * @returns {Object} - الإعلان
   */
  router.get('/promotions/:id', staticContentController.getPromotionById.bind(staticContentController));

  /**
   * تحديث إعلان
   * @route PUT /api/admin/promotions/:id
   * @group الإدارة - عمليات لوحة التحكم
   * @returns {Object} - الإعلان المحدث
   */
  router.put('/promotions/:id', 
    uploadImage('promotions').single('image'), 
    staticContentController.updatePromotion.bind(staticContentController)
  );

  /**
   * حذف إعلان
   * @route DELETE /api/admin/promotions/:id
   * @group الإدارة - عمليات لوحة التحكم
   * @returns {Object} - رسالة التأكيد
   */
  router.delete('/promotions/:id', staticContentController.deletePromotion.bind(staticContentController));

  // ==================== الإحصاءات ====================

  /**
   * الحصول على الإحصاءات العامة
   * @route GET /api/admin/statistics
   * @group الإدارة - عمليات لوحة التحكم
   * @returns {Object} - الإحصاءات العامة
   */
  router.get('/statistics', statisticsController.getGeneralStatistics.bind(statisticsController));

  /**
   * الحصول على إحصاءات الزيارات اليومية
   * @route GET /api/admin/statistics/daily-visits
   * @group الإدارة - عمليات لوحة التحكم
   * @returns {Object} - إحصاءات الزيارات اليومية
   */
  router.get('/statistics/daily-visits', statisticsController.getDailyVisits.bind(statisticsController));

  /**
   * الحصول على تقرير السيارات حسب الفئة
   * @route GET /api/admin/statistics/cars-by-category
   * @group الإدارة - عمليات لوحة التحكم
   * @returns {Object} - تقرير السيارات حسب الفئة
   */
  router.get('/statistics/cars-by-category', statisticsController.getCarsByCategory.bind(statisticsController));

  /**
   * الحصول على تقرير السيارات حسب الشركة المصنعة
   * @route GET /api/admin/statistics/cars-by-make
   * @group الإدارة - عمليات لوحة التحكم
   * @returns {Object} - تقرير السيارات حسب الشركة المصنعة
   */
  router.get('/statistics/cars-by-make', statisticsController.getCarsByMake.bind(statisticsController));

  /**
   * الحصول على متوسط سعر السيارات
   * @route GET /api/admin/statistics/average-price
   * @group الإدارة - عمليات لوحة التحكم
   * @returns {Object} - متوسط سعر السيارات
   */
  router.get('/statistics/average-price', statisticsController.getAverageCarPrice.bind(statisticsController));

  /**
   * الحصول على إحصاءات السيارات حسب السنة
   * @route GET /api/admin/statistics/cars-by-year
   * @group الإدارة - عمليات لوحة التحكم
   * @returns {Object} - إحصاءات السيارات حسب السنة
   */
  router.get('/statistics/cars-by-year', statisticsController.getCarsByYear.bind(statisticsController));

  /**
   * الحصول على إحصاءات السيارات المضافة مؤخرًا
   * @route GET /api/admin/statistics/recently-added
   * @group الإدارة - عمليات لوحة التحكم
   * @returns {Object} - إحصاءات السيارات المضافة مؤخرًا
   */
  router.get('/statistics/recently-added', statisticsController.getRecentlyAddedStats.bind(statisticsController));

  /**
   * الحصول على إحصاءات المستخدمين الجدد
   * @route GET /api/admin/statistics/new-users
   * @group الإدارة - عمليات لوحة التحكم
   * @returns {Object} - إحصاءات المستخدمين الجدد
   */
  router.get('/statistics/new-users', statisticsController.getNewUsersStats.bind(statisticsController));

  /**
   * الحصول على إحصاءات التفاعل
   * @route GET /api/admin/statistics/engagement
   * @group الإدارة - عمليات لوحة التحكم
   * @returns {Object} - إحصاءات التفاعل
   */
  router.get('/statistics/engagement', statisticsController.getEngagementStats.bind(statisticsController));

  return router;
};

module.exports = setupAdminRoutes;