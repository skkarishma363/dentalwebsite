const fs = require('fs');
const path = require('path');

// ==========================================================================
// CONFIGURATION & HELPER PATHS
// ==========================================================================
const PATHS = {
  content: path.join(__dirname, 'src', 'content'),
  templates: path.join(__dirname, 'src', 'templates'),
  pages: path.join(__dirname, 'src', 'pages'),
  output: __dirname
};

// Ensure output directories exist
const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

ensureDir(path.join(PATHS.output, 'treatments'));
ensureDir(path.join(PATHS.output, 'doctors'));
ensureDir(path.join(PATHS.output, 'blogs'));

// Clean old compiled static html files in a directory
const cleanDir = (dirPath) => {
  if (fs.existsSync(dirPath)) {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      if (file.endsWith('.html')) {
        fs.unlinkSync(path.join(dirPath, file));
      }
    }
  }
};

cleanDir(path.join(PATHS.output, 'treatments'));
cleanDir(path.join(PATHS.output, 'doctors'));
cleanDir(path.join(PATHS.output, 'blogs'));

// ==========================================================================
// SVG ICON REGISTRY
// ==========================================================================
const getSVGIcon = (name) => {
  const icons = {
    'user-check': `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>`,
    'cpu': `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="15" x2="23" y2="15"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="15" x2="4" y2="15"></line></svg>`,
    'heart': `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`,
    'dollar-sign': `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>`,
    'shield-check': `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 11 11 13 15 9"></polyline></svg>`,
    'smile': `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>`,
    'aperture': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="14.31" y1="8" x2="20.05" y2="17.94"></line><line x1="9.69" y1="8" x2="21.17" y2="8"></line><line x1="7.38" y1="12" x2="13.12" y2="2.06"></line><line x1="9.69" y1="16" x2="3.95" y2="6.06"></line><line x1="14.31" y1="16" x2="2.83" y2="16"></line><line x1="16.62" y1="12" x2="10.88" y2="21.94"></line></svg>`,
    'box': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><polygon points="12 22.08 12 12 3 6.92 3 17.08 12 22.08"></polygon><polygon points="12 22.08 21 17.08 21 6.92 12 12 12 22.08"></polygon><polygon points="12 12 21 6.92 12 1.84 3 6.92 12 12"></polygon><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`,
    'zap': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
    'camera': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>`,
    'eye': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`,
    'shield': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`
  };
  return icons[name] || '';
};

const getTreatmentSVGIcon = (id) => {
  const icons = {
    'root-canal-treatment': `<svg viewBox="0 0 100 100" class="treatment-svg" xmlns="http://www.w3.org/2000/svg" width="70" height="70" fill="none" stroke="var(--color-teal)" style="display: block; margin: 0 auto;"><path d="M50 10 C30 10 25 25 25 45 C25 65 32 85 35 90 C37 92 40 90 42 85 C45 78 48 70 50 70 C52 70 55 78 58 85 C60 90 63 92 65 90 C68 85 75 65 75 45 C75 25 70 10 50 10 Z" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M50 25 V65" stroke-width="4" stroke-linecap="round"/><path d="M50 35 Q40 50 38 75" stroke-width="3" stroke-linecap="round"/><path d="M50 35 Q60 50 62 75" stroke-width="3" stroke-linecap="round"/></svg>`,
    'dental-implants': `<svg viewBox="0 0 100 100" class="treatment-svg" xmlns="http://www.w3.org/2000/svg" width="70" height="70" fill="none" stroke="var(--color-teal)" style="display: block; margin: 0 auto;"><path d="M50 10 C32 10 28 20 28 35 C28 48 35 50 50 50 C65 50 72 48 72 35 C72 20 68 10 50 10 Z" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><line x1="50" y1="50" x2="50" y2="85" stroke-width="5" stroke-linecap="round"/><line x1="40" y1="58" x2="60" y2="58" stroke-width="3" stroke-linecap="round"/><line x1="42" y1="66" x2="58" y2="66" stroke-width="3" stroke-linecap="round"/><line x1="44" y1="74" x2="56" y2="74" stroke-width="3" stroke-linecap="round"/><line x1="46" y1="82" x2="54" y2="82" stroke-width="3" stroke-linecap="round"/></svg>`,
    'smile-designing': `<svg viewBox="0 0 100 100" class="treatment-svg" xmlns="http://www.w3.org/2000/svg" width="70" height="70" fill="none" stroke="var(--color-teal)" style="display: block; margin: 0 auto;"><path d="M20 50 Q50 85 80 50 Q50 65 20 50 Z" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M30 54 Q50 62 70 54" stroke-width="3" stroke-linecap="round"/><path d="M78 20 L82 28 L90 32 L82 36 L78 44 L74 36 L66 32 L74 28 Z" fill="var(--color-lime-accent)" stroke="none"/><path d="M18 25 L20 29 L24 31 L20 33 L18 37 L16 33 L12 31 L16 29 Z" fill="var(--color-lime-accent)" stroke="none"/></svg>`,
    'teeth-whitening': `<svg viewBox="0 0 100 100" class="treatment-svg" xmlns="http://www.w3.org/2000/svg" width="70" height="70" fill="none" stroke="var(--color-teal)" style="display: block; margin: 0 auto;"><path d="M50 15 C30 15 25 30 25 50 C25 70 32 85 35 90 C37 92 40 90 42 85 C45 78 48 70 50 70 C52 70 55 78 58 85 C60 90 63 92 65 90 C68 85 75 70 75 50 C75 30 70 15 50 15 Z" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M30 35 L33 40 L38 42 L33 44 L30 49 L27 44 L22 42 L27 40 Z" fill="var(--color-lime-accent)" stroke="none"/><path d="M65 25 L67 29 L71 31 L67 33 L65 37 L63 33 L59 31 L63 29 Z" fill="var(--color-lime-accent)" stroke="none"/><path d="M52 48 L54 52 L58 54 L54 56 L52 60 L50 56 L46 54 L50 52 Z" fill="var(--color-lime-accent)" stroke="none"/></svg>`,
    'braces-aligners': `<svg viewBox="0 0 100 100" class="treatment-svg" xmlns="http://www.w3.org/2000/svg" width="70" height="70" fill="none" stroke="var(--color-teal)" style="display: block; margin: 0 auto;"><path d="M15 65 Q50 30 85 65" stroke-width="4" stroke-linecap="round"/><rect x="25" y="48" width="8" height="8" rx="2" fill="var(--color-lime-accent)" stroke="currentColor" stroke-width="2"/><rect x="37" y="42" width="8" height="8" rx="2" fill="var(--color-lime-accent)" stroke="currentColor" stroke-width="2"/><rect x="49" y="40" width="8" height="8" rx="2" fill="var(--color-lime-accent)" stroke="currentColor" stroke-width="2"/><rect x="61" y="42" width="8" height="8" rx="2" fill="var(--color-lime-accent)" stroke="currentColor" stroke-width="2"/><rect x="73" y="48" width="8" height="8" rx="2" fill="var(--color-lime-accent)" stroke="currentColor" stroke-width="2"/><line x1="29" y1="46" x2="29" y2="58" stroke-width="2" stroke-linecap="round"/><line x1="41" y1="40" x2="41" y2="52" stroke-width="2" stroke-linecap="round"/><line x1="53" y1="38" x2="53" y2="50" stroke-width="2" stroke-linecap="round"/><line x1="65" y1="40" x2="65" y2="52" stroke-width="2" stroke-linecap="round"/><line x1="77" y1="46" x2="77" y2="58" stroke-width="2" stroke-linecap="round"/></svg>`,
    'crowns-bridges': `<svg viewBox="0 0 100 100" class="treatment-svg" xmlns="http://www.w3.org/2000/svg" width="70" height="70" fill="none" stroke="var(--color-teal)" style="display: block; margin: 0 auto;"><path d="M50 40 C32 40 28 50 28 65 C28 80 32 90 35 92 C37 94 40 92 42 88 C45 82 48 75 50 75 C52 75 55 82 58 88 C60 92 63 94 65 92 C68 90 72 80 72 65 C72 50 68 40 50 40 Z" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M25 35 L33 15 L43 28 L50 15 L57 28 L67 15 L75 35 Z" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="33" cy="12" r="2" fill="var(--color-lime-accent)" stroke="none"/><circle cx="50" cy="12" r="2" fill="var(--color-lime-accent)" stroke="none"/><circle cx="67" cy="12" r="2" fill="var(--color-lime-accent)" stroke="none"/></svg>`,
    'wisdom-tooth-removal': `<svg viewBox="0 0 100 100" class="treatment-svg" xmlns="http://www.w3.org/2000/svg" width="70" height="70" fill="none" stroke="var(--color-teal)" style="display: block; margin: 0 auto;"><path d="M50 30 C30 30 25 45 25 65 C25 80 32 90 35 92 C37 94 40 92 42 88 C45 82 48 75 50 75 C52 75 55 82 58 88 C60 92 63 94 65 92 C68 90 75 80 75 65 C75 45 70 30 50 30 Z" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" opacity="0.4"/><path d="M50 50 Q65 40 65 20" stroke-width="4" stroke-linecap="round"/><path d="M58 24 L65 18 L70 26" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    'child-dentistry': `<svg viewBox="0 0 100 100" class="treatment-svg" xmlns="http://www.w3.org/2000/svg" width="70" height="70" fill="none" stroke="var(--color-teal)" style="display: block; margin: 0 auto;"><path d="M50 15 C30 15 26 28 26 48 C26 65 32 82 35 86 C37 88 39 86 41 82 C44 76 47 70 50 70 C53 70 56 76 59 82 C61 86 63 88 65 86 C68 82 74 65 74 48 C74 28 70 15 50 15 Z" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="42" cy="38" r="3.5" fill="var(--color-teal-dark)" stroke="none"/><circle cx="58" cy="38" r="3.5" fill="var(--color-teal-dark)" stroke="none"/><path d="M44 48 Q50 55 56 48" stroke-width="3" stroke-linecap="round"/><circle cx="37" cy="45" r="2.5" fill="var(--color-lime-accent)" stroke="none"/><circle cx="63" cy="45" r="2.5" fill="var(--color-lime-accent)" stroke="none"/></svg>`,
    'gum-treatments': `<svg viewBox="0 0 100 100" class="treatment-svg" xmlns="http://www.w3.org/2000/svg" width="70" height="70" fill="none" stroke="var(--color-teal)" style="display: block; margin: 0 auto;"><path d="M50 15 C35 15 32 25 32 40 C32 55 35 75 38 80 C40 82 42 80 44 75 C46 70 48 65 50 65 C52 65 54 70 56 75 C58 80 60 82 62 80 C65 75 68 55 68 40 C68 25 65 15 50 15 Z" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 52 C25 42 35 52 50 52 C65 52 75 42 85 52" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 58 L18 64 M35 56 L33 62 M65 56 L63 62 M80 58 L78 64" stroke-width="2" stroke-linecap="round"/></svg>`,
    'emergency-dental-care': `<svg viewBox="0 0 100 100" class="treatment-svg" xmlns="http://www.w3.org/2000/svg" width="70" height="70" fill="none" stroke="var(--color-teal)" style="display: block; margin: 0 auto;"><path d="M50 15 C30 15 25 30 25 50 C25 70 32 85 35 90 C37 92 40 90 42 85 C45 78 48 70 50 70 C52 70 55 78 58 85 C60 90 63 92 65 90 C68 85 75 70 75 50 C75 30 70 15 50 15 Z" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M43 45 H57 M50 38 V52" stroke-width="4.5" stroke-linecap="round"/><path d="M10 50 Q18 42 22 50 M78 50 Q82 58 90 50" stroke-width="3" stroke-linecap="round"/></svg>`
  };
  return icons[id] || '';
};

