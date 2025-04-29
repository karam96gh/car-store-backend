// src/core/usecases/BrandUseCases.js
class BrandUseCases {
    constructor(brandRepository) {
      this.brandRepository = brandRepository;
    }
  
    /**
     * الحصول على قائمة العلامات التجارية
     * @returns {Promise<Array>} - قائمة العلامات التجارية
     */
    async getBrands() {
      return this.brandRepository.getBrands();
    }
  
    /**
     * الحصول على علامة تجارية محددة
     * @param {string} brandId - معرف العلامة التجارية
     * @returns {Promise<Object|null>} - العلامة التجارية أو null
     */
    async getBrandById(brandId) {
      const brand = await this.brandRepository.getBrandById(brandId);
      
      if (!brand) {
        throw new Error('العلامة التجارية غير موجودة');
      }
      
      return brand;
    }
  }
  
  module.exports = BrandUseCases;