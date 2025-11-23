-- ============================================
-- S.H.AD2 Fitness App - Seed Exercises
-- Optional: Populate the exercises table
-- ============================================
-- Run this AFTER running 01_create_tables.sql and 02_rls_policies.sql
-- This will populate your database with common exercises
-- ============================================

-- ============================================
-- CHEST EXERCISES
-- ============================================
INSERT INTO public.exercises (name, description, muscle_group, equipment, difficulty, instructions, video_url, image_url) VALUES
(
    'Barbell Bench Press',
    'The king of chest exercises. Lie on a flat bench and press a barbell up from chest level.',
    'chest',
    'barbell, bench',
    'intermediate',
    ARRAY[
        'Lie flat on the bench with feet firmly on the ground',
        'Grip the barbell slightly wider than shoulder width',
        'Unrack the bar and lower it slowly to your chest',
        'Press the bar back up to starting position',
        'Keep your shoulder blades retracted throughout'
    ],
    NULL,
    NULL
),
(
    'Push-ups',
    'Classic bodyweight chest exercise that can be done anywhere.',
    'chest',
    'bodyweight',
    'beginner',
    ARRAY[
        'Start in a plank position with hands shoulder-width apart',
        'Keep your body in a straight line from head to heels',
        'Lower your chest to the ground by bending your elbows',
        'Push back up to starting position',
        'Keep your core engaged throughout'
    ],
    NULL,
    NULL
),
(
    'Dumbbell Flyes',
    'Isolation exercise that stretches and contracts the chest muscles.',
    'chest',
    'dumbbells, bench',
    'intermediate',
    ARRAY[
        'Lie on a flat bench holding dumbbells above your chest',
        'Keep a slight bend in your elbows',
        'Lower the weights out to the sides in an arc motion',
        'Bring the dumbbells back together above your chest',
        'Focus on squeezing your chest at the top'
    ],
    NULL,
    NULL
);

-- ============================================
-- BACK EXERCISES
-- ============================================
INSERT INTO public.exercises (name, description, muscle_group, equipment, difficulty, instructions) VALUES
(
    'Pull-ups',
    'Compound exercise that builds back width and strength.',
    'back',
    'pull-up bar',
    'intermediate',
    ARRAY[
        'Hang from a pull-up bar with palms facing away',
        'Pull yourself up until your chin is over the bar',
        'Lower yourself back down with control',
        'Keep your core tight and avoid swinging',
        'Focus on using your back muscles, not just arms'
    ]
),
(
    'Barbell Rows',
    'Fundamental exercise for building back thickness.',
    'back',
    'barbell',
    'intermediate',
    ARRAY[
        'Bend at the hips with a slight knee bend',
        'Grip the barbell with hands shoulder-width apart',
        'Pull the bar to your lower chest',
        'Lower the bar back down with control',
        'Keep your back straight throughout'
    ]
),
(
    'Lat Pulldowns',
    'Machine exercise targeting the latissimus dorsi.',
    'back',
    'cable machine',
    'beginner',
    ARRAY[
        'Sit at the lat pulldown machine and grip the bar wide',
        'Pull the bar down to your upper chest',
        'Squeeze your shoulder blades together',
        'Slowly return to starting position',
        'Keep your torso upright'
    ]
);

-- ============================================
-- LEG EXERCISES
-- ============================================
INSERT INTO public.exercises (name, description, muscle_group, equipment, difficulty, instructions) VALUES
(
    'Barbell Squats',
    'The king of leg exercises. Builds overall leg strength and mass.',
    'legs',
    'barbell, squat rack',
    'intermediate',
    ARRAY[
        'Position the barbell on your upper back',
        'Stand with feet shoulder-width apart',
        'Lower your body by bending knees and hips',
        'Go down until thighs are parallel to the ground',
        'Push through your heels to return to standing',
        'Keep your chest up and core tight'
    ]
),
(
    'Lunges',
    'Unilateral leg exercise that improves balance and strength.',
    'legs',
    'bodyweight or dumbbells',
    'beginner',
    ARRAY[
        'Stand with feet hip-width apart',
        'Step forward with one leg',
        'Lower your body until both knees are at 90 degrees',
        'Push back to starting position',
        'Alternate legs or complete one side at a time'
    ]
),
(
    'Romanian Deadlifts',
    'Targets hamstrings and glutes with an emphasis on hip hinge movement.',
    'legs',
    'barbell or dumbbells',
    'intermediate',
    ARRAY[
        'Hold the weight in front of your thighs',
        'Keep a slight bend in your knees',
        'Push your hips back and lower the weight',
        'Feel the stretch in your hamstrings',
        'Drive your hips forward to return to standing',
        'Keep the bar close to your body'
    ]
);

