/**
 * إعداد مسارات التطبيق
 * يتم تجميع جميع المسارات هنا
 */
const setupAuthRoutes = require('./authRoutes');
const setupCarRoutes = require('./carRoutes');
const setupAdminRoutes = require('./adminRoutes');
const setupStaticContentRoutes = require('./staticContentRoutes');
const setupStatisticsRoutes = require('./statisticsRoutes');

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

  // التعامل مع المسارات غير الموجودة
  app.use('*', (req, res) => {
    res.status(404).json({
      success: false,
      message: 'المسار غير موجود'
    });
  });
};

module.exports = setupRoutes;