import { WorkoutPlan, NutritionPlan } from '../types';

export const planGenerator = {
  workout: {
    "lose-weight-beginner": {
      name: "Fat Burn Starter",
      duration: "30 min",
      exercises: [
        { name: "Warm-up Walk", sets: "1", reps: "5 min" },
        { name: "Bodyweight Squats", sets: "3", reps: "10" },
        { name: "Modified Push-ups", sets: "3", reps: "8" },
        { name: "Plank Hold", sets: "3", reps: "20 sec" },
        { name: "Walking Lunges", sets: "3", reps: "10 each" }
      ]
    },
    "lose-weight-intermediate": {
      name: "Cardio Power",
      duration: "45 min",
      exercises: [
        { name: "Jump Rope", sets: "3", reps: "2 min" },
        { name: "Burpees", sets: "4", reps: "12" },
        { name: "Mountain Climbers", sets: "4", reps: "20" },
        { name: "High Knees", sets: "3", reps: "1 min" },
        { name: "Cool-down Stretch", sets: "1", reps: "5 min" }
      ]
    },
    "build-muscle-beginner": {
      name: "Strength Foundation",
      duration: "40 min",
      exercises: [
        { name: "Goblet Squats", sets: "4", reps: "12" },
        { name: "Dumbbell Press", sets: "4", reps: "10" },
        { name: "Bent-over Rows", sets: "4", reps: "10" },
        { name: "Shoulder Press", sets: "3", reps: "10" },
        { name: "Bicep Curls", sets: "3", reps: "12" }
      ]
    },
    "build-muscle-intermediate": {
      name: "Muscle Builder Pro",
      duration: "60 min",
      exercises: [
        { name: "Barbell Squats", sets: "5", reps: "8" },
        { name: "Bench Press", sets: "5", reps: "8" },
        { name: "Deadlifts", sets: "4", reps: "6" },
        { name: "Pull-ups", sets: "4", reps: "8" },
        { name: "Dips", sets: "3", reps: "10" }
      ]
    },
    "stay-active-beginner": {
      name: "Daily Wellness",
      duration: "25 min",
      exercises: [
        { name: "Brisk Walking", sets: "1", reps: "10 min" },
        { name: "Bodyweight Squats", sets: "2", reps: "12" },
        { name: "Wall Push-ups", sets: "2", reps: "10" },
        { name: "Yoga Stretches", sets: "1", reps: "5 min" }
      ]
    }
  } as Record<string, WorkoutPlan>,
  
  nutrition: {
    "lose-weight": {
      dailyCalories: 1800,
      macros: {
        protein: 120,
        carbs: 180,
        fats: 50
      },
      meals: [
        "🍳 Breakfast (7-8 AM): Scrambled egg whites with spinach and whole grain toast",
        "☕ Morning Snack (10 AM): Green tea with 10 almonds",
        "🥗 Lunch (12-1 PM): Grilled chicken breast with mixed greens and quinoa",
        "🍎 Afternoon Snack (4 PM): Apple slices with natural peanut butter",
        "🍽️ Dinner (7-8 PM): Baked salmon with steamed broccoli and brown rice",
        "🥛 Evening (Before bed): Casein protein shake or low-fat Greek yogurt"
      ]
    },
    "lose-weight-indian": {
      dailyCalories: 1800,
      macros: {
        protein: 120,
        carbs: 180,
        fats: 50
      },
      meals: [
        "🍳 Breakfast (7-8 AM): Moong dal cheela with pudina chutney",
        "☕ Morning Snack (10 AM): Green tea with roasted chana (chickpeas)",
        "🥗 Lunch (12-1 PM): Tandoori paneer with cucumber raita and roti",
        "🍎 Afternoon Snack (4 PM): Sprouts bhel with lemon and chaat masala",
        "🍽️ Dinner (7-8 PM): Masoor dal with methi roti and sabzi",
        "🥛 Evening (Before bed): Haldi doodh (turmeric milk) with low sugar"
      ]
    },
    "build-muscle": {
      dailyCalories: 2600,
      macros: {
        protein: 200,
        carbs: 280,
        fats: 75
      },
      meals: [
        "🍳 Breakfast (7-8 AM): 4 whole eggs + oatmeal with banana and protein powder",
        "💪 Post-Workout (After Gym): Whey protein shake with banana and peanut butter",
        "🥗 Lunch (12-1 PM): Grilled chicken/beef with brown rice and sweet potato",
        "🍎 Afternoon Snack (4 PM): Cottage cheese with mixed nuts and berries",
        "🍽️ Dinner (7-8 PM): Salmon with quinoa, avocado, and roasted vegetables",
        "🥛 Evening (Before bed): Casein protein shake or Greek yogurt with almonds"
      ]
    },
    "build-muscle-indian": {
      dailyCalories: 2600,
      macros: {
        protein: 200,
        carbs: 280,
        fats: 75
      },
      meals: [
        "🍳 Breakfast (7-8 AM): Paneer bhurji + 3 eggs with multigrain paratha",
        "💪 Post-Workout (After Gym): Protein lassi with banana and badam (almonds)",
        "🥗 Lunch (12-1 PM): Chicken curry with jeera rice and dal makhani",
        "🍎 Afternoon Snack (4 PM): Chana chaat with nuts and protein bar",
        "🍽️ Dinner (7-8 PM): Egg curry with brown rice and palak paneer",
        "🥛 Evening (Before bed): Protein milk with haldi and soaked badams"
      ]
    },
    "stay-active": {
      dailyCalories: 2200,
      macros: {
        protein: 140,
        carbs: 220,
        fats: 65
      },
      meals: [
        "🍳 Breakfast (7-8 AM): Greek yogurt parfait with granola and berries",
        "☕ Morning Snack (10 AM): Mixed nuts and protein bar",
        "🥗 Lunch (12-1 PM): Turkey wrap with hummus and vegetables",
        "🍎 Afternoon Snack (4 PM): Smoothie with protein powder and fruits",
        "🍽️ Dinner (7-8 PM): Grilled chicken with quinoa and roasted veggies",
        "🥛 Evening (Before bed): Cottage cheese or casein protein"
      ]
    },
    "stay-active-indian": {
      dailyCalories: 2200,
      macros: {
        protein: 140,
        carbs: 220,
        fats: 65
      },
      meals: [
        "🍳 Breakfast (7-8 AM): Besan chilla with dahi and fruits",
        "☕ Morning Snack (10 AM): Roasted makhana with chaas",
        "🥗 Lunch (12-1 PM): Dal khichdi with paneer curry and salad",
        "🍎 Afternoon Snack (4 PM): Sprouts chat with lemon and spices",
        "🍽️ Dinner (7-8 PM): Roti with soya curry and mixed vegetables",
        "🥛 Evening (Before bed): Protein milk with turmeric and honey"
      ]
    }
  } as Record<string, NutritionPlan>
};

