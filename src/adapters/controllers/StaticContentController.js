/**
 * متحكم المحتوى الثابت
 * مسؤول عن معالجة طلبات الصفحات الثابتة والإعلانات
 */
class StaticContentController {
    constructor(staticContentUseCases) {
      this.staticContentUseCases = staticContentUseCases;
    }
  
    // ==================== الصفحات الثابتة (عام) ====================
  
    /**
     * الحصول على صفحة ثابتة بواسطة المسار
     * @param {Object} req - كائن الطلب
     * @param {Object} res - كائن الاستجابة
     * @param {Function} next - دالة التالي
     */
    async getStaticPageBySlug(req, res, next) {
      try {
        const { slug } = req.params;
        
        // الحصول على الصفحة
        const page = await this.staticContentUseCases.getStaticPageBySlug(slug);
  
        res.status(200).json({
          success: true,
          data: page
        });
      } catch (error) {
        if (error.message === 'الصفحة غير موجودة') {
          return res.status(404).json({
            success: false,
            message: error.message
          });
        }
        next(error);
      }
    }
  
    /**
     * الحصول على الإعلانات النشطة
     * @param {Object} req - كائن الطلب
     * @param {Object} res - كائن الاستجابة
     * @param {Function} next - دالة التالي
     */
    async getActivePromotions(req, res, next) {
      try {
        // الحصول على الإعلانات النشطة
        const promotions = await this.staticContentUseCases.getActivePromotions();
  
        res.status(200).json({
          success: true,
          data: promotions
        });
      } catch (error) {
        next(error);
      }
    }
  
    // ==================== الصفحات الثابتة (إدارة) ====================
  
    /**
     * إنشاء صفحة ثابتة
     * @param {Object} req - كائن الطلب
     * @param {Object} res - كائن الاستجابة
     * @param {Function} next - دالة التالي
     */
    async createStaticPage(req, res, next) {
      try {
        const { title, content, slug } = req.body;
        
        // التحقق من البيانات المطلوبة
        if (!title || !content || !slug) {
          return res.status(400).json({
            success: false,
            message: 'الرجاء توفير جميع البيانات المطلوبة'
          });
        }
        
        // إنشاء الصفحة
        const page = await this.staticContentUseCases.createStaticPage({
          title,
          content,
          slug
        });
  
        res.status(201).json({
          success: true,
          message: 'تم إنشاء الصفحة بنجاح',
          data: page
        });
      } catch (error) {
        if (error.message === 'يوجد صفحة بهذا المسار بالفعل' || 
            error.message === 'بيانات الصفحة غير مكتملة') {
          return res.status(400).json({
            success: false,
            message: error.message
          });
        }
        next(error);
      }
    }
  
    /**
     * الحصول على كافة الصفحات الثابتة
     * @param {Object} req - كائن الطلب
     * @param {Object} res - كائن الاستجابة
     * @param {Function} next - دالة التالي
     */
    async getAllStaticPages(req, res, next) {
      try {
        // الحصول على كافة الصفحات
        const pages = await this.staticContentUseCases.getAllStaticPages();
  
        res.status(200).json({
          success: true,
          data: pages
        });
      } catch (error) {
        next(error);
      }
    }
  
    /**
     * الحصول على صفحة ثابتة بواسطة المعرف
     * @param {Object} req - كائن الطلب
     * @param {Object} res - كائن الاستجابة
     * @param {Function} next - دالة التالي
     */
    async getStaticPageById(req, res, next) {
      try {
        const { id } = req.params;
        
        // الحصول على الصفحة
        const page = await this.staticContentUseCases.getStaticPageById(id);
  
        res.status(200).json({
          success: true,
          data: page
        });
      } catch (error) {
        if (error.message === 'الصفحة غير موجودة') {
          return res.status(404).json({
            success: false,
            message: error.message
          });
        }
        next(error);
      }
    }
  
    /**
     * تحديث صفحة ثابتة
     * @param {Object} req - كائن الطلب
     * @param {Object} res - كائن الاستجابة
     * @param {Function} next - دالة التالي
     */
    async updateStaticPage(req, res, next) {
      try {
        const { id } = req.params;
        const { title, content, slug } = req.body;
        
        // تحديث الصفحة
        const updatedPage = await this.staticContentUseCases.updateStaticPage(id, {
          title,
          content,
          slug
        });
  
        res.status(200).json({
          success: true,
          message: 'تم تحديث الصفحة بنجاح',
          data: updatedPage
        });
      } catch (error) {
        if (error.message === 'الصفحة غير موجودة' ||
            error.message === 'يوجد صفحة أخرى بهذا المسار') {
          return res.status(400).json({
            success: false,
            message: error.message
          });
        }
        next(error);
      }
    }
  
