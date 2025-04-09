/**
 * سياق التطبيق
 * يتم تهيئة جميع الخدمات والمستودعات وحالات الاستخدام والمتحكمات هنا
 */

// استيراد المستودعات
const CarRepositoryImpl = require('../database/repositories/CarRepositoryImpl');
const UserRepositoryImpl = require('../database/repositories/UserRepositoryImpl');
const StaticPageRepositoryImpl = require('../database/repositories/StaticPageRepositoryImpl');
const PromotionRepositoryImpl = require('../database/repositories/PromotionRepositoryImpl');
const StatisticsRepositoryImpl = require('../database/repositories/StatisticsRepositoryImpl');

// استيراد الخدمات
const FileStorageService = require('../storage/FileStorageService');

// استيراد حالات الاستخدام
const CarUseCases = require('../../core/usecases/CarUseCases');
const UserUseCases = require('../../core/usecases/UserUseCases');
const StaticContentUseCases = require('../../core/usecases/StaticContentUseCases');
const StatisticsUseCases = require('../../core/usecases/StatisticsUseCases');

// استيراد المتحكمات
const AuthController = require('../../adapters/controllers/AuthController');
const CarController = require('../../adapters/controllers/CarController');
const AdminCarController = require('../../adapters/controllers/AdminCarController');
const AdminUserController = require('../../adapters/controllers/AdminUserController');
const StaticContentController = require('../../adapters/controllers/StaticContentController');
const StatisticsController = require('../../adapters/controllers/StatisticsController');

// إنشاء المستودعات
const carRepository = new CarRepositoryImpl();
const userRepository = new UserRepositoryImpl();
const staticPageRepository = new StaticPageRepositoryImpl();
const promotionRepository = new PromotionRepositoryImpl();
const statisticsRepository = new StatisticsRepositoryImpl();

// إنشاء الخدمات
const fileStorageService = new FileStorageService();

// إنشاء حالات الاستخدام
const carUseCases = new CarUseCases(carRepository, fileStorageService);
const userUseCases = new UserUseCases(userRepository);
const staticContentUseCases = new StaticContentUseCases(staticPageRepository, promotionRepository, fileStorageService);
const statisticsUseCases = new StatisticsUseCases(statisticsRepository, carRepository, userRepository);

// إنشاء المتحكمات
const authController = new AuthController(userUseCases);
const carController = new CarController(carUseCases, userUseCases);
const adminCarController = new AdminCarController(carUseCases);
const adminUserController = new AdminUserController(userUseCases);
const staticContentController = new StaticContentController(staticContentUseCases);
const statisticsController = new StatisticsController(statisticsUseCases);

// تصدير السياق
module.exports = {
  // المستودعات
  carRepository,
  userRepository,
  staticPageRepository,
  promotionRepository,
  statisticsRepository,

  // الخدمات
  fileStorageService,

  // حالات الاستخدام
  carUseCases,
  userUseCases,
  staticContentUseCases,
  statisticsUseCases,

  // المتحكمات
  authController,
  carController,
  adminCarController,
  adminUserController,
  staticContentController,
  statisticsController
};