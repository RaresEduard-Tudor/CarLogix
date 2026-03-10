// Car brands and their popular models
export const carBrands = {
  'Audi': ['A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q3', 'Q4 e-tron', 'Q5', 'Q7', 'Q8', 'TT', 'R8', 'e-tron GT'],
  'BMW': ['1 Series', '2 Series', '3 Series', '4 Series', '5 Series', '6 Series', '7 Series', '8 Series', 'X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7', 'Z4', 'i3', 'i4', 'iX'],
  'Mercedes-Benz': ['A-Class', 'B-Class', 'C-Class', 'CLA', 'CLS', 'E-Class', 'G-Class', 'GLA', 'GLB', 'GLC', 'GLE', 'GLS', 'S-Class', 'SL', 'AMG GT', 'EQA', 'EQB', 'EQC', 'EQS'],
  'Volkswagen': ['Golf', 'Polo', 'Passat', 'Tiguan', 'Touareg', 'Arteon', 'T-Cross', 'T-Roc', 'Sharan', 'Touran', 'Caddy', 'ID.3', 'ID.4', 'ID.5'],
  'Toyota': ['Corolla', 'Camry', 'Prius', 'RAV4', 'Highlander', 'Land Cruiser', 'Prado', 'Hilux', 'Yaris', 'Avalon', 'Sienna', 'Tacoma', 'Tundra', 'Sequoia'],
  'Honda': ['Civic', 'Accord', 'CR-V', 'HR-V', 'Pilot', 'Passport', 'Ridgeline', 'Fit', 'Insight', 'Odyssey'],
  'Ford': ['Fiesta', 'Focus', 'Mondeo', 'Mustang', 'Explorer', 'Escape', 'Edge', 'Expedition', 'F-150', 'Ranger', 'Bronco', 'Maverick'],
  'Chevrolet': ['Spark', 'Sonic', 'Cruze', 'Malibu', 'Impala', 'Corvette', 'Camaro', 'Equinox', 'Traverse', 'Tahoe', 'Suburban', 'Silverado', 'Colorado'],
  'Nissan': ['Micra', 'Sentra', 'Altima', 'Maxima', 'GT-R', 'Juke', 'Qashqai', 'X-Trail', 'Murano', 'Pathfinder', 'Armada', 'Frontier', 'Titan'],
  'Hyundai': ['i10', 'i20', 'i30', 'Elantra', 'Sonata', 'Genesis', 'Kona', 'Tucson', 'Santa Fe', 'Palisade', 'Venue'],
  'Kia': ['Picanto', 'Rio', 'Forte', 'Optima', 'Stinger', 'Soul', 'Seltos', 'Sportage', 'Sorento', 'Telluride', 'Carnival'],
  'Mazda': ['Mazda2', 'Mazda3', 'Mazda6', 'MX-5', 'CX-3', 'CX-30', 'CX-5', 'CX-9', 'CX-50'],
  'Subaru': ['Impreza', 'Legacy', 'Outback', 'Forester', 'Ascent', 'WRX', 'BRZ'],
  'Mitsubishi': ['Mirage', 'Lancer', 'Eclipse Cross', 'Outlander', 'Pajero', 'Triton'],
  'Lexus': ['IS', 'ES', 'GS', 'LS', 'LC', 'UX', 'NX', 'RX', 'GX', 'LX'],
  'Infiniti': ['Q50', 'Q60', 'Q70', 'QX30', 'QX50', 'QX60', 'QX80'],
  'Acura': ['ILX', 'TLX', 'RLX', 'NSX', 'RDX', 'MDX'],
  'Volvo': ['S60', 'S90', 'V60', 'V90', 'XC40', 'XC60', 'XC90'],
  'Jaguar': ['XE', 'XF', 'XJ', 'F-Type', 'E-Pace', 'F-Pace', 'I-Pace'],
  'Land Rover': ['Discovery Sport', 'Discovery', 'Range Rover Evoque', 'Range Rover Velar', 'Range Rover Sport', 'Range Rover'],
  'Porsche': ['911', 'Boxster', 'Cayman', 'Panamera', 'Macan', 'Cayenne', 'Taycan'],
  'Tesla': ['Model 3', 'Model S', 'Model X', 'Model Y', 'Cybertruck', 'Roadster'],
  'Peugeot': ['108', '208', '308', '508', '2008', '3008', '5008'],
  'Renault': ['Clio', 'Megane', 'Talisman', 'Captur', 'Kadjar', 'Koleos'],
  'Citroën': ['C1', 'C3', 'C4', 'C5', 'C3 Aircross', 'C5 Aircross'],
  'Skoda': ['Fabia', 'Octavia', 'Superb', 'Kamiq', 'Karoq', 'Kodiaq'],
  'SEAT': ['Ibiza', 'Leon', 'Toledo', 'Arona', 'Ateca', 'Tarraco'],
  'Fiat': ['500', 'Panda', 'Tipo', '500X', '500L', 'Ducato'],
  'Alfa Romeo': ['Giulietta', 'Giulia', 'Stelvio', '4C'],
  'Jeep': ['Renegade', 'Compass', 'Cherokee', 'Grand Cherokee', 'Wrangler', 'Gladiator'],
  'Dodge': ['Charger', 'Challenger', 'Durango', 'Journey'],
  'Chrysler': ['300', 'Pacifica'],
  'Buick': ['Encore', 'Envision', 'Enclave'],
  'Cadillac': ['ATS', 'CTS', 'XTS', 'XT4', 'XT5', 'XT6', 'Escalade'],
  'GMC': ['Terrain', 'Acadia', 'Yukon', 'Sierra', 'Canyon'],
  'Lincoln': ['MKZ', 'Continental', 'MKC', 'Corsair', 'Nautilus', 'Aviator', 'Navigator'],
  'Genesis': ['G70', 'G80', 'G90', 'GV70', 'GV80'],
  'Mini': ['Cooper', 'Countryman', 'Clubman'],
  'Smart': ['Fortwo', 'Forfour'],
  'Dacia': ['Sandero', 'Logan', 'Duster', 'Lodgy'],
  'Lada': ['Granta', 'Vesta', 'XRAY', 'Niva'],
  'Other': ['Custom/Kit Car', 'Classic/Vintage', 'Unknown']
};

// Car colors
export const carColors = [
  'White',
  'Black',
  'Silver',
  'Gray',
  'Red',
  'Blue',
  'Green',
  'Yellow',
  'Orange',
  'Brown',
  'Beige',
  'Gold',
  'Purple',
  'Pink',
  'Maroon',
  'Navy',
  'Turquoise',
  'Lime',
  'Other'
];

// Get all brand names sorted
export const getBrandNames = () => {
  return Object.keys(carBrands).sort();
};

// Get models for a specific brand
export const getModelsForBrand = (brand) => {
  return carBrands[brand] || [];
};

// Service types for maintenance dropdown
export const serviceTypes = [
  'Oil Change',
  'Tire Rotation',
  'Brake Service',
  'Transmission Service',
  'Engine Tune-up',
  'Air Filter',
  'Cabin Filter',
  'Battery Replacement',
  'Spark Plugs',
  'Coolant Flush',
  'Inspection',
  'Other'
];