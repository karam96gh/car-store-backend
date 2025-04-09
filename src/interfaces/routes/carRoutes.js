/**
 * مسارات السيارات
 * مسارات API الخاصة بالسيارات للمستخدمين
 */
const express = require('express');
const { authenticateJWT, optionalAuthenticateJWT } = require('../middlewares/authMiddleware');

/**
 * إعداد مسارات السيارات
 * @param {Object} carController - متحكم السيارات
 * @returns {Object} - جسر المسارات
 */
const setupCarRoutes = (carController) => {
  const router = express.Router();

  /**
   * الحصول على قائمة السيارات
   * @route GET /api/cars
   * @group السيارات - عمليات السيارات
   * @returns {Object} - قائمة السيارات
   */
  router.get('/', carController.getCars.bind(carController));

  /**
   * البحث عن السيارات
   * @route GET /api/cars/search
   * @group السيارات - عمليات السيارات
   * @returns {Object} - نتائج البحث
   */
  router.get('/search', carController.searchCars.bind(carController));

  /**
   * الحصول على السيارات المميزة
   * @route GET /api/cars/featured
   * @group السيارات - عمليات السيارات
   * @returns {Object} - قائمة السيارات المميزة
   */
  router.get('/featured', carController.getFeaturedCars.bind(carController));

  /**
   * الحصول على السيارات الأكثر مشاهدة
   * @route GET /api/cars/most-viewed
   * @group السيارات - عمليات السيارات
   * @returns {Object} - قائمة السيارات الأكثر مشاهدة
   */
  router.get('/most-viewed', carController.getMostViewedCars.bind(carController));

  /**
   * الحصول على سيارة بواسطة المعرف
   * @route GET /api/cars/:id
   * @group السيارات - عمليات السيارات
   * @returns {Object} - السيارة
   */
  router.get('/:id', optionalAuthenticateJWT, carController.getCarById.bind(carController));

  /**
   * الحصول على سيارات مشابهة
   * @route GET /api/cars/:id/similar
   * @group السيارات - عمليات السيارات
   * @returns {Object} - قائمة السيارات المشابهة
   */
  router.get('/:id/similar', carController.getSimilarCars.bind(carController));

  /**
   * إضافة سيارة للمفضلة
   * @route POST /api/cars/:carId/favorite
   * @group السيارات - عمليات السيارات
   * @returns {Object} - رسالة التأكيد
   */
  router.post('/:carId/favorite', authenticateJWT, carController.addToFavorites.bind(carController));

  /**
   * حذف سيارة من المفضلة
   * @route DELETE /api/cars/:carId/favorite
   * @group السيارات - عمليات السيارات
   * @returns {Object} - رسالة التأكيد
   */
  router.delete('/:carId/favorite', authenticateJWT, carController.removeFromFavorites.bind(carController));

  /**
   * إضافة إشعار سعر
   * @route POST /api/cars/:carId/price-alert
   * @group السيارات - عمليات السيارات
   * @returns {Object} - إشعار السعر
   */
  router.post('/:carId/price-alert', authenticateJWT, carController.addPriceAlert.bind(carController));

  /**
   * الحصول على السيارات المفضلة للمستخدم
   * @route GET /api/cars/user/favorites
   * @group السيارات - عمليات السيارات
   * @returns {Object} - قائمة السيارات المفضلة
   */
  router.get('/user/favorites', authenticateJWT, carController.getFavorites.bind(carController));

  /**
   * الحصول على إشعارات الأسعار للمستخدم
   * @route GET /api/cars/user/price-alerts
   * @group السيارات - عمليات السيارات
   * @returns {Object} - قائمة إشعارات الأسعار
   */
  router.get('/user/price-alerts', authenticateJWT, carController.getPriceAlerts.bind(carController));

  /**
   * حذف إشعار سعر
   * @route DELETE /api/cars/price-alert/:alertId
   * @group السيارات - عمليات السيارات
   * @returns {Object} - رسالة التأكيد
   */
  router.delete('/price-alert/:alertId', authenticateJWT, carController.removePriceAlert.bind(carController));

  /**
   * الحصول على سجل التصفح للمستخدم
   * @route GET /api/cars/user/history
   * @group السيارات - عمليات السيارات
   * @returns {Object} - سجل التصفح
   */
  router.get('/user/history', authenticateJWT, carController.getBrowserHistory.bind(carController));

  return router;
};

module.exports = setupCarRoutes;