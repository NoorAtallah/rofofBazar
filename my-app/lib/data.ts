export const BRAND = {
  name:        'لونيل',
  nameEn:      'Lunel',
  tags:        ['عطور', 'بخور', 'مستحضرات'],
  description: 'عطور مصنوعة يدويًا من أجود المكونات الطبيعية، تأسر كل لحظة بعبق استثنائي.',
  space:       'A-12  ·  الطابق الأول',
  rating:      4.8,
  reviews:     214,
}

export const PRODUCTS = [
  {
    id: 1,
    name: 'بخور الورد الملكي',
    sub: 'بخور فاخر',
    price: 185,
    was: 230,
    image: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?w=700&q=90',
    images: [
      'https://images.unsplash.com/photo-1599305090598-fe179d501227?w=700&q=90',
      'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=700&q=90',
    ],
    description: 'بخور الورد الملكي مستخلص من أجود أنواع الورد الطائفي، يمنحك عبقًا فاخرًا يدوم طويلًا.',
    available: true,
  },
  {
    id: 2,
    name: 'عطر نسائي أزرق',
    sub: 'أو دو برفيوم · 100ml',
    price: 340,
    image: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=700&q=90',
    images: [
      'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=700&q=90',
    ],
    description: 'تركيبة زهرية مائية فريدة تجمع بين الأناقة والجرأة في آنٍ واحد.',
    available: true,
  },
  {
    id: 3,
    name: 'شمعة الياسمين',
    sub: 'شمعة معطرة · 200g',
    price: 120,
    was: 185,
    image: 'https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=700&q=90',
    images: [
      'https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=700&q=90',
    ],
    description: 'شمعة سويا طبيعية بعبق الياسمين، تحترق لأكثر من 40 ساعة.',
    available: true,
  },
  {
    id: 4,
    name: 'زيت العود الفاخر',
    sub: 'زيت طبيعي · 12ml',
    price: 520,
    image: 'https://images.unsplash.com/photo-1610461888750-10bfc601b4a6?w=700&q=90',
    images: [
      'https://images.unsplash.com/photo-1610461888750-10bfc601b4a6?w=700&q=90',
    ],
    description: 'زيت عود هندي خالص من الدرجة الأولى، قطرات قليلة تكفي ليومك كله.',
    available: true,
  },
  {
    id: 5,
    name: 'مجموعة البخور',
    sub: 'طقم كلاسيك',
    price: 290,
    was: 350,
    image: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=700&q=90',
    images: [
      'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=700&q=90',
    ],
    description: 'طقم بخور كلاسيكي يضم خمسة أنواع من أشهر عطور البخور العربية.',
    available: false,
  },
  {
    id: 6,
    name: 'عطر رجالي داكن',
    sub: 'أو دو تواليت · 75ml',
    price: 410,
    image: 'https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?w=700&q=90',
    images: [
      'https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?w=700&q=90',
    ],
    description: 'عطر شرقي دافئ يمزج العود والمسك مع لمسة غربية حديثة.',
    available: true,
  },
]

export type Product = typeof PRODUCTS[0]