// ==========================================================================
// DATA INGESTION
// ==========================================================================
const homeData = JSON.parse(fs.readFileSync(path.join(PATHS.content, 'home.json'), 'utf8'));
const treatments = JSON.parse(fs.readFileSync(path.join(PATHS.content, 'treatments.json'), 'utf8'));
const doctors = JSON.parse(fs.readFileSync(path.join(PATHS.content, 'doctors.json'), 'utf8'));
const blogs = JSON.parse(fs.readFileSync(path.join(PATHS.content, 'blogs.json'), 'utf8'));
// Parse dynamic reviews from public/reviews.txt
const parseReviewsFile = () => {
  const reviewsFilePath = path.join(__dirname, 'public', 'reviews.txt');
  if (!fs.existsSync(reviewsFilePath)) {
    console.error(`Warning: Reviews file not found at ${reviewsFilePath}`);
    return [];
  }
  const content = fs.readFileSync(reviewsFilePath, 'utf8');
  const lines = content.split(/\r?\n/);
  
  const reviews = [];
  let currentReview = null;
  let textLines = [];
  
  // Matches "Number. Name" with optional whitespace
  const reviewHeaderRegex = /^(\d+)\s*\.\s*(.+)$/;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      continue;
    }
    
    const match = line.match(reviewHeaderRegex);
    if (match) {
      // Save the previous review if it exists
      if (currentReview) {
        currentReview.text = textLines.join('\n').trim();
        reviews.push(currentReview);
        textLines = [];
      }
      
      const num = parseInt(match[1]);
      const name = match[2].trim();
      
      // The next line contains the relative date (e.g. "6 months ago")
      let date = '3 years ago'; // Default fallback date
      if (i + 1 < lines.length) {
        const nextLine = lines[i + 1].trim();
        // Simple check to make sure it looks like a relative date
        if (nextLine && (nextLine.includes('ago') || nextLine.includes('month') || nextLine.includes('year') || nextLine.includes('week'))) {
          date = nextLine;
          i++; // Skip the date line in the main loop
        }
      }
      
      // Generate initials for Google avatar
      const nameParts = name.split(/\s+/);
      let avatar = '';
      if (nameParts.length > 0) {
        if (nameParts.length === 1) {
          avatar = nameParts[0].slice(0, 2).toUpperCase();
        } else {
          avatar = (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
        }
      }
      if (!avatar) avatar = 'G';
      
      currentReview = {
        name: name,
        rating: 5, // All reviews get 5 star ratings
        date: date,
        avatar: avatar
      };
    } else {
      if (currentReview) {
        textLines.push(lines[i]);
      }
    }
  }
  
  // Push the final review
  if (currentReview) {
    currentReview.text = textLines.join('\n').trim();
    reviews.push(currentReview);
  }
  
  return reviews;
};

const testimonials = parseReviewsFile();

// Templates
const layoutHTML = fs.readFileSync(path.join(PATHS.templates, 'layout.html'), 'utf8');
const treatmentTemplate = fs.readFileSync(path.join(PATHS.templates, 'treatment.html'), 'utf8');
const doctorTemplate = fs.readFileSync(path.join(PATHS.templates, 'doctor.html'), 'utf8');
const blogTemplate = fs.readFileSync(path.join(PATHS.templates, 'blog.html'), 'utf8');

// ==========================================================================
// SCHEMA GENERATORS (SEO)
// ==========================================================================
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "Dentist",
  "name": "Apex Dental Hospital",
  "image": "https://apexdentalhospital.com/images/hero_logo.jpg",
  "@id": "https://apexdentalhospital.com/#hospital",
  "url": "https://apexdentalhospital.com",
  "telephone": "+918978644036",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Shop No. 3 & 4, 1st Floor, Mahalakshmi Complex, Opp. Apollo Pharmacy, Ramanayapeta",
    "addressLocality": "Kakinada",
    "addressRegion": "Andhra Pradesh",
    "postalCode": "533005",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 16.9452,
    "longitude": 82.2385
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "09:00",
      "closes": "21:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Sunday",
      "opens": "10:00",
      "closes": "17:00"
    }
  ],
  "sameAs": [
    "https://www.facebook.com/apexdentalhospital",
    "https://www.instagram.com/apexdentalhospital"
  ]
};

const getLocalBusinessSchemaHTML = () => {
  return `<script type="application/ld+json">${JSON.stringify(localBusinessSchema)}</script>`;
};

const getDoctorSchemaHTML = (doc) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    "name": doc.name,
    "jobTitle": doc.qualification,
    "worksFor": {
      "@type": "MedicalOrganization",
      "name": "Apex Dental Hospital",
      "url": "https://apexdentalhospital.com"
    },
    "description": doc.bio,
    "knowsAbout": doc.specialization
  };
  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
};

const getFAQSchemaHTML = (faqList) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqList.map(item => ({
      "@type": "Question",
      "name": item.q || item.title || '',
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a || item.text || ''
      }
    }))
  };
  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
};

