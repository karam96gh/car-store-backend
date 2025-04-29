
// src/interfaces/routes/brandRoutes.js
const express = require('express');

/**
 * إعداد مسارات العلامات التجارية
 * @param {Object} brandController - متحكم العلامات التجارية
 * @returns {Object} - جسر المسارات
 */
const setupBrandRoutes = (brandController) => {
  const router = express.Router();

  /**
   * الحصول على قائمة العلامات التجارية
   * @route GET /api/brands
   * @group العلامات التجارية - عمليات العلامات التجارية
   * @returns {Object} - قائمة العلامات التجارية
   */
  router.get('/', brandController.getBrands.bind(brandController));

  /**
   * الحصول على علامة تجارية محددة
   * @route GET /api/brands/:id
   * @group العلامات التجارية - عمليات العلامات التجارية
   * @returns {Object} - العلامة التجارية
   */
  router.get('/:id', brandController.getBrandById.bind(brandController));

  return router;
};

module.exports = setupBrandRoutes;