// src/infrastructure/database/repositories/BrandRepositoryImpl.js
const CarBrand = require('../../../core/domain/entities/CarBrand');

// بيانات البراندات المستوردة من تطبيق Flutter
const carData = {
  'Toyota': {
    'logo': 'http://62.171.153.198:3995/uploads/car-images/toyota.png',
    'models': [
      'Camry', 'Corolla', 'RAV4', 'Land Cruiser', 'Yaris',
      'Prius', 'Hilux', 'Tacoma', '4Runner', 'Highlander',
      'Avalon', 'Tundra', 'Sequoia', 'Celica', 'Supra',
      'MR2', 'C-HR', 'Venza', 'Sienna', 'Corona'
    ],
  },
  'BMW': {
    'logo': 'http://62.171.153.198:3995/uploads/car-images/bmw.png',
    'models': [
      'X5', 'X3', '3 Series', '5 Series', '7 Series',
      'X1', 'X7', 'M3', 'M5', 'Z4',
      'i8', 'i3', '2 Series', '4 Series', '6 Series',
      '8 Series', 'X6', 'M4', 'M2', '2002'
    ],
  },
  'Mercedes-Benz': {
    'logo': 'http://62.171.153.198:3995/uploads/car-images/mercedes-benz.png',
    'models': [
      'E200', 'C-Class', 'S-Class', 'GLA', 'GLE',
      'A-Class', 'B-Class', 'CLS', 'GLC', 'GLS',
      'SL', 'SLK', 'AMG GT', 'CLK', 'EQC','E300','E350',
      '190E', '300SL', '600', 'Maybach', 'Sprinter'
    ],
  },
  'Chevrolet': {
    'logo': 'http://62.171.153.198:3995/uploads/car-images/chevrolet.png',
    'models': [
      'Camaro', 'Corvette', 'Impala', 'Malibu', 'Silverado',
      'Tahoe', 'Suburban', 'Equinox', 'Traverse', 'Cruze',
      'Spark', 'Aveo', 'Volt', 'Bolt', 'Blazer',
      'Nova', 'Caprice', 'Bel Air', 'Monte Carlo', 'Chevelle'
    ],
  },
  'Hyundai': {
    'logo': 'http://62.171.153.198:3995/uploads/car-images/hyundai.png',
    'models': [
      'Tucson', 'Sonata', 'Elantra', 'Santa Fe', 'Accent',
      'Kona', 'Palisade', 'Veloster', 'Genesis Coupe', 'i10',
      'i20', 'i30', 'Azera', 'Equus', 'XG350',
      'Staria', 'Venue', 'IONIQ', 'Nexo', 'Pony'
    ],
  },
  'Kia': {
    'logo': 'http://62.171.153.198:3995/uploads/car-images/kia.png',
    'models': [
      'Sportage', 'Cerato', 'Sorento', 'Picanto', 'Rio',
      'Optima', 'Carnival', 'Stinger', 'Telluride', 'Seltos',
      'EV6', 'Niro', 'Soul', 'Forte', 'Cadenza',
      'K5', 'K900', 'Borrego', 'Magentis', 'Pride'
    ],
  },
  'Audi': {
    'logo': 'http://62.171.153.198:3995/uploads/car-images/audi.png',
    'models': [
      'A4', 'A6', 'Q5', 'Q7', 'A8',
      'A3', 'A5', 'Q3', 'Q8', 'TT',
      'R8', 'e-tron', 'RS6', 'S4', '100',
      '200', 'Quattro', 'V8', 'RS3', 'RS7'
    ],
  },
  'KGM (Ssangyong)': {
    'logo': 'http://62.171.153.198:3995/uploads/car-images/ssangyong.png',
    'models': [
      'Rexton', 'Tivoli', 'Korando', 'Musso', 'Actyon',
      'Chairman', 'Stavic', 'Rodius', 'Korando Sports', 'XLV',
      'Kyron', 'Rexton Sports', 'Turismo', 'XAV', 'Damas'
    ],
  },
  'Genesis': {
    'logo': 'http://62.171.153.198:3995/uploads/car-images/genesis.png',
    'models': [
      'G70', 'G80', 'G90', 'GV70', 'GV80',
      'GV60', 'EQ900', 'Mint', 'Essentia', 'X',
      'New York', 'GV90', 'G80 Electrified', 'GV70 Electrified', 'X Speedium Coupe'
    ],
  },
  'Renault': {
    'logo': 'http://62.171.153.198:3995/uploads/car-images/renault.png',
    'models': [
      'Clio', 'Megane', 'Captur', 'Kadjar', 'Duster',
      'Talisman', 'Koleos', 'Zoe', 'Twingo', 'Laguna',
      'Safrane', 'Avantime', 'Vel Satis', 'Fluence', 'Wind',
      '4CV', '5', '8', '9', '11'
    ],
  },
  'Jeep': {
    'logo': 'http://62.171.153.198:3995/uploads/car-images/jeep.png',
    'models': [
      'Wrangler', 'Grand Cherokee', 'Cherokee', 'Compass', 'Renegade',
      'Gladiator', 'Liberty', 'Patriot', 'Commander', 'Wagoneer',
      'CJ', 'Willys', 'FC', 'DJ', 'Forward Control',
      'J-Series', 'Honcho', 'Cherokee XJ', 'Grand Wagoneer', 'Scrambler'
    ],
  },
  'Porsche': {
    'logo': 'http://62.171.153.198:3995/uploads/car-images/porsche.png',
    'models': [
      '911', 'Cayenne', 'Panamera', 'Macan', 'Taycan',
      'Boxster', 'Cayman', '918 Spyder', '356', '928',
      '944', '968', '959', 'Carrera GT', 'Mission E',
      '550 Spyder', '904', '906', '908', '917'
    ],
  },
  'Volkswagen': {
    'logo': 'http://62.171.153.198:3995/uploads/car-images/volkswagen.png',
    'models': [
      'Golf', 'Passat', 'Tiguan', 'Jetta', 'Polo',
      'Arteon', 'Atlas', 'Beetle', 'ID.4', 'Touareg',
      'Scirocco', 'Type 2', 'Karmann Ghia', 'Corrado', 'Lupo',
      'Phideon', 'Santana', 'Vento', 'Fox', 'Derby'
    ],
  },
  'Land Rover': {
    'logo': 'http://62.171.153.198:3995/uploads/car-images/land-rover.png',
    'models': [
      'Range Rover', 'Discovery', 'Defender', 'Range Rover Sport', 'Range Rover Evoque',
      'Range Rover Velar', 'Freelander', 'Discovery Sport', 'Series I', 'Series II',
      'Series III', 'Range Rover Classic', 'Range Rover P38', 'Range Rover L322', 'DC100',
      'LR2', 'LR3', 'LR4', 'Range Rover SVAutobiography', 'Range Rover PHEV'
    ],
  },
  'Mini': {
    'logo': 'http://62.171.153.198:3995/uploads/car-images/mini.png',
    'models': [
      'Cooper', 'Countryman', 'Clubman', 'Paceman', 'Convertible',
      'Coupe', 'Roadster', 'John Cooper Works', 'GP', 'Electric',
      'Mini E', 'Mini 1000', 'Mini 1275GT', 'Mini Van', 'Mini Pickup',
      'Mini Moke', 'Mini Traveller', 'Mini Cooper S', 'Mini One', 'Mini Seven'
    ],
  },
  'Honda': {
    'logo': 'http://62.171.153.198:3995/uploads/car-images/honda.png',
    'models': [
      'Civic', 'Accord', 'CR-V', 'Pilot', 'Odyssey',
      'Fit', 'HR-V', 'Ridgeline', 'Passport', 'Insight',
      'S2000', 'NSX', 'Prelude', 'Integra', 'Legend',
      'Jazz', 'City', 'N-One', 'N-Box', 'Acty'
    ],
  },
  'Lexus': {
    'logo': 'http://62.171.153.198:3995/uploads/car-images/lexus.png',
    'models': [
      'ES', 'RX', 'NX', 'LS', 'GX',
      'LX', 'UX', 'LC', 'RC', 'IS',
      'CT', 'HS', 'LFA', 'SC', 'GS',
      'ES Hybrid', 'RX Hybrid', 'NX Hybrid', 'LS Hybrid', 'UX Hybrid'
    ],
  },
  'Ford': {
    'logo': 'http://62.171.153.198:3995/uploads/car-images/ford.png',
    'models': [
      'F-150', 'Mustang', 'Explorer', 'Focus', 'Escape',
      'Ranger', 'Edge', 'Fiesta', 'Bronco', 'Expedition',
      'Taurus', 'Model T', 'Thunderbird', 'GT', 'Fusion',
      'Galaxie', 'Fairlane', 'Pinto', 'Festiva', 'Probe'
    ],
  },
  'Nissan': {
    'logo': 'http://62.171.153.198:3995/uploads/car-images/nissan.png',
    'models': [
      'Altima', 'Maxima', 'Rogue', 'Sentra', 'Pathfinder',
      'Murano', 'Frontier', 'Titan', '370Z', 'GT-R',
      'Leaf', 'Versa', 'Juke', 'X-Trail', 'Sunny',
      'Patrol', 'Silvia', 'Skyline', 'Pulsar', 'Micra'
    ],
  },
  'Volvo': {
    'logo': 'http://62.171.153.198:3995/uploads/car-images/volvo.png',
    'models': [
      'XC90', 'XC60', 'XC40', 'S90', 'S60',
      'V90', 'V60', 'V40', '240', '740',
      '850', 'C30', 'P1800', 'Amazon', 'PV544',
      'S40', 'S70', 'V70', 'XC70', 'Polestar'
    ],
  },
  'Peugeot': {
    'logo': 'http://62.171.153.198:3995/uploads/car-images/peugeot.png',
    'models': [
      '208', '308', '508', '2008', '3008',
      '5008', '108', '407', '607', 'RCZ',
      'Partner', 'Expert', 'Boxer', '504', '505',
      '604', '205', '206', '207', '106'
    ],
  },
  'Tesla': {
    'logo': 'http://62.171.153.198:3995/uploads/car-images/tesla.png',
    'models': [
      'Model S', 'Model 3', 'Model X', 'Model Y', 'Cybertruck',
      'Roadster', 'Semi', 'Model S Plaid', 'Model X Plaid', 'Model 3 Performance',
      'Model Y Performance', 'Roadster 2020', 'Model 2', 'Model Q', 'Model R',
      'Model A', 'Model B', 'Model C', 'Model D', 'Model E'
    ],
  },
  'Maserati': {
    'logo': 'http://62.171.153.198:3995/uploads/car-images/maserati.png',
    'models': [
      'Ghibli', 'Quattroporte', 'Levante', 'GranTurismo', 'MC20',
      'GranCabrio', '3200 GT', 'Coupe', 'Spyder', 'Bora',
      'Merak', 'Khamsin', 'Indy', 'Sebring', 'Mexico',
      'Shamal', 'Barchetta', 'A6', '8C', 'Tipo 61'
    ],
  },
  'Suzuki': {
    'logo': 'http://62.171.153.198:3995/uploads/car-images/suzuki.png',
    'models': [
      'Swift', 'Vitara', 'Jimny', 'Baleno', 'Celerio',
      'Ignis', 'SX4', 'Alto', 'Wagon R', 'Kizashi',
      'Samurai', 'Sidekick', 'Esteem', 'Grand Vitara', 'XL7',
      'Cappuccino', 'Carry', 'Liana', 'Splash', 'X-90'
    ],
  },
};

