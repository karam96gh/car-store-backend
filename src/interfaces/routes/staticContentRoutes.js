/**
 * مسارات المحتوى الثابت
 * مسارات API الخاصة بالصفحات الثابتة والإعلانات
 */
const express = require('express');

/**
 * إعداد مسارات المحتوى الثابت
 * @param {Object} staticContentController - متحكم المحتوى الثابت
 * @returns {Object} - جسر المسارات
 */
const setupStaticContentRoutes = (staticContentController) => {
  const router = express.Router();

  /**
   * الحصول على صفحة ثابتة بواسطة المسار
   * @route GET /api/static-pages/:slug
   * @group المحتوى الثابت - عمليات المحتوى الثابت
   * @returns {Object} - الصفحة الثابتة
   */
  router.get('/static-pages/:slug', staticContentController.getStaticPageBySlug.bind(staticContentController));

  /**
   * الحصول على الإعلانات النشطة
   * @route GET /api/promotions
   * @group المحتوى الثابت - عمليات المحتوى الثابت
   * @returns {Object} - قائمة الإعلانات النشطة
   */
  router.get('/promotions', staticContentController.getActivePromotions.bind(staticContentController));

  return router;
};

module.exports = setupStaticContentRoutes;