const pregnancyBotResponses = [
  {
    keywords: ['hello', 'hi', 'hey', 'greetings'],
    response: "Hello! I'm your pregnancy wellness assistant. How can I help you today?"
  },
  {
    keywords: ['nutrition', 'diet', 'eat', 'food', 'healthy eating'],
    response: "Proper nutrition during pregnancy is crucial. Focus on a balanced diet with plenty of fruits, vegetables, whole grains, lean proteins, and healthy fats. Make sure to get enough folate, iron, calcium, and protein. Would you like me to show you our diet planning page?"
  },
  {
    keywords: ['morning sickness', 'nausea', 'vomiting', 'sick'],
    response: "Morning sickness is common during the first trimester. Try eating small, frequent meals, staying hydrated, and avoiding triggers. Ginger tea, crackers, and bland foods may help. If symptoms are severe, please consult your healthcare provider."
  },
  {
    keywords: ['exercise', 'workout', 'physical activity', 'fitness'],
    response: "Regular, moderate exercise is beneficial during pregnancy. Walking, swimming, prenatal yoga, and stationary cycling are great options. Always consult your healthcare provider before starting any exercise routine during pregnancy."
  },
  {
    keywords: ['weight gain', 'gaining weight'],
    response: "Healthy weight gain during pregnancy depends on your pre-pregnancy BMI. Generally, a gain of 25-35 pounds is recommended for those with a normal BMI, but your healthcare provider can give you personalized guidance."
  },
  {
    keywords: ['vitamins', 'supplements', 'prenatal'],
    response: "Prenatal vitamins are important during pregnancy. They typically contain folic acid, iron, calcium, vitamin D, and other essential nutrients. Always take supplements as recommended by your healthcare provider."
  },
  {
    keywords: ['cravings', 'craving'],
    response: "Food cravings are common during pregnancy. It's okay to indulge occasionally, but try to maintain a balanced diet. If you're craving non-food items (pica), please consult your healthcare provider."
  },
  {
    keywords: ['heartburn', 'acid reflux', 'indigestion'],
    response: "Heartburn is common during pregnancy. Try eating smaller, more frequent meals, avoiding spicy or fatty foods, not lying down after eating, and elevating your head while sleeping. If symptoms persist, consult your healthcare provider."
  },
  {
    keywords: ['constipation', 'irregular'],
    response: "Constipation is common during pregnancy. Increase your fiber intake with fruits, vegetables, and whole grains. Stay hydrated, exercise regularly, and consider a fiber supplement if recommended by your healthcare provider."
  },
  {
    keywords: ['sleep', 'insomnia', 'can\'t sleep', 'sleeping'],
    response: "Sleep problems are common during pregnancy. Try sleeping on your left side with pillows for support, establishing a bedtime routine, limiting fluids before bed, and creating a comfortable sleep environment. If insomnia persists, consult your healthcare provider."
  },
  {
    keywords: ['water', 'hydration', 'fluid', 'drink'],
    response: "Staying hydrated is crucial during pregnancy. Aim for 8-10 glasses of water daily. Herbal teas, milk, and fruit juices can also contribute to your fluid intake. Proper hydration helps prevent UTIs, constipation, and preterm labor."
  },
  {
    keywords: ['protein', 'meat', 'fish', 'vegetarian', 'vegan'],
    response: "Protein is essential during pregnancy. Good sources include lean meats, poultry, fish (low in mercury), eggs, dairy, legumes, nuts, and seeds. Vegetarians and vegans should ensure adequate protein intake through plant-based sources and possibly supplements as recommended by their healthcare provider."
  },
  {
    keywords: ['calcium', 'bones', 'dairy', 'milk'],
    response: "Calcium is crucial for your baby's bone development. Good sources include dairy products, fortified plant milks, leafy greens, and calcium-fortified foods. Aim for 1,000-1,300 mg daily, as recommended by your healthcare provider."
  },
  {
    keywords: ['iron', 'anemia'],
    response: "Iron is important for preventing anemia during pregnancy. Good sources include lean red meat, poultry, fish, beans, lentils, and iron-fortified cereals. Consuming vitamin C alongside iron-rich foods enhances absorption."
  },
  {
    keywords: ['folic acid', 'folate', 'neural tube'],
    response: "Folic acid is crucial for preventing neural tube defects. Good sources include leafy greens, citrus fruits, beans, and fortified grains. A prenatal vitamin with folic acid is typically recommended before and during pregnancy."
  },
  {
    keywords: ['omega-3', 'dha', 'fish oil', 'brain development'],
    response: "Omega-3 fatty acids, especially DHA, support your baby's brain and eye development. Sources include fatty fish (low in mercury), walnuts, flaxseeds, and chia seeds. Some prenatal vitamins include DHA, or your healthcare provider might recommend a supplement."
  },
  {
    keywords: ['caffeine', 'coffee', 'tea', 'soda'],
    response: "Moderate caffeine consumption (less than 200 mg daily, about one 12-oz cup of coffee) is generally considered safe during pregnancy. However, it's best to limit caffeine from coffee, tea, soda, and chocolate."
  },
  {
    keywords: ['alcohol', 'wine', 'beer', 'drinking'],
    response: "No amount of alcohol is considered safe during pregnancy. Alcohol can cause serious birth defects and developmental issues. Please avoid all alcoholic beverages during pregnancy."
  },
  {
    keywords: ['smoking', 'cigarettes', 'tobacco', 'vape', 'e-cigarette'],
    response: "Smoking during pregnancy poses serious risks including preterm birth, low birth weight, and birth defects. If you smoke, please talk to your healthcare provider about quitting strategies. This includes e-cigarettes and vaping products."
  },
  {
    keywords: ['medication', 'medicine', 'drugs', 'pills'],
    response: "Always consult your healthcare provider before taking any medication during pregnancy, including over-the-counter drugs. Some medications are safe, while others may pose risks to your baby's development."
  },
  {
    keywords: ['meal plan', 'meal planning', 'meal prep', 'meal schedule'],
    response: "Meal planning during pregnancy can help ensure you get all the nutrients you need. Focus on including a variety of foods from all food groups. Our diet planning page can help you create a balanced meal plan tailored to your pregnancy needs."
  },
  {
    keywords: ['snack', 'snacks', 'snacking'],
    response: "Healthy snacks during pregnancy include fruit with yogurt, whole grain crackers with cheese, vegetables with hummus, nuts and seeds, and smoothies. These provide nutrients and help manage hunger between meals."
  },
  {
    keywords: ['vegetarian', 'vegan', 'plant-based'],
    response: "Vegetarian and vegan diets can be healthy during pregnancy if well-planned. Ensure adequate protein, iron, calcium, vitamin D, vitamin B12, and omega-3 fatty acids. Your healthcare provider might recommend specific supplements."
  },
  {
    keywords: ['gestational diabetes', 'blood sugar', 'glucose'],
    response: "Managing gestational diabetes involves monitoring blood sugar, following a specific meal plan, regular physical activity, and possibly medication. Work closely with your healthcare team for personalized guidance."
  },
  {
    keywords: ['food safety', 'foodborne illness', 'listeria', 'salmonella', 'toxoplasmosis'],
    response: "Food safety is crucial during pregnancy. Avoid raw or undercooked meat, fish, and eggs; unpasteurized dairy; deli meats and hot dogs unless heated until steaming; and wash all fruits and vegetables thoroughly."
  },
  {
    keywords: ['fish', 'seafood', 'mercury'],
    response: "Fish provides important nutrients during pregnancy, but choose low-mercury options like salmon, trout, and light canned tuna. Avoid high-mercury fish like shark, swordfish, king mackerel, and tilefish. Aim for 2-3 servings of low-mercury fish weekly."
  },
  {
    keywords: ['thank', 'thanks', 'thank you'],
    response: "You're welcome! I'm here to help with any questions about your pregnancy wellness journey. Is there anything else you'd like to know?"
  },
  {
    keywords: ['bye', 'goodbye', 'see you'],
    response: "Goodbye! Feel free to chat anytime you have questions about your pregnancy wellness. Take care!"
  }
];

export default pregnancyBotResponses;
