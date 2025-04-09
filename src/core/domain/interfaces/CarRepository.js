/**
 * واجهة مستودع السيارات
 * تحدد العمليات المطلوبة للتعامل مع بيانات السيارات
 */
class CarRepository {
    /**
     * إنشاء سيارة جديدة
     * @param {Object} carData - بيانات السيارة
     * @returns {Promise<Object>} - السيارة المنشأة
     */
    async create(carData) {
      throw new Error('Method not implemented');
    }
  
    /**
     * الحصول على كافة السيارات
     * @param {Object} filters - مرشحات البحث
     * @param {Object} pagination - خيارات التصفح
     * @returns {Promise<Array>} - قائمة السيارات
     */
    async findAll(filters = {}, pagination = { page: 1, limit: 10 }) {
      throw new Error('Method not implemented');
    }
  
    /**
     * الحصول على سيارة بواسطة المعرف
     * @param {number} id - معرف السيارة
     * @returns {Promise<Object|null>} - السيارة أو null إذا لم تكن موجودة
     */
    async findById(id) {
      throw new Error('Method not implemented');
    }
  
    /**
     * تحديث سيارة
     * @param {number} id - معرف السيارة
     * @param {Object} carData - بيانات التحديث
     * @returns {Promise<Object>} - السيارة المحدثة
     */
    async update(id, carData) {
      throw new Error('Method not implemented');
    }
  
    /**
     * حذف سيارة
     * @param {number} id - معرف السيارة
     * @returns {Promise<boolean>} - هل تم الحذف بنجاح
     */
    async delete(id) {
      throw new Error('Method not implemented');
    }
  
    /**
     * زيادة عدد المشاهدات
     * @param {number} id - معرف السيارة
     * @returns {Promise<Object>} - السيارة المحدثة
     */
    async incrementViews(id) {
      throw new Error('Method not implemented');
    }
  
    /**
     * البحث عن السيارات حسب معايير مختلفة
     * @param {Object} criteria - معايير البحث
     * @param {Object} pagination - خيارات التصفح
     * @returns {Promise<Array>} - قائمة السيارات
     */
    async search(criteria, pagination = { page: 1, limit: 10 }) {
      throw new Error('Method not implemented');
    }
  
    /**
     * الحصول على السيارات المميزة
     * @param {number} limit - عدد السيارات
     * @returns {Promise<Array>} - قائمة السيارات المميزة
     */
    async findFeatured(limit = 10) {
      throw new Error('Method not implemented');
    }
  
    /**
     * الحصول على السيارات الأكثر مشاهدة
     * @param {number} limit - عدد السيارات
     * @returns {Promise<Array>} - قائمة السيارات الأكثر مشاهدة
     */
    async findMostViewed(limit = 10) {
      throw new Error('Method not implemented');
    }
  
    /**
     * إضافة صورة للسيارة
     * @param {number} carId - معرف السيارة
     * @param {Object} imageData - بيانات الصورة
     * @returns {Promise<Object>} - الصورة المضافة
     */
    async addImage(carId, imageData) {
      throw new Error('Method not implemented');
    }
  
    /**
     * حذف صورة من السيارة
     * @param {number} imageId - معرف الصورة
     * @returns {Promise<boolean>} - هل تم الحذف بنجاح
     */
    async deleteImage(imageId) {
      throw new Error('Method not implemented');
    }
  
    /**
     * إضافة مواصفة للسيارة
     * @param {number} carId - معرف السيارة
     * @param {Object} specData - بيانات المواصفة
     * @returns {Promise<Object>} - المواصفة المضافة
     */
    async addSpecification(carId, specData) {
      throw new Error('Method not implemented');
    }
  
    /**
     * حذف مواصفة من السيارة
     * @param {number} specId - معرف المواصفة
     * @returns {Promise<boolean>} - هل تم الحذف بنجاح
     */
    async deleteSpecification(specId) {
      throw new Error('Method not implemented');
    }
  }
  module.exports = CarRepository;