// ==========================================================================
// COMPILATION RUNNERS
// ==========================================================================
const compileLayout = (content, title, description, additionalCss = '', additionalJs = '', schema = '') => {
  let output = layoutHTML;
  output = output.replace(/{{meta_title}}/g, title);
  output = output.replace(/{{meta_description}}/g, description);
  output = output.replace(/{{additional_css}}/g, additionalCss);
  output = output.replace(/{{additional_js}}/g, additionalJs);
  output = output.replace(/{{schema_markup}}/g, schema);
  output = output.replace(/{{content}}/g, content);
  return output;
};

// 1. GENERATE WHY CHOOSE US SLIDER
const generateWhyChooseUsSlider = () => {
  const getFeatureVisual = (idx) => {
    const images = [
      '/public/about us/experienced specialist.jpeg',
      '/public/about us/Advanced Technology.jpeg',
      '/public/about us/Pain free dentistry.png',
      '/public/about us/afoordable treatment plans.jpeg',
      '/public/about us/strict sterilization protocols.jpeg',
      '/public/about us/patient centric care.jpeg'
    ];
    const imgPath = images[idx] || images[0];
    return `<img src="${imgPath}" alt="${homeData.whyChooseUs.cards[idx].title}" class="why-slide-img" loading="lazy">`;
  };

  return homeData.whyChooseUs.cards.map((card, idx) => `
    <div class="why-slide ${idx === 0 ? 'active' : ''}" data-slide-index="${idx}">
      <!-- Left Side (40%): Content -->
      <div class="why-slide-content">
        <h3 class="why-slide-title">${card.title}</h3>
        <p class="why-slide-text">${card.text}</p>
        <div class="why-slide-actions">
          <a href="#booking" class="btn btn-accent why-slide-btn">Book Free Consultation</a>
        </div>
      </div>
      <!-- Right Side (60%): Visual -->
      <div class="why-slide-visual">
        <div class="why-slide-visual-inner">
          ${getFeatureVisual(idx)}
        </div>
      </div>
    </div>
  `).join('');
};

const getServiceImage = (id) => {
  const images = {
    'root-canal-treatment': '/public/services-images/Root canal.jpeg',
    'dental-implants': '/public/services-images/Dental Implants.jpeg',
    'smile-designing': '/public/services-images/Smile designing.jpeg',
    'teeth-whitening': '/public/treatments/teeth-whitening-card.png',
    'braces-aligners': '/public/treatments/braces-aligners-card.jpg',
    'crowns-bridges': '/public/services-images/Dental crowns and Bridges.jpeg',
    'wisdom-tooth-removal': '/public/treatments/wisdom-tooth-card.png',
    'child-dentistry': '/public/services-images/Child Dentistry.jpeg',
    'gum-treatments': '/public/services-images/Gum treatments.jpeg',
    'emergency-dental-care': '/public/services-images/Emergency dental care.jpeg'
  };
  return images[id] || '';
};

const generateTreatmentsGrid = (limit = 99) => {
  return treatments.slice(0, limit).map(t => {
    return `
      <div class="treatment-card">
        <div class="treatment-card-image">
          <img src="${getServiceImage(t.id)}" alt="${t.title} Banner" loading="lazy">
        </div>
        <div class="treatment-card-body">
          <h3>${t.title}</h3>
          <p>${t.description}</p>
          <div class="treatment-card-footer">
            <a href="/treatments/${t.id}.html" class="treatment-card-link">Learn More</a>
            <a href="/index.html#booking" class="treatment-card-book">Book Appointment</a>
          </div>
        </div>
      </div>
    `;
  }).join('');
};

const generateSpecificDoctorsGrid = (docList) => {
  return docList.map(d => {
    // Get initials for doctor placeholder photo (excluding titles)
    const initials = d.name.split(' ').filter(w => !['Dr.', 'Dr'].includes(w)).map(w => w[0]).join('');
    const initialsClean = initials.length > 0 ? initials.slice(0, 2).toUpperCase() : 'DR';
    
    // Render image if photo exists, otherwise fallback to SVG initials using brand colors
    const photoHTML = d.photo 
      ? `<img src="/src/images/${d.photo}" alt="${d.name}" loading="lazy">` 
      : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 250" width="100%" height="100%"><rect width="300" height="250" fill="%23F0FCFC"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="'Poppins', sans-serif" font-weight="800" font-size="44" fill="%2300B5B5">${initialsClean}</text></svg>`;

    return `
      <div class="doctor-card">
        <div class="doctor-card-photo">
          ${photoHTML}
        </div>
        <div class="doctor-card-body">
          <h3>${d.name}</h3>
          <p class="doc-qual">${d.qualification}</p>
          <p class="doc-specialty">${d.specialization}</p>
          <p class="doc-exp">${d.experience}</p>
          <a href="/doctors/${d.id}.html" class="btn btn-secondary doctor-card-link" style="padding: 0.5rem 1rem; font-size: 0.85rem; width: 100%;">View Profile</a>
        </div>
      </div>
    `;
  }).join('');
};

const generateDoctorsGrid = (limit = 99) => {
  return generateSpecificDoctorsGrid(doctors.slice(0, limit));
};

const generateConsultingSpecialistsGrid = () => {
  return `
    <div class="consultant-card">
      <div class="consultant-card-body">
        <h3>Dr. Ravi Kiran</h3>
        <p class="consultant-qual">MDS</p>
        <p class="consultant-specialization">Periodontist</p>
      </div>
    </div>
    <div class="consultant-card">
      <div class="consultant-card-body">
        <h3>Dr. Siddu Kalyan</h3>
        <p class="consultant-qual">MDS</p>
        <p class="consultant-specialization">Oral & Maxillofacial Surgeon</p>
      </div>
    </div>
    <div class="consultant-card">
      <div class="consultant-card-body">
        <h3>Dr. SSS Swaroop</h3>
        <p class="consultant-qual">MDS</p>
        <p class="consultant-specialization">Orthodontist & Aligner Specialist</p>
      </div>
    </div>
  `;
};