class BrandRepositoryImpl {
  /**
   * الحصول على كافة العلامات التجارية
   * @returns {Promise<Array>} - قائمة العلامات التجارية
   */
  async getBrands() {
    try {
      // محاكاة استجابة الخادم
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const brands = [];
      
      Object.entries(carData).forEach(([name, data]) => {
        brands.push(new CarBrand({
          id: name,
          name: name,
          logoUrl: data.logo,
          models: data.models,
          carsCount: data.models.length
        }));
      });
      
      return brands;
    } catch (error) {
      console.error('Error fetching brands:', error);
      throw new Error(`Failed to fetch brands: ${error.message}`);
    }
  }

  /**
   * الحصول على علامة تجارية محددة
   * @param {string} brandId - معرف العلامة التجارية
   * @returns {Promise<Object|null>} - العلامة التجارية أو null
   */
  async getBrandById(brandId) {
    try {
      // محاكاة استجابة الخادم
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (!carData[brandId]) {
        return null;
      }
      
      return new CarBrand({
        id: brandId,
        name: brandId,
        logoUrl: carData[brandId].logo,
        models: carData[brandId].models,
        carsCount: carData[brandId].models.length
      });
    } catch (error) {
      console.error(`Error fetching brand ${brandId}:`, error);
      throw new Error(`Failed to fetch brand: ${error.message}`);
    }
  }
}

module.exports = BrandRepositoryImpl;