-- ============================================
-- SHOULDER EXERCISES
-- ============================================
INSERT INTO public.exercises (name, description, muscle_group, equipment, difficulty, instructions) VALUES
(
    'Overhead Press',
    'Compound movement for building shoulder strength and size.',
    'shoulders',
    'barbell or dumbbells',
    'intermediate',
    ARRAY[
        'Start with the weight at shoulder height',
        'Press the weight overhead until arms are fully extended',
        'Lower back to shoulder height with control',
        'Keep your core tight and avoid arching your back',
        'Can be done seated or standing'
    ]
),
(
    'Lateral Raises',
    'Isolation exercise targeting the side deltoids.',
    'shoulders',
    'dumbbells',
    'beginner',
    ARRAY[
        'Stand with dumbbells at your sides',
        'Raise the weights out to the sides',
        'Lift until arms are parallel to the ground',
        'Lower back down with control',
        'Keep a slight bend in your elbows'
    ]
),
(
    'Face Pulls',
    'Excellent for rear deltoids and upper back health.',
    'shoulders',
    'cable machine',
    'beginner',
    ARRAY[
        'Set the cable at face height with a rope attachment',
        'Pull the rope towards your face',
        'Separate the ends of the rope as you pull',
        'Focus on squeezing your rear delts',
        'Slowly return to starting position'
    ]
);

-- ============================================
-- ARM EXERCISES
-- ============================================
INSERT INTO public.exercises (name, description, muscle_group, equipment, difficulty, instructions) VALUES
(
    'Barbell Curls',
    'Classic bicep building exercise.',
    'arms',
    'barbell',
    'beginner',
    ARRAY[
        'Stand with feet shoulder-width apart',
        'Hold the barbell with an underhand grip',
        'Curl the bar up to shoulder height',
        'Squeeze your biceps at the top',
        'Lower back down with control',
        'Keep your elbows stationary'
    ]
),
(
    'Tricep Dips',
    'Compound movement for building tricep strength.',
    'arms',
    'parallel bars or bench',
    'intermediate',
    ARRAY[
        'Position yourself on parallel bars or a bench',
        'Lower your body by bending your elbows',
        'Go down until your upper arms are parallel to the ground',
        'Push back up to starting position',
        'Keep your elbows close to your body'
    ]
),
(
    'Hammer Curls',
    'Targets biceps and forearms with a neutral grip.',
    'arms',
    'dumbbells',
    'beginner',
    ARRAY[
        'Hold dumbbells at your sides with palms facing each other',
        'Curl the weights up keeping the neutral grip',
        'Squeeze at the top',
        'Lower back down with control',
        'Can be done alternating or simultaneously'
    ]
);

-- ============================================
-- CORE EXERCISES
-- ============================================
INSERT INTO public.exercises (name, description, muscle_group, equipment, difficulty, instructions) VALUES
(
    'Planks',
    'Isometric core exercise that builds stability and endurance.',
    'core',
    'bodyweight',
    'beginner',
    ARRAY[
        'Start in a push-up position on your forearms',
        'Keep your body in a straight line',
        'Engage your core and hold the position',
        'Breathe normally',
        'Start with 30 seconds and progress'
    ]
),
(
    'Hanging Leg Raises',
    'Advanced core exercise targeting the lower abs.',
    'core',
    'pull-up bar',
    'advanced',
    ARRAY[
        'Hang from a pull-up bar with arms fully extended',
        'Keep your legs together',
        'Raise your legs up to 90 degrees',
        'Lower back down with control',
        'Avoid swinging'
    ]
),
(
    'Russian Twists',
    'Rotational core exercise targeting obliques.',
    'core',
    'bodyweight or medicine ball',
    'beginner',
    ARRAY[
        'Sit on the ground with knees bent',
        'Lean back slightly to engage your core',
        'Rotate your torso from side to side',
        'Touch the ground on each side',
        'Keep your feet off the ground for added difficulty'
    ]
);

-- ============================================
-- CARDIO EXERCISES
-- ============================================
INSERT INTO public.exercises (name, description, muscle_group, equipment, difficulty, instructions) VALUES
(
    'Running',
    'Classic cardiovascular exercise for endurance and fat loss.',
    'cardio',
    'none or treadmill',
    'beginner',
    ARRAY[
        'Start at a comfortable pace',
        'Keep your posture upright',
        'Land on the middle of your foot',
        'Swing your arms naturally',
        'Gradually increase duration and intensity'
    ]
),
(
    'Jump Rope',
    'High-intensity cardio that improves coordination.',
    'cardio',
    'jump rope',
    'beginner',
    ARRAY[
        'Hold the rope handles at hip level',
        'Swing the rope over your head',
        'Jump with both feet as the rope passes under',
        'Land softly on the balls of your feet',
        'Start with short intervals'
    ]
),
(
    'Burpees',
    'Full-body cardio exercise that builds strength and endurance.',
    'cardio',
    'bodyweight',
    'intermediate',
    ARRAY[
        'Start standing with feet shoulder-width apart',
        'Drop into a squat position',
        'Kick your feet back into a plank',
        'Do a push-up (optional)',
        'Jump your feet back to squat position',
        'Jump up explosively with arms overhead'
    ]
);

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
DO $$
BEGIN
    RAISE NOTICE '✅ Exercise database seeded successfully!';
    RAISE NOTICE '💪 Added exercises for: Chest, Back, Legs, Shoulders, Arms, Core, and Cardio';
    RAISE NOTICE '📱 Your app is now ready to use!';
END $$;
