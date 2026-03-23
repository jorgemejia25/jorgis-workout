import type { PredefinedMeal, UserSettings, WorkoutSchedule } from './types'

export const PREDEFINED_MEALS: PredefinedMeal[] = [
  { name: 'Huevos con frijoles y tortillas', calories: 450, protein: 25, carbs: 40, fat: 20 },
  { name: 'Incaparina con leche',            calories: 280, protein: 12, carbs: 45, fat:  6 },
  { name: 'Pollo con arroz y frijoles',      calories: 650, protein: 40, carbs: 70, fat: 18 },
  { name: 'Carne molida con arroz',          calories: 600, protein: 35, carbs: 65, fat: 20 },
  { name: 'Licuado gainer (leche+avena+banano+maní)', calories: 650, protein: 25, carbs: 80, fat: 25 },
  { name: 'Sándwich de mantequilla de maní', calories: 400, protein: 15, carbs: 35, fat: 22 },
  { name: 'Banano',                          calories: 105, protein:  1, carbs: 27, fat:  0 },
  { name: 'Puño de maní',                    calories: 170, protein:  7, carbs:  6, fat: 14 },
  { name: 'Huevos revueltos con tortillas',  calories: 380, protein: 22, carbs: 30, fat: 18 },
]

export interface ExerciseTemplate {
  name: string
  targetSets: number
  targetReps: string
  muscles: string[]
  steps: string[]
  cues: string[]
  animationKey: string
  defaultWeight: number
}

export const UPPER_EXERCISES: ExerciseTemplate[] = [
  {
    name: 'Press de barra (floor press)',
    targetSets: 4,
    targetReps: '8-10',
    muscles: ['Pecho', 'Tríceps', 'Hombros ant.'],
    steps: [
      'Recostarte en el piso con las rodillas dobladas. Agarra la barra al ancho de los hombros.',
      'Baja la barra lentamente hasta tocar el pecho. Codos a 45° del torso.',
      'Empuja la barra hacia arriba exhalando. Extiende los brazos completamente.',
      'Pausa de 1 segundo arriba antes de la siguiente repetición.',
    ],
    cues: ['Codos a 45°, no abiertos', 'Espalda pegada al piso'],
    animationKey: 'floor-press',
    defaultWeight: 20,
  },
  {
    name: 'Remo con barra',
    targetSets: 4,
    targetReps: '8-10',
    muscles: ['Espalda alta', 'Bíceps', 'Romboides'],
    steps: [
      'Párate con los pies al ancho de caderas. Dobla la cintura hasta que el torso quede a 45°.',
      'Agarra la barra con agarre prono, manos al ancho de hombros.',
      'Jala la barra hacia el ombligo apretando la espalda. No uses impulso.',
      'Baja controlado hasta extensión completa de brazos.',
    ],
    cues: ['Espalda recta, no redondes', 'Jala hacia ombligo, no el pecho'],
    animationKey: 'barbell-row',
    defaultWeight: 30,
  },
  {
    name: 'Press militar con barra',
    targetSets: 3,
    targetReps: '8-12',
    muscles: ['Hombros', 'Tríceps', 'Core'],
    steps: [
      'Párate con la barra a la altura del pecho. Agarre al ancho de hombros.',
      'Aprieta el core y glúteos. No arquees la espalda baja.',
      'Empuja la barra hacia arriba en línea recta sobre la cabeza.',
      'Baja la barra hasta la altura del mentón de forma controlada.',
    ],
    cues: ['Core apretado siempre', 'Empuja en línea recta'],
    animationKey: 'overhead-press',
    defaultWeight: 20,
  },
  {
    name: 'Curl de bíceps con barra',
    targetSets: 3,
    targetReps: '10-12',
    muscles: ['Bíceps', 'Braquial'],
    steps: [
      'Párate con la barra en agarre supino. Codos pegados al torso.',
      'Exhala y sube la barra curvando los antebrazos hacia los hombros.',
      'Aprieta el bíceps en la parte alta por 1 segundo.',
      'Baja lentamente hasta extensión completa.',
    ],
    cues: ['Codos fijos, no los muevas', 'Baja hasta extensión total'],
    animationKey: 'bicep-curl',
    defaultWeight: 15,
  },
  {
    name: 'Extensión de tríceps (overhead)',
    targetSets: 3,
    targetReps: '10-12',
    muscles: ['Tríceps (cabeza larga)'],
    steps: [
      'Párate con el peso sobre la cabeza, codos apuntando al frente.',
      'Dobla los codos bajando el peso detrás de la cabeza.',
      'Extiende los brazos completamente hacia arriba.',
      'Mantén los codos cerca de la cabeza durante todo el movimiento.',
    ],
    cues: ['Codos al frente siempre', 'No dejes que se abran'],
    animationKey: 'tricep-extension',
    defaultWeight: 10,
  },
  {
    name: 'Elevaciones laterales',
    targetSets: 3,
    targetReps: '12-15',
    muscles: ['Hombros laterales'],
    steps: [
      'Párate con los brazos a los lados, codos ligeramente doblados.',
      'Sube los brazos hacia los lados hasta la altura de los hombros.',
      'Pausa 1 segundo arriba apretando el deltoides.',
      'Baja lentamente en 2-3 segundos.',
    ],
    cues: ['Sube hasta nivel de hombros', 'Controla la bajada'],
    animationKey: 'lateral-raise',
    defaultWeight: 5,
  },
]

