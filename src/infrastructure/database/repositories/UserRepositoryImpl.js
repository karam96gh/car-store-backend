/**
 * تنفيذ مستودع المستخدمين
 * يستخدم Prisma للتفاعل مع قاعدة البيانات
 */
const User = require('../../../core/domain/entities/User');
const UserRepository = require('../../../core/domain/interfaces/UserRepository');
const prisma = require('../prismaClient');

class UserRepositoryImpl extends UserRepository {
  /**
   * إنشاء مستخدم جديد
   * @param {Object} userData - بيانات المستخدم
   * @returns {Promise<Object>} - المستخدم المنشأ
   */
  async create(userData) {
    try {
        console.log(userData);
        
      const user = await prisma.user.create({
        data: userData
      });

      return new User(user);
    } catch (error) {
      throw new Error(`فشل إنشاء المستخدم: ${error.message}`);
    }
  }

  /**
   * الحصول على كافة المستخدمين
   * @param {Object} filters - مرشحات البحث
   * @param {Object} pagination - خيارات التصفح
   * @returns {Promise<Object>} - قائمة المستخدمين مع معلومات التصفح
   */
  async findAll(filters = {}, pagination = { page: 1, limit: 10 }) {
    try {
      const { page = 1, limit = 10 } = pagination;
      const skip = (page - 1) * limit;

      // بناء شرط البحث
      const where = {};

      if (filters.role) {
        where.role = filters.role;
      }

      if (filters.isActive !== undefined) {
        where.isActive = filters.isActive;
      }

      if (filters.search) {
        where.OR = [
          { name: { contains: filters.search } },
          { email: { contains: filters.search } }
        ];

        // إضافة البحث برقم الهاتف إذا كان موجودًا
        if (filters.search.match(/^\d+$/)) {
          where.OR.push({ phone: { contains: filters.search } });
        }
      }

      // الحصول على عدد المستخدمين
      const total = await prisma.user.count({ where });

      // الحصول على قائمة المستخدمين
      const users = await prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        }
      });

      // تحويل البيانات إلى كيانات
      const userEntities = users.map(user => new User(user));

      // إعداد معلومات التصفح
      const totalPages = Math.ceil(total / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      return {
        data: userEntities.map(user => user.toJSON()),
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage,
          hasPrevPage
        }
      };
    } catch (error) {
      throw new Error(`فشل الحصول على المستخدمين: ${error.message}`);
    }
  }

  /**
   * الحصول على مستخدم بواسطة المعرف
   * @param {number} id - معرف المستخدم
   * @returns {Promise<Object|null>} - المستخدم أو null إذا لم يكن موجود
   */
  async findById(id) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: parseInt(id) }
      });

      if (!user) {
        return null;
      }

      return new User(user);
    } catch (error) {
      throw new Error(`فشل الحصول على المستخدم: ${error.message}`);
    }
  }

  /**
   * الحصول على مستخدم بواسطة البريد الإلكتروني
   * @param {string} email - البريد الإلكتروني
   * @returns {Promise<Object|null>} - المستخدم أو null إذا لم يكن موجود
   */
  async findByEmail(email) {
    try {
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        return null;
      }

      return new User(user);
    } catch (error) {
      throw new Error(`فشل الحصول على المستخدم: ${error.message}`);
    }
  }

  /**
   * الحصول على مستخدم بواسطة رقم الهاتف
   * @param {string} phone - رقم الهاتف
   * @returns {Promise<Object|null>} - المستخدم أو null إذا لم يكن موجود
   */
  async findByPhone(phone) {
    try {
      const user = await prisma.user.findUnique({
        where: { phone }
      });

      if (!user) {
        return null;
      }

      return new User(user);
    } catch (error) {
      throw new Error(`فشل الحصول على المستخدم: ${error.message}`);
    }
  }

  /**
   * تحديث مستخدم
   * @param {number} id - معرف المستخدم
   * @param {Object} userData - بيانات التحديث
   * @returns {Promise<Object>} - المستخدم المحدث
   */
  async update(id, userData) {
    try {
      const user = await prisma.user.update({
        where: { id: parseInt(id) },
        data: userData
      });

      return new User(user);
    } catch (error) {
      throw new Error(`فشل تحديث المستخدم: ${error.message}`);
    }
  }

  /**
   * تغيير حالة نشاط المستخدم
   * @param {number} id - معرف المستخدم
   * @param {boolean} isActive - حالة النشاط
   * @returns {Promise<Object>} - المستخدم المحدث
   */
  async updateActiveStatus(id, isActive) {
    try {
      const user = await prisma.user.update({
        where: { id: parseInt(id) },
        data: { isActive }
      });

      return new User(user);
    } catch (error) {
      throw new Error(`فشل تحديث حالة نشاط المستخدم: ${error.message}`);
    }
  }

  /**
   * تغيير كلمة المرور
   * @param {number} id - معرف المستخدم
   * @param {string} password - كلمة المرور الجديدة (مشفرة)
   * @returns {Promise<boolean>} - هل تم التحديث بنجاح
   */
  async updatePassword(id, password) {
    try {
      await prisma.user.update({
        where: { id: parseInt(id) },
        data: { password }
      });

      return true;
    } catch (error) {
      throw new Error(`فشل تحديث كلمة المرور: ${error.message}`);
    }
  }

  /**
   * حذف مستخدم
   * @param {number} id - معرف المستخدم
   * @returns {Promise<boolean>} - هل تم الحذف بنجاح
   */
  async delete(id) {
    try {
      await prisma.user.delete({
        where: { id: parseInt(id) }
      });

      return true;
    } catch (error) {
      throw new Error(`فشل حذف المستخدم: ${error.message}`);
    }
  }

  /**
   * إضافة سيارة للمفضلة
   * @param {number} userId - معرف المستخدم
   * @param {number} carId - معرف السيارة
   * @returns {Promise<Object>} - سجل المفضلة
   */
  async addFavorite(userId, carId) {
    try {
      const favorite = await prisma.favorite.create({
        data: {
          userId: parseInt(userId),
          carId: parseInt(carId)
        }
      });

      return favorite;
    } catch (error) {
      // إذا كانت السيارة موجودة بالفعل في المفضلة
      if (error.code === 'P2002') {
        return await prisma.favorite.findFirst({
          where: {
            userId: parseInt(userId),
            carId: parseInt(carId)
          }
        });
      }

      throw new Error(`فشل إضافة السيارة للمفضلة: ${error.message}`);
    }
  }

  /**
   * حذف سيارة من المفضلة
   * @param {number} userId - معرف المستخدم
   * @param {number} carId - معرف السيارة
   * @returns {Promise<boolean>} - هل تم الحذف بنجاح
   */
  async removeFavorite(userId, carId) {
    try {
      await prisma.favorite.deleteMany({
        where: {
          userId: parseInt(userId),
          carId: parseInt(carId)
        }
      });

      return true;
    } catch (error) {
      throw new Error(`فشل حذف السيارة من المفضلة: ${error.message}`);
    }
  }

  /**
   * الحصول على قائمة السيارات المفضلة للمستخدم
   * @param {number} userId - معرف المستخدم
   * @param {Object} pagination - خيارات التصفح
   * @returns {Promise<Object>} - قائمة السيارات المفضلة مع معلومات التصفح
   */
  async getFavorites(userId, pagination = { page: 1, limit: 10 }) {
    try {
      const { page = 1, limit = 10 } = pagination;
      const skip = (page - 1) * limit;

      // الحصول على عدد السيارات المفضلة
      const total = await prisma.favorite.count({
        where: { userId: parseInt(userId) }
      });

      // الحصول على قائمة السيارات المفضلة
      const favorites = await prisma.favorite.findMany({
        where: { userId: parseInt(userId) },
        include: {
          car: {
            include: {
              images: true,
              specifications: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        }
      });

      // تحويل البيانات
      const cars = favorites.map(favorite => favorite.car);

      // إعداد معلومات التصفح
      const totalPages = Math.ceil(total / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      return {
        data: cars,
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage,
          hasPrevPage
        }
      };
    } catch (error) {
      throw new Error(`فشل الحصول على السيارات المفضلة: ${error.message}`);
    }
  }

  /**
   * إضافة إشعار سعر
   * @param {number} userId - معرف المستخدم
   * @param {number} carId - معرف السيارة
   * @param {number} targetPrice - السعر المستهدف
   * @returns {Promise<Object>} - إشعار السعر
   */
  async addPriceAlert(userId, carId, targetPrice) {
    try {
      const alert = await prisma.priceAlert.create({
        data: {
          userId: parseInt(userId),
          carId: parseInt(carId),
          targetPrice: parseFloat(targetPrice)
        }
      });

      return alert;
    } catch (error) {
      throw new Error(`فشل إضافة إشعار السعر: ${error.message}`);
    }
  }

  /**
   * الحصول على إشعار سعر بواسطة المعرف
   * @param {number} alertId - معرف الإشعار
   * @returns {Promise<Object|null>} - إشعار السعر
   */
  async getPriceAlertById(alertId) {
    try {
      return await prisma.priceAlert.findUnique({
        where: { id: parseInt(alertId) }
      });
    } catch (error) {
      throw new Error(`فشل الحصول على إشعار السعر: ${error.message}`);
    }
  }

  /**
   * حذف إشعار سعر
   * @param {number} alertId - معرف الإشعار
   * @returns {Promise<boolean>} - هل تم الحذف بنجاح
   */
  async removePriceAlert(alertId) {
    try {
      await prisma.priceAlert.delete({
        where: { id: parseInt(alertId) }
      });

      return true;
    } catch (error) {
      throw new Error(`فشل حذف إشعار السعر: ${error.message}`);
    }
  }

  /**
   * الحصول على قائمة إشعارات الأسعار للمستخدم
   * @param {number} userId - معرف المستخدم
   * @returns {Promise<Array>} - قائمة إشعارات الأسعار
   */
  async getPriceAlerts(userId) {
    try {
      const alerts = await prisma.priceAlert.findMany({
        where: { userId: parseInt(userId) },
        include: {
          car: {
            include: {
              images: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return alerts;
    } catch (error) {
      throw new Error(`فشل الحصول على إشعارات الأسعار: ${error.message}`);
    }
  }

  /**
   * إضافة سجل تصفح
   * @param {number} userId - معرف المستخدم
   * @param {number} carId - معرف السيارة
   * @returns {Promise<Object>} - سجل التصفح
   */
  async addBrowserHistory(userId, carId) {
    try {
      const history = await prisma.browserHistory.create({
        data: {
          userId: parseInt(userId),
          carId: parseInt(carId)
        }
      });

      return history;
    } catch (error) {
      throw new Error(`فشل إضافة سجل التصفح: ${error.message}`);
    }
  }

  /**
   * الحصول على سجل تصفح المستخدم
   * @param {number} userId - معرف المستخدم
   * @param {Object} pagination - خيارات التصفح
   * @returns {Promise<Object>} - سجل التصفح مع معلومات التصفح
   */
  async getBrowserHistory(userId, pagination = { page: 1, limit: 10 }) {
    try {
      const { page = 1, limit = 10 } = pagination;
      const skip = (page - 1) * limit;

      // الحصول على عدد سجلات التصفح
      const total = await prisma.browserHistory.count({
        where: { userId: parseInt(userId) }
      });

      // الحصول على سجل التصفح
      const history = await prisma.browserHistory.findMany({
        where: { userId: parseInt(userId) },
        include: {
          car: {
            include: {
              images: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: {
          viewedAt: 'desc'
        }
      });

      // إعداد معلومات التصفح
      const totalPages = Math.ceil(total / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      return {
        data: history,
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage,
          hasPrevPage
        }
      };
    } catch (error) {
      throw new Error(`فشل الحصول على سجل التصفح: ${error.message}`);
    }
  }

  /**
   * عدد المستخدمين
   * @param {Object} filters - مرشحات العد
   * @returns {Promise<number>} - عدد المستخدمين
   */
  async count(filters = {}) {
    try {
      const where = {};

      if (filters.role) {
        where.role = filters.role;
      }

      if (filters.isActive !== undefined) {
        where.isActive = filters.isActive;
      }

      return await prisma.user.count({ where });
    } catch (error) {
      throw new Error(`فشل عد المستخدمين: ${error.message}`);
    }
  }

  /**
   * عدد المفضلات
   * @returns {Promise<number>} - عدد المفضلات
   */
  async countFavorites() {
    try {
      return await prisma.favorite.count();
    } catch (error) {
      throw new Error(`فشل عد المفضلات: ${error.message}`);
    }
  }

  /**
   * عدد إشعارات الأسعار
   * @returns {Promise<number>} - عدد إشعارات الأسعار
   */
  async countPriceAlerts() {
    try {
      return await prisma.priceAlert.count();
    } catch (error) {
      throw new Error(`فشل عد إشعارات الأسعار: ${error.message}`);
    }
  }

  /**
   * إحصاءات المستخدمين الجدد
   * @param {number} days - عدد الأيام
   * @returns {Promise<Array>} - إحصاءات المستخدمين الجدد
   */
  async getNewUsersStats(days = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      const stats = await prisma.$queryRaw`
        SELECT 
          DATE(created_at) as date, 
          COUNT(*) as count 
        FROM User 
        WHERE created_at >= ${startDate}
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `;

      return stats;
    } catch (error) {
      throw new Error(`فشل الحصول على إحصاءات المستخدمين الجدد: ${error.message}`);
    }
  }
}
module.exports = UserRepositoryImpl;