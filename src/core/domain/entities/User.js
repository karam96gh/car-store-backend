/**
 * كيان المستخدم
 * يمثل نموذج البيانات الأساسي للمستخدم
 */
class User {
    constructor({
      id,
      name,
      email,
      phone,
      password,
      role,
      isActive,
      createdAt,
      updatedAt
    }) {
      this.id = id;
      this.name = name;
      this.email = email;
      this.phone = phone;
      this.password = password; // سيتم تشفيرها قبل الحفظ
      this.role = role || 'USER'; // ADMIN, USER
      this.isActive = isActive !== undefined ? isActive : true;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
    }
  
    /**
     * التحقق من صحة البيانات
     */
    validate() {
      if (!this.name || this.name.trim() === '') {
        throw new Error('الاسم مطلوب');
      }
  
      if (!this.email || this.email.trim() === '') {
        throw new Error('البريد الإلكتروني مطلوب');
      }
  
      // التحقق من صحة البريد الإلكتروني
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.email)) {
        throw new Error('البريد الإلكتروني غير صالح');
      }
  
      if (this.phone) {
        // يمكن تعديل هذا للتحقق من تنسيق الهاتف المناسب للمنطقة
        const phoneRegex = /^\+?[0-9]{8,15}$/;
        if (!phoneRegex.test(this.phone)) {
          throw new Error('رقم الهاتف غير صالح');
        }
      }
  
      // التحقق من كلمة المرور عند الإنشاء
      if (!this.id && (!this.password || this.password.length < 6)) {
        throw new Error('كلمة المرور مطلوبة ويجب أن تتكون من 6 أحرف على الأقل');
      }
  
      if (!['ADMIN', 'USER'].includes(this.role)) {
        throw new Error('دور المستخدم غير صالح');
      }
  
      return true;
    }
  
    /**
     * إزالة البيانات الحساسة
     */
    sanitize() {
      const sanitized = { ...this };
      delete sanitized.password;
      return sanitized;
    }
  
    /**
     * تحويل الكيان إلى كائن JSON مع إزالة البيانات الحساسة
     */
    toJSON() {
      const json = {
        id: this.id,
        name: this.name,
        email: this.email,
        phone: this.phone,
        role: this.role,
        isActive: this.isActive,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt
      };
  
      return json;
    }
  
    /**
     * التحقق مما إذا كان المستخدم مشرفًا
     */
    isAdmin() {
      return this.role === 'ADMIN';
    }
    toPlainObject() {
        return {
          name: this.name,
          email: this.email,
          phone: this.phone,
          password: this.password,
          role: this.role,
          isActive: this.isActive
        };
      }
  }
  
  module.exports = User;