export const LOWER_EXERCISES: ExerciseTemplate[] = [
  {
    name: 'Sentadilla con barra',
    targetSets: 4,
    targetReps: '8-10',
    muscles: ['Cuádriceps', 'Glúteos', 'Isquios', 'Core'],
    steps: [
      'Pies al ancho de hombros, puntas hacia afuera 15-30°. Barra sobre los trapecios.',
      'Inhala, aprieta el core y desciende como si te fueras a sentar.',
      'Baja hasta que los muslos queden paralelos al piso (o más bajo).',
      'Empuja a través de los talones para subir. Exhala al llegar arriba.',
    ],
    cues: ['Rodillas siguen las puntas', 'Talones en el piso siempre'],
    animationKey: 'squat',
    defaultWeight: 40,
  },
  {
    name: 'Peso muerto rumano con barra',
    targetSets: 4,
    targetReps: '8-10',
    muscles: ['Isquiotibiales', 'Glúteos', 'Espalda baja'],
    steps: [
      'Párate con la barra frente a ti, pies al ancho de caderas.',
      'Empuja la cadera hacia atrás (bisagra de cadera) bajando la barra por las piernas.',
      'Mantén la barra cerca del cuerpo, espalda completamente recta.',
      'Siente el estiramiento en los isquios. Aprieta los glúteos para subir.',
    ],
    cues: ['Espalda recta, no redondes la lumbar', 'Barra pegada al cuerpo'],
    animationKey: 'romanian-deadlift',
    defaultWeight: 40,
  },
  {
    name: 'Zancadas con mancuernas',
    targetSets: 3,
    targetReps: '10-12/pierna',
    muscles: ['Cuádriceps', 'Glúteos', 'Isquios'],
    steps: [
      'Párate erecto con una mancuerna en cada mano.',
      'Da un paso largo hacia adelante con una pierna.',
      'Baja la rodilla trasera casi hasta el piso. Tronco recto.',
      'Empuja con el talón del pie delantero para volver.',
    ],
    cues: ['Tronco recto, no te inclines', 'Rodilla trasera 1cm del piso'],
    animationKey: 'lunges',
    defaultWeight: 12,
  },
  {
    name: 'Elevación de talones',
    targetSets: 4,
    targetReps: '15-20',
    muscles: ['Gemelos', 'Sóleo'],
    steps: [
      'Párate con las puntas de los pies en el borde de un escalón o superficie.',
      'Sube lo más alto posible sobre las puntas.',
      'Mantén 1-2 segundos arriba apretando los gemelos.',
      'Baja lentamente sintiendo el estiramiento completo.',
    ],
    cues: ['Máxima contracción arriba', 'Bajar despacio (3 segundos)'],
    animationKey: 'calf-raise',
    defaultWeight: 0,
  },
  {
    name: 'Plancha abdominal',
    targetSets: 3,
    targetReps: '30-45seg',
    muscles: ['Core', 'Transverso', 'Glúteos'],
    steps: [
      'Apoya los antebrazos en el piso, codos debajo de los hombros.',
      'Levanta el cuerpo formando una línea recta de cabeza a talones.',
      'Aprieta el abdomen y los glúteos durante todo el tiempo.',
      'Respira de forma normal y sostenida. Mira al piso.',
    ],
    cues: ['Cuerpo en línea recta', 'No dejes caer la cadera'],
    animationKey: 'plank',
    defaultWeight: 0,
  },
]

/** Default schedule: Mon=upper, Tue=lower, Thu=upper, Fri=lower, rest days = null */
export const DEFAULT_SCHEDULE: WorkoutSchedule = {
  0: null,    // Domingo
  1: 'upper', // Lunes
  2: 'lower', // Martes
  3: null,    // Miércoles
  4: 'upper', // Jueves
  5: 'lower', // Viernes
  6: null,    // Sábado
}

const ALL_EXERCISES = [...UPPER_EXERCISES, ...LOWER_EXERCISES]

export const DEFAULT_SETTINGS: UserSettings = {
  weight: 52.6,
  height: 1.76,
  goalWeight: 65,
  calorieGoal: 2500,
  proteinGoal: 100,
  carbsGoal: 240,
  fatGoal: 55,
  unit: 'kg',
  workoutSchedule: DEFAULT_SCHEDULE,
  restDuration: 90,
  defaultWeights: Object.fromEntries(ALL_EXERCISES.map((ex) => [ex.name, ex.defaultWeight])),
}

export const REST_TIMER_OPTIONS = [60, 90, 120, 180]

export const TIPS = [
  { icon: 'Utensils',   text: 'Comé aunque no tengás hambre — tu cuerpo necesita el combustible.' },
  { icon: 'Moon',       text: 'Dormí 7-8 horas. Es cuando los músculos crecen.' },
  { icon: 'Clock',      text: 'No te saltés comidas, especialmente el desayuno.' },
  { icon: 'Scale',      text: 'Pesate 1 vez por semana, en ayunas y por la mañana.' },
  { icon: 'TrendingUp', text: 'Subí peso progresivamente cada semana para seguir creciendo.' },
]

export const PROGRESSION_TIPS = [
  'Si llegás al tope de reps, subí 2.5kg y volvé al mínimo.',
  'Enfocate en la técnica antes de agregar peso.',
  'La constancia es más importante que la intensidad.',
  'Registrá tus pesos para ver el progreso semana a semana.',
]

export const DAY_NAMES_SHORT = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
export const DAY_NAMES_FULL  = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
