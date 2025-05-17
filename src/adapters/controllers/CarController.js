/**
 * متحكم السيارات
 * مسؤول عن معالجة طلبات السيارات
 */
class CarController {
    constructor(carUseCases, userUseCases) {
      this.carUseCases = carUseCases;
      this.userUseCases = userUseCases;
    }
  
    /**
     * الحصول على قائمة السيارات
     * @param {Object} req - كائن الطلب
     * @param {Object} res - كائن الاستجابة
     * @param {Function} next - دالة التالي
     */
    async getCars(req, res, next) {
      try {
        const { page = 1, limit = 1000, type, category, brandId, model, year, 
                yearMin, yearMax, priceMin, priceMax, orderBy } = req.query;
  
        // إعداد مرشحات البحث
        const filters = {};
        
        if (type) filters.type = type;
        if (category) filters.category = category;
        if (brandId) filters.brandId = brandId;
        if (model) filters.model = model;
        if (year) filters.year = parseInt(year);
        
        // نطاق السنة
        if (yearMin || yearMax) {
          filters.yearRange = {
            min: yearMin ? parseInt(yearMin) : 1900,
            max: yearMax ? parseInt(yearMax) : new Date().getFullYear() + 1
          };
        }
        
        // نطاق السعر
        if (priceMin || priceMax) {
          filters.priceRange = {
            min: priceMin ? parseFloat(priceMin) : 0,
            max: priceMax ? parseFloat(priceMax) : Number.MAX_SAFE_INTEGER
          };
        }
  
        // خيارات التصفح
        const pagination = {
          page: parseInt(page),
          limit: parseInt(limit)
        };
  
        // الحصول على قائمة السيارات
        const result = await this.carUseCases.getCars(filters, pagination);
  
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
     * البحث عن السيارات
     * @param {Object} req - كائن الطلب
     * @param {Object} res - كائن الاستجابة
     * @param {Function} next - دالة التالي
     */
    async searchCars(req, res, next) {
      try {
        const { page = 1, limit = 1000, searchText, type, category, make, model, 
                yearMin, yearMax, priceMin, priceMax, orderBy } = req.query;
  
        // إعداد معايير البحث
        const criteria = {
          searchText,
          orderBy
        };
        
        if (type) criteria.type = type;
        if (category) criteria.category = category;
        if (make) criteria.make = make;
        if (model) criteria.model = model;
        
        // نطاق السنة
        if (yearMin || yearMax) {
          criteria.yearRange = {
            min: yearMin ? parseInt(yearMin) : 1900,
            max: yearMax ? parseInt(yearMax) : new Date().getFullYear() + 1
          };
        }
        
        // نطاق السعر
        if (priceMin || priceMax) {
          criteria.priceRange = {
            min: priceMin ? parseFloat(priceMin) : 0,
            max: priceMax ? parseFloat(priceMax) : Number.MAX_SAFE_INTEGER
          };
        }
  
        // خيارات التصفح
        const pagination = {
          page: parseInt(page),
          limit: parseInt(limit)
        };
  
        // البحث عن السيارات
        const result = await this.carUseCases.searchCars(criteria, pagination);
  
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
     * الحصول على سيارة بواسطة المعرف
     * @param {Object} req - كائن الطلب
     * @param {Object} res - كائن الاستجابة
     * @param {Function} next - دالة التالي
     */
    async getCarById(req, res, next) {
      try {
        const { id } = req.params;
        
        // زيادة عدد المشاهدات
        await this.carUseCases.incrementCarViews(id);
        
        // الحصول على السيارة
        const car = await this.carUseCases.getCarById(id);
        
        // إضافة السيارة لسجل التصفح إذا كان المستخدم مسجل الدخول
        if (req.user) {
          await this.userUseCases.addBrowserHistory(req.user.id, id);
        }
  
        res.status(200).json({
          success: true,
          data: car
        });
      } catch (error) {
        if (error.message === 'السيارة غير موجودة') {
          return res.status(404).json({
            success: false,
            message: error.message
          });
        }
        next(error);
      }
    }
  
    /**
     * الحصول على السيارات المميزة
     * @param {Object} req - كائن الطلب
     * @param {Object} res - كائن الاستجابة
     * @param {Function} next - دالة التالي
     */
    async getFeaturedCars(req, res, next) {
      try {
        const { limit = 1000 } = req.query;
        
        // الحصول على السيارات المميزة
        const featuredCars = await this.carUseCases.getFeaturedCars(parseInt(limit));
  
        res.status(200).json({
          success: true,
          data: featuredCars
        });
      } catch (error) {
        next(error);
      }
    }
  
    /**
     * الحصول على السيارات الأكثر مشاهدة
     * @param {Object} req - كائن الطلب
     * @param {Object} res - كائن الاستجابة
     * @param {Function} next - دالة التالي
     */
    async getMostViewedCars(req, res, next) {
      try {
        const { limit = 1000 } = req.query;
        
        // الحصول على السيارات الأكثر مشاهدة
        const mostViewedCars = await this.carUseCases.getMostViewedCars(parseInt(limit));
  
        res.status(200).json({
          success: true,
          data: mostViewedCars
        });
      } catch (error) {
        next(error);
      }
    }
  
    /**
     * الحصول على سيارات مشابهة
     * @param {Object} req - كائن الطلب
     * @param {Object} res - كائن الاستجابة
     * @param {Function} next - دالة التالي
     */
    async getSimilarCars(req, res, next) {
      try {
        const { id } = req.params;
        const { limit = 6 } = req.query;
        
        // الحصول على السيارات المشابهة
        const similarCars = await this.carUseCases.getSimilarCars(id, parseInt(limit));
  
        res.status(200).json({
          success: true,
          data: similarCars
        });
      } catch (error) {
        if (error.message === 'السيارة غير موجودة') {
          return res.status(404).json({
            success: false,
            message: error.message
          });
        }
        next(error);
      }
    }
  
    /**
     * إضافة سيارة للمفضلة
     * @param {Object} req - كائن الطلب
     * @param {Object} res - كائن الاستجابة
     * @param {Function} next - دالة التالي
     */
    async addToFavorites(req, res, next) {
      try {
        const userId = req.user.id;
        const { carId } = req.params;
        
        // إضافة السيارة للمفضلة
        await this.userUseCases.addToFavorites(userId, carId);
  
        res.status(200).json({
          success: true,
          message: 'تمت إضافة السيارة للمفضلة بنجاح'
        });
      } catch (error) {
        next(error);
      }
    }
  
    /**
     * حذف سيارة من المفضلة
     * @param {Object} req - كائن الطلب
     * @param {Object} res - كائن الاستجابة
     * @param {Function} next - دالة التالي
     */
    async removeFromFavorites(req, res, next) {
      try {
        const userId = req.user.id;
        const { carId } = req.params;
        
        // حذف السيارة من المفضلة
        await this.userUseCases.removeFromFavorites(userId, carId);
  
        res.status(200).json({
          success: true,
          message: 'تم حذف السيارة من المفضلة بنجاح'
        });
      } catch (error) {
        next(error);
      }
    }
  
    /**
     * الحصول على السيارات المفضلة للمستخدم
     * @param {Object} req - كائن الطلب
     * @param {Object} res - كائن الاستجابة
     * @param {Function} next - دالة التالي
     */
    async getFavorites(req, res, next) {
      try {
        const userId = req.user.id;
        const { page = 1, limit = 1000 } = req.query;
        
        // خيارات التصفح
        const pagination = {
          page: parseInt(page),
          limit: parseInt(limit)
        };
        
        // الحصول على السيارات المفضلة
        const result = await this.userUseCases.getUserFavorites(userId, pagination);
  
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
     * إضافة إشعار سعر
     * @param {Object} req - كائن الطلب
     * @param {Object} res - كائن الاستجابة
     * @param {Function} next - دالة التالي
     */
    async addPriceAlert(req, res, next) {
      try {
        const userId = req.user.id;
        const { carId } = req.params;
        const { targetPrice } = req.body;
        
        // التحقق من البيانات المطلوبة
        if (!targetPrice) {
          return res.status(400).json({
            success: false,
            message: 'الرجاء تحديد السعر المستهدف'
          });
        }
        
        // إضافة إشعار سعر
        const alert = await this.userUseCases.addPriceAlert(userId, carId, targetPrice);
  
        res.status(201).json({
          success: true,
          message: 'تم إضافة إشعار السعر بنجاح',
          data: alert
        });
      } catch (error) {
        next(error);
      }
    }
  
    /**
     * حذف إشعار سعر
     * @param {Object} req - كائن الطلب
     * @param {Object} res - كائن الاستجابة
     * @param {Function} next - دالة التالي
     */
    async removePriceAlert(req, res, next) {
      try {
        const userId = req.user.id;
        const { alertId } = req.params;
        
        // حذف إشعار سعر
        await this.userUseCases.removePriceAlert(userId, alertId);
  
        res.status(200).json({
          success: true,
          message: 'تم حذف إشعار السعر بنجاح'
        });
      } catch (error) {
        if (error.message === 'الإشعار غير موجود' || 
            error.message === 'غير مصرح لك بحذف هذا الإشعار') {
          return res.status(403).json({
            success: false,
            message: error.message
          });
        }
        next(error);
      }
    }
  
    /**
     * الحصول على إشعارات الأسعار للمستخدم
     * @param {Object} req - كائن الطلب
     * @param {Object} res - كائن الاستجابة
     * @param {Function} next - دالة التالي
     */
    async getPriceAlerts(req, res, next) {
      try {
        const userId = req.user.id;
        
        // الحصول على إشعارات الأسعار
        const alerts = await this.userUseCases.getUserPriceAlerts(userId);
  
        res.status(200).json({
          success: true,
          data: alerts
        });
      } catch (error) {
        next(error);
      }
    }
  
    /**
     * الحصول على سجل التصفح للمستخدم
     * @param {Object} req - كائن الطلب
     * @param {Object} res - كائن الاستجابة
     * @param {Function} next - دالة التالي
     */
    async getBrowserHistory(req, res, next) {
      try {
        const userId = req.user.id;
        const { page = 1, limit = 1000 } = req.query;
        
        // خيارات التصفح
        const pagination = {
          page: parseInt(page),
          limit: parseInt(limit)
        };
        
        // الحصول على سجل التصفح
        const result = await this.userUseCases.getUserBrowserHistory(userId, pagination);
  
        res.status(200).json({
          success: true,
          data: result.data,
          pagination: result.pagination
        });
      } catch (error) {
        next(error);
      }
    }
  }
  
  module.exports = CarController;