    /**
     * حذف صفحة ثابتة
     * @param {Object} req - كائن الطلب
     * @param {Object} res - كائن الاستجابة
     * @param {Function} next - دالة التالي
     */
    async deleteStaticPage(req, res, next) {
      try {
        const { id } = req.params;
        
        // حذف الصفحة
        await this.staticContentUseCases.deleteStaticPage(id);
  
        res.status(200).json({
          success: true,
          message: 'تم حذف الصفحة بنجاح'
        });
      } catch (error) {
        if (error.message === 'الصفحة غير موجودة') {
          return res.status(404).json({
            success: false,
            message: error.message
          });
        }
        next(error);
      }
    }
  
    // ==================== الإعلانات (إدارة) ====================
  
    /**
     * إنشاء إعلان جديد
     * @param {Object} req - كائن الطلب
     * @param {Object} res - كائن الاستجابة
     * @param {Function} next - دالة التالي
     */
    async createPromotion(req, res, next) {
      try {
        const { title, description, linkUrl, startDate, endDate, isActive } = req.body;
        const file = req.file;
        
        // التحقق من البيانات المطلوبة
        if (!title || !description || !file || !startDate || !endDate) {
          return res.status(400).json({
            success: false,
            message: 'الرجاء توفير جميع البيانات المطلوبة'
          });
        }
        
        // إنشاء الإعلان
        const promotion = await this.staticContentUseCases.createPromotion(
          {
            title,
            description,
            linkUrl,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            isActive: isActive === 'true' || isActive === true
          },
          file
        );
  
        res.status(201).json({
          success: true,
          message: 'تم إنشاء الإعلان بنجاح',
          data: promotion
        });
      } catch (error) {
        if (error.message === 'بيانات الإعلان غير مكتملة') {
          return res.status(400).json({
            success: false,
            message: error.message
          });
        }
        next(error);
      }
    }
  
    /**
     * الحصول على كافة الإعلانات
     * @param {Object} req - كائن الطلب
     * @param {Object} res - كائن الاستجابة
     * @param {Function} next - دالة التالي
     */
    async getAllPromotions(req, res, next) {
      try {
        const { isActive } = req.query;
        
        // إعداد المرشحات
        const filters = {};
        
        if (isActive !== undefined) {
          filters.isActive = isActive === 'true';
        }
        
        // الحصول على كافة الإعلانات
        const promotions = await this.staticContentUseCases.getAllPromotions(filters);
  
        res.status(200).json({
          success: true,
          data: promotions
        });
      } catch (error) {
        next(error);
      }
    }
  
    /**
     * الحصول على إعلان بواسطة المعرف
     * @param {Object} req - كائن الطلب
     * @param {Object} res - كائن الاستجابة
     * @param {Function} next - دالة التالي
     */
    async getPromotionById(req, res, next) {
      try {
        const { id } = req.params;
        
        // الحصول على الإعلان
        const promotion = await this.staticContentUseCases.getPromotionById(id);
  
        res.status(200).json({
          success: true,
          data: promotion
        });
      } catch (error) {
        if (error.message === 'الإعلان غير موجود') {
          return res.status(404).json({
            success: false,
            message: error.message
          });
        }
        next(error);
      }
    }
  
    /**
     * تحديث إعلان
     * @param {Object} req - كائن الطلب
     * @param {Object} res - كائن الاستجابة
     * @param {Function} next - دالة التالي
     */
    async updatePromotion(req, res, next) {
      try {
        const { id } = req.params;
        const { title, description, linkUrl, startDate, endDate, isActive } = req.body;
        const file = req.file || null;
        
        // إعداد بيانات التحديث
        const promotionData = {};
        
        if (title) promotionData.title = title;
        if (description) promotionData.description = description;
        if (linkUrl !== undefined) promotionData.linkUrl = linkUrl;
        if (startDate) promotionData.startDate = new Date(startDate);
        if (endDate) promotionData.endDate = new Date(endDate);
        if (isActive !== undefined) promotionData.isActive = isActive === 'true' || isActive === true;
        
        // تحديث الإعلان
        const updatedPromotion = await this.staticContentUseCases.updatePromotion(
          id,
          promotionData,
          file
        );
  
        res.status(200).json({
          success: true,
          message: 'تم تحديث الإعلان بنجاح',
          data: updatedPromotion
        });
      } catch (error) {
        if (error.message === 'الإعلان غير موجود') {
          return res.status(404).json({
            success: false,
            message: error.message
          });
        }
        next(error);
      }
    }
  
    /**
     * حذف إعلان
     * @param {Object} req - كائن الطلب
     * @param {Object} res - كائن الاستجابة
     * @param {Function} next - دالة التالي
     */
    async deletePromotion(req, res, next) {
      try {
        const { id } = req.params;
        
        // حذف الإعلان
        await this.staticContentUseCases.deletePromotion(id);
  
        res.status(200).json({
          success: true,
          message: 'تم حذف الإعلان بنجاح'
        });
      } catch (error) {
        if (error.message === 'الإعلان غير موجود') {
          return res.status(404).json({
            success: false,
            message: error.message
          });
        }
        next(error);
      }
    }
  }
  
  module.exports = StaticContentController;