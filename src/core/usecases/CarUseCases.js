/**
 * حالات استخدام السيارات
 * تحتوي على المنطق الخاص بعمليات السيارات
 */
const Car = require('../domain/entities/Car');

class CarUseCases {
  constructor(carRepository, storageService) {
    this.carRepository = carRepository;
    this.storageService = storageService;
  }

  /**
   * إنشاء سيارة جديدة
   * @param {Object} carData - بيانات السيارة
   * @returns {Promise<Object>} - السيارة المنشأة
   */
  async createCar(carData) {
    // معالجة الأبعاد إذا تم توفيرها كحقول منفصلة
    const dimensions = this._processDimensions(carData);
    
    // إنشاء كيان سيارة مع الأبعاد
    const carDataWithDimensions = {
      ...carData,
      dimensions
    };
    
    const car = new Car(carDataWithDimensions);
    
    // التحقق من صحة البيانات
    car.validate();
    
    // حفظ السيارة في قاعدة البيانات
    return this.carRepository.create(car);
  }

  /**
   * تحديث سيارة
   * @param {number} id - معرف السيارة
   * @param {Object} carData - بيانات التحديث
   * @returns {Promise<Object>} - السيارة المحدثة
   */
  async updateCar(id, carData) {
    // التحقق من وجود السيارة
    const existingCar = await this.carRepository.findById(id);
    
    if (!existingCar) {
      throw new Error('السيارة غير موجودة');
    }
    
    // معالجة الأبعاد إذا تم توفيرها كحقول منفصلة
    const dimensions = this._processDimensions(carData);
    
    // دمج البيانات الحالية مع التحديث
    const updatedCarData = { 
      ...existingCar, 
      ...carData,
      dimensions: dimensions || existingCar.dimensions
    };
    
    // إنشاء كيان سيارة محدث
    const updatedCar = new Car(updatedCarData);
    
    // التحقق من صحة البيانات
    updatedCar.validate();
    
    // حفظ التحديث في قاعدة البيانات
    return this.carRepository.update(id, updatedCar);
  }

  /**
   * معالجة بيانات الأبعاد
   * @private
   * @param {Object} carData - بيانات السيارة
   * @returns {Object|null} - كائن الأبعاد أو null
   */
  _processDimensions(carData) {
    const { dimensionLength, dimensionWidth, dimensionHeight, ...rest } = carData;
    
    // التحقق من وجود أي من حقول الأبعاد
    if (dimensionLength || dimensionWidth || dimensionHeight || 
        (carData.dimensions && Object.keys(carData.dimensions).length > 0)) {
      
      // إذا كان هناك كائن أبعاد جاهز، استخدمه
      if (carData.dimensions) {
        return carData.dimensions;
      }
      
      // وإلا قم بإنشاء كائن جديد
      const dimensions = {};
      
      if (dimensionLength) dimensions.length = parseFloat(dimensionLength);
      if (dimensionWidth) dimensions.width = parseFloat(dimensionWidth);
      if (dimensionHeight) dimensions.height = parseFloat(dimensionHeight);
      
      return Object.keys(dimensions).length > 0 ? dimensions : null;
    }
    
    return null;
  }

  /**
   * الحصول على سيارات مشابهة
   * @param {number} carId - معرف السيارة
   * @param {number} limit - عدد السيارات
   * @returns {Promise<Array>} - قائمة السيارات المشابهة
   */
  async getSimilarCars(carId, limit = 6) {
    // الحصول على السيارة
    const car = await this.carRepository.findById(carId);
    
    if (!car) {
      throw new Error('السيارة غير موجودة');
    }
    
    // معايير البحث للسيارات المشابهة
    const criteria = {
      category: car.category,
      make: car.make,
      excludeId: carId,
      priceRange: {
        min: car.price * 0.8, // 80% من السعر
        max: car.price * 1.2  // 120% من السعر
      }
    };
    
    // إضافة الحقول الجديدة للبحث عن سيارات مشابهة
    if (car.fuel) {
      criteria.fuel = car.fuel;
    }
    
    if (car.transmission) {
      criteria.transmission = car.transmission;
    }
    
    // البحث عن سيارات مشابهة
    const result = await this.carRepository.search(criteria, { page: 1, limit });
    
    return result.data;
  }







///////////////////////////////////////
 

  /**
   * الحصول على قائمة السيارات
   * @param {Object} filters - مرشحات البحث
   * @param {Object} pagination - خيارات التصفح
   * @returns {Promise<Object>} - قائمة السيارات مع معلومات التصفح
   */
  async getCars(filters = {}, pagination = { page: 1, limit: 10 }) {
    return this.carRepository.findAll(filters, pagination);
  }

  /**
   * الحصول على سيارة بواسطة المعرف
   * @param {number} id - معرف السيارة
   * @returns {Promise<Object>} - السيارة
   */
  async getCarById(id) {
    const car = await this.carRepository.findById(id);
    
    if (!car) {
      throw new Error('السيارة غير موجودة');
    }
    
    return car;
  }



