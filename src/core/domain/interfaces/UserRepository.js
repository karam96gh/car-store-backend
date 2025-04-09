/**
 * واجهة مستودع المستخدمين
 * تحدد العمليات المطلوبة للتعامل مع بيانات المستخدمين
 */
class UserRepository {
    /**
     * إنشاء مستخدم جديد
     * @param {Object} userData - بيانات المستخدم
     * @returns {Promise<Object>} - المستخدم المنشأ
     */
    async create(userData) {
      throw new Error('Method not implemented');
    }
  
    /**
     * الحصول على كافة المستخدمين
     * @param {Object} filters - مرشحات البحث
     * @param {Object} pagination - خيارات التصفح
     * @returns {Promise<Array>} - قائمة المستخدمين
     */
    async findAll(filters = {}, pagination = { page: 1, limit: 10 }) {
      throw new Error('Method not implemented');
    }
  
    /**
     * الحصول على مستخدم بواسطة المعرف
     * @param {number} id - معرف المستخدم
     * @returns {Promise<Object|null>} - المستخدم أو null إذا لم يكن موجودًا
     */
    async findById(id) {
      throw new Error('Method not implemented');
    }
  
    /**
     * الحصول على مستخدم بواسطة البريد الإلكتروني
     * @param {string} email - البريد الإلكتروني
     * @returns {Promise<Object|null>} - المستخدم أو null إذا لم يكن موجودًا
     */
    async findByEmail(email) {
      throw new Error('Method not implemented');
    }
  
    /**
     * الحصول على مستخدم بواسطة رقم الهاتف
     * @param {string} phone - رقم الهاتف
     * @returns {Promise<Object|null>} - المستخدم أو null إذا لم يكن موجودًا
     */
    async findByPhone(phone) {
      throw new Error('Method not implemented');
    }
  
    /**
     * تحديث مستخدم
     * @param {number} id - معرف المستخدم
     * @param {Object} userData - بيانات التحديث
     * @returns {Promise<Object>} - المستخدم المحدث
     */
    async update(id, userData) {
      throw new Error('Method not implemented');
    }
  
    /**
     * تغيير حالة نشاط المستخدم
     * @param {number} id - معرف المستخدم
     * @param {boolean} isActive - حالة النشاط
     * @returns {Promise<Object>} - المستخدم المحدث
     */
    async updateActiveStatus(id, isActive) {
      throw new Error('Method not implemented');
    }
  
    /**
     * تغيير كلمة المرور
     * @param {number} id - معرف المستخدم
     * @param {string} password - كلمة المرور الجديدة (مشفرة)
     * @returns {Promise<boolean>} - هل تم التحديث بنجاح
     */
    async updatePassword(id, password) {
      throw new Error('Method not implemented');
    }
  
    /**
     * حذف مستخدم
     * @param {number} id - معرف المستخدم
     * @returns {Promise<boolean>} - هل تم الحذف بنجاح
     */
    async delete(id) {
      throw new Error('Method not implemented');
    }
  
    /**
     * إضافة سيارة للمفضلة
     * @param {number} userId - معرف المستخدم
     * @param {number} carId - معرف السيارة
     * @returns {Promise<Object>} - سجل المفضلة
     */
    async addFavorite(userId, carId) {
      throw new Error('Method not implemented');
    }
  
    /**
     * حذف سيارة من المفضلة
     * @param {number} userId - معرف المستخدم
     * @param {number} carId - معرف السيارة
     * @returns {Promise<boolean>} - هل تم الحذف بنجاح
     */
    async removeFavorite(userId, carId) {
      throw new Error('Method not implemented');
    }
  
    /**
     * الحصول على قائمة السيارات المفضلة للمستخدم
     * @param {number} userId - معرف المستخدم
     * @param {Object} pagination - خيارات التصفح
     * @returns {Promise<Array>} - قائمة السيارات المفضلة
     */
    async getFavorites(userId, pagination = { page: 1, limit: 10 }) {
      throw new Error('Method not implemented');
    }
  
    /**
     * إضافة إشعار سعر
     * @param {number} userId - معرف المستخدم
     * @param {number} carId - معرف السيارة
     * @param {number} targetPrice - السعر المستهدف
     * @returns {Promise<Object>} - إشعار السعر
     */
    async addPriceAlert(userId, carId, targetPrice) {
      throw new Error('Method not implemented');
    }
  
    /**
     * حذف إشعار سعر
     * @param {number} alertId - معرف الإشعار
     * @returns {Promise<boolean>} - هل تم الحذف بنجاح
     */
    async removePriceAlert(alertId) {
      throw new Error('Method not implemented');
    }
  
    /**
     * الحصول على قائمة إشعارات الأسعار للمستخدم
     * @param {number} userId - معرف المستخدم
     * @returns {Promise<Array>} - قائمة إشعارات الأسعار
     */
    async getPriceAlerts(userId) {
      throw new Error('Method not implemented');
    }
  
    /**
     * إضافة سجل تصفح
     * @param {number} userId - معرف المستخدم
     * @param {number} carId - معرف السيارة
     * @returns {Promise<Object>} - سجل التصفح
     */
    async addBrowserHistory(userId, carId) {
      throw new Error('Method not implemented');
    }
  
    /**
     * الحصول على سجل تصفح المستخدم
     * @param {number} userId - معرف المستخدم
     * @param {Object} pagination - خيارات التصفح
     * @returns {Promise<Array>} - سجل التصفح
     */
    async getBrowserHistory(userId, pagination = { page: 1, limit: 10 }) {
      throw new Error('Method not implemented');
    }
  }
  
  module.exports = UserRepository;