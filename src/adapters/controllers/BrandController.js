// src/adapters/controllers/BrandController.js
/**
 * متحكم العلامات التجارية
 * للتعامل مع طلبات API المتعلقة بالعلامات التجارية
 */
class BrandController {
    constructor(brandUseCases) {
      this.brandUseCases = brandUseCases;
    }
  
    /**
     * الحصول على قائمة العلامات التجارية
     * @param {Object} req - كائن الطلب
     * @param {Object} res - كائن الاستجابة
     * @param {Function} next - دالة التالي
     */
    async getBrands(req, res, next) {
      try {
        const brands = await this.brandUseCases.getBrands();
        
        res.status(200).json({
          success: true,
          data: brands
        });
      } catch (error) {
        next(error);
      }
    }
  
    /**
     * الحصول على علامة تجارية محددة
     * @param {Object} req - كائن الطلب
     * @param {Object} res - كائن الاستجابة
     * @param {Function} next - دالة التالي
     */
    async getBrandById(req, res, next) {
      try {
        const { id } = req.params;
        
        const brand = await this.brandUseCases.getBrandById(id);
        
        res.status(200).json({
          success: true,
          data: brand
        });
      } catch (error) {
        if (error.message === 'العلامة التجارية غير موجودة') {
          return res.status(404).json({
            success: false,
            message: error.message
          });
        }
        next(error);
      }
    }
  }
  
  module.exports = BrandController;