const generateSVGFeaturedImage = (title, category) => {
  const escapedTitle = title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const escapedCategory = category.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const wrapText = (text, maxCharsPerLine) => {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    words.forEach(word => {
      if ((currentLine + ' ' + word).length > maxCharsPerLine) {
        lines.push(currentLine.trim());
        currentLine = word;
      } else {
        currentLine += ' ' + word;
      }
    });
    if (currentLine) {
      lines.push(currentLine.trim());
    }
    return lines;
  };

  const titleLines = wrapText(escapedTitle, 24);
  const lineSpacing = 65; // px
  const startY = 320 - ((titleLines.length - 1) * lineSpacing) / 2;

  const textMarkup = titleLines.map((line, idx) => {
    return `<tspan x="100" y="${startY + idx * lineSpacing}">${line}</tspan>`;
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="1200" height="800" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Brand Gradient -->
    <linearGradient id="brand-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#03045E" />
      <stop offset="60%" stop-color="#023E8A" />
      <stop offset="100%" stop-color="#0077B6" />
    </linearGradient>
    
    <!-- Accent Glow -->
    <radialGradient id="accent-glow" cx="80%" cy="20%" r="60%">
      <stop offset="0%" stop-color="#00B4D8" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#03045E" stop-opacity="0" />
    </radialGradient>

    <!-- Card Pill Gradient -->
    <linearGradient id="pill-grad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#CAF0F8" />
      <stop offset="100%" stop-color="#90E0EF" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="800" fill="url(#brand-grad)" />
  <rect width="1200" height="800" fill="url(#accent-glow)" />

  <!-- Premium Geometric Decorative Waves -->
  <path d="M -100 700 C 300 600, 400 850, 900 650 C 1100 570, 1200 700, 1300 680 L 1300 900 L -100 900 Z" fill="#0077B6" opacity="0.1" />
  <path d="M -100 750 C 200 680, 500 820, 800 720 C 1000 650, 1150 780, 1300 760 L 1300 900 L -100 900 Z" fill="#0096C7" opacity="0.15" />

  <!-- Tech/Clinical Grid Overlay (Subtle) -->
  <g opacity="0.05">
    <line x1="100" y1="0" x2="100" y2="800" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="10 15" />
    <line x1="200" y1="0" x2="200" y2="800" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="10 15" />
    <line x1="300" y1="0" x2="300" y2="800" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="10 15" />
    <line x1="400" y1="0" x2="400" y2="800" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="10 15" />
    <line x1="500" y1="0" x2="500" y2="800" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="10 15" />
    <line x1="600" y1="0" x2="600" y2="800" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="10 15" />
    <line x1="700" y1="0" x2="700" y2="800" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="10 15" />
    <line x1="800" y1="0" x2="800" y2="800" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="10 15" />
    <line x1="900" y1="0" x2="900" y2="800" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="10 15" />
    <line x1="1000" y1="0" x2="1000" y2="800" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="10 15" />
    <line x1="1100" y1="0" x2="1100" y2="800" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="10 15" />

    <line x1="0" y1="100" x2="1200" y2="100" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="10 15" />
    <line x1="0" y1="200" x2="1200" y2="200" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="10 15" />
    <line x1="0" y1="300" x2="1200" y2="300" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="10 15" />
    <line x1="0" y1="400" x2="1200" y2="400" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="10 15" />
    <line x1="0" y1="500" x2="1200" y2="500" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="10 15" />
    <line x1="0" y1="600" x2="1200" y2="600" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="10 15" />
    <line x1="0" y1="700" x2="1200" y2="700" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="10 15" />
  </g>

  <!-- Large Dental Watermark Icon (Right Side) -->
  <g transform="translate(850, 400) scale(3.5)" opacity="0.12">
    <!-- Stylized Tooth Outline -->
    <path d="M0 -70 C-35 -70 -42 -45 -42 -10 C-42 25 -30 60 -25 68 C-22 72 -17 68 -14 60 C-10 48 -5 35 0 35 C5 35 10 48 14 60 C17 68 22 72 25 68 C30 60 42 25 42 -10 C42 -45 35 -70 0 -70 Z" fill="none" stroke="#FFFFFF" stroke-width="5" stroke-linejoin="round" />
    <!-- Sparkles/Clean shine -->
    <path d="M-60 -40 L-55 -43 L-52 -50 L-49 -43 L-44 -40 L-49 -37 L-52 -30 L-55 -37 Z" fill="#00B4D8" />
    <path d="M50 -55 L53 -57 L55 -62 L57 -57 L62 -55 L57 -53 L55 -48 L53 -53 Z" fill="#00B4D8" />
  </g>

  <!-- Category Badge Pill -->
  <g transform="translate(100, 140)">
    <rect width="260" height="48" rx="24" fill="url(#pill-grad)" />
    <text x="130" y="30" font-family="'Poppins', 'Segoe UI', sans-serif" font-size="18" font-weight="700" fill="#023E8A" letter-spacing="1.5" text-anchor="middle">${escapedCategory.toUpperCase()}</text>
  </g>

  <!-- Blog Title (Multi-line) -->
  <text font-family="'Poppins', 'Segoe UI', sans-serif" font-size="56" font-weight="700" fill="#FFFFFF" letter-spacing="-0.5">
    ${textMarkup}
  </text>

  <!-- Clinic Branding Divider -->
  <line x1="100" y1="620" x2="1100" y2="620" stroke="#FFFFFF" stroke-width="1.5" opacity="0.2" />

  <!-- Clinic Logo & Tagline at bottom -->
  <g transform="translate(100, 680)">
    <!-- Small Tooth Logo Mark -->
    <path d="M0 -15 C-8 -15 -10 -10 -10 -2 C-10 5 -7 13 -6 15 C-5 16 -4 15 -3 13 C-2 10 -1 8 0 8 C1 8 2 10 3 13 C4 15 5 16 6 15 C7 13 10 5 10 -2 C10 -10 8 -15 0 -15 Z" fill="#00B4D8" />
    <text x="25" y="5" font-family="'Poppins', 'Segoe UI', sans-serif" font-size="24" font-weight="700" fill="#FFFFFF" letter-spacing="0.5">APEX DENTAL</text>
    <text x="25" y="25" font-family="'Poppins', 'Segoe UI', sans-serif" font-size="12" font-weight="600" fill="#90E0EF" letter-spacing="2">HOSPITAL</text>
    
    <!-- Tagline on the right -->
    <text x="900" y="10" font-family="'Poppins', 'Segoe UI', sans-serif" font-size="14" font-weight="500" fill="#90E0EF" letter-spacing="1.5" text-anchor="end">BRINGING LIFE TO YOUR SMILE</text>
  </g>
</svg>`;
};

const ensureBlogImage = (b) => {
  const blogImagesDir = path.join(__dirname, 'public', 'blog-images');
  ensureDir(blogImagesDir);

  if (!b.image) {
    b.image = `blog_${b.id}.svg`;
  }

  const imagePath = path.join(blogImagesDir, b.image);
  if (fs.existsSync(imagePath)) {
    return b.image;
  }

  const baseName = path.basename(b.image, path.extname(b.image));
  const extensions = ['.png', '.jpg', '.jpeg', '.svg'];
  for (const ext of extensions) {
    if (fs.existsSync(path.join(blogImagesDir, baseName + ext))) {
      b.image = baseName + ext;
      return b.image;
    }
  }

  const svgFilename = `${baseName}.svg`;
  const svgPath = path.join(blogImagesDir, svgFilename);
  
  const svgContent = generateSVGFeaturedImage(b.title, b.category);
  fs.writeFileSync(svgPath, svgContent, 'utf8');
  console.log(`✓ Automatically generated featured image: public/blog-images/${svgFilename}`);
  
  b.image = svgFilename;
  return b.image;
};

const generateBlogsGrid = (limit = 99) => {
  return blogs.slice(0, limit).map((b, index) => {
    const imageName = ensureBlogImage(b);
    const extraClass = index >= 3 ? ' blog-card-extra' : '';
    return `
      <div class="blog-card${extraClass}">
        <div class="blog-card-image">
          <img src="/public/blog-images/${imageName}" alt="${b.title}" loading="lazy">
        </div>
        <div class="blog-card-body">
          <div class="blog-meta">
            <span>${b.category}</span>
            <span class="blog-meta-separator">|</span>
            <span class="blog-date">${b.date}</span>
          </div>
          <h3>${b.title}</h3>
          <p>${b.description}</p>
          <a href="/blogs/${b.id}.html" class="blog-card-link">Read Full Post</a>
        </div>
      </div>
    `;
  }).join('');
};

const generateTestimonialsGrid = () => {
  const googleColors = ['bg-blue', 'bg-red', 'bg-yellow', 'bg-green', 'bg-purple', 'bg-orange', 'bg-teal', 'bg-pink'];
  return testimonials.map((t, idx) => {
    let stars = '';
    for (let i = 0; i < t.rating; i++) {
      stars += '★';
    }
    const colorClass = googleColors[idx % googleColors.length];
    const needsReadMore = t.text.length > 180;
    const displayText = needsReadMore ? t.text.slice(0, 170) + '...' : t.text;
    const escapedFullText = t.text.replace(/"/g, '&quot;').replace(/\n/g, ' ');
    
    return `
      <div class="testimonial-slide">
        <div class="testimonial-header">
          <div class="google-badge-small">
            <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
          </div>
          <div class="testimonial-stars" aria-label="${t.rating} Stars">${stars}</div>
        </div>
        <div class="testimonial-body">
          <p class="testimonial-content">${displayText}${needsReadMore ? ` <button class="read-more-trigger" data-full-text="${escapedFullText}" data-name="${t.name}" data-date="${t.date}" data-avatar="${t.avatar}" data-color-class="${colorClass}">Read More</button>` : ''}</p>
        </div>
        <div class="testimonial-avatar-block">
          <div class="testimonial-avatar ${colorClass}">${t.avatar}</div>
          <div class="testimonial-user-info">
            <strong>${t.name}</strong>
            <span>${t.date}</span>
          </div>
          <div class="verified-review-badge">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>Verified</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
};

const getTechnologyImage = (title) => {
  const images = {
    'Rotary Root Canal Treatment': '/public/technology-images/Rotary root canal.jpeg',
    'Electronic Apex Locator': '/public/technology-images/Electronic apex locator.png',
    'Ultrasonic Endodontics': '/public/technology-images/Ultrasonic Endodontics.jpeg',
    'Implant Dentistry Equipment': '/public/technology-images/Implant dentistry.jpeg',
    'Class B Autoclave Sterilization': '/public/technology-images/Class B Autoclave Sterilization.jpeg',
    'Intraoral Camera': '/public/technology-images/Intraoral camera.jpeg',
    'Digital Patient Records': '/public/technology-images/Digital patient records.jpeg'
  };
  return images[title] || '';
};

const generateTechnologyGrid = () => {
  return homeData.technology.items.map(item => `
    <div class="tech-card" data-treatment="${item.mappedTreatment || ''}">
      <div class="tech-card-image-wrap">
        <img src="${getTechnologyImage(item.title)}" alt="${item.title}" class="tech-card-img" loading="lazy">
        <div class="tech-card-fade"></div>
      </div>
      <div class="tech-card-content">
        <h3 class="tech-card-title">${item.title}</h3>
        <p class="tech-card-tagline">${item.tagline}</p>
        
        <div class="tech-card-details">
          <p class="tech-card-desc">${item.detailedDescription}</p>
          <div class="tech-card-benefits">
            <h4>Key Benefits:</h4>
            <ul>
              ${item.benefits.map(b => `<li><span class="benefit-tick">✓</span> ${b}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    </div>
  `).join('');
};

const generateJourneyTimeline = () => {
  return homeData.patientJourney.steps.map(step => `
    <div class="journey-step">
      <div class="journey-step-circle">${step.number}</div>
      <div class="journey-step-text">
        <h3>${step.title}</h3>
        <p>${step.text}</p>
      </div>
    </div>
  `).join('');
};

const generateFAQAccordion = (faqList) => {
  if (!faqList || !Array.isArray(faqList)) return '';
  return faqList.map((item, idx) => {
    const question = item.q || item.title || '';
    const answer = item.a || item.text || 'Answer is not available at the moment. Please contact our clinic for more details.';
    
    if (!question.trim()) return '';

    return `
      <div class="faq-item">
        <button class="faq-question" aria-expanded="false">
          <span>${question}</span>
          <svg class="faq-icon-chevron" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </button>
        <div class="faq-answer">
          <div class="faq-answer-inner">
            <p>${answer}</p>
          </div>
        </div>
      </div>
    `;
  }).join('');
};

// 9. GENERATE SMILE TRANSFORMATION GALLERY
const generateSmileTransformationsGallery = () => {
  const dirPath = path.join(__dirname, 'public', 'before&after');
  if (!fs.existsSync(dirPath)) {
    console.error(`Warning: Transformations directory not found at ${dirPath}`);
    return '';
  }
  
  const files = fs.readdirSync(dirPath);
  const casesMap = {};
  
  // Find matching pairs, e.g. before1_900.webp and after1_900.webp
  files.forEach(file => {
    const match = file.match(/^(before|after)(\d+)_900\.webp$/i);
    if (match) {
      const type = match[1].toLowerCase(); // "before" or "after"
      const caseNum = match[2]; // e.g. "1"
      const caseId = `case${caseNum}`;
      
      if (!casesMap[caseId]) {
        casesMap[caseId] = { id: caseId, before: '', after: '' };
      }
      casesMap[caseId][type] = `/public/before&after/${file}`;
    }
  });
  
  // Sort cases chronologically (case1, case2, case3...)
  const cases = Object.values(casesMap)
    .filter(c => c.before && c.after)
    .sort((a, b) => {
      const numA = parseInt(a.id.replace(/\D/g, '')) || 0;
      const numB = parseInt(b.id.replace(/\D/g, '')) || 0;
      return numA - numB;
    });

  // Swap 3rd (index 2) and 6th (index 5) cards as requested
  if (cases.length >= 6) {
    const temp = cases[2];
    cases[2] = cases[5];
    cases[5] = temp;
  }
    
  if (cases.length === 0) {
    return '<p class="text-center text-muted">No smile transformations available.</p>';
  }

  // Map of cases to treatment details
  const caseDetails = {
    '1': { treatment: 'Root Canal Treatment', desc: 'Single-sitting microscope-guided root canal treatment followed by a custom porcelain crown restoration.' },
    '2': { treatment: 'Gum Treatments', desc: 'Deep scaling, root planing, and laser gum therapy to eliminate tartar buildup and restore gum health.' },
    '3': { treatment: 'Smile Designing', desc: 'Aesthetic smile makeover using a custom-crafted dental bridge to replace missing front teeth.' },
    '4': { treatment: 'Dental Implants', desc: 'Permanent replacement of missing teeth using advanced titanium implants and natural-looking crowns.' },
    '5': { treatment: 'Dental Crowns & Bridges', desc: 'Full arch rehabilitation using a premium custom denture to restore complete chewing function.' },
    '6': { treatment: 'Dental Crowns & Bridges', desc: 'Lower arch tooth replacement utilizing a high-strength dental bridge for a natural bite.' }
  };
  
  // Generate HTML
  let cardsHTML = '';
  cases.forEach((c, idx) => {
    const caseNum = c.id.replace('case', '');
    const details = caseDetails[caseNum] || { treatment: 'Smile Transformation', desc: 'Real clinical before and after patient dental result.' };
    
    // Derive responsive mobile sizes (450px wide) from 900px wide paths
    const before_450 = c.before.replace('_900.webp', '_450.webp');
    const after_450 = c.after.replace('_900.webp', '_450.webp');
    
    if (idx === 0) {
      // First card: Load instantly, no lazy-load, no skeleton placeholder
      cardsHTML += `
        <div class="transformation-card" data-index="${idx}">
          <div class="transformation-slider-wrapper">
            <!-- After Image (Loaded Immediately) -->
            <div class="transformation-image transformation-after">
              <img class="loaded" 
                   src="${c.after}" 
                   srcset="${after_450} 450w, ${c.after} 900w"
                   sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw"
                   alt="${details.treatment} After">
            </div>
            <!-- Before Image (Loaded Immediately) -->
            <div class="transformation-image transformation-before" style="clip-path: polygon(0 0, 50% 0, 50% 100%, 0 100%)">
              <img class="loaded" 
                   src="${c.before}" 
                   srcset="${before_450} 450w, ${c.before} 900w"
                   sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw"
                   alt="${details.treatment} Before">
            </div>
            <!-- Labels -->
            <span class="transformation-label label-before">Before</span>
            <span class="transformation-label label-after">After</span>
            <!-- Slider Handle -->
            <div class="transformation-handle" style="left: 50%">
              <div class="transformation-handle-line"></div>
              <div class="transformation-handle-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:block; margin:auto;"><path d="m18 8 4 4-4 4M6 8l-4 4 4 4M2 12h20"/></svg>
              </div>
            </div>
          </div>
        </div>
      `;
    } else {
      // Remaining cards: Defer loading with custom shimmer skeleton placeholder
      cardsHTML += `
        <div class="transformation-card" data-index="${idx}">
          <div class="transformation-slider-wrapper">
            <!-- After Image (Lazy Loaded) -->
            <div class="transformation-image transformation-after skeleton">
              <img class="lazy-load" 
                   src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 3'%3E%3C/svg%3E" 
                   data-src="${c.after}" 
                   data-srcset="${after_450} 450w, ${c.after} 900w"
                   sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw"
                   alt="${details.treatment} After">
            </div>
            <!-- Before Image (Lazy Loaded) -->
            <div class="transformation-image transformation-before skeleton" style="clip-path: polygon(0 0, 50% 0, 50% 100%, 0 100%)">
              <img class="lazy-load" 
                   src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 3'%3E%3C/svg%3E" 
                   data-src="${c.before}" 
                   data-srcset="${before_450} 450w, ${c.before} 900w"
                   sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw"
                   alt="${details.treatment} Before">
            </div>
            <!-- Labels -->
            <span class="transformation-label label-before">Before</span>
            <span class="transformation-label label-after">After</span>
            <!-- Slider Handle -->
            <div class="transformation-handle" style="left: 50%">
              <div class="transformation-handle-line"></div>
              <div class="transformation-handle-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:block; margin:auto;"><path d="m18 8 4 4-4 4M6 8l-4 4 4 4M2 12h20"/></svg>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  });
  
  return `
    <div class="transformations-carousel-container">
      <button class="transformation-nav-btn nav-btn-prev" aria-label="Previous Case">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
      </button>
      <div class="transformations-track-wrapper">
        <div class="transformations-track">
          ${cardsHTML}
        </div>
      </div>
      <button class="transformation-nav-btn nav-btn-next" aria-label="Next Case">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </button>
    </div>
    <div class="transformations-indicators"></div>
  `;
};

// ==========================================================================
// BUILD PAGES
// ==========================================================================

// A. HOME PAGE
const buildHomePage = () => {
  let homeHTML = fs.readFileSync(path.join(PATHS.pages, 'home.html'), 'utf8');
  
  homeHTML = homeHTML.replace(/{{why_choose_us_slider}}/g, generateWhyChooseUsSlider());
  homeHTML = homeHTML.replace(/{{treatments_grid}}/g, generateTreatmentsGrid(10)); // Show all 10 on home
  const leadDoctors = doctors.filter(d => ['dr-mohammad-raheem', 'dr-shiek-arshi-azeem'].includes(d.id));
  homeHTML = homeHTML.replace(/{{doctors_grid}}/g, generateSpecificDoctorsGrid(leadDoctors));
  homeHTML = homeHTML.replace(/{{testimonials_grid}}/g, generateTestimonialsGrid());
  homeHTML = homeHTML.replace(/{{technology_grid}}/g, generateTechnologyGrid());
  homeHTML = homeHTML.replace(/{{journey_timeline}}/g, generateJourneyTimeline());
  homeHTML = homeHTML.replace(/{{faqs_grid}}/g, generateFAQAccordion(homeData.generalFaq));
  homeHTML = homeHTML.replace(/{{blogs_grid}}/g, generateBlogsGrid(4)); // Show first 4 on home
  homeHTML = homeHTML.replace(/{{smile_transformation_gallery}}/g, generateSmileTransformationsGallery());

  const finalHTML = compileLayout(
    homeHTML,
    "Apex Dental Hospital | Bringing Life To Your Smile",
    "Apex Dental Hospital provides advanced dental treatments including implants, root canals, braces, aligners, cosmetic dentistry, and family dental care with expert specialists and modern technology.",
    `<!-- Preload first Before & After images -->
    <link rel="preload" href="/public/before&after/after1_900.webp" as="image" imagesrcset="/public/before&after/after1_450.webp 450w, /public/before&after/after1_900.webp 900w" imagesizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw">
    <link rel="preload" href="/public/before&after/before1_900.webp" as="image" imagesrcset="/public/before&after/before1_450.webp 450w, /public/before&after/before1_900.webp 900w" imagesizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw">`,
    '<script src="/src/js/slider.js"></script>',
    getLocalBusinessSchemaHTML() + getFAQSchemaHTML(homeData.generalFaq)
  );

  fs.writeFileSync(path.join(PATHS.output, 'index.html'), finalHTML, 'utf8');
  console.log('✓ compiled: index.html');
};

// B. CONTACT PAGE
const buildContactPage = () => {
  const contactHTML = fs.readFileSync(path.join(PATHS.pages, 'contact.html'), 'utf8');
    const finalHTML = compileLayout(
      contactHTML,
      "Contact Us | Apex Dental Hospital",
      "Contact Apex Dental Hospital in Ramanayapeta, Kakinada. View phone numbers, working hours, and get interactive directions to our dental facility.",
      '',
      '',
      getLocalBusinessSchemaHTML()
    );
  fs.writeFileSync(path.join(PATHS.output, 'contact.html'), finalHTML, 'utf8');
  console.log('✓ compiled: contact.html');
};

const buildPrivacyPolicyPage = () => {
  const privacyHTML = fs.readFileSync(path.join(PATHS.pages, 'privacy-policy.html'), 'utf8');
  const finalHTML = compileLayout(
    privacyHTML,
    "Privacy Policy | Apex Dental Hospital",
    "Read the Privacy Policy of Apex Dental Hospital. Learn how we collect, use, and protect your personal and clinical healthcare data.",
    '',
    '',
    getLocalBusinessSchemaHTML()
  );
  fs.writeFileSync(path.join(PATHS.output, 'privacy-policy.html'), finalHTML, 'utf8');
  console.log('✓ compiled: privacy-policy.html');
};

const buildTermsAndConditionsPage = () => {
  const termsHTML = fs.readFileSync(path.join(PATHS.pages, 'terms-and-conditions.html'), 'utf8');
  const finalHTML = compileLayout(
    termsHTML,
    "Terms & Conditions | Apex Dental Hospital",
    "Review the Terms and Conditions of Apex Dental Hospital governing website usage, appointment bookings, and clinical disclaimers.",
    '',
    '',
    getLocalBusinessSchemaHTML()
  );
  fs.writeFileSync(path.join(PATHS.output, 'terms-and-conditions.html'), finalHTML, 'utf8');
  console.log('✓ compiled: terms-and-conditions.html');
};

// C. TREATMENTS LIST PAGE
const buildTreatmentsListPage = () => {
  let treatmentsHTML = fs.readFileSync(path.join(PATHS.pages, 'treatments.html'), 'utf8');
  treatmentsHTML = treatmentsHTML.replace(/{{treatments_grid}}/g, generateTreatmentsGrid());
    const finalHTML = compileLayout(
      treatmentsHTML,
      "Our Dental Treatments | Apex Dental Hospital",
      "Explore our 10 specialized dental treatments including root canal treatment, dental implants, smile designing, teeth whitening, braces & aligners, crowns & bridges, wisdom tooth removal, child dentistry, gum treatments, and emergency dental care.",
      '',
      '',
      getLocalBusinessSchemaHTML()
    );
  fs.writeFileSync(path.join(PATHS.output, 'treatments', 'index.html'), finalHTML, 'utf8');
  console.log('✓ compiled: treatments/index.html');
};

// D. DOCTORS LIST PAGE
const buildDoctorsListPage = () => {
  let doctorsHTML = fs.readFileSync(path.join(PATHS.pages, 'doctors.html'), 'utf8');
  const leadDoctors = doctors.filter(d => ['dr-mohammad-raheem', 'dr-shiek-arshi-azeem'].includes(d.id));
  const consultantDoctors = doctors.filter(d => !['dr-mohammad-raheem', 'dr-shiek-arshi-azeem'].includes(d.id));
  
  doctorsHTML = doctorsHTML.replace(/{{lead_doctors_grid}}/g, generateSpecificDoctorsGrid(leadDoctors));
  doctorsHTML = doctorsHTML.replace(/{{consultant_doctors_grid}}/g, generateConsultingSpecialistsGrid());
    const finalHTML = compileLayout(
      doctorsHTML,
      "Our Doctors | Apex Dental Hospital",
      "Consult our experienced MDS prosthodontist, implantologist, orthodontist, endodontist, and pediatric dentists at Apex Dental Hospital.",
      '',
      '',
      getLocalBusinessSchemaHTML()
    );
  fs.writeFileSync(path.join(PATHS.output, 'doctors', 'index.html'), finalHTML, 'utf8');
  console.log('✓ compiled: doctors/index.html');
};

// E. BLOG LIST PAGE
const buildBlogListPage = () => {
  let blogHTML = fs.readFileSync(path.join(PATHS.pages, 'blog.html'), 'utf8');
  blogHTML = blogHTML.replace(/{{blogs_grid}}/g, generateBlogsGrid());
    const finalHTML = compileLayout(
      blogHTML,
      "Oral Health Blog | Apex Dental Hospital",
      "Read dental articles and hygiene advice written by MDS specialists. Learn about aligners, dental implants, pain-free root canals, and pediatric care.",
      '',
      '',
      getLocalBusinessSchemaHTML()
    );
  fs.writeFileSync(path.join(PATHS.output, 'blog.html'), finalHTML, 'utf8');
  console.log('✓ compiled: blog.html');
};

// F. INDIVIDUAL TREATMENT PAGES (10 PAGES)
const buildIndividualTreatmentPages = () => {
  treatments.forEach(t => {
    let html = treatmentTemplate;
    
    // Symptoms mapping
    const symptomsHTML = t.symptoms.map(s => `
      <li class="symptom-item">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        <span>${s}</span>
      </li>
    `).join('');

    // Benefits mapping
    const benefitsHTML = t.benefits.map(b => `
      <li class="benefit-item">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        <span>${b}</span>
      </li>
    `).join('');

    // Procedure steps mapping
    const procedureHTML = t.procedure.map(step => `
      <div class="proc-step">
        <div class="proc-step-num">${step.step}</div>
        <div class="proc-step-content">
          <h3>${step.title}</h3>
          <p>${step.text}</p>
        </div>
      </div>
    `).join('');

    // Why Choose us mapping
    const whyUsHTML = t.why_us.map(w => `
      <li style="display:flex; gap:0.5rem; align-items:flex-start;">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color:var(--color-lime); margin-top:0.2rem; flex-shrink:0;"><polyline points="20 6 9 17 4 12"></polyline></svg>
        <span style="font-size:0.95rem; color:var(--color-text-main); font-weight:500;">${w}</span>
      </li>
    `).join('');



    // FAQs mapping
    const faqsHTML = generateFAQAccordion(t.faqs);

    // Replace in template
    const breadcrumbHTML = `
    <nav class="breadcrumb-nav" aria-label="Breadcrumb">
      <a href="/index.html" class="breadcrumb-link">Home</a>
      <span class="breadcrumb-separator">&gt;</span>
      <a href="/treatments/index.html" class="breadcrumb-link">Treatments</a>
      <span class="breadcrumb-separator">&gt;</span>
      <span class="breadcrumb-current">${t.title}</span>
    </nav>
    `;
    // Video mapping logic
    const videoMap = {
      'root-canal-treatment': ['/public/Services/Rct-Treatment.mp4'],
      'dental-implants': ['/public/Services/Dental-Implant-001.mp4'],
      'braces-aligners': ['/public/Services/Aligners-Treatment.mp4', '/public/Services/Braces-Treatement.mp4'],
      'crowns-bridges': ['/public/Services/Dental-Crowns.mp4', '/public/Services/Dental-Bridge.mp4'],
      'wisdom-tooth-removal': ['/public/Services/Wisdom-teeth-removal-treatment-1.mp4'],
      'gum-treatments': ['/public/Services/Advance-Gum-Treatemnt.mp4']
    };
    
    const treatmentVideos = videoMap[t.id] || ['/public/Services/Rct-Treatment.mp4'];
    const videoThumbnail = getServiceImage(t.id);

    html = html.replace(/{{breadcrumb}}/g, breadcrumbHTML);
    html = html.replace(/{{title}}/g, t.title);
    html = html.replace(/{{tagline}}/g, t.tagline);
    html = html.replace(/{{symptoms}}/g, symptomsHTML);
    html = html.replace(/{{benefits}}/g, benefitsHTML);
    html = html.replace(/{{procedure}}/g, procedureHTML);
    html = html.replace(/{{why_us}}/g, whyUsHTML);
    html = html.replace(/{{doctor_quote}}/g, t.doctor_recommendation.quote);
    html = html.replace(/{{doctor_name}}/g, t.doctor_recommendation.name);
    html = html.replace(/{{doctor_title}}/g, t.doctor_recommendation.title);

    html = html.replace(/{{faqs}}/g, faqsHTML);
    const heroBgMapping = {
      'root-canal-treatment': '/public/treatments/Root canal treatment.jpeg',
      'dental-implants': '/public/treatments/Dental implants.jpeg',
      'smile-designing': '/public/treatments/Smile designing.jpeg',
      'teeth-whitening': '/public/treatments/teeth whitening.jpeg',
      'braces-aligners': '/public/treatments/braces.jpeg',
      'crowns-bridges': '/public/treatments/Dental crowns and bridges.jpeg',
      'wisdom-tooth-removal': '/public/treatments/wisdom tooth removal.jpeg',
      'child-dentistry': '/public/treatments/Child dentistry.jpeg',
      'gum-treatments': '/public/treatments/Gum treatment.jpeg',
      'emergency-dental-care': '/public/treatments/emergency care.jpeg'
    };
    const heroBackgroundImgPath = heroBgMapping[t.id] || '/public/treatments/Root canal treatment.jpeg';

    html = html.replace(/{{video_thumbnail}}/g, videoThumbnail);
    html = html.replace(/{{video_src_0}}/g, treatmentVideos[0]);
    html = html.replace(/{{video_src_list}}/g, JSON.stringify(treatmentVideos));
    html = html.replace(/{{hero_background_img}}/g, heroBackgroundImgPath);
    html = html.replace(/{{treatment_id}}/g, t.id);

    const schemaMarkup = getFAQSchemaHTML(t.faqs);

    const finalHTML = compileLayout(
      html,
      `${t.title} | Apex Dental Hospital`,
      t.meta_description,
      '',
      '',
      schemaMarkup
    );

    fs.writeFileSync(path.join(PATHS.output, 'treatments', `${t.id}.html`), finalHTML, 'utf8');
    console.log(`✓ compiled: treatments/${t.id}.html`);
  });
};

// G. INDIVIDUAL DOCTOR PROFILE PAGES (4 PAGES)
const buildIndividualDoctorPages = () => {
  doctors.forEach(d => {
    let html = doctorTemplate;

    // Get initials for doctor placeholder photo (excluding titles)
    const initials = d.name.split(' ').filter(w => !['Dr.', 'Dr'].includes(w)).map(w => w[0]).join('');
    const initialsClean = initials.length > 0 ? initials.slice(0, 2).toUpperCase() : 'DR';

    // Hero photo logic
    const heroPhotoHTML = d.photo 
      ? `<img src="/src/images/${d.photo}" alt="${d.name}">` 
      : `<div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; background-color:var(--color-teal); color:white;">${initialsClean}</div>`;

    // Biography paragraphs (split by \n\n)
    const bioHTML = d.bio.split('\n\n').map(p => `<p style="margin-bottom: 1rem; line-height: 1.7; font-size: 0.98rem;">${p.trim()}</p>`).join('');

    // Optional Quote Section
    const quoteSectionHTML = d.quote ? `
      <div class="doctor-quote-block" style="background: var(--color-bg-secondary); border-left: 4px solid var(--color-teal); padding: 1.5rem; border-radius: 0 var(--radius-md) var(--radius-md) 0; margin: 2rem 0; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
        <p style="font-style: italic; font-size: 1.15rem; color: var(--color-teal-dark); font-weight: 600; line-height: 1.6; margin-bottom: 0;">“${d.quote}”</p>
      </div>
    ` : '';

    // Optional Special Interests Section
    const specialInterestsSectionHTML = d.special_interests ? `
      <div style="margin-top: 2rem;">
        <h2 style="font-size: 1.6rem; border-bottom: 2px solid var(--color-teal-light); padding-bottom: 0.5rem; color: var(--color-text-dark);">Special Interests</h2>
        <ul style="list-style: none; display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 0.75rem; margin-top: 1rem; padding-left: 0;">
          ${d.special_interests.map(si => `
            <li style="display:flex; gap:0.5rem; align-items:flex-start;">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color:var(--color-teal); margin-top:0.25rem; flex-shrink:0;"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span style="font-size:0.95rem; color:var(--color-text-main); font-weight: 500;">${si}</span>
            </li>
          `).join('')}
        </ul>
      </div>
    ` : '';

    // Optional Areas of Expertise Section
    const expertiseSectionHTML = d.areas_of_expertise ? `
      <div style="margin-top: 2rem;">
        <h2 style="font-size: 1.6rem; border-bottom: 2px solid var(--color-teal-light); padding-bottom: 0.5rem; color: var(--color-text-dark);">Areas of Expertise</h2>
        <ul style="list-style: none; display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 0.75rem; margin-top: 1rem; padding-left: 0;">
          ${d.areas_of_expertise.map(exp => `
            <li style="display:flex; gap:0.5rem; align-items:flex-start;">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color:var(--color-lime); margin-top:0.25rem; flex-shrink:0;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              <span style="font-size:0.95rem; color:var(--color-text-main); font-weight: 500;">${exp}</span>
            </li>
          `).join('')}
        </ul>
      </div>
    ` : '';

    // CTA Section
    const ctaSectionHTML = `
      <div style="margin-top: 3rem; text-align: center; background: var(--color-bg-secondary); padding: 2.5rem 1.5rem; border-radius: var(--radius-md); border: 1px solid var(--color-border);">
        <h3 style="font-size: 1.4rem; margin-bottom: 0.5rem; color: var(--color-text-dark); font-weight: 700;">Schedule an Appointment with ${d.name}</h3>
        <p style="font-size: 0.95rem; color: var(--color-text-muted); margin-bottom: 1.5rem; max-width: 500px; margin-left: auto; margin-right: auto;">Choose your preferred date and time slot to consult with our specialist at our clinic.</p>
        <a href="/index.html#booking" class="btn btn-primary" style="padding: 0.8rem 2.2rem; font-size: 1rem; display: inline-block; font-weight: 700; border-radius: var(--radius-sm); text-decoration: none;">Book Appointment with ${d.name}</a>
      </div>
    `;

    // Education items mapping
    const educationHTML = d.education.map(edu => `
      <li style="display:flex; gap:0.5rem; align-items:flex-start;">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color:var(--color-teal); margin-top:0.25rem; flex-shrink:0;"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path></svg>
        <span style="font-size:0.95rem; color:var(--color-text-main); font-weight: 500;">${edu}</span>
      </li>
    `).join('');

    // Fellowships items mapping
    const fellowshipsHTML = (d.fellowships || ["Active Member of Dental Association"]).map(f => `
      <li style="display:flex; gap:0.5rem; align-items:flex-start;">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color:var(--color-lime); margin-top:0.25rem; flex-shrink:0;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
        <span style="font-size:0.95rem; color:var(--color-text-main); font-weight: 500;">${f}</span>
      </li>
    `).join('');

    let membershipsSectionHTML = '';
    if (d.id !== 'dr-shiek-arshi-azeem' && d.fellowships && d.fellowships.length > 0) {
      membershipsSectionHTML = `
        <div style="margin-top: 0.5rem;">
          <h2 style="font-size: 1.6rem; border-bottom: 2px solid var(--color-teal-light); padding-bottom: 0.5rem; color: var(--color-text-dark);">Professional Memberships</h2>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1rem; padding-left: 0;">
            ${fellowshipsHTML}
          </ul>
        </div>
      `;
    }

    // Replace in template
    const breadcrumbHTML = `
    <nav class="breadcrumb-nav" aria-label="Breadcrumb" style="margin-bottom: 1.5rem;">
      <a href="/index.html" class="breadcrumb-link" style="color: rgba(255,255,255,0.7); text-decoration: none;">Home</a>
      <span class="breadcrumb-separator" style="color: var(--color-lime-accent); margin: 0 0.5rem;">&gt;</span>
      <a href="/doctors/index.html" class="breadcrumb-link" style="color: rgba(255,255,255,0.7); text-decoration: none;">Doctors</a>
      <span class="breadcrumb-separator" style="color: var(--color-lime-accent); margin: 0 0.5rem;">&gt;</span>
      <span class="breadcrumb-current" style="color: var(--color-lime-accent); font-weight: 600;">${d.name}</span>
    </nav>
    `;
    html = html.replace(/{{breadcrumb}}/g, breadcrumbHTML);

    html = html.replace(/{{name}}/g, d.name);
    html = html.replace(/{{qualification}}/g, d.qualification);
    html = html.replace(/{{specialization}}/g, d.specialization);
    html = html.replace(/{{experience}}/g, d.experience);
    html = html.replace(/{{bio}}/g, bioHTML);
    html = html.replace(/{{education}}/g, educationHTML);
    html = html.replace(/{{memberships_section}}/g, membershipsSectionHTML);
    html = html.replace(/{{hero_photo}}/g, heroPhotoHTML);
    html = html.replace(/{{quote_section}}/g, quoteSectionHTML);
    html = html.replace(/{{expertise_section}}/g, expertiseSectionHTML);
    html = html.replace(/{{cta_section}}/g, ctaSectionHTML);

    const schemaMarkup = getDoctorSchemaHTML(d);

    const finalHTML = compileLayout(
      html,
      `${d.name} | Apex Dental Hospital`,
      `Consult ${d.name}, ${d.qualification} at Apex Dental Hospital in Kakinada. Specialized in ${d.specialization} with ${d.experience}.`,
      '',
      '',
      schemaMarkup
    );

    fs.writeFileSync(path.join(PATHS.output, 'doctors', `${d.id}.html`), finalHTML, 'utf8');
    console.log(`✓ compiled: doctors/${d.id}.html`);
  });
};

// H. INDIVIDUAL BLOG PAGES (3 PAGES)
const buildIndividualBlogPages = () => {
  blogs.forEach(b => {
    let html = blogTemplate;

    // Replace in template
    const breadcrumbHTML = `
    <nav class="breadcrumb-nav" aria-label="Breadcrumb">
      <a href="/index.html" class="breadcrumb-link">Home</a>
      <span class="breadcrumb-separator">&gt;</span>
      <a href="/blog.html" class="breadcrumb-link">Blog</a>
      <span class="breadcrumb-separator">&gt;</span>
      <span class="breadcrumb-current">${b.title}</span>
    </nav>
    `;
    html = html.replace(/{{breadcrumb}}/g, breadcrumbHTML);

    html = html.replace(/{{title}}/g, b.title);
    html = html.replace(/{{category}}/g, b.category);
    html = html.replace(/{{date}}/g, b.date);
    html = html.replace(/{{author}}/g, b.author);
    html = html.replace(/{{read_time}}/g, b.read_time);
    html = html.replace(/{{content}}/g, b.content);

    const finalHTML = compileLayout(
      html,
      `${b.title} | Apex Dental Hospital`,
      b.meta_description,
      '',
      '',
      ''
    );

    fs.writeFileSync(path.join(PATHS.output, 'blogs', `${b.id}.html`), finalHTML, 'utf8');
    console.log(`✓ compiled: blogs/${b.id}.html`);
  });
};

// ==========================================================================
// SEO FILES GENERATION (SITEMAP & ROBOTS.TXT)
// ==========================================================================
const generateSEOFiles = () => {
  console.log('Generating sitemap.xml and robots.txt...');
  
  const baseUrl = 'https://apexdentalkkd.in';
  
  // Base URLs of main pages
  const urls = [
    { loc: `${baseUrl}/`, priority: '1.0' },
    { loc: `${baseUrl}/index.html`, priority: '0.9' },
    { loc: `${baseUrl}/contact.html`, priority: '0.8' },
    { loc: `${baseUrl}/blog.html`, priority: '0.8' },
    { loc: `${baseUrl}/privacy-policy.html`, priority: '0.3' },
    { loc: `${baseUrl}/terms-and-conditions.html`, priority: '0.3' },
    { loc: `${baseUrl}/treatments/index.html`, priority: '0.8' },
    { loc: `${baseUrl}/doctors/index.html`, priority: '0.8' }
  ];
  
  // Add treatments
  treatments.forEach(t => {
    urls.push({ loc: `${baseUrl}/treatments/${t.id}.html`, priority: '0.7' });
  });
  
  // Add doctors
  doctors.forEach(d => {
    urls.push({ loc: `${baseUrl}/doctors/${d.id}.html`, priority: '0.7' });
  });
  
  // Add blogs
  blogs.forEach(b => {
    urls.push({ loc: `${baseUrl}/blogs/${b.id}.html`, priority: '0.6' });
  });
  
  // Build XML content
  let sitemapContent = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemapContent += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  urls.forEach(url => {
    sitemapContent += '  <url>\n';
    sitemapContent += `    <loc>${url.loc}</loc>\n`;
    sitemapContent += `    <priority>${url.priority}</priority>\n`;
    sitemapContent += '  </url>\n';
  });
  sitemapContent += '</urlset>\n';
  
  // Build robots.txt content
  const robotsContent = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`;

  // Path to /public/
  const publicDir = path.join(__dirname, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Write files to /public/
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapContent, 'utf8');
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsContent, 'utf8');
  console.log('✓ sitemap.xml and robots.txt written to /public/');

  // Write files to root /
  fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), sitemapContent, 'utf8');
  fs.writeFileSync(path.join(__dirname, 'robots.txt'), robotsContent, 'utf8');
  console.log('✓ sitemap.xml and robots.txt written to root directory');
};

// ==========================================================================
// MAIN BUILD ORCHESTRATOR
// ==========================================================================
const buildAll = () => {
  console.log('Starting APEX DENTAL HOSPITAL website static build...');
  try {
    buildHomePage();
    buildContactPage();
    buildPrivacyPolicyPage();
    buildTermsAndConditionsPage();
    buildTreatmentsListPage();
    buildDoctorsListPage();
    buildBlogListPage();
    buildIndividualTreatmentPages();
    buildIndividualDoctorPages();
    buildIndividualBlogPages();
    generateSEOFiles();
    console.log('Build completed successfully! 20+ static HTML pages generated.');
  } catch (error) {
    console.error('ERROR during compilation:', error);
    process.exit(1);
  }
};

buildAll();

