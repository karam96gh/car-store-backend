/**
 * مسارات الإحصاءات
 * مسارات API الخاصة بالإحصاءات العامة
 */
const express = require('express');

/**
 * إعداد مسارات الإحصاءات
 * @param {Object} statisticsController - متحكم الإحصاءات
 * @returns {Object} - جسر المسارات
 */
const setupStatisticsRoutes = (statisticsController) => {
  const router = express.Router();

  /**
   * تسجيل زيارة للموقع
   * @route POST /api/statistics/record-visit
   * @group الإحصاءات - عمليات الإحصاءات
   * @returns {Object} - رسالة التأكيد
   */
  router.post('/record-visit', statisticsController.recordVisit.bind(statisticsController));

  /**
   * الحصول على إحصاءات موجزة عن الموقع
   * @route GET /api/statistics/summary
   * @group الإحصاءات - عمليات الإحصاءات
   * @returns {Object} - إحصاءات موجزة
   */
  router.get('/summary', statisticsController.getGeneralStatistics.bind(statisticsController));

  return router;
};

module.exports = setupStatisticsRoutes;