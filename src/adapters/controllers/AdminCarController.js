/**
 * متحكم السيارات للإدارة
 * مسؤول عن معالجة طلبات إدارة السيارات
 */
class AdminCarController {
    constructor(carUseCases) {
      this.carUseCases = carUseCases;
    }
  
    /**
     * إنشاء سيارة جديدة
     * @param {Object} req - كائن الطلب
     * @param {Object} res - كائن الاستجابة
     * @param {Function} next - دالة التالي
     */
    async createCar(req, res, next) {
      try {
        // الحصول على بيانات السيارة من الطلب
        const carData = req.body;
        
        // إنشاء سيارة جديدة
        const car = await this.carUseCases.createCar(carData);
  
        res.status(201).json({
          success: true,
          message: 'تم إنشاء السيارة بنجاح',
          data: car
        });
      } catch (error) {
        next(error);
      }
    }
  
    /**
     * تحديث سيارة
     * @param {Object} req - كائن الطلب
     * @param {Object} res - كائن الاستجابة
     * @param {Function} next - دالة التالي
     */
    async updateCar(req, res, next) {
      try {
        const { id } = req.params;
        const carData = req.body;
        
        // تحديث السيارة
        const updatedCar = await this.carUseCases.updateCar(id, carData);
  
        res.status(200).json({
          success: true,
          message: 'تم تحديث السيارة بنجاح',
          data: updatedCar
        });
      } catch (error) {
        if (error.message === 'السيارة غير موجودة') {
          return res.status(404).json({
            success: false,
            message: error.message
          });
        }
        next(error);
      }
    }
  
    /**
     * حذف سيارة
     * @param {Object} req - كائن الطلب
     * @param {Object} res - كائن الاستجابة
     * @param {Function} next - دالة التالي
     */
    async deleteCar(req, res, next) {
      try {
        const { id } = req.params;
        
        // حذف السيارة
        await this.carUseCases.deleteCar(id);
  
        res.status(200).json({
          success: true,
          message: 'تم حذف السيارة بنجاح'
        });
      } catch (error) {
        if (error.message === 'السيارة غير موجودة') {
          return res.status(404).json({
            success: false,
            message: error.message
          });
        }
        next(error);
      }
    }
  
    /**
     * إضافة صورة للسيارة
     * @param {Object} req - كائن الطلب
     * @param {Object} res - كائن الاستجابة
     * @param {Function} next - دالة التالي
     */
    async addCarImage(req, res, next) {
      try {
        const { id } = req.params;
        const file = req.file;
        const { isMain, is360View } = req.body;
        
        // التحقق من وجود الملف
        if (!file) {
          return res.status(400).json({
            success: false,
            message: 'الرجاء توفير صورة للتحميل'
          });
        }
        
        // إعداد بيانات الصورة
        const imageData = {
          isMain: isMain === 'true' || isMain === true,
          is360View: is360View === 'true' || is360View === true
        };
        
        // إضافة الصورة
        const image = await this.carUseCases.addCarImage(id, file, imageData);
  
        res.status(201).json({
          success: true,
          message: 'تم إضافة الصورة بنجاح',
          data: image
        });
      } catch (error) {
        if (error.message === 'السيارة غير موجودة') {
          return res.status(404).json({
            success: false,
            message: error.message
          });
        }
        next(error);
      }
    }
  
    /**
     * حذف صورة من السيارة
     * @param {Object} req - كائن الطلب
     * @param {Object} res - كائن الاستجابة
     * @param {Function} next - دالة التالي
     */
    async deleteCarImage(req, res, next) {
      try {
        const { imageId } = req.params;
        
        // حذف الصورة
        await this.carUseCases.deleteCarImage(imageId);
  
        res.status(200).json({
          success: true,
          message: 'تم حذف الصورة بنجاح'
        });
      } catch (error) {
        if (error.message === 'الصورة غير موجودة') {
          return res.status(404).json({
            success: false,
            message: error.message
          });
        }
        next(error);
      }
    }
  
    /**
     * إضافة مواصفة للسيارة
     * @param {Object} req - كائن الطلب
     * @param {Object} res - كائن الاستجابة
     * @param {Function} next - دالة التالي
     */
    async addCarSpecification(req, res, next) {
      try {
        const { id } = req.params;
        const { key, value } = req.body;
        
        // التحقق من البيانات المطلوبة
        if (!key || !value) {
          return res.status(400).json({
            success: false,
            message: 'الرجاء توفير مفتاح وقيمة المواصفة'
          });
        }
        
        // إضافة المواصفة
        const spec = await this.carUseCases.addCarSpecification(id, { key, value });
  
        res.status(201).json({
          success: true,
          message: 'تم إضافة المواصفة بنجاح',
          data: spec
        });
      } catch (error) {
        if (error.message === 'السيارة غير موجودة' || 
            error.message === 'بيانات المواصفة غير مكتملة') {
          return res.status(400).json({
            success: false,
            message: error.message
          });
        }
        next(error);
      }
    }
  
    /**
     * حذف مواصفة من السيارة
     * @param {Object} req - كائن الطلب
     * @param {Object} res - كائن الاستجابة
     * @param {Function} next - دالة التالي
     */
    async deleteCarSpecification(req, res, next) {
      try {
        const { specId } = req.params;
        
        // حذف المواصفة
        await this.carUseCases.deleteCarSpecification(specId);
  
        res.status(200).json({
          success: true,
          message: 'تم حذف المواصفة بنجاح'
        });
      } catch (error) {
        next(error);
      }
    }
  }
  
  module.exports = AdminCarController;