export const knowledgeBase = {
  nutrition_substitutes: {
    broccoli: "palak (spinach), methi (fenugreek), green beans, or gobhi (cauliflower)",
    chicken: "paneer, tofu, fish, soya chunks, or legumes",
    rice: "quinoa, daliya (broken wheat), ragi, or cauliflower rice",
    milk: "toned milk, chaas (buttermilk), lassi, or soy milk",
    protein: "whey protein, paneer, chana (chickpeas), moong dal, or masoor dal",
    yogurt: "dahi (curd), chaas (buttermilk), lassi, or paneer",
    indian_protein: "dal (lentils), rajma (kidney beans), chole (chickpeas), sprouts, or soya chunks",
    indian_breakfast: "besan chilla, moong dal cheela, paneer bhurji, or masala oats",
    indian_snacks: "roasted chana, makhana (foxnuts), mixed sprouts chat, or paneer tikka",
    eggs: "paneer bhurji, tofu scramble, besan chilla, or chia pudding",
    salmon: "mackerel, hilsa fish, rohu, or omega-3 rich walnuts",
    beef: "mutton, chicken breast, soya chunks, or mushrooms",
    soybean: "paneer (cottage cheese), chickpeas (chana), lentils (dal), kidney beans (rajma), peas, quinoa, or seitan",
    soya: "paneer, dal (lentils), rajma, chole (chickpeas), peanuts, or whey protein",
    tofu: "paneer, cottage cheese, Greek yogurt, or tempeh",
    peanut: "almond butter, cashew butter, sunflower seed butter, or tahini",
    dairy: "almond milk, coconut milk, oat milk, or cashew milk",
    gluten: "rice, quinoa, oats (certified gluten-free), buckwheat, or millet",
    nuts: "seeds (pumpkin, sunflower, chia), oats, or coconut",
    wheat: "rice flour, besan (chickpea flour), ragi, or almond flour",
    sugar: "stevia, monk fruit, jaggery (limited), honey (limited), or dates"
  },
  exercise_alternatives: {
    squats: "lunges, leg press, step-ups, or wall sits",
    "push-ups": "chest press, wall push-ups, incline push-ups, or resistance band chest fly",
    running: "cycling, swimming, brisk walking, or elliptical",
    "pull-ups": "lat pulldown, assisted pull-ups, resistance band rows, or inverted rows",
    deadlifts: "Romanian deadlifts, kettlebell swings, or good mornings",
    burpees: "mountain climbers, jumping jacks, or high knees",
    planks: "dead bugs, bird dogs, or hollow body holds",
    "bench press": "dumbbell press, floor press, or resistance band press",
    "shoulder press": "Arnold press, lateral raises, or pike push-ups",
    lunges: "Bulgarian split squats, step-ups, or leg press"
  },
  allergies_and_restrictions: {
    soy_allergy: "Avoid: soy sauce, tofu, edamame, soy milk, miso, tempeh. Alternatives: Paneer (20g protein/100g), Dal (9g protein/cup), Rajma (15g protein/cup), Chickpeas (15g protein/cup), Whey protein, Pea protein, Greek yogurt, Eggs, Quinoa (8g protein/cup), Nuts & seeds.",
    lactose_intolerant: "Avoid dairy. Use: Lactose-free milk, Almond milk, Coconut milk, Soy milk, Oat milk, Cashew milk. Protein sources: Eggs, Fish, Chicken, Lentils, Beans, Tofu.",
    gluten_intolerant: "Avoid wheat, barley, rye. Use: Rice, Quinoa, Certified gluten-free oats, Buckwheat, Millet, Corn, Potatoes. Flour alternatives: Rice flour, Besan, Almond flour, Coconut flour.",
    nut_allergy: "Avoid all tree nuts. Use: Seeds (sunflower, pumpkin, chia, flax), Oats, Coconut (usually safe), Tahini (sesame paste), Soy butter (if no soy allergy).",
    egg_allergy: "Protein alternatives: Paneer, Tofu, Dal, Chickpeas, Quinoa, Greek yogurt, Fish, Chicken. For baking: Flax eggs (1 tbsp flax + 3 tbsp water), Chia eggs, Applesauce.",
    vegan: "Complete proteins: Quinoa, Soy products, Lentils+Rice, Chickpeas+Whole grains. High protein: Tofu, Tempeh, Seitan, Lentils, Chickpeas, Black beans, Pea protein, Hemp seeds, Nutritional yeast.",
    vegetarian: "Protein sources: Paneer, Dal, Rajma, Chole, Eggs, Greek yogurt, Cottage cheese, Quinoa, Tofu, Tempeh, Protein powder (whey/pea)."
  },
  workout_knowledge: {
    "warm-up": "Always warm up for 5-10 minutes with light cardio and dynamic stretching to prevent injuries and improve performance.",
    "cool-down": "Cool down with 5-10 minutes of light activity and static stretching to reduce muscle soreness and improve flexibility.",
    "progressive-overload": "Gradually increase weight, reps, or intensity every 2-3 weeks to continue making progress.",
    "muscle-groups": "Train each major muscle group (chest, back, legs, shoulders, arms) at least twice per week for balanced development.",
    "form": "Proper form is more important than heavy weight. Quality over quantity prevents injuries.",
    "rest-between-sets": "Rest 60-90 seconds for muscle building, 2-3 minutes for strength, 30-45 seconds for fat loss."
  },
  nutrition_knowledge: {
    "protein-timing": "Consume 20-30g protein within 2 hours after workout for optimal muscle recovery and growth.",
    "meal-frequency": "Eat 5-6 smaller meals throughout the day to maintain energy and boost metabolism.",
    "pre-workout": "Eat carbs + protein 1-2 hours before workout. Try banana with peanut butter or oats with protein.",
    "post-workout": "Consume fast-digesting protein (whey) and carbs within 30-60 minutes after training.",
    "hydration": "Drink 3-4 liters of water daily. Add 500ml-1L for every hour of intense exercise.",
    "carbs": "Complex carbs (brown rice, oats, sweet potato) provide sustained energy. Simple carbs (fruits) for quick energy.",
    "fats": "Healthy fats (nuts, avocado, olive oil) are essential for hormone production. 0.3-0.5g per lb bodyweight.",
    "cheat-meal": "One cheat meal per week can boost metabolism and mental health. Don't overdo it!",
    "indian-diet": "Dal + rice + sabzi + roti + paneer/curd provides complete nutrition with all amino acids."
  },
  fitness_tips: {
    "weight-loss": "Create a 500 calorie deficit daily for 1 lb/week loss. Combine cardio + strength training + proper diet.",
    "muscle-gain": "Eat 300-500 calorie surplus with high protein (1g per lb bodyweight). Lift heavy with progressive overload.",
    "beginner": "Start with 3 days/week full-body workouts. Focus on compound movements: squats, deadlifts, bench press, rows.",
    "intermediate": "4-5 days/week with upper/lower or push/pull/legs split. Track your progress weekly.",
    "advanced": "5-6 days/week with specialized splits. Periodize training with heavy, medium, light weeks.",
    "consistency": "Consistency beats perfection. 3-4 workouts weekly for 6 months beats 6-7 workouts for 1 month.",
    "motivation": "Set SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound). Track progress with photos and measurements."
  },
  common_questions: {
    "when-workout": "Best time is when YOU can be most consistent. Morning boosts metabolism, evening has peak strength.",
    "cardio-strength": "Do strength training first, then cardio. Or separate them (cardio in AM, weights in PM).",
    "soreness": "DOMS (muscle soreness) is normal for 24-48 hours. Light activity helps. See doctor if pain persists 72+ hours.",
    "supplements": "Protein powder, creatine, multivitamin are scientifically proven. Others are optional.",
    "abs": "Abs are made in the kitchen (diet) and revealed through low body fat. Train core 2-3x per week.",
    "spot-reduction": "You can't target fat loss in specific areas. Overall fat loss through diet + exercise reveals muscles.",
    "plateau": "Change routine every 4-6 weeks. Increase intensity, change exercises, or adjust nutrition."
  },
  safety_warnings: [
    "⚠️ IMPORTANT: If you feel sharp pain, stop immediately.",
    "⚠️ Chest pain requires immediate medical attention.",
    "⚠️ Our app provides fitness guidance, not medical advice.",
    "⚠️ Consult a doctor before starting any new exercise program.",
    "⚠️ Dizziness, nausea, or unusual fatigue requires rest and medical consultation."
  ]
};