  /**
   * حذف سيارة
   * @param {number} id - معرف السيارة
   * @returns {Promise<boolean>} - هل تم الحذف بنجاح
   */
  async deleteCar(id) {
    // التحقق من وجود السيارة
    const car = await this.carRepository.findById(id);
    
    if (!car) {
      throw new Error('السيارة غير موجودة');
    }
    
    // حذف الصور المرتبطة بالسيارة
    if (car.images && car.images.length > 0) {
      for (const image of car.images) {
        await this.storageService.deleteFile(image.url);
      }
    }
    
    // حذف السيارة من قاعدة البيانات
    return this.carRepository.delete(id);
  }

  /**
   * زيادة عدد مشاهدات السيارة
   * @param {number} id - معرف السيارة
   * @returns {Promise<Object>} - السيارة المحدثة
   */
  async incrementCarViews(id) {
    return this.carRepository.incrementViews(id);
  }

  /**
   * البحث عن السيارات
   * @param {Object} criteria - معايير البحث
   * @param {Object} pagination - خيارات التصفح
   * @returns {Promise<Object>} - نتائج البحث
   */
  async searchCars(criteria, pagination = { page: 1, limit: 10 }) {
    return this.carRepository.search(criteria, pagination);
  }

  /**
   * الحصول على السيارات المميزة
   * @param {number} limit - عدد السيارات
   * @returns {Promise<Array>} - قائمة السيارات المميزة
   */
  async getFeaturedCars(limit = 10) {
    return this.carRepository.findFeatured(limit);
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
   * إضافة صورة للسيارة
   * @param {number} carId - معرف السيارة
   * @param {Object} file - ملف الصورة
   * @param {Object} imageData - بيانات إضافية للصورة
   * @returns {Promise<Object>} - الصورة المضافة
   */
  async addCarImage(carId, file, imageData = {}) {
    // التحقق من وجود السيارة
    const car = await this.carRepository.findById(carId);
    
    if (!car) {
      throw new Error('السيارة غير موجودة');
    }
    
    // رفع الملف إلى خدمة التخزين
    const uploadedFile = await this.storageService.uploadFile(file, 'car-images');
    
    // إعداد بيانات الصورة
    const carImageData = {
      url: uploadedFile.url,
      isMain: imageData.isMain || false,
      is360View: imageData.is360View || false
    };
    
    // إضافة الصورة في قاعدة البيانات
    return this.carRepository.addImage(carId, carImageData);
  }

  /**
   * حذف صورة من السيارة
   * @param {number} imageId - معرف الصورة
   * @returns {Promise<boolean>} - هل تم الحذف بنجاح
   */
  async deleteCarImage(imageId) {
    try {
      // الحصول على بيانات الصورة
      console.log(`جاري البحث عن الصورة برقم: ${imageId}`);
      const image = await this.carRepository.getImageById(imageId);
      
      if (!image) {
        console.error('الصورة غير موجودة في قاعدة البيانات');
        throw new Error('الصورة غير موجودة');
      }
      
      console.log(`تم العثور على الصورة. URL: ${image.url}`);
      
      // حذف الملف من خدمة التخزين
      try {
        await this.storageService.deleteFile(image.url);
        console.log('تم حذف الصورة من التخزين');
      } catch (storageError) {
        console.warn('لم يتم حذف الصورة من التخزين بنجاح، لكن سنستمر في الحذف من قاعدة البيانات:', storageError.message);
        // سنستمر بحذف الإشارة في قاعدة البيانات حتى لو فشل حذف الملف
      }
      
      // حذف الصورة من قاعدة البيانات
      const result = await this.carRepository.deleteImage(imageId);
      console.log('تم حذف الصورة من قاعدة البيانات بنجاح');
      
      return result;
    } catch (error) {
      console.error('خطأ في حذف الصورة:', error);
      throw error;
    }
  }

  /**
   * إضافة مواصفة للسيارة
   * @param {number} carId - معرف السيارة
   * @param {Object} specData - بيانات المواصفة
   * @returns {Promise<Object>} - المواصفة المضافة
   */
  async addCarSpecification(carId, specData) {
    // التحقق من وجود السيارة
    const car = await this.carRepository.findById(carId);
    
    if (!car) {
      throw new Error('السيارة غير موجودة');
    }
    
    // التحقق من بيانات المواصفة
    if (!specData.key || !specData.value) {
      throw new Error('بيانات المواصفة غير مكتملة');
    }
    
    // إضافة المواصفة في قاعدة البيانات
    return this.carRepository.addSpecification(carId, specData);
  }

  /**
   * حذف مواصفة من السيارة
   * @param {number} specId - معرف المواصفة
   * @returns {Promise<boolean>} - هل تم الحذف بنجاح
   */
  async deleteCarSpecification(specId) {
    return this.carRepository.deleteSpecification(specId);
  }


}

module.exports = CarUseCases;