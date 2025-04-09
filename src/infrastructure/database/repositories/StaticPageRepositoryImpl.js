/**
 * تنفيذ مستودع الصفحات الثابتة
 * يستخدم Prisma للتفاعل مع قاعدة البيانات
 */
const prisma = require('../prismaClient');

class StaticPageRepositoryImpl {
  /**
   * إنشاء صفحة ثابتة جديدة
   * @param {Object} pageData - بيانات الصفحة
   * @returns {Promise<Object>} - الصفحة المنشأة
   */
  async create(pageData) {
    try {
      return await prisma.staticPage.create({
        data: pageData
      });
    } catch (error) {
      throw new Error(`فشل إنشاء الصفحة الثابتة: ${error.message}`);
    }
  }

  /**
   * الحصول على كافة الصفحات الثابتة
   * @returns {Promise<Array>} - قائمة الصفحات
   */
  async findAll() {
    try {
      return await prisma.staticPage.findMany({
        orderBy: {
          title: 'asc'
        }
      });
    } catch (error) {
      throw new Error(`فشل الحصول على الصفحات الثابتة: ${error.message}`);
    }
  }

  /**
   * الحصول على صفحة ثابتة بواسطة المعرف
   * @param {number} id - معرف الصفحة
   * @returns {Promise<Object|null>} - الصفحة
   */
  async findById(id) {
    try {
      return await prisma.staticPage.findUnique({
        where: { id: parseInt(id) }
      });
    } catch (error) {
      throw new Error(`فشل الحصول على الصفحة الثابتة: ${error.message}`);
    }
  }

  /**
   * الحصول على صفحة ثابتة بواسطة المسار
   * @param {string} slug - مسار الصفحة
   * @returns {Promise<Object|null>} - الصفحة
   */
  async findBySlug(slug) {
    try {
      return await prisma.staticPage.findUnique({
        where: { slug }
      });
    } catch (error) {
      throw new Error(`فشل الحصول على الصفحة الثابتة: ${error.message}`);
    }
  }

  /**
   * تحديث صفحة ثابتة
   * @param {number} id - معرف الصفحة
   * @param {Object} pageData - بيانات التحديث
   * @returns {Promise<Object>} - الصفحة المحدثة
   */
  async update(id, pageData) {
    try {
      return await prisma.staticPage.update({
        where: { id: parseInt(id) },
        data: pageData
      });
    } catch (error) {
      throw new Error(`فشل تحديث الصفحة الثابتة: ${error.message}`);
    }
  }

  /**
   * حذف صفحة ثابتة
   * @param {number} id - معرف الصفحة
   * @returns {Promise<boolean>} - هل تم الحذف بنجاح
   */
  async delete(id) {
    try {
      await prisma.staticPage.delete({
        where: { id: parseInt(id) }
      });

      return true;
    } catch (error) {
      throw new Error(`فشل حذف الصفحة الثابتة: ${error.message}`);
    }
  }
}

module.exports = StaticPageRepositoryImpl;