export interface LanguageItem {
  id: string;
  label: string;
  nativeName: string;
  code: string;
}

export const LANGUAGES: LanguageItem[] = [
  { id: 'english', label: 'English', nativeName: 'English', code: 'en' },
  { id: 'hindi', label: 'हिन्दी', nativeName: 'Hindi', code: 'hi' },
  { id: 'marathi', label: 'मराठी', nativeName: 'Marathi', code: 'mr' },
  { id: 'kannada', label: 'ಕನ್ನಡ', nativeName: 'Kannada', code: 'kn' },
  { id: 'telugu', label: 'తెలుగు', nativeName: 'Telugu', code: 'te' },
  { id: 'malayalam', label: 'മലയാളം', nativeName: 'Malayalam', code: 'ml' },
];

export const SKILL_IMAGES: Record<string, any> = {
  labour: require('@/assets/images/skills/labour.png'),
  mason: require('@/assets/images/skills/mason.png'),
  it_technician: require('@/assets/images/skills/iti_technician.png'),
  carpenter: require('@/assets/images/skills/carpenter.png'),
  electrician: require('@/assets/images/skills/electrician.png'),
  painter: require('@/assets/images/skills/painter.png'),
  plumber: require('@/assets/images/skills/plumber.png'),
  welder: require('@/assets/images/skills/welder.png'),
  foreman: require('@/assets/images/skills/foreman.png'),
  supervisor: require('@/assets/images/skills/supervisor.png'),
  engineer: require('@/assets/images/skills/engineer.png'),
};

export const SKILLS = [
  { id: 'labour', label: 'Labour', hindiLabel: 'लेबर', icon: '🏗️' },
  { id: 'mason', label: 'Mason', hindiLabel: 'मिस्त्री', icon: '🧱' },
  { id: 'it_technician', label: 'ITI/Technician', hindiLabel: 'आई.टी.आई/\nतकनीशियन', icon: '💻' },
  { id: 'carpenter', label: 'Carpenter', hindiLabel: 'बढ़ई', icon: '🪚' },
  { id: 'electrician', label: 'Electrician', hindiLabel: 'इलेक्ट्रीशियन', icon: '⚡' },
  { id: 'painter', label: 'Painter', hindiLabel: 'पेंटर', icon: '🎨' },
  { id: 'plumber', label: 'Plumber', hindiLabel: 'प्लम्बर', icon: '🔧' },
  { id: 'welder', label: 'Welder', hindiLabel: 'वेल्डर', icon: '🔥' },
  { id: 'foreman', label: 'Foreman', hindiLabel: 'फोरमैन', icon: '👷' },
  { id: 'supervisor', label: 'Supervisor', hindiLabel: 'सुपरवाइज़र', icon: '📋' },
  { id: 'engineer', label: 'Engineer', hindiLabel: 'इंजीनियर', icon: '⚙️' },
];

