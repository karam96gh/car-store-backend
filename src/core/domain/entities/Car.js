/**
 * كيان السيارة
 * يمثل نموذج البيانات الأساسي للسيارة
 */
class Car {
  constructor({
    id,
    title,
    description,
    type,
    category,
    make,
    model,
    year,
    mileage,
    price,
    location,
    contactNumber,
    isFeatured,
    views,
    images = [],
    specifications = [],
    createdAt,
    updatedAt,
    // الحقول الجديدة
    fuel,
    transmission,
    driveType,
    doors,
    passengers,
    exteriorColor,
    interiorColor,
    engineSize,
    dimensions,
    vin,
    origin
  }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.type = type; // NEW, USED
    this.category = category; // LUXURY, ECONOMY, SUV, SPORTS, SEDAN, OTHER
    this.make = make;
    this.model = model;
    this.year = year;
    this.mileage = mileage;
    this.price = price;
    this.location = location;
    this.contactNumber = contactNumber;
    this.isFeatured = isFeatured || false;
    this.views = views || 0;
    this.images = images;
    this.specifications = specifications;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    
    // تعيين الحقول الجديدة
    this.fuel = fuel;
    this.transmission = transmission;
    this.driveType = driveType;
    this.doors = doors;
    this.passengers = passengers;
    this.exteriorColor = exteriorColor;
    this.interiorColor = interiorColor;
    this.engineSize = engineSize;
    this.dimensions = dimensions;
    this.vin = vin;
    this.origin = origin;
  }

  /**
   * التحقق من صحة البيانات
   */
  validate() {
    if (!this.title || this.title.trim() === '') {
      throw new Error('العنوان مطلوب');
    }

    if (!this.description || this.description.trim() === '') {
      throw new Error('الوصف مطلوب');
    }

    if (!this.make || this.make.trim() === '') {
      throw new Error('الشركة المصنعة مطلوبة');
    }

    if (!this.model || this.model.trim() === '') {
      throw new Error('الموديل مطلوب');
    }

    if (!this.year || isNaN(this.year)) {
      throw new Error('سنة الصنع مطلوبة وصحيحة');
    }

    if (this.year < 1900 || this.year > new Date().getFullYear() + 1) {
      throw new Error('سنة الصنع غير صالحة');
    }

    if (!this.price || isNaN(this.price) || this.price <= 0) {
      throw new Error('السعر مطلوب وصحيح');
    }

    if (!this.contactNumber || this.contactNumber.trim() === '') {
      throw new Error('رقم الاتصال مطلوب');
    }

    if (!['NEW', 'USED'].includes(this.type)) {
      throw new Error('نوع السيارة غير صالح');
    }

    if (!['LUXURY', 'ECONOMY', 'SUV', 'SPORTS', 'SEDAN', 'OTHER'].includes(this.category)) {
      throw new Error('فئة السيارة غير صالحة');
    }

    // التحقق من الحقول الجديدة (اختياري)
    if (this.doors && (isNaN(this.doors) || this.doors < 0)) {
      throw new Error('عدد الأبواب يجب أن يكون رقماً صحيحاً موجباً');
    }

    if (this.passengers && (isNaN(this.passengers) || this.passengers < 0)) {
      throw new Error('عدد الركاب يجب أن يكون رقماً صحيحاً موجباً');
    }

    // التحقق من الأبعاد إذا كانت موجودة
    if (this.dimensions) {
      if (this.dimensions.length && (isNaN(this.dimensions.length) || this.dimensions.length <= 0)) {
        throw new Error('طول السيارة يجب أن يكون رقماً موجباً');
      }
      if (this.dimensions.width && (isNaN(this.dimensions.width) || this.dimensions.width <= 0)) {
        throw new Error('عرض السيارة يجب أن يكون رقماً موجباً');
      }
      if (this.dimensions.height && (isNaN(this.dimensions.height) || this.dimensions.height <= 0)) {
        throw new Error('ارتفاع السيارة يجب أن يكون رقماً موجباً');
      }
    }

    return true;
  }

  /**
   * زيادة عدد مرات المشاهدة
   */
  incrementViews() {
    this.views = (this.views || 0) + 1;
    return this.views;
  }

  /**
   * تحويل الكيان إلى كائن JSON
   */
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      type: this.type,
      category: this.category,
      make: this.make,
      model: this.model,
      year: this.year,
      mileage: this.mileage,
      price: this.price,
      location: this.location,
      contactNumber: this.contactNumber,
      isFeatured: this.isFeatured,
      views: this.views,
      images: this.images,
      specifications: this.specifications,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      // إضافة الحقول الجديدة
      fuel: this.fuel,
      transmission: this.transmission,
      driveType: this.driveType,
      doors: this.doors,
      passengers: this.passengers,
      exteriorColor: this.exteriorColor,
      interiorColor: this.interiorColor,
      engineSize: this.engineSize,
      dimensions: this.dimensions,
      vin: this.vin,
      origin: this.origin
    };
  }
}

module.exports = Car;