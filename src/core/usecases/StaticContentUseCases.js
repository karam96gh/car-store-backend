/**
 * حالات استخدام المحتوى الثابت
 * تشمل الصفحات الثابتة والإعلانات
 */
class StaticContentUseCases {
    constructor(staticPageRepository, promotionRepository, storageService) {
      this.staticPageRepository = staticPageRepository;
      this.promotionRepository = promotionRepository;
      this.storageService = storageService;
    }
  
    // ==================== الصفحات الثابتة ====================
  
    /**
     * إنشاء صفحة ثابتة جديدة
     * @param {Object} pageData - بيانات الصفحة
     * @returns {Promise<Object>} - الصفحة المنشأة
     */
    async createStaticPage(pageData) {
      // التحقق من وجود الصفحة بنفس الـ slug
      const existingPage = await this.staticPageRepository.findBySlug(pageData.slug);
      
      if (existingPage) {
        throw new Error('يوجد صفحة بهذا المسار بالفعل');
      }
      
      // التحقق من البيانات
      if (!pageData.title || !pageData.content || !pageData.slug) {
        throw new Error('بيانات الصفحة غير مكتملة');
      }
      
      // تنسيق الـ slug
      pageData.slug = this._formatSlug(pageData.slug);
      
      // إنشاء الصفحة
      return this.staticPageRepository.create(pageData);
    }
  
    /**
     * الحصول على كافة الصفحات الثابتة
     * @returns {Promise<Array>} - قائمة الصفحات
     */
    async getAllStaticPages() {
      return this.staticPageRepository.findAll();
    }
  
    /**
     * الحصول على صفحة ثابتة بواسطة المعرف
     * @param {number} id - معرف الصفحة
     * @returns {Promise<Object>} - الصفحة
     */
    async getStaticPageById(id) {
      const page = await this.staticPageRepository.findById(id);
      
      if (!page) {
        throw new Error('الصفحة غير موجودة');
      }
      
      return page;
    }
  
    /**
     * الحصول على صفحة ثابتة بواسطة المسار
     * @param {string} slug - مسار الصفحة
     * @returns {Promise<Object>} - الصفحة
     */
    async getStaticPageBySlug(slug) {
      const page = await this.staticPageRepository.findBySlug(slug);
      
      if (!page) {
        throw new Error('الصفحة غير موجودة');
      }
      
      return page;
    }
  
    /**
     * تحديث صفحة ثابتة
     * @param {number} id - معرف الصفحة
     * @param {Object} pageData - بيانات التحديث
     * @returns {Promise<Object>} - الصفحة المحدثة
     */
    async updateStaticPage(id, pageData) {
      // التحقق من وجود الصفحة
      const existingPage = await this.staticPageRepository.findById(id);
      
      if (!existingPage) {
        throw new Error('الصفحة غير موجودة');
      }
      
      // التحقق من تغيير المسار
      if (pageData.slug && pageData.slug !== existingPage.slug) {
        const pageWithSlug = await this.staticPageRepository.findBySlug(pageData.slug);
        
        if (pageWithSlug && pageWithSlug.id !== id) {
          throw new Error('يوجد صفحة أخرى بهذا المسار');
        }
        
        // تنسيق المسار الجديد
        pageData.slug = this._formatSlug(pageData.slug);
      }
      
      // تحديث الصفحة
      return this.staticPageRepository.update(id, pageData);
    }
  
    /**
     * حذف صفحة ثابتة
     * @param {number} id - معرف الصفحة
     * @returns {Promise<boolean>} - هل تم الحذف بنجاح
     */
    async deleteStaticPage(id) {
      // التحقق من وجود الصفحة
      const page = await this.staticPageRepository.findById(id);
      
      if (!page) {
        throw new Error('الصفحة غير موجودة');
      }
      
      // حذف الصفحة
      return this.staticPageRepository.delete(id);
    }
  
    // ==================== الإعلانات والعروض ====================
  
    /**
     * إنشاء إعلان جديد
     * @param {Object} promotionData - بيانات الإعلان
     * @param {Object} imageFile - ملف صورة الإعلان
     * @returns {Promise<Object>} - الإعلان المنشأ
     */
    async createPromotion(promotionData, imageFile) {
      // التحقق من البيانات
      if (!promotionData.title || !promotionData.description || !imageFile) {
        throw new Error('بيانات الإعلان غير مكتملة');
      }
      
      // رفع صورة الإعلان
      const uploadedImage = await this.storageService.uploadFile(imageFile, 'promotions');
      
      // إضافة رابط الصورة
      promotionData.imageUrl = uploadedImage.url;
      
      // إنشاء الإعلان
      return this.promotionRepository.create(promotionData);
    }
  
    /**
     * الحصول على كافة الإعلانات
     * @param {Object} filters - مرشحات (نشط/غير نشط)
     * @returns {Promise<Array>} - قائمة الإعلانات
     */
    async getAllPromotions(filters = {}) {
      return this.promotionRepository.findAll(filters);
    }
  
    /**
     * الحصول على الإعلانات النشطة
     * @returns {Promise<Array>} - قائمة الإعلانات النشطة
     */
    async getActivePromotions() {
      const now = new Date();
      
      return this.promotionRepository.findActive(now);
    }
  
    /**
     * الحصول على إعلان بواسطة المعرف
     * @param {number} id - معرف الإعلان
     * @returns {Promise<Object>} - الإعلان
     */
    async getPromotionById(id) {
      const promotion = await this.promotionRepository.findById(id);
      
      if (!promotion) {
        throw new Error('الإعلان غير موجود');
      }
      
      return promotion;
    }
  
    /**
     * تحديث إعلان
     * @param {number} id - معرف الإعلان
     * @param {Object} promotionData - بيانات التحديث
     * @param {Object} imageFile - ملف صورة الإعلان الجديد (اختياري)
     * @returns {Promise<Object>} - الإعلان المحدث
     */
    async updatePromotion(id, promotionData, imageFile = null) {
      // التحقق من وجود الإعلان
      const existingPromotion = await this.promotionRepository.findById(id);
      
      if (!existingPromotion) {
        throw new Error('الإعلان غير موجود');
      }
      
      // إذا تم توفير صورة جديدة
      if (imageFile) {
        // حذف الصورة القديمة
        await this.storageService.deleteFile(existingPromotion.imageUrl);
        
        // رفع الصورة الجديدة
        const uploadedImage = await this.storageService.uploadFile(imageFile, 'promotions');
        
        // تحديث رابط الصورة
        promotionData.imageUrl = uploadedImage.url;
      }
      
      // تحديث الإعلان
      return this.promotionRepository.update(id, promotionData);
    }
  
    /**
     * حذف إعلان
     * @param {number} id - معرف الإعلان
     * @returns {Promise<boolean>} - هل تم الحذف بنجاح
     */
    async deletePromotion(id) {
      // التحقق من وجود الإعلان
      const promotion = await this.promotionRepository.findById(id);
      
      if (!promotion) {
        throw new Error('الإعلان غير موجود');
      }
      
      // حذف صورة الإعلان
      await this.storageService.deleteFile(promotion.imageUrl);
      
      // حذف الإعلان
      return this.promotionRepository.delete(id);
    }
  
    /**
     * تنسيق المسار (slug)
     * @private
     * @param {string} slug - المسار
     * @returns {string} - المسار المنسق
     */
    _formatSlug(slug) {
      // إزالة المسافات والأحرف الخاصة
      return slug
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }
  }
  
  module.exports = StaticContentUseCases;