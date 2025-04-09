/**
 * متحكم الإحصاءات
 * مسؤول عن معالجة طلبات الإحصاءات والتقارير
 */
class StatisticsController {
    constructor(statisticsUseCases) {
      this.statisticsUseCases = statisticsUseCases;
    }
  
    /**
     * تسجيل زيارة للموقع
     * @param {Object} req - كائن الطلب
     * @param {Object} res - كائن الاستجابة
     * @param {Function} next - دالة التالي
     */
    async recordVisit(req, res, next) {
      try {
        // تسجيل الزيارة
        await this.statisticsUseCases.recordVisit();
  
        res.status(200).json({
          success: true,
          message: 'تم تسجيل الزيارة بنجاح'
        });
      } catch (error) {
        next(error);
      }
    }
  
    /**
     * الحصول على الإحصاءات العامة
     * @param {Object} req - كائن الطلب
     * @param {Object} res - كائن الاستجابة
     * @param {Function} next - دالة التالي
     */
    async getGeneralStatistics(req, res, next) {
      try {
        // الحصول على الإحصاءات العامة
        const statistics = await this.statisticsUseCases.getGeneralStatistics();
  
        res.status(200).json({
          success: true,
          data: statistics
        });
      } catch (error) {
        next(error);
      }
    }
  
    /**
     * الحصول على إحصاءات الزيارات اليومية
     * @param {Object} req - كائن الطلب
     * @param {Object} res - كائن الاستجابة
     * @param {Function} next - دالة التالي
     */
    async getDailyVisits(req, res, next) {
      try {
        const { days = 30 } = req.query;
        
        // الحصول على إحصاءات الزيارات اليومية
        const visits = await this.statisticsUseCases.getDailyVisits(parseInt(days));
  
        res.status(200).json({
          success: true,
          data: visits
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
        const { limit = 10 } = req.query;
        
        // الحصول على السيارات الأكثر مشاهدة
        const cars = await this.statisticsUseCases.getMostViewedCars(parseInt(limit));
  
        res.status(200).json({
          success: true,
          data: cars
        });
      } catch (error) {
        next(error);
      }
    }
  
    /**
     * الحصول على تقرير السيارات حسب الفئة
     * @param {Object} req - كائن الطلب
     * @param {Object} res - كائن الاستجابة
     * @param {Function} next - دالة التالي
     */
    async getCarsByCategory(req, res, next) {
      try {
        // الحصول على تقرير السيارات حسب الفئة
        const report = await this.statisticsUseCases.getCarsByCategory();
  
        res.status(200).json({
          success: true,
          data: report
        });
      } catch (error) {
        next(error);
      }
    }
  
    /**
     * الحصول على تقرير السيارات حسب الشركة المصنعة
     * @param {Object} req - كائن الطلب
     * @param {Object} res - كائن الاستجابة
     * @param {Function} next - دالة التالي
     */
    async getCarsByMake(req, res, next) {
      try {
        const { limit = 10 } = req.query;
        
        // الحصول على تقرير السيارات حسب الشركة المصنعة
        const report = await this.statisticsUseCases.getCarsByMake(parseInt(limit));
  
        res.status(200).json({
          success: true,
          data: report
        });
      } catch (error) {
        next(error);
      }
    }
  
    /**
     * الحصول على متوسط سعر السيارات
     * @param {Object} req - كائن الطلب
     * @param {Object} res - كائن الاستجابة
     * @param {Function} next - دالة التالي
     */
    async getAverageCarPrice(req, res, next) {
      try {
        const { type, category } = req.query;
        
        // إعداد المرشحات
        const filters = {};
        
        if (type) filters.type = type;
        if (category) filters.category = category;
        
        // الحصول على متوسط سعر السيارات
        const avgPrice = await this.statisticsUseCases.getAverageCarPrice(filters);
  
        res.status(200).json({
          success: true,
          data: { averagePrice: avgPrice }
        });
      } catch (error) {
        next(error);
      }
    }
  
    /**
     * الحصول على إحصاءات السيارات حسب السنة
     * @param {Object} req - كائن الطلب
     * @param {Object} res - كائن الاستجابة
     * @param {Function} next - دالة التالي
     */
    async getCarsByYear(req, res, next) {
      try {
        // الحصول على إحصاءات السيارات حسب السنة
        const report = await this.statisticsUseCases.getCarsByYear();
  
        res.status(200).json({
          success: true,
          data: report
        });
      } catch (error) {
        next(error);
      }
    }
  
    /**
     * الحصول على إحصاءات السيارات المضافة مؤخرًا
     * @param {Object} req - كائن الطلب
     * @param {Object} res - كائن الاستجابة
     * @param {Function} next - دالة التالي
     */
    async getRecentlyAddedStats(req, res, next) {
      try {
        const { days = 30 } = req.query;
        
        // الحصول على إحصاءات السيارات المضافة مؤخرًا
        const stats = await this.statisticsUseCases.getRecentlyAddedStats(parseInt(days));
  
        res.status(200).json({
          success: true,
          data: stats
        });
      } catch (error) {
        next(error);
      }
    }
  
    /**
     * الحصول على إحصاءات المستخدمين الجدد
     * @param {Object} req - كائن الطلب
     * @param {Object} res - كائن الاستجابة
     * @param {Function} next - دالة التالي
     */
    async getNewUsersStats(req, res, next) {
      try {
        const { days = 30 } = req.query;
        
        // الحصول على إحصاءات المستخدمين الجدد
        const stats = await this.statisticsUseCases.getNewUsersStats(parseInt(days));
  
        res.status(200).json({
          success: true,
          data: stats
        });
      } catch (error) {
        next(error);
      }
    }
  
    /**
     * الحصول على إحصاءات التفاعل
     * @param {Object} req - كائن الطلب
     * @param {Object} res - كائن الاستجابة
     * @param {Function} next - دالة التالي
     */
    async getEngagementStats(req, res, next) {
      try {
        // الحصول على إحصاءات التفاعل
        const stats = await this.statisticsUseCases.getEngagementStats();
  
        res.status(200).json({
          success: true,
          data: stats
        });
      } catch (error) {
        next(error);
      }
    }
  }
  
  module.exports = StatisticsController;