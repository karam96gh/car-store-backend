/**
 * حالات استخدام الإحصاءات
 * للحصول على معلومات وتقارير حول استخدام التطبيق
 */
class StatisticsUseCases {
    constructor(statisticsRepository, carRepository, userRepository) {
      this.statisticsRepository = statisticsRepository;
      this.carRepository = carRepository;
      this.userRepository = userRepository;
    }
  
    /**
     * تسجيل زيارة للموقع
     * @returns {Promise<void>}
     */
    async recordVisit() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      await this.statisticsRepository.incrementVisits(today);
    }
  
    /**
     * الحصول على إحصاءات عامة
     * @returns {Promise<Object>} - الإحصاءات العامة
     */
    async getGeneralStatistics() {
      const currentDate = new Date();
      
      // إحصاءات الزيارات
      const visitStats = await this.statisticsRepository.getVisitStats();
      
      // إحصاءات السيارات
      const carsCount = await this.carRepository.count();
      const newCarsCount = await this.carRepository.count({ type: 'NEW' });
      const usedCarsCount = await this.carRepository.count({ type: 'USED' });
      const featuredCarsCount = await this.carRepository.count({ isFeatured: true });
      
      // إحصاءات المستخدمين
      const usersCount = await this.userRepository.count();
      const activeUsersCount = await this.userRepository.count({ isActive: true });
      
      return {
        visits: {
          today: visitStats.today,
          thisWeek: visitStats.thisWeek,
          thisMonth: visitStats.thisMonth,
          total: visitStats.total
        },
        cars: {
          total: carsCount,
          new: newCarsCount,
          used: usedCarsCount,
          featured: featuredCarsCount,
          categories: await this.carRepository.countByCategory()
        },
        users: {
          total: usersCount,
          active: activeUsersCount
        },
        updatedAt: currentDate
      };
    }
  
    /**
     * الحصول على إحصاءات الزيارات اليومية
     * @param {number} days - عدد الأيام
     * @returns {Promise<Array>} - إحصاءات الزيارات اليومية
     */
    async getDailyVisits(days = 30) {
      return this.statisticsRepository.getDailyVisits(days);
    }
  
    /**
     * الحصول على السيارات الأكثر مشاهدة
     * @param {number} limit - عدد السيارات
     * @returns {Promise<Array>} - قائمة السيارات الأكثر مشاهدة
     */
    async getMostViewedCars(limit = 10) {
      return this.carRepository.findMostViewed(limit);
    }
  
    /**
     * الحصول على تقرير السيارات حسب الفئة
     * @returns {Promise<Object>} - تقرير السيارات حسب الفئة
     */
    async getCarsByCategory() {
      return this.carRepository.countByCategory();
    }
  
    /**
     * الحصول على تقرير السيارات حسب الشركة المصنعة
     * @param {number} limit - عدد الشركات
     * @returns {Promise<Array>} - تقرير السيارات حسب الشركة المصنعة
     */
    async getCarsByMake(limit = 10) {
      return this.carRepository.countByMake(limit);
    }
  
    /**
     * الحصول على متوسط سعر السيارات
     * @param {Object} filters - مرشحات (جديد/مستعمل/الخ)
     * @returns {Promise<number>} - متوسط السعر
     */
    async getAverageCarPrice(filters = {}) {
      return this.carRepository.getAveragePrice(filters);
    }
  
    /**
     * الحصول على إحصاءات السيارات حسب السنة
     * @returns {Promise<Array>} - تقرير السيارات حسب السنة
     */
    async getCarsByYear() {
      return this.carRepository.countByYear();
    }
  
    /**
     * الحصول على إحصاءات السيارات المضافة مؤخرًا
     * @param {number} days - عدد الأيام
     * @returns {Promise<Array>} - تقرير السيارات المضافة مؤخرًا
     */
    async getRecentlyAddedStats(days = 30) {
      return this.carRepository.getRecentlyAddedStats(days);
    }
  
    /**
     * الحصول على إحصاءات المستخدمين الجدد
     * @param {number} days - عدد الأيام
     * @returns {Promise<Array>} - تقرير المستخدمين الجدد
     */
    async getNewUsersStats(days = 30) {
      return this.userRepository.getNewUsersStats(days);
    }
  
    /**
     * الحصول على إحصاءات التفاعل
     * @returns {Promise<Object>} - إحصاءات التفاعل
     */
    async getEngagementStats() {
      const favoritesCount = await this.userRepository.countFavorites();
      const alertsCount = await this.userRepository.countPriceAlerts();
      
      return {
        favorites: favoritesCount,
        priceAlerts: alertsCount,
        updatedAt: new Date()
      };
    }
  }
  
  module.exports = StatisticsUseCases;