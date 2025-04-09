/**
 * تنفيذ مستودع السيارات
 * يستخدم Prisma للتفاعل مع قاعدة البيانات
 */
const Car = require('../../../core/domain/entities/Car');
const CarRepository = require('../../../core/domain/interfaces/CarRepository');
const prisma = require('../prismaClient');

class CarRepositoryImpl extends CarRepository {
  /**
   * إنشاء سيارة جديدة
   * @param {Object} carData - بيانات السيارة
   * @returns {Promise<Object>} - السيارة المنشأة
   */
  async create(carData) {
    try {
      // استخراج المواصفات والصور إن وجدت
      const { specifications = [], images = [], ...carInfo } = carData;

      // إنشاء السيارة مع المواصفات والصور
      const car = await prisma.car.create({
        data: {
          ...carInfo,
          specifications: {
            create: specifications
          },
          images: {
            create: images
          }
        },
        include: {
          specifications: true,
          images: true
        }
      });

      return new Car(car);
    } catch (error) {
      throw new Error(`فشل إنشاء السيارة: ${error.message}`);
    }
  }

  /**
   * الحصول على كافة السيارات
   * @param {Object} filters - مرشحات البحث
   * @param {Object} pagination - خيارات التصفح
   * @returns {Promise<Object>} - قائمة السيارات مع معلومات التصفح
   */
  async findAll(filters = {}, pagination = { page: 1, limit: 10 }) {
    try {
      const { page = 1, limit = 10 } = pagination;
      const skip = (page - 1) * limit;

      // إعداد مرشحات البحث
      const where = this._buildWhereClause(filters);

      // الحصول على عدد السيارات
      const total = await prisma.car.count({ where });

      // الحصول على قائمة السيارات
      const cars = await prisma.car.findMany({
        where,
        include: {
          images: true,
          specifications: true
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        }
      });

      // تحويل البيانات إلى كيانات
      const carEntities = cars.map(car => new Car(car));

      // إعداد معلومات التصفح
      const totalPages = Math.ceil(total / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      return {
        data: carEntities,
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
      throw new Error(`فشل الحصول على السيارات: ${error.message}`);
    }
  }

  /**
   * الحصول على سيارة بواسطة المعرف
   * @param {number} id - معرف السيارة
   * @returns {Promise<Object|null>} - السيارة أو null إذا لم تكن موجودة
   */
  async findById(id) {
    try {
      const car = await prisma.car.findUnique({
        where: { id: parseInt(id) },
        include: {
          specifications: true,
          images: true
        }
      });

      if (!car) {
        return null;
      }

      return new Car(car);
    } catch (error) {
      throw new Error(`فشل الحصول على السيارة: ${error.message}`);
    }
  }

  /**
   * تحديث سيارة
   * @param {number} id - معرف السيارة
   * @param {Object} carData - بيانات التحديث
   * @returns {Promise<Object>} - السيارة المحدثة
   */
  async update(id, carData) {
    try {
      // استخراج المواصفات والصور إن وجدت
      const { specifications, images, ...carInfo } = carData;

      // تحديث السيارة
      const car = await prisma.car.update({
        where: { id: parseInt(id) },
        data: carInfo,
        include: {
          specifications: true,
          images: true
        }
      });

      return new Car(car);
    } catch (error) {
      throw new Error(`فشل تحديث السيارة: ${error.message}`);
    }
  }

  /**
   * حذف سيارة
   * @param {number} id - معرف السيارة
   * @returns {Promise<boolean>} - هل تم الحذف بنجاح
   */
  async delete(id) {
    try {
      await prisma.car.delete({
        where: { id: parseInt(id) }
      });

      return true;
    } catch (error) {
      throw new Error(`فشل حذف السيارة: ${error.message}`);
    }
  }

  /**
   * زيادة عدد المشاهدات
   * @param {number} id - معرف السيارة
   * @returns {Promise<Object>} - السيارة المحدثة
   */
  async incrementViews(id) {
    try {
      const car = await prisma.car.update({
        where: { id: parseInt(id) },
        data: {
          views: {
            increment: 1
          }
        },
        include: {
          specifications: true,
          images: true
        }
      });

      return new Car(car);
    } catch (error) {
      throw new Error(`فشل زيادة عدد المشاهدات: ${error.message}`);
    }
  }

  /**
   * البحث عن السيارات حسب معايير مختلفة
   * @param {Object} criteria - معايير البحث
   * @param {Object} pagination - خيارات التصفح
   * @returns {Promise<Object>} - نتائج البحث
   */
  async search(criteria, pagination = { page: 1, limit: 10 }) {
    try {
      const { page = 1, limit = 10 } = pagination;
      const skip = (page - 1) * limit;

      // إعداد معايير البحث
      const where = this._buildSearchCriteria(criteria);

      // الحصول على عدد النتائج
      const total = await prisma.car.count({ where });

      // الحصول على النتائج
      const cars = await prisma.car.findMany({
        where,
        include: {
          images: true,
          specifications: true
        },
        skip,
        take: limit,
        orderBy: this._buildOrderBy(criteria.orderBy)
      });

      // تحويل البيانات إلى كيانات
      const carEntities = cars.map(car => new Car(car));

      // إعداد معلومات التصفح
      const totalPages = Math.ceil(total / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      return {
        data: carEntities,
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
      throw new Error(`فشل البحث عن السيارات: ${error.message}`);
    }
  }

  /**
   * الحصول على السيارات المميزة
   * @param {number} limit - عدد السيارات
   * @returns {Promise<Array>} - قائمة السيارات المميزة
   */
  async findFeatured(limit = 10) {
    try {
      const featuredCars = await prisma.car.findMany({
        where: {
          isFeatured: true
        },
        include: {
          images: true,
          specifications: true
        },
        orderBy: {
          updatedAt: 'desc'
        },
        take: limit
      });

      return featuredCars.map(car => new Car(car));
    } catch (error) {
      throw new Error(`فشل الحصول على السيارات المميزة: ${error.message}`);
    }
  }

  /**
   * الحصول على السيارات الأكثر مشاهدة
   * @param {number} limit - عدد السيارات
   * @returns {Promise<Array>} - قائمة السيارات الأكثر مشاهدة
   */
  async findMostViewed(limit = 10) {
    try {
      const mostViewedCars = await prisma.car.findMany({
        include: {
          images: true,
          specifications: true
        },
        orderBy: {
          views: 'desc'
        },
        take: limit
      });

      return mostViewedCars.map(car => new Car(car));
    } catch (error) {
      throw new Error(`فشل الحصول على السيارات الأكثر مشاهدة: ${error.message}`);
    }
  }

  /**
   * إضافة صورة للسيارة
   * @param {number} carId - معرف السيارة
   * @param {Object} imageData - بيانات الصورة
   * @returns {Promise<Object>} - الصورة المضافة
   */
  async addImage(carId, imageData) {
    try {
      const image = await prisma.carImage.create({
        data: {
          ...imageData,
          carId: parseInt(carId)
        }
      });

      return image;
    } catch (error) {
      throw new Error(`فشل إضافة الصورة: ${error.message}`);
    }
  }

  /**
   * الحصول على صورة بواسطة المعرف
   * @param {number} imageId - معرف الصورة
   * @returns {Promise<Object|null>} - الصورة
   */
  async getImageById(imageId) {
    try {
      return await prisma.carImage.findUnique({
        where: { id: parseInt(imageId) }
      });
    } catch (error) {
      throw new Error(`فشل الحصول على الصورة: ${error.message}`);
    }
  }

  /**
   * حذف صورة من السيارة
   * @param {number} imageId - معرف الصورة
   * @returns {Promise<boolean>} - هل تم الحذف بنجاح
   */
  async deleteImage(imageId) {
    try {
      await prisma.carImage.delete({
        where: { id: parseInt(imageId) }
      });

      return true;
    } catch (error) {
      throw new Error(`فشل حذف الصورة: ${error.message}`);
    }
  }

  /**
   * إضافة مواصفة للسيارة
   * @param {number} carId - معرف السيارة
   * @param {Object} specData - بيانات المواصفة
   * @returns {Promise<Object>} - المواصفة المضافة
   */
  async addSpecification(carId, specData) {
    try {
      const spec = await prisma.specification.create({
        data: {
          ...specData,
          carId: parseInt(carId)
        }
      });

      return spec;
    } catch (error) {
      throw new Error(`فشل إضافة المواصفة: ${error.message}`);
    }
  }

  /**
   * حذف مواصفة من السيارة
   * @param {number} specId - معرف المواصفة
   * @returns {Promise<boolean>} - هل تم الحذف بنجاح
   */
  async deleteSpecification(specId) {
    try {
      await prisma.specification.delete({
        where: { id: parseInt(specId) }
      });

      return true;
    } catch (error) {
      throw new Error(`فشل حذف المواصفة: ${error.message}`);
    }
  }

  /**
   * عدد السيارات
   * @param {Object} filters - مرشحات العد
   * @returns {Promise<number>} - عدد السيارات
   */
  async count(filters = {}) {
    try {
      const where = this._buildWhereClause(filters);
      return await prisma.car.count({ where });
    } catch (error) {
      throw new Error(`فشل عد السيارات: ${error.message}`);
    }
  }

  /**
   * عدد السيارات حسب الفئة
   * @returns {Promise<Object>} - عدد السيارات حسب الفئة
   */
  async countByCategory() {
    try {
      const categories = Object.values(prisma.CarCategory);
      const result = {};

      for (const category of categories) {
        const count = await prisma.car.count({
          where: { category }
        });
        result[category] = count;
      }

      return result;
    } catch (error) {
      throw new Error(`فشل عد السيارات حسب الفئة: ${error.message}`);
    }
  }

  /**
   * عدد السيارات حسب الشركة المصنعة
   * @param {number} limit - عدد الشركات
   * @returns {Promise<Array>} - عدد السيارات حسب الشركة المصنعة
   */
  async countByMake(limit = 10) {
    try {
      const makes = await prisma.car.groupBy({
        by: ['make'],
        _count: {
          make: true
        },
        orderBy: {
          _count: {
            make: 'desc'
          }
        },
        take: limit
      });

      return makes.map(item => ({
        make: item.make,
        count: item._count.make
      }));
    } catch (error) {
      throw new Error(`فشل عد السيارات حسب الشركة المصنعة: ${error.message}`);
    }
  }

  /**
   * متوسط سعر السيارات
   * @param {Object} filters - مرشحات البحث
   * @returns {Promise<number>} - متوسط السعر
   */
  async getAveragePrice(filters = {}) {
    try {
      const where = this._buildWhereClause(filters);
      
      const result = await prisma.car.aggregate({
        where,
        _avg: {
          price: true
        }
      });

      return result._avg.price || 0;
    } catch (error) {
      throw new Error(`فشل حساب متوسط السعر: ${error.message}`);
    }
  }

  /**
   * إحصاءات السيارات حسب السنة
   * @returns {Promise<Array>} - إحصاءات السيارات حسب السنة
   */
  async countByYear() {
    try {
      const years = await prisma.car.groupBy({
        by: ['year'],
        _count: {
          year: true
        },
        orderBy: {
          year: 'desc'
        }
      });

      return years.map(item => ({
        year: item.year,
        count: item._count.year
      }));
    } catch (error) {
      throw new Error(`فشل عد السيارات حسب السنة: ${error.message}`);
    }
  }

  /**
   * إحصاءات السيارات المضافة مؤخرًا
   * @param {number} days - عدد الأيام
   * @returns {Promise<Array>} - إحصاءات السيارات المضافة مؤخرًا
   */
  async getRecentlyAddedStats(days = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      const stats = await prisma.$queryRaw`
        SELECT 
          DATE(created_at) as date, 
          COUNT(*) as count 
        FROM Car 
        WHERE created_at >= ${startDate}
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `;

      return stats;
    } catch (error) {
      throw new Error(`فشل الحصول على إحصاءات السيارات المضافة مؤخرًا: ${error.message}`);
    }
  }

  /**
   * بناء شرط البحث
   * @private
   * @param {Object} filters - مرشحات البحث
   * @returns {Object} - شرط البحث
   */
  _buildWhereClause(filters) {
    const where = {};

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.category) {
      where.category = filters.category;
    }

    if (filters.make) {
      where.make = filters.make;
    }

    if (filters.model) {
      where.model = filters.model;
    }

    if (filters.year) {
      where.year = parseInt(filters.year);
    }

    if (filters.yearRange) {
      where.year = {
        gte: parseInt(filters.yearRange.min),
        lte: parseInt(filters.yearRange.max)
      };
    }

    if (filters.priceRange) {
      where.price = {
        gte: parseFloat(filters.priceRange.min),
        lte: parseFloat(filters.priceRange.max)
      };
    }

    if (filters.isFeatured !== undefined) {
      where.isFeatured = filters.isFeatured;
    }

    return where;
  }

  /**
   * بناء معايير البحث
   * @private
   * @param {Object} criteria - معايير البحث
   * @returns {Object} - معايير البحث
   */
  _buildSearchCriteria(criteria) {
    const where = this._buildWhereClause(criteria);

    // البحث بالنص
    if (criteria.searchText) {
      where.OR = [
        { title: { contains: criteria.searchText } },
        { description: { contains: criteria.searchText } },
        { make: { contains: criteria.searchText } },
        { model: { contains: criteria.searchText } }
      ];
    }

    // استثناء سيارة معينة
    if (criteria.excludeId) {
      where.id = {
        not: parseInt(criteria.excludeId)
      };
    }

    return where;
  }

  /**
   * بناء معايير الترتيب
   * @private
   * @param {string} orderBy - معيار الترتيب
   * @returns {Object} - معايير الترتيب
   */
  _buildOrderBy(orderBy) {
    switch (orderBy) {
      case 'price_asc':
        return { price: 'asc' };
      case 'price_desc':
        return { price: 'desc' };
      case 'year_asc':
        return { year: 'asc' };
      case 'year_desc':
        return { year: 'desc' };
      case 'views_desc':
        return { views: 'desc' };
      default:
        return { createdAt: 'desc' };
    }
  }
}

module.exports = CarRepositoryImpl;