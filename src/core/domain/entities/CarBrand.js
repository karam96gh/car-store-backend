// src/core/domain/entities/CarBrand.js
class CarBrand {
    constructor({
      id,
      name,
      logoUrl,
      models = [],
      carsCount = 0
    }) {
      this.id = id;
      this.name = name;
      this.logoUrl = logoUrl;
      this.models = models;
      this.carsCount = carsCount;
    }
  
    toJSON() {
      return {
        id: this.id,
        name: this.name,
        logoUrl: this.logoUrl,
        models: this.models,
        carsCount: this.carsCount
      };
    }
  }
  
  module.exports = CarBrand;