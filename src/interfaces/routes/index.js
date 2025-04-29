// src/interfaces/routes/index.js
/**
 * إعداد مسارات التطبيق
 * يتم تجميع جميع المسارات هنا
 */
const setupAuthRoutes = require('./authRoutes');
const setupCarRoutes = require('./carRoutes');
const setupAdminRoutes = require('./adminRoutes');
const setupStaticContentRoutes = require('./staticContentRoutes');
const setupStatisticsRoutes = require('./statisticsRoutes');
const setupBrandRoutes = require('./brandRoutes'); // إضافة مسارات العلامات التجارية

const { authenticateJWT, isAdmin } = require('../middlewares/authMiddleware');

/**
 * تهيئة جميع مسارات API
 * @param {Object} app - تطبيق Express
 */
const setupRoutes = (app) => {
  // استيراد المتحكمات (يتم حقنها من خلال السياق)
  const context = require('../../infrastructure/config/context');
  
  // إعداد المسارات
  app.use('/api/auth', setupAuthRoutes(context.authController));
  app.use('/api/cars', setupCarRoutes(context.carController));
  app.use('/api/brands', setupBrandRoutes(context.brandController)); // إضافة مسارات العلامات التجارية
  app.use('/api/admin', authenticateJWT, isAdmin, setupAdminRoutes(
    context.adminCarController,
    context.adminUserController,
    context.staticContentController,
    context.statisticsController
  ));
  app.use('/api', setupStaticContentRoutes(context.staticContentController));
  app.use('/api/statistics', setupStatisticsRoutes(context.statisticsController));

  // مسار التحقق من الخادم
  app.get('/api/health', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'الخادم يعمل بشكل جيد',
      timestamp: new Date()
    });
  });

  // مسار للحصول على أحدث السيارات
  app.get('/api/latest-cars', async (req, res, next) => {
    try {
      const { limit = 10 } = req.query;
      const latestCars = await context.carUseCases.getCars({}, { page: 1, limit: parseInt(limit) });
      
      res.status(200).json({
        success: true,
        data: latestCars.data
      });
    } catch (error) {
      next(error);
    }
  });

  // التعامل مع المسارات غير الموجودة
  app.use('*', (req, res) => {
    res.status(404).json({
      success: false,
      message: 'المسار غير موجود'
    });
  });
};

module.exports = setupRoutes;