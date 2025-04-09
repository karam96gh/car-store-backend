/**
 * تنفيذ مستودع الإعلانات والعروض
 * يستخدم Prisma للتفاعل مع قاعدة البيانات
 */
const prisma = require('../prismaClient');

class PromotionRepositoryImpl {
  /**
   * إنشاء إعلان جديد
   * @param {Object} promotionData - بيانات الإعلان
   * @returns {Promise<Object>} - الإعلان المنشأ
   */
  async create(promotionData) {
    try {
      return await prisma.promotion.create({
        data: promotionData
      });
    } catch (error) {
      throw new Error(`فشل إنشاء الإعلان: ${error.message}`);
    }
  }

  /**
   * الحصول على كافة الإعلانات
   * @param {Object} filters - مرشحات (نشط/غير نشط)
   * @returns {Promise<Array>} - قائمة الإعلانات
   */
  async findAll(filters = {}) {
    try {
      const where = {};

      if (filters.isActive !== undefined) {
        where.isActive = filters.isActive;
      }

      return await prisma.promotion.findMany({
        where,
        orderBy: {
          startDate: 'desc'
        }
      });
    } catch (error) {
      throw new Error(`فشل الحصول على الإعلانات: ${error.message}`);
    }
  }

  /**
   * الحصول على الإعلانات النشطة
   * @param {Date} currentDate - التاريخ الحالي
   * @returns {Promise<Array>} - قائمة الإعلانات النشطة
   */
  async findActive(currentDate) {
    try {
      return await prisma.promotion.findMany({
        where: {
          isActive: true,
          startDate: {
            lte: currentDate
          },
          endDate: {
            gte: currentDate
          }
        },
        orderBy: {
          startDate: 'desc'
        }
      });
    } catch (error) {
      throw new Error(`فشل الحصول على الإعلانات النشطة: ${error.message}`);
    }
  }

  /**
   * الحصول على إعلان بواسطة المعرف
   * @param {number} id - معرف الإعلان
   * @returns {Promise<Object|null>} - الإعلان
   */
  async findById(id) {
    try {
      return await prisma.promotion.findUnique({
        where: { id: parseInt(id) }
      });
    } catch (error) {
      throw new Error(`فشل الحصول على الإعلان: ${error.message}`);
    }
  }

  /**
   * تحديث إعلان
   * @param {number} id - معرف الإعلان
   * @param {Object} promotionData - بيانات التحديث
   * @returns {Promise<Object>} - الإعلان المحدث
   */
  async update(id, promotionData) {
    try {
      return await prisma.promotion.update({
        where: { id: parseInt(id) },
        data: promotionData
      });
    } catch (error) {
      throw new Error(`فشل تحديث الإعلان: ${error.message}`);
    }
  }

  /**
   * حذف إعلان
   * @param {number} id - معرف الإعلان
   * @returns {Promise<boolean>} - هل تم الحذف بنجاح
   */
  async delete(id) {
    try {
      await prisma.promotion.delete({
        where: { id: parseInt(id) }
      });

      return true;
    } catch (error) {
      throw new Error(`فشل حذف الإعلان: ${error.message}`);
    }
  }
}

module.exports = PromotionRepositoryImpl;