// Category metadata for visual icons, colors, and images on JobCard
export const JOB_CATEGORY_META: Record<string, { icon: string; color: string; bg: string; image: string }> = {
  labour: { icon: 'people', color: '#E65100', bg: '#FFF3E0', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200&h=200&fit=crop' },
  mason: { icon: 'construct', color: '#4E342E', bg: '#EFEBE9', image: 'https://images.unsplash.com/photo-1590644365607-1c5e1a73df6e?w=200&h=200&fit=crop' },
  technician: { icon: 'hardware-chip', color: '#1565C0', bg: '#E3F2FD', image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=200&h=200&fit=crop' },
  carpenter: { icon: 'hammer', color: '#6D4C41', bg: '#EFEBE9', image: 'https://images.unsplash.com/photo-1601058268499-e52658b8bb88?w=200&h=200&fit=crop' },
  electrician: { icon: 'flash', color: '#F9A825', bg: '#FFFDE7', image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=200&h=200&fit=crop' },
  painter: { icon: 'color-palette', color: '#AD1457', bg: '#FCE4EC', image: 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=200&h=200&fit=crop' },
  plumber: { icon: 'water', color: '#00838F', bg: '#E0F7FA', image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=200&h=200&fit=crop' },
  welder: { icon: 'flame', color: '#E53935', bg: '#FFEBEE', image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=200&h=200&fit=crop' },
  foreman: { icon: 'megaphone', color: '#2E7D32', bg: '#E8F5E9', image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=200&h=200&fit=crop' },
  supervisor: { icon: 'clipboard', color: '#5E35B1', bg: '#EDE7F6', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop' },
  engineer: { icon: 'cog', color: '#37474F', bg: '#ECEFF1', image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=200&h=200&fit=crop' },
  teacher: { icon: 'school', color: '#0277BD', bg: '#E1F5FE', image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=200&h=200&fit=crop' },
  driver: { icon: 'car', color: '#455A64', bg: '#ECEFF1', image: 'https://images.unsplash.com/photo-1449965408869-ebd3fee40ee5?w=200&h=200&fit=crop' },
  security: { icon: 'shield-checkmark', color: '#1B5E20', bg: '#E8F5E9', image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=200&h=200&fit=crop' },
  helper: { icon: 'hand-left', color: '#FF6F00', bg: '#FFF8E1', image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=200&h=200&fit=crop' },
};

// Unique image per job ID for visual variety
export const JOB_IMAGES: Record<string, string> = {
  '1': 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200&h=200&fit=crop',
  '7': 'https://images.unsplash.com/photo-1578496479914-7ef3b0193be3?w=200&h=200&fit=crop',
  '8': 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=200&h=200&fit=crop',
  '9': 'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=200&h=200&fit=crop',
  '10': 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=200&h=200&fit=crop',
  '5': 'https://images.unsplash.com/photo-1590644365607-1c5e1a73df6e?w=200&h=200&fit=crop',
  '11': 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=200&h=200&fit=crop',
  '12': 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=200&h=200&fit=crop',
  '13': 'https://images.unsplash.com/photo-1607400201889-565b1ee75f8e?w=200&h=200&fit=crop',
  '14': 'https://images.unsplash.com/photo-1582653291997-079a1c04e5a1?w=200&h=200&fit=crop',
  '2': 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=200&h=200&fit=crop',
  '15': 'https://images.unsplash.com/photo-1558049076-236ad5e0df53?w=200&h=200&fit=crop',
  '16': 'https://images.unsplash.com/photo-1555963966-b7ae5404b6ed?w=200&h=200&fit=crop',
  '17': 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=200&h=200&fit=crop',
  '18': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&h=200&fit=crop',
  '3': 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=200&h=200&fit=crop',
  '19': 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=200&h=200&fit=crop',
  '20': 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=200&h=200&fit=crop',
  '21': 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=200&h=200&fit=crop',
  '4': 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=200&h=200&fit=crop',
  '22': 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=200&h=200&fit=crop',
  '23': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=200&h=200&fit=crop',
  '24': 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=200&h=200&fit=crop',
  '25': 'https://images.unsplash.com/photo-1601058268499-e52658b8bb88?w=200&h=200&fit=crop',
  '26': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop',
  '27': 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=200&h=200&fit=crop',
  '28': 'https://images.unsplash.com/photo-1610395219791-21b0353e43cb?w=200&h=200&fit=crop',
  '29': 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=200&h=200&fit=crop',
  '30': 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=200&h=200&fit=crop',
  '31': 'https://images.unsplash.com/photo-1605117882932-f9e32b03fea9?w=200&h=200&fit=crop',
  '32': 'https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=200&h=200&fit=crop',
  '33': 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=200&h=200&fit=crop',
  '34': 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=200&h=200&fit=crop',
  '35': 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=200&h=200&fit=crop',
  '36': 'https://images.unsplash.com/photo-1544724107-6d5c4caaff30?w=200&h=200&fit=crop',
  '37': 'https://images.unsplash.com/photo-1557862921-37829c790f19?w=200&h=200&fit=crop',
  '38': 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=200&h=200&fit=crop',
  '39': 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=200&h=200&fit=crop',
  '40': 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=200&h=200&fit=crop',
  '41': 'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=200&h=200&fit=crop',
  '6': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
  '42': 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=200&h=200&fit=crop',
  '43': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&h=200&fit=crop',
  '44': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=200&h=200&fit=crop',
  '45': 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=200&h=200&fit=crop',
  '46': 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=200&h=200&fit=crop',
  '47': 'https://images.unsplash.com/photo-1537462715986-d655a1b75395?w=200&h=200&fit=crop',
  '48': 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=200&h=200&fit=crop',
  '49': 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=200&h=200&fit=crop',
  '50': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=200&h=200&fit=crop',
  '51': 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=200&h=200&fit=crop',
  '52': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&h=200&fit=crop',
  '53': 'https://images.unsplash.com/photo-1523050854058-8df90110c476?w=200&h=200&fit=crop',
  '54': 'https://images.unsplash.com/photo-1449965408869-ebd3fee40ee5?w=200&h=200&fit=crop',
  '55': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=200&h=200&fit=crop',
  '56': 'https://images.unsplash.com/photo-1557862921-37829c790f19?w=200&h=200&fit=crop',
  '57': 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=200&h=200&fit=crop',
  '58': 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=200&h=200&fit=crop',
  '59': 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=200&h=200&fit=crop',
  '60': 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=200&h=200&fit=crop',
};

export const MOCK_JOBS = [
  // === LABOUR JOBS ===
  { id: '1', title: 'Construction Labour', company: 'BuildRight Infra', salary: '₹18,000 - ₹22,000/mo', location: 'Silicon City, Indore', distance: '2.5 km', type: 'Full Time', urgent: true, posted: '2h ago', category: 'labour' },
  { id: '7', title: 'Site Labour - Warehouse', company: 'GoDown Logistics', salary: '₹500/day', location: 'Bhawarkuan, Indore', distance: '3.1 km', type: 'Daily Wage', urgent: false, posted: '4h ago', category: 'labour' },
  { id: '8', title: 'Loading/Unloading Labour', company: 'TransPack India', salary: '₹450/day', location: 'Bengali Square, Indore', distance: '5.6 km', type: 'Daily Wage', urgent: true, posted: '1h ago', category: 'labour' },
  { id: '9', title: 'Factory Helper', company: 'IndoPack Manufacturing', salary: '₹14,000 - ₹16,000/mo', location: 'Rau, Indore', distance: '8.2 km', type: 'Full Time', urgent: false, posted: '1d ago', category: 'labour' },
  { id: '10', title: 'Road Construction Worker', company: 'Highway Projects Ltd', salary: '₹550/day', location: 'Super Corridor, Indore', distance: '4.0 km', type: 'Daily Wage', urgent: true, posted: '30m ago', category: 'labour' },

  // === MASON JOBS ===
  { id: '5', title: 'Mason - Building Construction', company: 'CementPro Builders', salary: '₹900/day', location: 'Super Corridor, Indore', distance: '3.7 km', type: 'Daily Wage', urgent: true, posted: '30m ago', category: 'mason' },
  { id: '11', title: 'Brick Mason', company: 'NeoConstruct Pvt Ltd', salary: '₹850/day', location: 'Nipania, Indore', distance: '6.1 km', type: 'Daily Wage', urgent: false, posted: '3h ago', category: 'mason' },
  { id: '12', title: 'Tile & Flooring Mason', company: 'FloorCraft Solutions', salary: '₹22,000 - ₹28,000/mo', location: 'Vijay Nagar, Indore', distance: '2.8 km', type: 'Full Time', urgent: true, posted: '45m ago', category: 'mason' },
  { id: '13', title: 'Plastering Mason', company: 'WallFinish India', salary: '₹750/day', location: 'Scheme No. 54, Indore', distance: '4.5 km', type: 'Daily Wage', urgent: false, posted: '6h ago', category: 'mason' },
  { id: '14', title: 'Stone Mason - Heritage Work', company: 'Rajwada Restoration', salary: '₹1,100/day', location: 'Rajwada, Indore', distance: '5.2 km', type: 'Part Time', urgent: false, posted: '2d ago', category: 'mason' },

  // === ELECTRICIAN JOBS ===
  { id: '2', title: 'Electrician', company: 'PowerFix Solutions', salary: '₹25,000 - ₹30,000/mo', location: 'Vijay Nagar, Indore', distance: '4.1 km', type: 'Full Time', urgent: false, posted: '5h ago', category: 'electrician' },
  { id: '15', title: 'Industrial Electrician', company: 'Indore Steel Works', salary: '₹28,000 - ₹35,000/mo', location: 'Rau, Indore', distance: '9.0 km', type: 'Full Time', urgent: true, posted: '1h ago', category: 'electrician' },
  { id: '16', title: 'Home Wiring Electrician', company: 'SafeWire Services', salary: '₹700/day', location: 'Saket Nagar, Indore', distance: '3.3 km', type: 'Daily Wage', urgent: false, posted: '8h ago', category: 'electrician' },
  { id: '17', title: 'AC Repair Technician', company: 'CoolBreeze Solutions', salary: '₹20,000 - ₹26,000/mo', location: 'Palasia, Indore', distance: '2.1 km', type: 'Full Time', urgent: true, posted: '2h ago', category: 'electrician' },
  { id: '18', title: 'Electrical Maintenance', company: 'MegaMall Indore', salary: '₹18,000 - ₹22,000/mo', location: 'Scheme No. 78, Indore', distance: '5.0 km', type: 'Full Time', urgent: false, posted: '12h ago', category: 'electrician' },

  // === PAINTER JOBS ===
  { id: '3', title: 'Painter (Interior)', company: 'ColorCraft India', salary: '₹800/day', location: 'Palasia, Indore', distance: '6.3 km', type: 'Daily Wage', urgent: true, posted: '1h ago', category: 'painter' },
  { id: '19', title: 'Exterior Wall Painter', company: 'BrightCoat Painters', salary: '₹750/day', location: 'Tilak Nagar, Indore', distance: '4.7 km', type: 'Daily Wage', urgent: false, posted: '5h ago', category: 'painter' },
  { id: '20', title: 'POP & Texture Artist', company: 'DesignWall Studio', salary: '₹30,000 - ₹38,000/mo', location: 'Silicon City, Indore', distance: '2.0 km', type: 'Full Time', urgent: true, posted: '3h ago', category: 'painter' },
  { id: '21', title: 'Wood Polish & Painter', company: 'WoodShine Works', salary: '₹650/day', location: 'Annapurna Road, Indore', distance: '3.9 km', type: 'Part Time', urgent: false, posted: '1d ago', category: 'painter' },

  // === PLUMBER JOBS ===
  { id: '4', title: 'Plumber', company: 'AquaFlow Services', salary: '₹20,000 - ₹25,000/mo', location: 'Scheme No. 78, Indore', distance: '3.8 km', type: 'Part Time', urgent: false, posted: '1d ago', category: 'plumber' },
  { id: '22', title: 'Plumber - New Construction', company: 'PipeLine Experts', salary: '₹800/day', location: 'Super Corridor, Indore', distance: '4.2 km', type: 'Daily Wage', urgent: true, posted: '2h ago', category: 'plumber' },
  { id: '23', title: 'Sanitary Fitter', company: 'CleanFit Solutions', salary: '₹18,000 - ₹22,000/mo', location: 'Geeta Bhawan, Indore', distance: '3.0 km', type: 'Full Time', urgent: false, posted: '7h ago', category: 'plumber' },
  { id: '24', title: 'Water Tank & Motor Repair', company: 'AquaTech Services', salary: '₹600/day', location: 'Sudama Nagar, Indore', distance: '2.6 km', type: 'Part Time', urgent: false, posted: '2d ago', category: 'plumber' },

  // === CARPENTER JOBS ===
  { id: '25', title: 'Furniture Carpenter', company: 'WoodCraft India', salary: '₹22,000 - ₹28,000/mo', location: 'MG Road, Indore', distance: '4.8 km', type: 'Full Time', urgent: true, posted: '1h ago', category: 'carpenter' },
  { id: '26', title: 'Modular Kitchen Carpenter', company: 'KitchenPro Designs', salary: '₹900/day', location: 'Vijay Nagar, Indore', distance: '3.5 km', type: 'Daily Wage', urgent: false, posted: '4h ago', category: 'carpenter' },
  { id: '27', title: 'Door & Window Fitter', company: 'FitRight Woodworks', salary: '₹700/day', location: 'New Palasia, Indore', distance: '2.9 km', type: 'Daily Wage', urgent: true, posted: '45m ago', category: 'carpenter' },
  { id: '28', title: 'Shuttering Carpenter', company: 'BuildMax Projects', salary: '₹850/day', location: 'Silicon City, Indore', distance: '2.3 km', type: 'Daily Wage', urgent: false, posted: '6h ago', category: 'carpenter' },
  { id: '29', title: 'Interior Woodwork', company: 'HomeDecor Studio', salary: '₹25,000 - ₹32,000/mo', location: 'Scheme No. 54, Indore', distance: '5.1 km', type: 'Full Time', urgent: true, posted: '2h ago', category: 'carpenter' },

  // === WELDER JOBS ===
  { id: '30', title: 'MIG/TIG Welder', company: 'MetalForge Industries', salary: '₹24,000 - ₹30,000/mo', location: 'Rau, Indore', distance: '8.5 km', type: 'Full Time', urgent: true, posted: '1h ago', category: 'welder' },
  { id: '31', title: 'Fabrication Welder', company: 'SteelCraft Works', salary: '₹900/day', location: 'Bhawarkuan, Indore', distance: '3.4 km', type: 'Daily Wage', urgent: false, posted: '5h ago', category: 'welder' },
  { id: '32', title: 'Gate & Grill Welder', company: 'IronArt Fabricators', salary: '₹700/day', location: 'Khajrana, Indore', distance: '6.7 km', type: 'Part Time', urgent: false, posted: '1d ago', category: 'welder' },
  { id: '33', title: 'Industrial Pipe Welder', company: 'PipeWeld Solutions', salary: '₹32,000 - ₹40,000/mo', location: 'Super Corridor, Indore', distance: '4.0 km', type: 'Full Time', urgent: true, posted: '3h ago', category: 'welder' },

  // === ITI/TECHNICIAN JOBS ===
  { id: '34', title: 'ITI Fitter', company: 'PrecisionTech Indore', salary: '₹16,000 - ₹20,000/mo', location: 'Nipania, Indore', distance: '5.5 km', type: 'Full Time', urgent: false, posted: '8h ago', category: 'technician' },
  { id: '35', title: 'CNC Operator', company: 'AutoParts Manufacturing', salary: '₹22,000 - ₹28,000/mo', location: 'Rau, Indore', distance: '9.2 km', type: 'Full Time', urgent: true, posted: '2h ago', category: 'technician' },
  { id: '36', title: 'Motor Winding Technician', company: 'ElectroFix India', salary: '₹18,000 - ₹24,000/mo', location: 'Bengali Square, Indore', distance: '4.3 km', type: 'Full Time', urgent: false, posted: '1d ago', category: 'technician' },
  { id: '37', title: 'CCTV Installation Tech', company: 'SecureView Systems', salary: '₹650/day', location: 'Palasia, Indore', distance: '2.5 km', type: 'Part Time', urgent: true, posted: '1h ago', category: 'technician' },
  { id: '38', title: 'Mobile Repair Technician', company: 'PhoneFix Hub', salary: '₹15,000 - ₹20,000/mo', location: 'Rajwada, Indore', distance: '5.0 km', type: 'Full Time', urgent: false, posted: '12h ago', category: 'technician' },

  // === FOREMAN JOBS ===
  { id: '39', title: 'Construction Foreman', company: 'MegaBuild Corp', salary: '₹30,000 - ₹38,000/mo', location: 'Silicon City, Indore', distance: '2.2 km', type: 'Full Time', urgent: true, posted: '30m ago', category: 'foreman' },
  { id: '40', title: 'Road Works Foreman', company: 'National Highway Auth', salary: '₹28,000 - ₹35,000/mo', location: 'Super Corridor, Indore', distance: '4.5 km', type: 'Full Time', urgent: false, posted: '6h ago', category: 'foreman' },
  { id: '41', title: 'Factory Floor Foreman', company: 'IndusPack Ltd', salary: '₹25,000 - ₹32,000/mo', location: 'Rau, Indore', distance: '8.0 km', type: 'Full Time', urgent: false, posted: '1d ago', category: 'foreman' },

  // === SUPERVISOR JOBS ===
  { id: '6', title: 'Site Supervisor', company: 'Metro Construction Ltd', salary: '₹35,000 - ₹42,000/mo', location: 'Rajwada, Indore', distance: '5.2 km', type: 'Full Time', urgent: false, posted: '3h ago', category: 'supervisor' },
  { id: '42', title: 'Warehouse Supervisor', company: 'LogiStore India', salary: '₹22,000 - ₹28,000/mo', location: 'Bhawarkuan, Indore', distance: '3.8 km', type: 'Full Time', urgent: true, posted: '2h ago', category: 'supervisor' },
  { id: '43', title: 'Production Supervisor', company: 'FoodPack Industries', salary: '₹26,000 - ₹32,000/mo', location: 'Nipania, Indore', distance: '6.0 km', type: 'Full Time', urgent: false, posted: '9h ago', category: 'supervisor' },

  // === ENGINEER JOBS ===
  { id: '44', title: 'Junior Civil Engineer', company: 'UrbanPlan Developers', salary: '₹30,000 - ₹40,000/mo', location: 'Scheme No. 78, Indore', distance: '3.6 km', type: 'Full Time', urgent: true, posted: '1h ago', category: 'engineer' },
  { id: '45', title: 'Site Engineer', company: 'SkyScraper Constructions', salary: '₹35,000 - ₹45,000/mo', location: 'Silicon City, Indore', distance: '2.0 km', type: 'Full Time', urgent: false, posted: '4h ago', category: 'engineer' },
  { id: '46', title: 'Electrical Engineer', company: 'PowerGrid Indore', salary: '₹32,000 - ₹42,000/mo', location: 'Super Corridor, Indore', distance: '4.3 km', type: 'Full Time', urgent: true, posted: '2h ago', category: 'engineer' },
  { id: '47', title: 'Mechanical Maintenance Engg', company: 'AutoWorks Factory', salary: '₹28,000 - ₹36,000/mo', location: 'Rau, Indore', distance: '9.5 km', type: 'Full Time', urgent: false, posted: '1d ago', category: 'engineer' },

  // === TEACHER JOBS ===
  { id: '48', title: 'Primary School Teacher', company: 'Sunrise Public School', salary: '₹15,000 - ₹20,000/mo', location: 'Vijay Nagar, Indore', distance: '3.0 km', type: 'Full Time', urgent: false, posted: '3h ago', category: 'teacher' },
  { id: '49', title: 'Math Teacher (8th-10th)', company: 'Oxford Academy', salary: '₹18,000 - ₹25,000/mo', location: 'Palasia, Indore', distance: '2.4 km', type: 'Full Time', urgent: true, posted: '1h ago', category: 'teacher' },
  { id: '50', title: 'Hindi Teacher', company: 'Saraswati Vidyalaya', salary: '₹12,000 - ₹16,000/mo', location: 'Geeta Bhawan, Indore', distance: '3.5 km', type: 'Part Time', urgent: false, posted: '6h ago', category: 'teacher' },
  { id: '51', title: 'Tuition Teacher - Science', company: 'BrainBox Coaching', salary: '₹400/day', location: 'Scheme No. 54, Indore', distance: '4.0 km', type: 'Part Time', urgent: false, posted: '1d ago', category: 'teacher' },
  { id: '52', title: 'Computer Teacher', company: 'TechSchool Academy', salary: '₹16,000 - ₹22,000/mo', location: 'Silicon City, Indore', distance: '2.1 km', type: 'Full Time', urgent: true, posted: '2h ago', category: 'teacher' },
  { id: '53', title: 'English Speaking Trainer', company: 'FluenT Academy', salary: '₹500/day', location: 'New Palasia, Indore', distance: '2.8 km', type: 'Part Time', urgent: false, posted: '8h ago', category: 'teacher' },

  // === DRIVER JOBS ===
  { id: '54', title: 'Truck Driver - Local', company: 'FastFreight Logistics', salary: '₹20,000 - ₹25,000/mo', location: 'Bhawarkuan, Indore', distance: '3.5 km', type: 'Full Time', urgent: true, posted: '1h ago', category: 'driver' },
  { id: '55', title: 'Auto Rickshaw Driver', company: 'CityRide Services', salary: '₹600/day', location: 'Rajwada, Indore', distance: '5.0 km', type: 'Daily Wage', urgent: false, posted: '4h ago', category: 'driver' },

  // === SECURITY JOBS ===
  { id: '56', title: 'Security Guard - Night Shift', company: 'ShieldForce Security', salary: '₹14,000 - ₹18,000/mo', location: 'Scheme No. 78, Indore', distance: '4.2 km', type: 'Full Time', urgent: false, posted: '5h ago', category: 'security' },
  { id: '57', title: 'Gate Security - Society', company: 'SecureHome Services', salary: '₹12,000 - ₹15,000/mo', location: 'Saket Nagar, Indore', distance: '3.0 km', type: 'Full Time', urgent: true, posted: '2h ago', category: 'security' },

  // === HELPER JOBS ===
  { id: '58', title: 'Kitchen Helper - Restaurant', company: 'Sarafa Dhaba', salary: '₹10,000 - ₹13,000/mo', location: 'Rajwada, Indore', distance: '5.2 km', type: 'Full Time', urgent: false, posted: '3h ago', category: 'helper' },
  { id: '59', title: 'Delivery Boy', company: 'QuickDrop Indore', salary: '₹450/day', location: 'Vijay Nagar, Indore', distance: '3.0 km', type: 'Daily Wage', urgent: true, posted: '45m ago', category: 'helper' },
  { id: '60', title: 'Shop Helper - Hardware', company: 'BuildMart Store', salary: '₹11,000 - ₹14,000/mo', location: 'Tilak Nagar, Indore', distance: '4.5 km', type: 'Full Time', urgent: false, posted: '1d ago', category: 'helper' },
];

