/**
 * حالات استخدام المستخدمين
 * تحتوي على المنطق الخاص بعمليات المستخدمين
 */
const User = require('../domain/entities/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getConfig } = require('../../infrastructure/config/config');

class UserUseCases {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * تسجيل مستخدم جديد
   * @param {Object} userData - بيانات المستخدم
   * @returns {Promise<Object>} - المستخدم المنشأ مع التوكن
   */
  async registerUser(userData) {
    console.log(userData.password);
    
    // التحقق من وجود المستخدم
    if (userData.email) {
      const existingUser = await this.userRepository.findByEmail(userData.email);
      if (existingUser) {
        throw new Error('البريد الإلكتروني مسجل بالفعل');
      }
    }

    if (userData.phone) {
      const existingUserByPhone = await this.userRepository.findByPhone(userData.phone);
      if (existingUserByPhone) {
        throw new Error('رقم الهاتف مسجل بالفعل');
      }
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // إنشاء كيان مستخدم
    const user = new User({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
              password: hashedPassword,
      role: 'ADMIN'
    });
    console.log(user);
    

    // التحقق من صحة البيانات
    user.validate();

    // حفظ المستخدم في قاعدة البيانات
    const savedUser = await this.userRepository.create(user.toPlainObject?.() || user);

    // إنشاء توكن JWT
    const token = this._generateToken(savedUser);

    return {
      user: savedUser.toJSON(),
      token
    };
  }

  /**
   * تسجيل الدخول
   * @param {string} email - البريد الإلكتروني
   * @param {string} password - كلمة المرور
   * @returns {Promise<Object>} - المستخدم مع التوكن
   */
  async loginUser(email, password) {
    // البحث عن المستخدم
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error('بيانات الدخول غير صحيحة');
    }

    // التحقق من حالة المستخدم
    if (!user.isActive) {
      throw new Error('هذا الحساب محظور');
    }

    // التحقق من كلمة المرور
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('بيانات الدخول غير صحيحة');
    }

    // إنشاء توكن JWT
    const token = this._generateToken(user);

    return {
      user: user.toJSON(),
      token
    };
  }

  /**
   * الحصول على قائمة المستخدمين (للمشرفين)
   * @param {Object} filters - مرشحات البحث
   * @param {Object} pagination - خيارات التصفح
   * @returns {Promise<Object>} - قائمة المستخدمين مع معلومات التصفح
   */
  async getUsers(filters = {}, pagination = { page: 1, limit: 10 }) {
    return this.userRepository.findAll(filters, pagination);
  }

  /**
   * الحصول على مستخدم بواسطة المعرف
   * @param {number} id - معرف المستخدم
   * @returns {Promise<Object>} - المستخدم
   */
  async getUserById(id) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new Error('المستخدم غير موجود');
    }

    return user.toJSON();
  }

  /**
   * تحديث بيانات المستخدم
   * @param {number} id - معرف المستخدم
   * @param {Object} userData - بيانات التحديث
   * @returns {Promise<Object>} - المستخدم المحدث
   */
  async updateUser(id, userData) {
    // التحقق من وجود المستخدم
    const existingUser = await this.userRepository.findById(id);

    if (!existingUser) {
      throw new Error('المستخدم غير موجود');
    }

    // التحقق من التعديل على البريد أو الهاتف
    if (userData.email && userData.email !== existingUser.email) {
      const userWithEmail = await this.userRepository.findByEmail(userData.email);
      if (userWithEmail) {
        throw new Error('البريد الإلكتروني مسجل بالفعل');
      }
    }

    if (userData.phone && userData.phone !== existingUser.phone) {
      const userWithPhone = await this.userRepository.findByPhone(userData.phone);
      if (userWithPhone) {
        throw new Error('رقم الهاتف مسجل بالفعل');
      }
    }

    // دمج البيانات الحالية مع التحديث
    const updatedUserData = { ...existingUser, ...userData };

    // حذف كلمة المرور من التحديث (تتم عبر دالة منفصلة)
    delete updatedUserData.password;

    // إنشاء كيان مستخدم محدث
    const updatedUser = new User(updatedUserData);

    // التحقق من صحة البيانات
    updatedUser.validate();

    // حفظ التحديث في قاعدة البيانات
    return this.userRepository.update(id, updatedUser);
  }

  /**
   * تغيير كلمة المرور
   * @param {number} id - معرف المستخدم
   * @param {string} currentPassword - كلمة المرور الحالية
   * @param {string} newPassword - كلمة المرور الجديدة
   * @returns {Promise<boolean>} - هل تم التحديث بنجاح
   */
  async changePassword(id, currentPassword, newPassword) {
    // التحقق من وجود المستخدم
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new Error('المستخدم غير موجود');
    }

    // التحقق من كلمة المرور الحالية
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      throw new Error('كلمة المرور الحالية غير صحيحة');
    }

    // تشفير كلمة المرور الجديدة
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // تحديث كلمة المرور
    return this.userRepository.updatePassword(id, hashedPassword);
  }

  /**
   * تعليق/إلغاء تعليق حساب مستخدم (للمشرفين)
   * @param {number} id - معرف المستخدم
   * @param {boolean} isActive - حالة النشاط
   * @returns {Promise<Object>} - المستخدم المحدث
   */
  async toggleUserStatus(id, isActive) {
    // التحقق من وجود المستخدم
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new Error('المستخدم غير موجود');
    }

    // لا يمكن تعليق حساب مشرف
    if (user.role === 'ADMIN' && !isActive) {
      throw new Error('لا يمكن تعليق حساب مشرف');
    }

    // تحديث حالة النشاط
    return this.userRepository.updateActiveStatus(id, isActive);
  }

  /**
   * إضافة سيارة للمفضلة
   * @param {number} userId - معرف المستخدم
   * @param {number} carId - معرف السيارة
   * @returns {Promise<Object>} - سجل المفضلة
   */
  async addToFavorites(userId, carId) {
    return this.userRepository.addFavorite(userId, carId);
  }

  /**
   * حذف سيارة من المفضلة
   * @param {number} userId - معرف المستخدم
   * @param {number} carId - معرف السيارة
   * @returns {Promise<boolean>} - هل تم الحذف بنجاح
   */
  async removeFromFavorites(userId, carId) {
    return this.userRepository.removeFavorite(userId, carId);
  }

  /**
   * الحصول على قائمة السيارات المفضلة للمستخدم
   * @param {number} userId - معرف المستخدم
   * @param {Object} pagination - خيارات التصفح
   * @returns {Promise<Object>} - قائمة السيارات المفضلة مع معلومات التصفح
   */
  async getUserFavorites(userId, pagination = { page: 1, limit: 10 }) {
    return this.userRepository.getFavorites(userId, pagination);
  }

  /**
   * إضافة إشعار سعر
   * @param {number} userId - معرف المستخدم
   * @param {number} carId - معرف السيارة
   * @param {number} targetPrice - السعر المستهدف
   * @returns {Promise<Object>} - إشعار السعر
   */
  async addPriceAlert(userId, carId, targetPrice) {
    return this.userRepository.addPriceAlert(userId, carId, targetPrice);
  }

  /**
   * حذف إشعار سعر
   * @param {number} userId - معرف المستخدم
   * @param {number} alertId - معرف الإشعار
   * @returns {Promise<boolean>} - هل تم الحذف بنجاح
   */
  async removePriceAlert(userId, alertId) {
    // التحقق من وجود الإشعار وملكيته
    const alert = await this.userRepository.getPriceAlertById(alertId);
    
    if (!alert) {
      throw new Error('الإشعار غير موجود');
    }
    
    if (alert.userId !== userId) {
      throw new Error('غير مصرح لك بحذف هذا الإشعار');
    }
    
    return this.userRepository.removePriceAlert(alertId);
  }

  /**
   * الحصول على قائمة إشعارات الأسعار للمستخدم
   * @param {number} userId - معرف المستخدم
   * @returns {Promise<Array>} - قائمة إشعارات الأسعار
   */
  async getUserPriceAlerts(userId) {
    return this.userRepository.getPriceAlerts(userId);
  }

  /**
   * إضافة سجل تصفح
   * @param {number} userId - معرف المستخدم
   * @param {number} carId - معرف السيارة
   * @returns {Promise<Object>} - سجل التصفح
   */
  async addBrowserHistory(userId, carId) {
    return this.userRepository.addBrowserHistory(userId, carId);
  }

  /**
   * الحصول على سجل تصفح المستخدم
   * @param {number} userId - معرف المستخدم
   * @param {Object} pagination - خيارات التصفح
   * @returns {Promise<Object>} - سجل التصفح مع معلومات التصفح
   */
  async getUserBrowserHistory(userId, pagination = { page: 1, limit: 10 }) {
    return this.userRepository.getBrowserHistory(userId, pagination);
  }

  /**
   * توليد توكن JWT
   * @private
   * @param {Object} user - المستخدم
   * @returns {string} - توكن JWT
   */
  _generateToken(user) {
    const config = getConfig();
    
    return jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
  }
}
module.exports = UserUseCases;