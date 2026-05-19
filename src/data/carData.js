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

// Signature / heritage color names per brand (top 30 popular brands)
export const brandColors = {
  'BMW': ['Alpine White', 'Jet Black', 'Mineral Grey', 'Carbon Black', 'Estoril Blue', 'Portimao Blue', 'San Marino Blue', 'Misano Blue', 'Tanzanite Blue', 'Frozen Pure Grey', 'Sunset Orange', 'Sapphire Black', 'Imola Red', 'Brooklyn Grey'],
  'Mercedes-Benz': ['Polar White', 'Obsidian Black', 'Iridium Silver', 'Selenite Grey', 'Cavansite Blue', 'Designo Diamond White', 'Mojave Silver', 'Hyacinth Red', 'Emerald Green', 'Brilliant Blue', 'Cardinal Red', 'Olivine Grey', 'Graphite Grey'],
  'Audi': ['Glacier White', 'Mythos Black', 'Florett Silver', 'Daytona Grey', 'Nardo Grey', 'Tango Red', 'Ara Blue', 'Navarra Blue', 'District Green', 'Python Yellow', 'Misano Red', 'Sebring Black', 'Ascari Blue', 'Vegas Yellow'],
  'Porsche': ['Guards Red', 'GT Silver', 'Racing Yellow', 'Miami Blue', 'Lava Orange', 'Carmine Red', 'Mamba Green', 'Chalk', 'Crayon', 'Gentian Blue', 'Carrara White', 'Jet Black', 'Aetna Blue', 'Shark Blue', 'Python Green', 'Riviera Blue'],
  'Volkswagen': ['Pure White', 'Deep Black', 'Reflex Silver', 'Indium Grey', 'Atlantic Blue', 'Habanero Orange', 'Kings Red', 'Lapiz Blue', 'Mojave Beige', 'Tornado Red', 'Oryx White'],
  'Toyota': ['Super White', 'Midnight Black', 'Celestial Silver', 'Magnetic Gray', 'Barcelona Red', 'Blueprint', 'Cypress', 'Ruby Flare Pearl', 'Wind Chill Pearl', 'Lunar Rock', 'Solar Octane', 'Voodoo Blue', 'Army Green'],
  'Honda': ['Crystal Black Pearl', 'Platinum White Pearl', 'Modern Steel', 'Sonic Gray Pearl', 'Rallye Red', 'Aegean Blue', 'Lunar Silver', 'Boost Blue', 'Still Night Pearl', 'Urban Gray Pearl', 'Radiant Red'],
  'Ford': ['Oxford White', 'Shadow Black', 'Iconic Silver', 'Magnetic Gray', 'Race Red', 'Antimatter Blue', 'Atlas Blue', 'Cyber Orange', 'Eruption Green', 'Grabber Blue', 'Velocity Blue', 'Rapid Red', 'Twister Orange', 'Highland Green', 'Mustang Yellow'],
  'Chevrolet': ['Summit White', 'Mosaic Black', 'Silver Ice', 'Satin Steel', 'Torch Red', 'Cherry Red Tintcoat', 'Riptide Blue', 'Sea Wolf Gray', 'Rapid Blue', 'Hot Rod Red', 'Sting Gray', 'Accelerate Yellow', 'Rally Green', 'Bright Yellow'],
  'Nissan': ['Glacier White', 'Super Black', 'Brilliant Silver', 'Gun Metallic', 'Scarlet Ember', 'Deep Blue Pearl', 'Storm Blue', 'Solid Red', 'Sunset Drift', 'Bayside Blue', 'Pearl White TriCoat'],
  'Hyundai': ['Atlas White', 'Phantom Black', 'Shimmering Silver', 'Magnetic Force', 'Calypso Red', 'Intense Blue', 'Soultronic Orange', 'Quartz White', 'Cyber Gray', 'Performance Blue', 'Ecotronic Gray'],
  'Kia': ['Snow White Pearl', 'Aurora Black', 'Steel Gray', 'Wolf Gray', 'Runway Red', 'Sparkling Silver', 'Imperial Blue', 'Sapphire Blue', 'Glacial White', 'Mineral Blue', 'Currant Red'],
  'Mazda': ['Soul Red Crystal', 'Snowflake White Pearl', 'Jet Black', 'Machine Gray', 'Deep Crystal Blue', 'Polymetal Gray', 'Sonic Silver', 'Eternal Blue', 'Zircon Sand', 'Artisan Red', 'Rhodium White'],
  'Subaru': ['Crystal White Pearl', 'Crystal Black Silica', 'Ice Silver', 'Magnetite Gray', 'Lapis Blue Pearl', 'World Rally Blue', 'Pure Red', 'Cool Gray Khaki', 'Sapphire Blue Pearl', 'Autumn Green', 'Cinnamon Brown', 'Geyser Blue'],
  'Lexus': ['Eminent White Pearl', 'Obsidian', 'Atomic Silver', 'Nebula Gray Pearl', 'Infrared', 'Nori Green Pearl', 'Caviar', 'Cloudburst Gray', 'Heat Wave', 'Ultrasonic Blue', 'Grecian Water'],
  'Volvo': ['Crystal White Pearl', 'Onyx Black', 'Bright Silver', 'Thunder Gray', 'Fusion Red', 'Denim Blue', 'Pebble Gray', 'Sage Green', 'Bursting Blue', 'Birch Light', 'Platinum Grey'],
  'Jaguar': ['British Racing Green', 'Indigo Blue', 'Caesium Blue', 'Polaris White', 'Santorini Black', 'Eiger Grey', 'Yulong White', 'Firenze Red', 'Velocity Blue', 'Borasco Grey', 'Bluefire Blue'],
  'Land Rover': ['Santorini Black', 'Fuji White', 'Indus Silver', 'Corris Grey', 'Firenze Red', 'Carpathian Grey', 'Hakuba Silver', 'Eiger Grey', 'Marl Grey', 'Yulong White', 'Lantau Bronze'],
  'Tesla': ['Pearl White Multi-Coat', 'Solid Black', 'Midnight Silver Metallic', 'Deep Blue Metallic', 'Red Multi-Coat', 'Quicksilver', 'Stealth Grey', 'Ultra Red', 'Ice Blue'],
  'Mini': ['Chili Red', 'British Racing Green', 'Pepper White', 'Midnight Black', 'Moonwalk Grey', 'Melting Silver', 'Island Blue', 'Caribbean Aqua', 'Volcanic Orange', 'Sage Green', 'Rooftop Grey'],
  'Fiat': ['Bossa Nova White', 'Pasodoble Red', 'Gelato White', 'Tuxedo Black', 'Mocha Latte', 'Espresso', 'Verde Hipster', 'Pompei Grey', 'Celebrity Blue', 'Granito Lucente'],
  'Alfa Romeo': ['Alfa Red', 'Rosso Competizione', 'Misano Blue', 'Trofeo White', 'Vesuvio Gray', 'Vulcano Black', 'Stromboli Gray', 'Visconti Green', 'Anodized Blue', 'Montecarlo Blue', 'Lipari Ochre'],
  'Jeep': ['Bright White', 'Diamond Black', 'Billet Silver', 'Granite Crystal', 'Firecracker Red', 'Hydro Blue', 'Sarge Green', 'Earl Gray', 'Tuscadero Pink', "Punk'n Orange", 'High Velocity Yellow', 'Gobi', 'Gecko Green'],
  'Dodge': ['Pitch Black', 'Bright White', 'Triple Nickel', 'Destroyer Grey', 'TorRed', 'B5 Blue', 'Frostbite', 'Plum Crazy', 'Sublime Green', 'F8 Green', 'Sinamon Stick', 'Octane Red', 'Go Mango'],
  'Cadillac': ['Crystal White Tricoat', 'Stellar Black', 'Radiant Silver', 'Shadow Metallic', 'Red Horizon Tintcoat', 'Wave Metallic', 'Rift Metallic', 'Garnet Metallic', 'Latte Metallic', 'Argent Silver'],
  'Mitsubishi': ['Pearl White', 'Labrador Black', 'Sterling Silver', 'Titanium Gray', 'Red Diamond', 'Octane Blue', 'Cosmic Blue', 'Cyber Gray', 'Sunshine Orange', 'Mercury Gray'],
  'Acura': ['Platinum White Pearl', 'Majestic Black Pearl', 'Lunar Silver', 'Modern Steel', 'Performance Red Pearl', 'Apex Blue', 'Tiger Eye Pearl', 'Liquid Carbon', 'Long Beach Blue', '130R White', 'Phantom Violet'],
  'Infiniti': ['Majestic White', 'Black Obsidian', 'Liquid Platinum', 'Graphite Shadow', 'Dynamic Sunstone Red', 'Hermosa Blue', 'Coulis Red', 'Mocha Almond', 'Pure White', 'Slate Gray'],
  'Peugeot': ['Pearl White', 'Nera Black', 'Cumulus Grey', 'Artense Grey', 'Ultimate Red', 'Vertigo Blue', 'Faro Yellow', 'Olivine Green', 'Elixir Red', 'Celebes Blue'],
  'Renault': ['Glacier White', 'Pearl Black', 'Highland Grey', 'Cassiopée Grey', 'Flame Red', 'Iron Blue', 'Solar Yellow', 'Mercury Beige', 'Magma Orange', 'Diamond Black'],
};

// Brand-specific colors followed by generic fallback (deduped, brand first)
export const getColorsForBrand = (brand) => {
  const branded = brandColors[brand] || [];
  const generic = carColors.filter(c => !branded.includes(c));
  return { branded, generic };
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