export const generateRAGResponse = (userQuery: string) => {
  const query = userQuery.toLowerCase();
  
  // Check for safety concerns first
  if (query.includes('pain') || query.includes('hurt') || query.includes('injury') || query.includes('chest pain')) {
    return {
      text: "⚠️ IMPORTANT: If you're experiencing pain, please stop exercising immediately and consult with a healthcare professional. Our app provides fitness guidance, not medical advice. Your safety is the top priority!",
      verified: true
    };
  }

  // Emergency keywords
  if (query.includes('dizzy') || query.includes('nausea') || query.includes('faint')) {
    return {
      text: "⚠️ ALERT: Dizziness, nausea, or fainting during exercise requires immediate rest. Sit or lie down, hydrate, and seek medical attention if symptoms persist. Never push through these warning signs!",
      verified: true
    };
  }

  // Allergies and Dietary Restrictions - PRIORITY CHECKS
  if (query.includes('allerg') && (query.includes('soy') || query.includes('soya'))) {
    return {
      text: "🚫 SOY ALLERGY ALTERNATIVES:\n\n✅ High-Protein Options:\n• Paneer (20g protein/100g)\n• Dal/Lentils (9g protein/cup)\n• Rajma/Kidney beans (15g protein/cup)\n• Chickpeas/Chole (15g protein/cup)\n• Whey protein powder\n• Pea protein powder\n• Greek yogurt\n• Eggs\n• Quinoa (8g protein/cup)\n• Nuts & seeds\n\n🥗 Meal Ideas:\n• Paneer bhurji with vegetables\n• Dal khichdi with rajma\n• Chickpea curry with rice\n• Greek yogurt with nuts\n• Egg white omelette\n\nAvoid: Tofu, tempeh, soy milk, edamame, soy sauce, miso paste.",
      verified: true
    };
  }

  if (query.includes('soy') || query.includes('soya')) {
    if (query.includes('alternative') || query.includes('substitute') || query.includes('replace') || query.includes('instead')) {
      return {
        text: "🔄 SOYBEAN ALTERNATIVES:\n\n💪 Protein-Rich Replacements:\n1. Paneer (cottage cheese) - 20g protein/100g\n2. Dal (lentils) - Any variety: moong, masoor, urad\n3. Rajma (kidney beans) - 15g protein/cup\n4. Chole (chickpeas) - 15g protein/cup\n5. Whey protein powder\n6. Pea protein powder\n7. Greek yogurt - 17g protein/cup\n8. Peanuts (if no allergy) - 25g protein/100g\n\n🍽️ Cooking Swaps:\n• Tofu → Paneer or cottage cheese\n• Soy milk → Almond milk, oat milk, coconut milk\n• Soy sauce → Coconut aminos, tamari (gluten-free)\n• Soya chunks → Paneer cubes or mushrooms\n\nAll provide excellent protein without soy!",
        verified: true
      };
    }
  }

  // Other allergy checks
  if (query.includes('allerg')) {
    if (query.includes('lactose') || query.includes('dairy') || query.includes('milk')) {
      return {
        text: "🥛 LACTOSE/DAIRY ALLERGY ALTERNATIVES:\n\n" + knowledgeBase.allergies_and_restrictions.lactose_intolerant + "\n\nAll provide nutrition without lactose!",
        verified: true
      };
    }
    if (query.includes('gluten') || query.includes('wheat')) {
      return {
        text: "🌾 GLUTEN ALLERGY ALTERNATIVES:\n\n" + knowledgeBase.allergies_and_restrictions.gluten_intolerant + "\n\nAll are naturally gluten-free!",
        verified: true
      };
    }
    if (query.includes('nut') || query.includes('peanut')) {
      return {
        text: "🥜 NUT ALLERGY ALTERNATIVES:\n\n" + knowledgeBase.allergies_and_restrictions.nut_allergy + "\n\nAlways check labels for cross-contamination!",
        verified: true
      };
    }
    if (query.includes('egg')) {
      return {
        text: "🥚 EGG ALLERGY ALTERNATIVES:\n\n" + knowledgeBase.allergies_and_restrictions.egg_allergy + "\n\nPerfect for egg-free diets!",
        verified: true
      };
    }
  }

  // Vegan and Vegetarian
  if (query.includes('vegan') && (query.includes('protein') || query.includes('source') || query.includes('diet'))) {
    return {
      text: "🌱 VEGAN PROTEIN SOURCES:\n\n" + knowledgeBase.allergies_and_restrictions.vegan + "\n\n💡 Tip: Combine legumes + grains for complete amino acid profile!",
      verified: true
    };
  }

  if (query.includes('vegetarian') && (query.includes('protein') || query.includes('source') || query.includes('diet'))) {
    return {
      text: "🥗 VEGETARIAN PROTEIN SOURCES:\n\n" + knowledgeBase.allergies_and_restrictions.vegetarian + "\n\n💡 Tip: Aim for 1g protein per lb bodyweight for muscle building!",
      verified: true
    };
  }
  
  // Workout Knowledge
  if (query.includes('warm') || query.includes('warm-up') || query.includes('warmup')) {
    return {
      text: "🔥 " + knowledgeBase.workout_knowledge["warm-up"] + " Try: jumping jacks, arm circles, leg swings, and light jogging.",
      verified: true
    };
  }
  
  if (query.includes('cool') || query.includes('cool-down') || query.includes('cooldown')) {
    return {
      text: "❄️ " + knowledgeBase.workout_knowledge["cool-down"] + " Hold stretches for 20-30 seconds each.",
      verified: true
    };
  }

  if (query.includes('progressive') || query.includes('overload') || query.includes('progress')) {
    return {
      text: "📈 " + knowledgeBase.workout_knowledge["progressive-overload"] + " Example: If you're doing 3x10 squats at 50kg, aim for 3x12 or 3x10 at 55kg next week.",
      verified: true
    };
  }

  if (query.includes('form') || query.includes('technique')) {
    return {
      text: "✅ " + knowledgeBase.workout_knowledge["form"] + " Watch yourself in a mirror or record your form to check technique.",
      verified: true
    };
  }

  if (query.includes('rest between') || query.includes('how long rest')) {
    return {
      text: "⏱️ " + knowledgeBase.workout_knowledge["rest-between-sets"] + " Adjust based on your fitness level and goals.",
      verified: true
    };
  }

  // Nutrition Knowledge
  if (query.includes('protein timing') || query.includes('when protein') || query.includes('post workout nutrition')) {
    return {
      text: "🥤 " + knowledgeBase.nutrition_knowledge["protein-timing"] + " Best sources: whey protein, chicken, paneer, eggs, or dal.",
      verified: true
    };
  }

  if (query.includes('pre workout') || query.includes('before workout') || query.includes('pre-workout')) {
    return {
      text: "🍌 " + knowledgeBase.nutrition_knowledge["pre-workout"] + " Indian options: poha with peanuts, upma, or besan chilla.",
      verified: true
    };
  }

  if (query.includes('post workout') || query.includes('after workout') || query.includes('post-workout')) {
    return {
      text: "💪 " + knowledgeBase.nutrition_knowledge["post-workout"] + " Indian options: lassi with banana, paneer bhurji, or protein dal.",
      verified: true
    };
  }

  if (query.includes('water') || query.includes('hydrat') || query.includes('how much water')) {
    return {
      text: "💧 " + knowledgeBase.nutrition_knowledge.hydration + " Signs of good hydration: clear/pale yellow urine, good energy levels.",
      verified: true
    };
  }

  if (query.includes('carb') || query.includes('carbohydrate')) {
    return {
      text: "🍚 " + knowledgeBase.nutrition_knowledge.carbs + " Best Indian sources: brown rice, oats, ragi, sweet potato, quinoa, daliya.",
      verified: true
    };
  }

  if (query.includes('fat') || query.includes('healthy fat')) {
    return {
      text: "🥜 " + knowledgeBase.nutrition_knowledge.fats + " Best sources: almonds, walnuts, ghee (limited), coconut oil, flaxseeds.",
      verified: true
    };
  }

  if (query.includes('cheat meal') || query.includes('cheat day')) {
    return {
      text: "🍕 " + knowledgeBase.nutrition_knowledge["cheat-meal"] + " Make it a meal, not a whole day!",
      verified: true
    };
  }

  if (query.includes('meal frequency') || query.includes('how many meals')) {
    return {
      text: "🍽️ " + knowledgeBase.nutrition_knowledge["meal-frequency"] + " Example: Breakfast, mid-morning snack, lunch, evening snack, dinner, bedtime snack.",
      verified: true
    };
  }

  if (query.includes('indian diet') || query.includes('vegetarian protein')) {
    return {
      text: "🇮🇳 " + knowledgeBase.nutrition_knowledge["indian-diet"] + " Add sprouts, chana, rajma, or soya chunks for extra protein!",
      verified: true
    };
  }

  // Fitness Tips by Goal
  if (query.includes('lose weight') || query.includes('fat loss') || query.includes('weight loss')) {
    return {
      text: "🔥 " + knowledgeBase.fitness_tips["weight-loss"] + " Focus on: HIIT cardio, strength training 3x/week, high protein diet.",
      verified: true
    };
  }

  if (query.includes('build muscle') || query.includes('muscle gain') || query.includes('bulking')) {
    return {
      text: "💪 " + knowledgeBase.fitness_tips["muscle-gain"] + " Focus on: heavy compound lifts, 8-12 reps, 4-5 sets per exercise.",
      verified: true
    };
  }

  if (query.includes('beginner') || query.includes('just starting') || query.includes('new to gym')) {
    return {
      text: "🌱 " + knowledgeBase.fitness_tips.beginner + " Master these movements first before advancing to complex exercises.",
      verified: true
    };
  }

  if (query.includes('intermediate') || query.includes('next level')) {
    return {
      text: "⚡ " + knowledgeBase.fitness_tips.intermediate + " Consider: Push (chest/shoulders/triceps), Pull (back/biceps), Legs split.",
      verified: true
    };
  }

  if (query.includes('advanced') || query.includes('experienced')) {
    return {
      text: "🏆 " + knowledgeBase.fitness_tips.advanced + " Consider working with a coach for personalized programming.",
      verified: true
    };
  }

  if (query.includes('motivation') || query.includes('stay consistent') || query.includes('give up')) {
    return {
      text: "💯 " + knowledgeBase.fitness_tips.motivation + " Remember: You're 0.1% better every single day. That's 37x better in a year!",
      verified: true
    };
  }

  if (query.includes('consistency') || query.includes('how often')) {
    return {
      text: "🎯 " + knowledgeBase.fitness_tips.consistency + " It's a marathon, not a sprint. Small daily wins compound into massive results!",
      verified: true
    };
  }

  // Common Questions
  if (query.includes('best time') || query.includes('when workout') || query.includes('morning or evening')) {
    return {
      text: "⏰ " + knowledgeBase.common_questions["when-workout"] + " Choose what fits YOUR schedule and stick to it!",
      verified: true
    };
  }

  if (query.includes('cardio and strength') || query.includes('cardio or weights') || query.includes('cardio first')) {
    return {
      text: "🏋️ " + knowledgeBase.common_questions["cardio-strength"] + " Never skip strength training - it boosts metabolism long-term!",
      verified: true
    };
  }

  if (query.includes('sore') || query.includes('doms') || query.includes('muscle soreness')) {
    return {
      text: "😅 " + knowledgeBase.common_questions.soreness + " Active recovery (walking, yoga) can help reduce soreness.",
      verified: true
    };
  }

  if (query.includes('supplement') || query.includes('protein powder') || query.includes('creatine')) {
    return {
      text: "💊 " + knowledgeBase.common_questions.supplements + " Food first, supplements second. They're called supplements, not replacements!",
      verified: true
    };
  }

  if (query.includes('abs') || query.includes('six pack') || query.includes('core')) {
    return {
      text: "💪 " + knowledgeBase.common_questions.abs + " Best exercises: planks, dead bugs, hanging leg raises, cable crunches.",
      verified: true
    };
  }

  if (query.includes('spot reduction') || query.includes('belly fat') || query.includes('target fat')) {
    return {
      text: "🎯 " + knowledgeBase.common_questions["spot-reduction"] + " Focus on overall body fat percentage through diet and full-body training.",
      verified: true
    };
  }

  if (query.includes('plateau') || query.includes('not progressing') || query.includes('stuck')) {
    return {
      text: "📊 " + knowledgeBase.common_questions.plateau + " Also: ensure adequate sleep, manage stress, and verify you're in the right calorie range.",
      verified: true
    };
  }
  
  // Check for nutrition substitutes with fuzzy matching
  for (const [food, substitutes] of Object.entries(knowledgeBase.nutrition_substitutes)) {
    if (query.includes(food) || (food.length > 3 && query.includes(food.substring(0, food.length - 1)))) {
      if (query.includes('substitute') || query.includes('alternative') || query.includes('replace') || query.includes('instead') || query.includes('allerg')) {
        return {
          text: `🔄 Great substitutes for ${food.toUpperCase()}:\n\n${substitutes}\n\n✅ These alternatives provide similar nutritional benefits!`,
          verified: true
        };
      }
    }
  }
  
  // Check for exercise alternatives
  for (const [exercise, alternatives] of Object.entries(knowledgeBase.exercise_alternatives)) {
    if (query.includes(exercise)) {
      return {
        text: `💡 Good alternatives for ${exercise.toUpperCase()}:\n\n${alternatives}\n\n✅ These exercises target similar muscle groups and can be adjusted to your fitness level.`,
        verified: true
      };
    }
  }

  // Sleep and Recovery
  if (query.includes('sleep') || query.includes('recovery') || query.includes('rest day')) {
    return {
      text: "😴 Sleep is crucial! Aim for 7-9 hours nightly. During sleep, your body releases growth hormone and repairs muscle tissue. Rest days allow muscles to grow stronger. Take 1-2 full rest days per week.",
      verified: true
    };
  }

  // Stretching and Flexibility
  if (query.includes('stretch') || query.includes('flexibility') || query.includes('mobility')) {
    return {
      text: "🧘 Stretching improves flexibility and reduces injury risk. Do dynamic stretches before workouts (leg swings, arm circles) and static stretches after (hold 20-30 seconds). Try yoga 1-2x per week for overall mobility!",
      verified: true
    };
  }

  // Counting Macros
  if (query.includes('macro') || query.includes('count calories') || query.includes('track food')) {
    return {
      text: "📱 Track macros for best results! Protein: 1g per lb bodyweight. Carbs: 2-3g/lb for muscle gain, 1-2g/lb for fat loss. Fats: 0.3-0.5g/lb. Use apps like MyFitnessPal or HealthifyMe to track easily!",
      verified: true
    };
  }

  // Energy and Fatigue
  if (query.includes('tired') || query.includes('fatigue') || query.includes('no energy')) {
    return {
      text: "⚡ Low energy? Check: 1) Sleep quality (7-9 hours), 2) Hydration (3-4L water), 3) Nutrition (enough carbs?), 4) Stress levels, 5) Overtraining (take a rest day!). Consider B-complex vitamins and iron levels too.",
      verified: true
    };
  }

  // Gym Equipment
  if (query.includes('home workout') || query.includes('no gym') || query.includes('bodyweight')) {
    return {
      text: "🏠 Effective home workouts: push-ups, squats, lunges, planks, burpees, mountain climbers. Add resistance bands or dumbbells for more challenge. No equipment needed to get fit!",
      verified: true
    };
  }

  // Women's Fitness
  if (query.includes('women') || query.includes('female') || query.includes('girl')) {
    return {
      text: "👩 Women's fitness tips: Lifting weights won't make you bulky (you don't have enough testosterone). Strength training increases bone density, boosts metabolism, and sculpts your physique. Train all muscle groups 2-3x per week!",
      verified: true
    };
  }
  
  // Default helpful response with suggestions
  return {
    text: "💬 I'm your B.R.A.V.O AI Coach! I can help with:\n\n💪 Workouts & Exercise Alternatives\n🥗 Nutrition & Meal Planning\n🎯 Weight Loss & Muscle Building\n⏰ Pre/Post Workout Nutrition\n💊 Supplements & Protein\n😴 Recovery & Sleep\n🧘 Stretching & Mobility\n🏠 Home Workouts\n🚫 Allergies & Dietary Restrictions\n\nTry asking:\n• \"I'm allergic to [food], what can I eat?\"\n• \"Alternatives for [exercise]?\"\n• \"How to [fitness goal]?\"\n\nWhat would you like to know?",
    verified: true
  };
};
