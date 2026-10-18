// Spanish exercise names. The dataset ships English names only (`name`), so this file is the
// one place a Spanish speaker's exercise names come from — hand-written, not machine-generated.
//
// Every entry carries the dataset's English name in a trailing comment and `es.test.js` asserts
// it matches `EXIDX[id].n` character for character, so a wrong id can never sit here quietly:
// the test fails with the mismatch instead of the app showing the wrong exercise.
//
// Complete: all 1,324 exercises in the shipped dataset have a line here. New exercises entering
// the dataset (and anything added by hand to a plan) still come through in English until someone
// writes the row — the fallback is the English name, so the library is never half-broken, only
// partially translated. Write the row by hand: these names are the app's vocabulary and a bulk
// machine translation nobody read would ship into every workout of that language.
export default {
  // --- chest ---
  '0025': 'Press de banca con barra', // barbell bench press
  '0047': 'Press de banca inclinado con barra', // barbell incline bench press
  '0033': 'Press de banca declinado con barra', // barbell decline bench press
  '0030': 'Press de banca agarre cerrado con barra', // barbell close-grip bench press
  '0022': 'Pullover a press con barra', // barbell pullover to press
  '0073': 'Pullover con barra', // barbell pullover
  '0289': 'Press de banca con mancuernas', // dumbbell bench press
  '0314': 'Press de banca inclinado con mancuernas', // dumbbell incline bench press
  '0301': 'Press de banca declinado con mancuernas', // dumbbell decline bench press
  '0352': 'Press de banca agarre neutro con mancuernas', // dumbbell neutral grip bench press
  '0308': 'Aperturas con mancuernas', // dumbbell fly
  '0319': 'Aperturas inclinadas con mancuernas', // dumbbell incline fly
  '0302': 'Aperturas declinadas con mancuernas', // dumbbell decline fly
  '0375': 'Pullover con mancuerna', // dumbbell pullover
  '0151': 'Press de banca en polea', // cable bench press
  '0169': 'Press de banca inclinado en polea', // cable incline bench press
  '0227': 'Aperturas de pie en polea', // cable standing fly
  '0188': 'Aperturas a media altura en polea', // cable middle fly
  '0185': 'Aperturas tumbado en polea', // cable lying fly
  '0748': 'Press de banca en multipower', // smith bench press
  '0757': 'Press de banca inclinado en multipower', // smith incline bench press
  '0753': 'Press de banca declinado en multipower', // smith decline bench press
  '0751': 'Press de banca agarre cerrado en multipower', // smith close-grip bench press
  '3294': 'Flexiones arquero', // archer push up
  '0009': 'Fondos de pecho asistidos (de rodillas)', // assisted chest dip (kneeling)
  '1716': 'Estiramiento de pectoral sentado asistido con fitball', // assisted seated pectoralis major stretch with stability ball
  '2364': 'Fondos de pecho asistidos agarre abierto (de rodillas)', // assisted wide-grip chest dip (kneeling)
  '1254': 'Press de banca con banda', // band bench press
  '0989': 'Press de pecho con giro a una mano con banda', // band one arm twisting chest press
  '1255': 'Pullover declinado con barra', // barbell decline pullover
  '0036': 'Press declinado agarre abierto con barra', // barbell decline wide-grip press
  '0040': 'Elevaciones frontales y pullover con barra', // barbell front raise and pullover
  '0045': 'Press de banca guillotina con barra', // barbell guillotine bench press
  '0050': 'Elevaciones inclinadas de hombros con barra', // barbell incline shoulder raise
  '1256': 'Press de banca declinado agarre invertido con barra', // barbell reverse grip decline bench press
  '1257': 'Press de banca inclinado agarre invertido con barra', // barbell reverse grip incline bench press
  '0122': 'Press de banca agarre abierto con barra', // barbell wide bench press
  '1258': 'Press de banca agarre abierto invertido con barra', // barbell wide reverse grip bench press
  '1259': 'Estiramiento de pecho tras la cabeza', // behind head chest stretch
  '0155': 'Cruces en polea', // cable cross-over variation
  '0158': 'Aperturas declinadas en polea', // cable decline fly
  '1260': 'Press declinado a una mano en polea', // cable decline one arm press
  '1261': 'Press declinado en polea', // cable decline press
  '0171': 'Aperturas inclinadas en polea', // cable incline fly
  '0170': 'Aperturas inclinadas en polea (sobre fitball)', // cable incline fly (on stability ball)
  '0179': 'Aperturas bajas en polea', // cable low fly
  '1262': 'Aperturas declinadas de pecho a una mano en polea', // cable one arm decline chest fly
  '1263': 'Aperturas a una mano en polea sobre fitball', // cable one arm fly on exercise ball
  '1264': 'Aperturas inclinadas a una mano en polea sobre fitball', // cable one arm incline fly on exercise ball
  '1265': 'Press inclinado a una mano en polea', // cable one arm incline press
  '1266': 'Press inclinado a una mano en polea sobre fitball', // cable one arm incline press on exercise ball
  '0191': 'Elevaciones laterales inclinado a una mano en polea', // cable one arm lateral bent-over
  '1267': 'Press a una mano en polea sobre fitball', // cable one arm press on exercise ball
  '1268': 'Press en polea sobre fitball', // cable press on exercise ball
  '2144': 'Press de pecho sentado en polea', // cable seated chest press
  '1269': 'Cruces de pie en polea', // cable standing up straight crossovers
  '1270': 'Cruces para pecho superior en polea', // cable upper chest crossovers
  '1271': 'Estiramiento de pecho y parte frontal del hombro', // chest and front of shoulder stretch
  '1430': 'Fondos de pecho (en jaula de fondos y dominadas)', // chest dip (on dip-pull-up cage)
  '2462': 'Fondos de pecho en barra recta', // chest dip on straight bar
  '1272': 'Estiramiento de pecho con fitball', // chest stretch with exercise ball
  '3216': 'Flexiones con toque al pecho', // chest tap push-up (male)
  '1273': 'Flexiones con palmada', // clap push up
  '0258': 'Flexiones de reloj', // clock push-up
  '1274': 'Flexiones profundas con mancuernas', // deep push up
  '1275': 'Flexiones con caída', // drop push up
  '0288': 'Pullover circular con mancuerna', // dumbbell around pullover
  '0303': 'Press martillo declinado con mancuernas', // dumbbell decline hammer press
  '1276': 'Aperturas declinadas a una mano con mancuerna', // dumbbell decline one arm fly
  '0307': 'Aperturas declinadas con giro con mancuernas', // dumbbell decline twist fly
  '1277': 'Aperturas con mancuernas sobre fitball', // dumbbell fly on exercise ball
  '3545': 'Press inclinado alterno con mancuernas', // dumbbell incline alternate press
  '0316': 'Press inclinado con mancuernas', // dumbbell incline breeding
  '1278': 'Aperturas inclinadas con mancuernas sobre fitball', // dumbbell incline fly on exercise ball
  '0321': 'Press martillo inclinado con mancuernas', // dumbbell incline hammer press
  '1279': 'Aperturas inclinadas a una mano con mancuerna', // dumbbell incline one arm fly
  '1280': 'Aperturas inclinadas a una mano con mancuerna sobre fitball', // dumbbell incline one arm fly on exercise ball
  '1281': 'Press inclinado a una mano con mancuerna', // dumbbell incline one arm press
  '1282': 'Press inclinado a una mano con mancuerna sobre fitball', // dumbbell incline one arm press on exercise ball
  '0324': 'Press inclinado con palmas enfrentadas con mancuernas', // dumbbell incline palm-in press
  '1283': 'Press inclinado con mancuernas sobre fitball', // dumbbell incline press on exercise ball
  '0328': 'Elevaciones inclinadas de hombros con mancuernas', // dumbbell incline shoulder raise
  '0331': 'Aperturas inclinadas con giro con mancuernas', // dumbbell incline twisted flyes
  '0340': 'Press martillo tumbado con mancuernas', // dumbbell lying hammer press
  '0343': 'Press tumbado a una mano con mancuerna', // dumbbell lying one arm press
  '0342': 'Press tumbado a una mano con mancuerna (variante)', // dumbbell lying one arm press v. 2
  '1284': 'Pullover tumbado con mancuerna sobre fitball', // dumbbell lying pullover on exercise ball
  '1285': 'Aperturas en banco a una mano con mancuerna', // dumbbell one arm bench fly
  '1286': 'Aperturas de pecho a una mano con mancuerna sobre fitball', // dumbbell one arm chest fly on exercise ball
  '1287': 'Press declinado de pecho a una mano con mancuerna', // dumbbell one arm decline chest press
  '1288': 'Aperturas a una mano con mancuerna sobre fitball', // dumbbell one arm fly on exercise ball
  '1289': 'Press inclinado de pecho a una mano con mancuerna', // dumbbell one arm incline chest press
  '1290': 'Press a una mano con mancuerna sobre fitball', // dumbbell one arm press on exercise ball
  '1291': 'Pullover a una mano con mancuerna sobre fitball', // dumbbell one arm pullover on exercise ball
  '1622': 'Press a una mano agarre invertido con mancuerna', // dumbbell one arm reverse grip press
  '1292': 'Aperturas a una pierna con mancuerna sobre fitball', // dumbbell one leg fly on exercise ball
  '1293': 'Press con mancuernas sobre fitball', // dumbbell press on exercise ball
  '1294': 'Pullover con extensión de cadera con mancuerna sobre fitball', // dumbbell pullover hip extension on exercise ball
  '1295': 'Pullover con mancuerna sobre fitball', // dumbbell pullover on exercise ball
  '1624': 'Press de banca invertido con mancuernas', // dumbbell reverse bench press
  '0433': 'Pullover con brazos rectos con mancuerna', // dumbbell straight arm pullover
  '1167': 'Estiramiento dinámico de pecho', // dynamic chest stretch (male)
  '1296': 'Flexiones en pica con fitball', // exercise ball pike push up
  '0458': 'Aperturas en el suelo con barra', // floor fly (with barbell)
  '3327': 'Flexiones en plancha completa', // full planche push-up
  '2139': 'Bicicleta de manos', // hands bike
  '3234': 'Aperturas hyght con mancuernas', // hyght dumbbell fly
  '0492': 'Flexiones inclinadas con salto', // incline push up depth jump
  '0493': 'Flexiones inclinadas', // incline push-up
  '3785': 'Flexiones inclinadas (sobre cajón)', // incline push-up (on box)
  '0494': 'Flexiones inclinadas agarre invertido', // incline reverse grip push-up
  '3011': 'Flexiones inclinadas de escápulas', // incline scapula push up
  '1297': 'Apretón isométrico de pecho', // isometric chest squeeze
  '0500': 'Limpiaparabrisas isométricos', // isometric wipers
  '0519': 'Press alterno en el suelo con kettlebell', // kettlebell alternating press on floor
  '0531': 'Press a una mano con recorrido ampliado en el suelo con kettlebell', // kettlebell extended range one arm press on floor
  '1298': 'Press a una mano en el suelo con kettlebell', // kettlebell one arm floor press
  '0545': 'Flexiones pliométricas con kettlebell', // kettlebell plyo push-up
  '3211': 'Flexiones de rodillas', // kneeling push-up (male)
  '3288': 'Fondos coreanos', // korean dips
  '0577': 'Press de pecho en máquina', // lever chest press
  '0576': 'Press de pecho en máquina (variante)', // lever chest press
  '1300': 'Press de pecho declinado en máquina', // lever decline chest press
  '1299': 'Press de pecho inclinado en máquina', // lever incline chest press
  '1479': 'Press de pecho inclinado en máquina (variante)', // lever incline chest press v. 2
  '0596': 'Aperturas sentado en máquina', // lever seated fly
  '3758': 'Press de pecho de pie en máquina', // lever standing chest press
  '1301': 'Press de pecho interno en máquina', // machine inner chest press
  '1302': 'Pase de pecho con balón medicinal', // medicine ball chest pass
  '1303': 'Empuje de pecho desde tres apoyos con balón medicinal', // medicine ball chest push from 3 point stance
  '1304': 'Empuje de pecho continuo con balón medicinal', // medicine ball chest push multiple response
  '1305': 'Empuje de pecho con balón medicinal', // medicine ball chest push single response
  '1312': 'Empuje de pecho con carrera y suelta con balón medicinal', // medicine ball chest push with run release
  '3217': 'Flexiones hindúes modificadas', // modified hindu push-up (male)
  '1306': 'Flexiones pliométricas', // plyo push up
  '1689': 'Empuje y tracción a peso corporal', // push and pull bodyweight
  '1307': 'Flexiones sobre bosu', // push up on bosu ball
  '0653': 'Flexiones (bosu)', // push-up (bosu ball)
  '0655': 'Flexiones (sobre fitball)', // push-up (on stability ball)
  '0656': 'Flexiones (sobre fitball) (variante)', // push-up (on stability ball)
  '0659': 'Flexiones en pared', // push-up (wall)
  '0658': 'Flexiones en pared (variante)', // push-up (wall) v. 2
  '0663': 'Flexiones con balón medicinal', // push-up medicine ball
  '0666': 'Flexiones con elevación a una mano', // raise single arm push-up
  '3124': 'Press de pecho sentado con banda elástica', // resistance band seated chest press
  '2203': 'Movilidad de hombro sentado con rodillo', // roller seated shoulder flexor depresor retractor
  '2209': 'Movilidad de hombro sentado a una pierna con rodillo', // roller seated single leg shoulder flexor depresor retractor
  '3021': 'Flexiones de escápulas', // scapula push-up
  '0699': 'Flexiones con toque al hombro', // shoulder tap push-up
  '0725': 'Flexiones a una mano', // single arm push-up
  '0754': 'Press declinado agarre invertido en multipower', // smith decline reverse-grip press
  '0758': 'Press inclinado agarre invertido en multipower', // smith incline reverse-grip press
  '0759': 'Elevaciones de hombros inclinadas en multipower', // smith incline shoulder raises
  '1626': 'Press de banca declinado agarre cerrado invertido en multipower', // smith machine reverse decline close grip bench press
  '0764': 'Press agarre invertido en multipower', // smith reverse-grip press
  '1308': 'Press de banca agarre abierto en multipower', // smith wide grip bench press
  '1309': 'Press de banca declinado agarre abierto en multipower', // smith wide grip decline bench press
  '0803': 'Flexiones superman', // superman push-up
  '0806': 'Flexiones en suspensión', // suspended push-up
  '1310': 'Flexiones con caída y peso', // weighted drop push up
  '3313': 'Fondos en barra recta con peso', // weighted straight bar dip
  '0856': 'Press Svend con peso', // weighted svend press
  '1311': 'Flexiones agarre abierto', // wide hand push up
  '2363': 'Fondos de pecho agarre abierto en paralelas altas', // wide-grip chest dip on high parallel bars

  // --- back ---
  '0027': 'Remo con barra', // barbell bent over row
  '0118': 'Remo con barra agarre invertido', // barbell reverse grip bent over row
  '0032': 'Peso muerto con barra', // barbell deadlift
  '0085': 'Peso muerto rumano con barra', // barbell romanian deadlift
  '0117': 'Peso muerto sumo con barra', // barbell sumo deadlift
  '0116': 'Peso muerto piernas rectas con barra', // barbell straight leg deadlift
  '0074': 'Peso muerto desde soportes con barra', // barbell rack pull
  '0049': 'Remo inclinado con barra', // barbell incline row
  '0076': 'Remo posterior con barra', // barbell rear delt row
  '0293': 'Remo con mancuernas', // dumbbell bent over row
  '0292': 'Remo a una mano con mancuerna', // dumbbell one arm bent-over row
  '0327': 'Remo inclinado con mancuernas', // dumbbell incline row
  '0300': 'Peso muerto con mancuernas', // dumbbell deadlift
  '1459': 'Peso muerto rumano con mancuernas', // dumbbell romanian deadlift
  '3759': 'Buenos días sentado en máquina', // lever seated good morning
  '0861': 'Remo sentado en polea', // cable seated row
  '0180': 'Remo sentado bajo en polea', // cable low seated row
  '1323': 'Remo sentado en polea con cuerda', // cable rope seated row
  '0157': 'Peso muerto en polea', // cable deadlift
  '0198': 'Jalón al pecho en polea', // cable pulldown
  '0238': 'Jalón con brazos rectos en polea', // cable straight arm pulldown
  '0237': 'Jalón con brazos rectos en polea con cuerda', // cable straight arm pulldown (with rope)
  '0160': 'Remo sentado abierto en polea a ras de suelo', // cable floor seated wide-grip row
  '0579': 'Jalón al pecho en máquina', // lever front pulldown
  '1350': 'Remo sentado en máquina', // lever seated row
  '0574': 'Remo inclinado en máquina', // lever bent over row
  '0578': 'Peso muerto en máquina', // lever deadlift
  '1359': 'Remo inclinado en multipower', // smith bent over row
  '0762': 'Remo posterior en multipower', // smith rear delt row
  '0752': 'Peso muerto en multipower', // smith deadlift
  '2330': 'Jalón al pecho en polea (recorrido completo)', // cable lat pulldown full range of motion
  '0652': 'Dominadas', // pull-up
  '1326': 'Dominadas supinas', // chin-up
  '1327': 'Dominadas supinas agarre cerrado', // close grip chin-up
  '0499': 'Remo invertido', // inverted row
  '0489': 'Hiperextensiones', // hyperextension
  '0488': 'Hiperextensiones en banco', // hyperextension (on bench)
  '0573': 'Extensión lumbar en máquina', // lever back extension
  '0593': 'Hiperextensión inversa en máquina', // lever reverse hyperextension
  '0007': 'Jalón lateral alterno en polea', // alternate lateral pulldown
  '3293': 'Dominadas arquero', // archer pull up
  '0015': 'Dominadas asistidas agarre cerrado en paralelas', // assisted parallel close grip pull-up
  '0017': 'Dominadas asistidas', // assisted pull-up
  '1431': 'Dominadas supinas asistidas de pie', // assisted standing chin-up
  '1432': 'Dominadas asistidas de pie', // assisted standing pull-up
  '1314': 'Extensión lumbar sobre fitball', // back extension on exercise ball
  '3297': 'Back lever', // back lever
  '1405': 'Estiramiento de espalda y pecho', // back pec stretch
  '0970': 'Dominadas asistidas con banda', // band assisted pull-up
  '0974': 'Jalón agarre cerrado con banda', // band close-grip pulldown
  '3117': 'Jalón con espalda fija agarre cerrado con banda', // band fixed back close grip pulldown
  '3116': 'Jalón supino con espalda fija con banda', // band fixed back underhand pulldown
  '0983': 'Jalón a una mano arrodillado con banda', // band kneeling one arm pulldown
  '0988': 'Remo bajo a una mano de pie con banda', // band one arm standing low row
  '0990': 'Remo sentado con giro a una mano con banda', // band one arm twisting seated row
  '1018': 'Encogimientos de hombros con banda', // band shrug
  '1010': 'Peso muerto piernas rectas con banda (variante)', // band straight leg deadlift
  '1013': 'Jalón supino con banda', // band underhand pulldown
  '1316': 'Pullover con brazos flexionados con barra', // barbell bent arm pullover
  '0034': 'Pullover declinado con brazos flexionados con barra', // barbell decline bent arm pullover
  '0037': 'Pullover declinado agarre abierto con barra', // barbell decline wide-grip pullover
  '0064': 'Remo inclinado a una mano con barra', // barbell one arm bent over row
  '3017': 'Remo Pendlay con barra', // barbell pendlay row
  '1317': 'Remo inclinado en banco agarre invertido con barra', // barbell reverse grip incline bench row
  '3019': 'Dominadas en banco', // bench pull-ups
  '3168': 'Remo en sentadilla a peso corporal', // bodyweight squatting row
  '3167': 'Remo en sentadilla a peso corporal (con toalla)', // bodyweight squatting row (with towel)
  '3156': 'Remo de pie agarre cerrado a una mano a peso corporal', // bodyweight standing close-grip one arm row
  '3158': 'Remo de pie agarre cerrado a peso corporal', // bodyweight standing close-grip row
  '3162': 'Remo de pie a una mano a peso corporal', // bodyweight standing one arm row
  '3161': 'Remo de pie a una mano a peso corporal (con toalla)', // bodyweight standing one arm row (with towel)
  '3166': 'Remo de pie a peso corporal', // bodyweight standing row
  '3165': 'Remo de pie a peso corporal (con toalla)', // bodyweight standing row (with towel)
  '0150': 'Jalón lateral en polea con barra', // cable bar lateral pulldown
  '0153': 'Jalón lateral cruzado en polea', // cable cross-over lateral pulldown
  '0159': 'Remo sentado declinado agarre abierto en polea', // cable decline seated wide-grip row
  '0167': 'Remo alto en polea (arrodillado)', // cable high row (kneeling)
  '1318': 'Remo inclinado en banco en polea', // cable incline bench row
  '0172': 'Jalón inclinado con brazos rectos en polea', // cable incline pushdown
  '0177': 'Jalón lateral en polea con cuerda', // cable lateral pulldown (with rope attachment)
  '2616': 'Jalón lateral en polea con barra V', // cable lateral pulldown with v-bar
  '0184': 'Pullover tumbado con extensión en polea con cuerda', // cable lying extension pullover (with rope attachment)
  '0189': 'Remo inclinado a una mano en polea', // cable one arm bent over row
  '3563': 'Jalón a una mano en polea', // cable one arm pulldown
  '0193': 'Remo alto a una mano con espalda recta en polea (arrodillado)', // cable one arm straight back high row (kneeling)
  '1319': 'Remo con rotación de palma en polea', // cable palm rotational row
  '0197': 'Jalón al pecho en polea (barra pro lat)', // cable pulldown (pro lat bar)
  '0199': 'Jalón con brazos rectos en polea (variante)', // cable pushdown (straight arm) v. 2
  '0205': 'Jalón posterior en polea', // cable rear pulldown
  '0208': 'Remo alto sentado agarre invertido con espalda recta en polea', // cable reverse-grip straight back seated high row
  '1320': 'Remo sentado cruzado con cuerda en polea', // cable rope crossover seated row
  '1321': 'Remo sentado elevado con cuerda en polea', // cable rope elevated seated row
  '1322': 'Remo inclinado en banco con extensión y cuerda en polea', // cable rope extension incline bench row
  '0213': 'Remo alto sentado en polea (barra V)', // cable seated high row (v-bar)
  '0214': 'Remo sentado alterno a una mano en polea', // cable seated one arm alternate row
  '0218': 'Remo sentado agarre abierto en polea', // cable seated wide-grip row
  '1717': 'Remo en sentadilla en polea con cuerda', // cable squat row (with rope attachment)
  '0234': 'Remo de pie en polea (barra V)', // cable standing row (v-bar)
  '0236': 'Remo de pie con giro en polea (barra V)', // cable standing twist row (v-bar)
  '0239': 'Remo sentado con espalda recta en polea', // cable straight back seated row
  '2464': 'Remo kayak Thibaudeau en polea', // cable thibaudeau kayak row
  '0244': 'Tracción con giro en polea', // cable twisting pull
  '0245': 'Jalón supino en polea', // cable underhand pulldown
  '1324': 'Remo superior en polea', // cable upper row
  '1325': 'Jalón posterior tras nuca agarre abierto en polea', // cable wide grip rear pulldown behind neck
  '0248': 'Remo tumbado con barra curva', // cambered bar lying row
  '0253': 'Dominadas supinas agarre cerrado en paralelas', // chin-ups (narrow parallel grip)
  '0305': 'Encogimientos de hombros declinado con mancuernas', // dumbbell decline shrug
  '0304': 'Encogimientos de hombros declinado con mancuernas (variante)', // dumbbell decline shrug v. 2
  '0329': 'Encogimientos de hombros inclinado con mancuernas', // dumbbell incline shrug
  '3541': 'Elevaciones en Y inclinado con mancuernas', // dumbbell incline y-raise
  '1328': 'Remo tumbado para deltoides posterior con mancuernas', // dumbbell lying rear delt row
  '1329': 'Remo inclinado con rotación de palma con mancuerna', // dumbbell palm rotational bent over row
  '1330': 'Remo inclinado en banco agarre invertido a una mano con mancuerna', // dumbbell reverse grip incline bench one arm row
  '1331': 'Remo inclinado en banco agarre invertido a dos manos con mancuernas', // dumbbell reverse grip incline bench two arm row
  '2327': 'Remo agarre invertido con mancuernas', // dumbbell reverse grip row (female)
  '0406': 'Encogimientos de hombros con mancuernas', // dumbbell shrug
  '3664': 'Plancha lateral con aperturas posteriores y mancuerna', // dumbbell side plank with rear fly
  '1772': 'Elevación de codos (flexión inversa)', // elbow lift - reverse push-up
  '3292': 'Elevador de escápulas', // elevator
  '1332': 'Elevaciones alternas de brazos con fitball', // exercise ball alternating arm ups
  '1333': 'Extensión lumbar con brazos extendidos sobre fitball', // exercise ball back extension with arms extended
  '1334': 'Extensión lumbar con manos tras la nuca sobre fitball', // exercise ball back extension with hands behind head
  '1335': 'Extensión lumbar con rodillas en el aire sobre fitball', // exercise ball back extension with knees off ground
  '1336': 'Extensión lumbar con rotación sobre fitball', // exercise ball back extension with rotation
  '1338': 'Abrazo al fitball', // exercise ball hug
  '1339': 'Estiramiento de dorsal sobre fitball', // exercise ball lat stretch
  '1341': 'Estiramiento lumbar sobre fitball (pirámide)', // exercise ball lower back stretch (pyramid)
  '1342': 'Estiramiento lateral de dorsal tumbado sobre fitball', // exercise ball lying side lat stretch
  '1343': 'Elevación de piernas boca abajo sobre fitball', // exercise ball prone leg raise
  '3010': 'Pullover tumbado con brazos flexionados y barra Z', // ez bar lying bent arms pullover
  '1344': 'Remo inclinado agarre invertido con barra Z', // ez bar reverse grip bent over row
  '3295': 'Front lever (repeticiones)', // front lever reps
  '0466': 'Dominadas al esternón de Gironda', // gironda sternum chin
  '2300': 'Remo invertido con rodillas flexionadas', // inverted row bent knees
  '2298': 'Remo invertido en banco', // inverted row on bench
  '0497': 'Remo invertido (variante)', // inverted row v. 2
  '0498': 'Remo invertido con anillas de suspensión', // inverted row with straps
  '0521': 'Remo renegado alterno con kettlebells', // kettlebell alternating renegade row
  '0522': 'Remo alterno con kettlebell', // kettlebell alternating row
  '0541': 'Remo a una mano con kettlebell', // kettlebell one arm row
  '0548': 'Jalón alto sumo con kettlebell', // kettlebell sumo high pull
  '1345': 'Remo a dos manos con kettlebell', // kettlebell two arm row
  '0558': 'Muscle up con balanceo', // kipping muscle up
  '1346': 'Estiramiento de dorsal arrodillado', // kneeling lat stretch
  '3418': 'Dominadas en L', // l-pull-up
  '0571': 'Remo sentado alterno agarre cerrado en máquina', // lever alternating narrow grip seated row
  '0572': 'Dominadas supinas asistidas en máquina', // lever assisted chin-up
  '3200': 'Remo inclinado en máquina con barra V', // lever bent-over row with v-bar
  '0580': 'Encogimientos de hombros sin agarre en máquina', // lever gripless shrug
  '1439': 'Encogimientos de hombros sin agarre en máquina (variante)', // lever gripless shrug v. 2
  '0581': 'Remo alto en máquina', // lever high row
  '0588': 'Remo sentado agarre cerrado en máquina', // lever narrow grip seated row
  '0589': 'Remo inclinado a una mano en máquina', // lever one arm bent over row
  '1356': 'Remo alto lateral a una mano en máquina', // lever one arm lateral high row
  '1347': 'Jalón lateral abierto a una mano en máquina', // lever one arm lateral wide pulldown
  '2285': 'Pullover en máquina', // lever pullover
  '2736': 'Jalón lateral agarre invertido en máquina', // lever reverse grip lateral pulldown
  '1348': 'Remo vertical agarre invertido en máquina', // lever reverse grip vertical row
  '1349': 'Remo en T invertido en máquina', // lever reverse t-bar row
  '0606': 'Remo en T en máquina', // lever t bar row
  '1351': 'Remo en T agarre invertido en máquina', // lever t-bar reverse grip row
  '1313': 'Remo unilateral en máquina', // lever unilateral row
  '0609': 'Puente de Londres', // london bridge
  '1352': 'Flexión lumbar', // lower back curl
  '1353': 'Recepción y lanzamiento sobre la cabeza con balón medicinal', // medicine ball catch and overhead throw
  '1354': 'Golpe sobre la cabeza con balón medicinal', // medicine ball overhead slam
  '0627': 'Dominadas supinas agarre mixto', // mixed grip chin-up
  '0631': 'Muscle up', // muscle up
  '1401': 'Muscle up (en barra vertical)', // muscle-up (on vertical bar)
  '1355': 'Una mano contra la pared', // one arm against wall
  '0638': 'Dominadas supinas a una mano', // one arm chin-up
  '1773': 'Remo a una mano con toalla', // one arm towel row
  '0651': 'Dominadas agarre neutro', // pull up (neutral grip)
  '0670': 'Dominadas posteriores', // rear pull-up
  '3144': 'Remo sentado con espalda recta con banda elástica', // resistance band seated straight back row
  '0673': 'Jalón al pecho agarre invertido en máquina', // reverse grip machine lat pulldown
  '0674': 'Dominadas agarre invertido', // reverse grip pull-up
  '0678': 'Jalón tipo Rocky', // rocky pull-up pulldown
  '2208': 'Estiramiento de espalda con rodillo', // roller back stretch
  '2207': 'Estiramiento lateral de dorsal con rodillo', // roller side lat stretch
  '0680': 'Trepa de cuerda', // rope climb
  '3012': 'Fondos de escápulas', // scapula dips
  '0688': 'Dominadas de escápulas', // scapular pull-up
  '0690': 'Estiramiento lumbar sentado', // seated lower back stretch
  '1763': 'Dominadas con agarre de hombro', // shoulder grip pull-up
  '1358': 'Estiramiento tumbado de lado en el suelo', // side lying floor stretch
  '0720': 'Dominadas supinas de lado a lado', // side-to-side chin
  '3304': 'Skin the cat', // skin the cat
  '0746': 'Encogimientos de espalda en multipower', // smith back shrug
  '0761': 'Remo agarre cerrado en multipower', // smith narrow row
  '1360': 'Remo a una mano en multipower', // smith one arm row
  '1361': 'Remo inclinado agarre invertido en multipower', // smith reverse grip bent over row
  '0767': 'Encogimientos de hombros en multipower', // smith shrug
  '1362': 'Esfinge', // sphinx
  '1363': 'Estiramiento de columna', // spine stretch
  '3669': 'Arquero de pie', // standing archer
  '0794': 'Estiramiento lateral de pie', // standing lateral stretch
  '1364': 'Báscula pélvica de pie', // standing pelvic tilt
  '0808': 'Remo en suspensión', // suspended row
  '0818': 'Jalón al pecho agarre paralelo con doble asa', // twin handle parallel grip lat pulldown
  '3231': 'Toque de dos pies', // two toe touch (male)
  '1365': 'Estiramiento de espalda alta', // upper back stretch
  '1366': 'Perro boca arriba', // upward facing dog
  '2987': 'Dominadas supinas agarre cerrado con peso en jaula de fondos', // weighted close grip chin-up on dip cage
  '0835': 'Hiperextensiones con peso (sobre fitball)', // weighted hyperextension (on stability ball)
  '3286': 'Muscle up con peso', // weighted muscle up
  '3312': 'Muscle up con peso (en barra)', // weighted muscle up (on bar)
  '3290': 'Dominadas a una mano con peso', // weighted one hand pull up
  '0841': 'Dominadas con peso', // weighted pull-up
  '1429': 'Dominadas agarre abierto', // wide grip pull-up
  '1367': 'Dominadas posteriores agarre abierto', // wide grip rear pull-up

  // --- shoulders ---
  '0091': 'Press militar sentado con barra', // barbell seated overhead press
  '0042': 'Sentadilla frontal con barra', // barbell front squat
  '0120': 'Remo al mentón con barra', // barbell upright row
  '0095': 'Encogimientos de hombros con barra', // barbell shrug
  '0041': 'Elevaciones frontales con barra', // barbell front raise
  '0075': 'Elevaciones posteriores con barra', // barbell rear delt raise
  '0426': 'Press militar de pie con mancuernas', // dumbbell standing overhead press
  '2137': 'Press Arnold con mancuernas', // dumbbell arnold press
  '0334': 'Elevaciones laterales con mancuernas', // dumbbell lateral raise
  '0310': 'Elevaciones frontales con mancuernas', // dumbbell front raise
  '0380': 'Pájaros con mancuernas', // dumbbell rear lateral raise
  '0378': 'Aperturas posteriores con mancuernas', // dumbbell rear fly
  '0376': 'Elevaciones con mancuernas', // dumbbell raise
  '0178': 'Elevaciones laterales en polea', // cable lateral raise
  '0192': 'Elevación lateral a una mano en polea', // cable one arm lateral raise
  '0162': 'Elevaciones frontales en polea', // cable front raise
  '0246': 'Remo al mentón en polea', // cable upright row
  '0220': 'Encogimientos de hombros en polea', // cable shrug
  '0219': 'Press de hombros en polea', // cable shoulder press
  '0587': 'Press militar en máquina', // lever military press
  '0584': 'Elevaciones laterales en máquina', // lever lateral raise
  '0604': 'Encogimientos de hombros en máquina', // lever shrug
  '0774': 'Press militar de pie en multipower', // smith standing military press
  '0775': 'Remo al mentón en multipower', // smith upright row
  '2135': 'Plancha frontal con peso', // weighted front plank
  '3544': 'Plancha lateral inclinada', // bodyweight incline side plank
  '0977': 'Elevaciones laterales hacia delante con banda', // band front lateral raise
  '0978': 'Elevaciones frontales con banda', // band front raise
  '0993': 'Aperturas inversas con banda', // band reverse fly
  '0997': 'Press de hombros con banda', // band shoulder press
  '1022': 'Remo para deltoides posterior de pie con banda', // band standing rear delt row
  '1012': 'Press sobre la cabeza con giro con banda', // band twisting overhead press
  '1017': 'Elevaciones en Y con banda', // band y-raise
  '0067': 'Arrancada a una mano con barra', // barbell one arm snatch
  '0086': 'Press militar sentado tras nuca con barra', // barbell seated behind head military press
  '0087': 'Press Bradford Rocky sentado con barra', // barbell seated bradford rocky press
  '0100': 'Esquiador con barra', // barbell skier
  '0105': 'Press Bradford de pie con barra', // barbell standing bradford press
  '1456': 'Press militar de pie agarre cerrado con barra', // barbell standing close grip military press
  '0107': 'Elevaciones frontales de pie sobre la cabeza con barra', // barbell standing front raise over head
  '1457': 'Press militar de pie agarre abierto con barra', // barbell standing wide military press
  '0119': 'Remo al mentón con barra (variante 2)', // barbell upright row v. 2
  '0121': 'Remo al mentón con barra (variante 3)', // barbell upright row v. 3
  '0123': 'Remo al mentón agarre abierto con barra', // barbell wide-grip upright row
  '0148': 'Press de hombros alterno en polea', // cable alternate shoulder press
  '0154': 'Aperturas inversas cruzadas en polea', // cable cross-over revers fly
  '0161': 'Elevaciones hacia delante en polea', // cable forward raise
  '0164': 'Elevaciones frontales de hombros en polea', // cable front shoulder raise
  '3697': 'Remo para deltoides posterior arrodillado en polea con cuerda', // cable kneeling rear delt row (with rope) (male)
  '0202': 'Remo para deltoides posterior en polea (con estribos)', // cable rear delt row (stirrups)
  '0203': 'Remo para deltoides posterior en polea con cuerda', // cable rear delt row (with rope)
  '0215': 'Elevaciones laterales posteriores sentado en polea', // cable seated rear lateral raise
  '0216': 'Rotación interna de hombro sentado en polea', // cable seated shoulder internal rotation
  '0225': 'Aperturas inversas altas cruzadas de pie en polea', // cable standing cross-over high reverse fly
  '0233': 'Remo para deltoides posterior de pie en polea con cuerda', // cable standing rear delt row (with rope)
  '0235': 'Rotación externa de hombro de pie en polea', // cable standing shoulder external rotation
  '0240': 'Aperturas inversas boca arriba en polea', // cable supine reverse fly
  '0286': 'Press lateral alterno con mancuernas', // dumbbell alternate side press
  '0287': 'Press Arnold con mancuernas (variante)', // dumbbell arnold press v. 2
  '0290': 'Press sentado en banco con mancuernas', // dumbbell bench seated press
  '0299': 'Press cubano con mancuernas', // dumbbell cuban press
  '2136': 'Press cubano con mancuernas (variante)', // dumbbell cuban press v. 2
  '0309': 'Elevaciones frontales con mancuernas (variante)', // dumbbell front raise v. 2
  '0311': 'Elevaciones laterales full can con mancuernas', // dumbbell full can lateral raise
  '0323': 'Elevaciones laterales inclinado a una mano con mancuerna', // dumbbell incline one arm lateral raise
  '0325': 'Elevaciones inclinado con mancuernas', // dumbbell incline raise
  '0326': 'Elevaciones laterales posteriores inclinado con mancuernas', // dumbbell incline rear lateral raise
  '3542': 'Elevaciones en T inclinado con mancuernas', // dumbbell incline t-raise
  '0332': 'Cruz de hierro con mancuernas', // dumbbell iron cross
  '0335': 'Elevaciones laterales al frente con mancuernas', // dumbbell lateral to front raise
  '0863': 'Rotación externa de hombro tumbado con mancuerna', // dumbbell lying external shoulder rotation
  '2470': 'Elevaciones para deltoides posterior tumbado en el suelo con mancuernas', // dumbbell lying on floor rear delt raise
  '0341': 'Deltoides posterior tumbado a una mano con mancuerna', // dumbbell lying one arm deltoid rear
  '0345': 'Elevaciones laterales posteriores tumbado a una mano con mancuerna', // dumbbell lying one arm rear lateral raise
  '0348': 'Elevaciones laterales posteriores tumbado con mancuernas', // dumbbell lying rear lateral raise
  '0355': 'Elevaciones laterales a una mano con mancuerna', // dumbbell one arm lateral raise
  '0356': 'Elevaciones laterales a una mano con mancuerna y apoyo', // dumbbell one arm lateral raise with support
  '0359': 'Aperturas inversas a una mano con mancuerna (con apoyo)', // dumbbell one arm reverse fly (with support)
  '0361': 'Press de hombros a una mano con mancuerna', // dumbbell one arm shoulder press
  '0360': 'Press de hombros a una mano con mancuerna (variante)', // dumbbell one arm shoulder press v. 2
  '0363': 'Remo al mentón a una mano con mancuerna', // dumbbell one arm upright row
  '1700': 'Push press con mancuernas', // dumbbell push press
  '2292': 'Elevaciones para deltoides posterior con mancuernas', // dumbbell rear delt raise
  '0377': 'Remo para deltoides posterior con mancuernas', // dumbbell rear delt row_shoulder
  '0379': 'Elevaciones laterales posteriores con apoyo de la cabeza con mancuernas', // dumbbell rear lateral raise (support head)
  '0383': 'Aperturas inversas con mancuernas', // dumbbell reverse fly
  '0386': 'Aperturas inversas con rotación con mancuernas', // dumbbell rotation reverse fly
  '2397': 'Press Scott con mancuernas', // dumbbell scott press
  '0387': 'Elevaciones frontales alternas sentado con mancuernas', // dumbbell seated alternate front raise
  '0388': 'Press alterno sentado con mancuernas', // dumbbell seated alternate press
  '3546': 'Press de hombros alterno sentado con mancuernas', // dumbbell seated alternate shoulder
  '2317': 'Elevaciones laterales sentado con brazos flexionados y mancuernas', // dumbbell seated bent arm lateral raise
  '0392': 'Elevaciones frontales sentado con mancuernas', // dumbbell seated front raise
  '0396': 'Elevaciones laterales sentado con mancuernas', // dumbbell seated lateral raise
  '0395': 'Elevaciones laterales sentado con mancuernas (variante)', // dumbbell seated lateral raise v. 2
  '0405': 'Press de hombros sentado con mancuernas', // dumbbell seated shoulder press
  '0404': 'Press de hombros sentado con mancuernas (agarre paralelo)', // dumbbell seated shoulder press (parallel grip)
  '0408': 'Elevaciones tumbado de lado a una mano con mancuerna', // dumbbell side lying one hand raise
  '3548': 'Paseo sobre la cabeza a un brazo con mancuerna', // dumbbell single arm overhead carry
  '0414': 'Press sobre la cabeza alterno de pie con mancuernas', // dumbbell standing alternate overhead press
  '0415': 'Elevaciones alternas de pie con mancuernas', // dumbbell standing alternate raise
  '2143': 'Círculos amplios de pie con mancuernas', // dumbbell standing around world
  '0419': 'Elevaciones frontales de pie por encima de la cabeza con mancuernas', // dumbbell standing front raise above head
  '0424': 'Press de pie a una mano con palma hacia dentro con mancuerna', // dumbbell standing one arm palm in press
  '0427': 'Press de pie con palmas enfrentadas con mancuernas', // dumbbell standing palms in press
  '0437': 'Remo al mentón con mancuernas', // dumbbell upright row
  '1765': 'Remo al mentón con mancuernas (vista posterior)', // dumbbell upright row (back pov)
  '0864': 'Rotación externa de hombro de pie con mancuerna', // dumbbell upright shoulder external rotation
  '0438': 'Press en W con mancuernas', // dumbbell w-press
  '0445': 'Press antigravedad con barra Z', // ez barbell anti gravity press
  '0520': 'Press alterno con kettlebell', // kettlebell alternating press
  '0527': 'Dos tiempos con dos kettlebells', // kettlebell double jerk
  '0528': 'Push press con dos kettlebells', // kettlebell double push press
  '0529': 'Arrancada con dos kettlebells', // kettlebell double snatch
  '0537': 'Cargada y dos tiempos a una mano con kettlebell', // kettlebell one arm clean and jerk
  '0538': 'Dos tiempos a una mano con kettlebell', // kettlebell one arm jerk
  '0539': 'Press militar a una mano hacia el lado con kettlebell', // kettlebell one arm military press to the side
  '0540': 'Push press a una mano con kettlebell', // kettlebell one arm push press
  '0542': 'Arrancada a una mano con kettlebell', // kettlebell one arm snatch
  '0543': 'Pirata con kettlebell', // kettlebell pirate supper legs
  '0546': 'Press sentado con kettlebell', // kettlebell seated press
  '1438': 'Press militar sentado a dos manos con kettlebell', // kettlebell seated two arm military press
  '0547': 'Press balancín con kettlebells', // kettlebell seesaw press
  '0550': 'Thruster con kettlebell', // kettlebell thruster
  '0552': 'Cargada a dos manos con kettlebell', // kettlebell two arm clean
  '3237': 'Elevaciones laterales con landmine', // landmine lateral raise
  '2271': 'Gancho de izquierda (boxeo)', // left hook. boxing
  '0590': 'Press de hombros a una mano en máquina', // lever one arm shoulder press
  '0602': 'Aperturas inversas sentado en máquina', // lever seated reverse fly
  '0601': 'Aperturas inversas sentado en máquina (agarre paralelo)', // lever seated reverse fly (parallel grip)
  '0603': 'Press de hombros en máquina', // lever shoulder press
  '0869': 'Press de hombros en máquina (variante 2)', // lever shoulder press v. 2
  '2318': 'Press de hombros en máquina (variante 3)', // lever shoulder press v. 3
  '0669': 'Estiramiento de deltoides posterior', // rear deltoid stretch
  '3122': 'Press de hombros sentado con banda elástica', // resistance band seated shoulder press
  '0747': 'Press tras nuca en multipower', // smith behind neck press
  '0765': 'Press de hombros sentado en multipower', // smith seated shoulder press
  '0766': 'Press de hombros en multipower', // smith shoulder press
  '0772': 'Press militar de pie tras nuca en multipower', // smith standing behind head military press
  '0788': 'Press tras nuca de pie', // standing behind neck press
  '0834': 'Elevaciones frontales con peso', // weighted front raise
  '3641': 'Paso arrodillado con balanceo y peso', // weighted kneeling step with swing
  '0844': 'Círculos de brazos con peso', // weighted round arm

  // --- arms ---
  '0031': 'Curl de bíceps con barra', // barbell curl
  '0080': 'Curl invertido con barra', // barbell reverse curl
  '0070': 'Curl en banco Scott con barra', // barbell preacher curl
  '0126': 'Curl de muñeca con barra', // barbell wrist curl
  '0082': 'Curl de muñeca invertido con barra', // barbell reverse wrist curl
  '0023': 'Curl de bíceps alterno con barra', // barbell alternate biceps curl
  '0106': 'Curl agarre cerrado con barra', // barbell standing close grip curl
  '0113': 'Curl agarre abierto con barra', // barbell standing wide-grip curl
  '0038': 'Curl arrastrado con barra', // barbell drag curl
  '0060': 'Extensión de tríceps tumbado con barra (rompecráneos)', // barbell lying triceps extension skull crusher
  '0056': 'Extensión de tríceps tumbado agarre cerrado con barra', // barbell lying close-grip triceps extension
  '0092': 'Extensión de tríceps sentado sobre la cabeza con barra', // barbell seated overhead triceps extension
  '0109': 'Extensión de tríceps de pie sobre la cabeza con barra', // barbell standing overhead triceps extension
  '0294': 'Curl de bíceps con mancuernas', // dumbbell biceps curl
  '0285': 'Curl de bíceps alterno con mancuernas', // dumbbell alternate biceps curl
  '0313': 'Curl martillo con mancuernas', // dumbbell hammer curl
  '0297': 'Curl concentrado con mancuerna', // dumbbell concentration curl
  '0372': 'Curl en banco Scott con mancuerna', // dumbbell preacher curl
  '0318': 'Curl inclinado con mancuernas', // dumbbell incline curl
  '0350': 'Curl tumbado supino con mancuernas', // dumbbell lying supine curl
  '0382': 'Curl de bíceps agarre invertido con mancuernas', // dumbbell revers grip biceps curl
  '0385': 'Curl de muñeca invertido con mancuernas', // dumbbell reverse wrist curl
  '0364': 'Curl de muñeca a una mano con mancuerna', // dumbbell one arm wrist curl
  '0351': 'Extensión de tríceps tumbado con mancuernas', // dumbbell lying triceps extension
  '0330': 'Extensión de tríceps inclinado con mancuernas', // dumbbell incline triceps extension
  '0333': 'Patada de tríceps con mancuerna', // dumbbell kickback
  '0354': 'Patada de tríceps a una mano con mancuerna', // dumbbell one arm kickback
  '0190': 'Curl a una mano en polea', // cable one arm curl
  '0195': 'Curl en banco Scott en polea', // cable preacher curl
  '0165': 'Curl martillo en polea con cuerda', // cable hammer curl (with rope)
  '0206': 'Curl invertido en polea', // cable reverse curl
  '0247': 'Curl de muñeca en polea', // cable wrist curl
  '0241': 'Extensión de tríceps en polea (barra V)', // cable triceps pushdown (v-bar)
  '0201': 'Extensión de tríceps en polea', // cable pushdown
  '0200': 'Extensión de tríceps en polea con cuerda', // cable pushdown (with rope attachment)
  '0194': 'Extensión de tríceps sobre la cabeza en polea con cuerda', // cable overhead triceps extension (rope attachment)
  '0860': 'Patada de tríceps en polea', // cable kickback
  '0592': 'Curl en banco Scott en máquina', // lever preacher curl
  '0251': 'Fondos en paralelas', // chest dip
  '0677': 'Fondos en anillas', // ring dips
  '0129': 'Fondos en banco', // bench dip (knees bent)
  '0662': 'Flexiones', // push-up
  '0259': 'Flexiones agarre cerrado', // close-grip push-up
  '0283': 'Flexiones diamante', // diamond push-up
  '0279': 'Flexiones declinadas', // decline push-up
  '3145': 'Flexiones con plus', // push-up plus
  '0018': 'Extensión de tríceps asistida de pie (con toalla)', // assisted standing triceps extension (with towel)
  '0019': 'Fondos de tríceps asistidos (de rodillas)', // assisted triceps dip (kneeling)
  '0968': 'Curl de bíceps alterno con banda', // band alternating biceps curl
  '0975': 'Flexiones agarre cerrado con banda', // band close-grip push-up
  '0976': 'Curl concentrado con banda', // band concentration curl
  '0986': 'Curl de bíceps sobre la cabeza a una mano con banda', // band one arm overhead biceps curl
  '0998': 'Extensión de tríceps lateral con banda', // band side triceps extension
  '2407': 'Curl de bíceps con barra (con soporte para brazos)', // barbell biceps curl (with arm blaster)
  '0035': 'Press declinado agarre cerrado al cráneo con barra', // barbell decline close grip to skull press
  '1719': 'Press de banca inclinado agarre cerrado con barra', // barbell incline close grip bench press
  '0048': 'Press inclinado agarre invertido con barra', // barbell incline reverse-grip press
  '0052': 'Press de banca JM con barra', // barbell jm bench press
  '1720': 'Extensión de tríceps tumbado tras la cabeza con barra', // barbell lying back of the head tricep extension
  '0055': 'Press tumbado agarre cerrado con barra', // barbell lying close-grip press
  '0057': 'Extensión tumbado con barra', // barbell lying extension
  '0059': 'Curl en banco Scott tumbado con barra', // barbell lying preacher curl
  '0061': 'Extensión de tríceps tumbado con barra', // barbell lying triceps extension
  '0065': 'Press a una mano en el suelo con barra', // barbell one arm floor press
  '1751': 'Press desde soportes con barra', // barbell pin presses
  '0072': 'Curl inclinado boca abajo con barra', // barbell prone incline curl
  '2187': 'Press de banca agarre cerrado invertido con barra', // barbell reverse close-grip bench press
  '1721': 'Rompecráneos agarre invertido con barra', // barbell reverse grip skullcrusher
  '0081': 'Curl en banco Scott invertido con barra', // barbell reverse preacher curl
  '1718': 'Extensión de tríceps sentado agarre cerrado tras nuca con barra', // barbell seated close grip behind neck triceps extension
  '0089': 'Curl concentrado sentado agarre cerrado con barra', // barbell seated close-grip concentration curl
  '2414': 'Curl concentrado de pie con barra', // barbell standing concentration curl
  '0110': 'Curl invertido de pie con barra', // barbell standing reverse grip curl
  '1629': 'Curl de bíceps de pie agarre abierto con barra', // barbell standing wide grip biceps curl
  '1399': 'Fondos en banco en el suelo', // bench dip on floor
  '1770': 'Curl concentrado de bíceps con la pierna', // biceps leg concentration curl
  '0139': 'Dominadas para bíceps agarre cerrado', // biceps narrow pull-ups
  '0140': 'Dominadas para bíceps', // biceps pull-up
  '0137': 'Elevación del cuerpo', // body-up
  '1771': 'Extensión de tríceps arrodillado a peso corporal', // bodyweight kneeling triceps extension
  '1769': 'Curl de bíceps tumbado de lado a peso corporal', // bodyweight side lying biceps curl
  '0149': 'Extensión de tríceps alterna en polea', // cable alternate triceps extension
  '1630': 'Curl agarre cerrado en polea', // cable close grip curl
  '1631': 'Curl concentrado en polea', // cable concentration curl
  '0152': 'Extensión concentrada en polea (sobre la rodilla)', // cable concentration extension (on knee)
  '0868': 'Curl en polea', // cable curl
  '1632': 'Curl arrastrado en polea', // cable drag curl
  '1722': 'Extensión de tríceps sobre la cabeza en polea alta', // cable high pulley overhead tricep extension
  '0173': 'Extensión de tríceps inclinado en polea', // cable incline triceps extension
  '0176': 'Extensión de tríceps arrodillado en polea', // cable kneeling triceps extension
  '1634': 'Curl de bíceps tumbado en polea', // cable lying bicep curl
  '0182': 'Curl tumbado agarre cerrado en polea', // cable lying close-grip curl
  '0186': 'Extensión de tríceps tumbado en polea (variante)', // cable lying triceps extension v. 2
  '1633': 'Curl en banco Scott a una mano en polea', // cable one arm preacher curl
  '1635': 'Curl en banco Scott invertido a una mano en polea', // cable one arm reverse preacher curl
  '1723': 'Extensión de tríceps a una mano en polea', // cable one arm tricep pushdown
  '1636': 'Curl sobre la cabeza en polea', // cable overhead curl
  '1637': 'Curl sobre la cabeza en polea sobre fitball', // cable overhead curl on exercise ball
  '1638': 'Curl de bíceps con jalón en polea', // cable pulldown bicep curl
  '0204': 'Extensión trasera en polea', // cable rear drive
  '2406': 'Extensión de tríceps agarre invertido en polea (barra SZ, con soporte)', // cable reverse grip triceps pushdown (sz-bar) (with arm blaster)
  '1413': 'Curl invertido a una mano en polea', // cable reverse one arm curl
  '0209': 'Curl en banco Scott invertido en polea', // cable reverse preacher curl
  '0207': 'Extensión de tríceps agarre invertido en polea', // cable reverse-grip pushdown
  '1639': 'Curl martillo en banco Scott con cuerda en polea', // cable rope hammer preacher curl
  '1724': 'Extensión de tríceps sobre la cabeza con cuerda en polea alta', // cable rope high pulley overhead tricep extension
  '1725': 'Extensión de tríceps inclinado con cuerda en polea', // cable rope incline tricep extension
  '1726': 'Extensión de tríceps tumbado en el suelo con cuerda en polea', // cable rope lying on floor tricep extension
  '1640': 'Curl martillo en banco Scott con cuerda a una mano en polea', // cable rope one arm hammer preacher curl
  '1641': 'Curl sentado en polea', // cable seated curl
  '1642': 'Curl concentrado sentado a una mano en polea', // cable seated one arm concentration curl
  '1643': 'Curl sentado sobre la cabeza en polea', // cable seated overhead curl
  '1644': 'Curl en sentadilla en polea', // cable squatting curl
  '0229': 'Curl interno de pie en polea', // cable standing inner curl
  '0231': 'Extensión de tríceps de pie a una mano en polea', // cable standing one arm triceps extension
  '0232': 'Jalón de pie en polea con cuerda', // cable standing pulldown (with rope)
  '1727': 'Extensión de tríceps sobre la cabeza a una mano agarre invertido de pie en polea', // cable standing reverse grip one arm overhead tricep extension
  '2405': 'Extensión de tríceps en polea (barra V, con soporte)', // cable triceps pushdown (v-bar) (with arm blaster)
  '1645': 'Curl a dos manos en banco inclinado en polea', // cable two arm curl on incline bench
  '1728': 'Patada de tríceps a dos manos en polea', // cable two arm tricep kickback
  '2398': 'Flexiones agarre cerrado (de rodillas)', // close-grip push-up (on knees)
  '2403': 'Curl de bíceps alterno con mancuernas (con soporte para brazos)', // dumbbell alternate biceps curl (with arm blaster)
  '1646': 'Curl martillo en banco Scott alterno con mancuernas', // dumbbell alternate hammer preacher curl
  '1647': 'Curl en banco Scott alterno con mancuernas', // dumbbell alternate preacher curl
  '1648': 'Curl martillo sentado alterno con mancuernas', // dumbbell alternate seated hammer curl
  '1649': 'Curl de bíceps alterno con pierna elevada sobre fitball y mancuernas', // dumbbell alternating bicep curl with leg raised on exercise ball
  '1650': 'Curl de bíceps sentado alterno sobre fitball con mancuernas', // dumbbell alternating seated bicep curl on exercise ball
  '1651': 'Curl de bíceps en zancada con gesto de bolos y mancuernas', // dumbbell bicep curl lunge with bowling motion
  '1652': 'Curl de bíceps sobre fitball con pierna elevada y mancuernas', // dumbbell bicep curl on exercise ball with leg raised
  '1653': 'Curl de bíceps a una pierna con mancuernas', // dumbbell bicep curl with stork stance
  '2401': 'Curl de bíceps con mancuernas (con soporte para brazos)', // dumbbell biceps curl (with arm blaster)
  '1654': 'Curl de bíceps invertido con mancuernas', // dumbbell biceps curl reverse
  '1655': 'Curl de bíceps en sentadilla con mancuernas', // dumbbell biceps curl squat
  '1656': 'Curl de bíceps en V sentado sobre bosu con mancuernas', // dumbbell biceps curl v sit on bosu ball
  '1731': 'Press agarre cerrado con mancuernas', // dumbbell close grip press
  '0296': 'Press agarre cerrado con mancuernas (variante)', // dumbbell close-grip press
  '0298': 'Curl martillo cruzado al cuerpo con mancuerna', // dumbbell cross body hammer curl
  '1657': 'Curl martillo cruzado al cuerpo con mancuerna (variante)', // dumbbell cross body hammer curl v. 2
  '1617': 'Press martillo declinado a una mano con mancuerna', // dumbbell decline one arm hammer press
  '0306': 'Extensión de tríceps declinado con mancuernas', // dumbbell decline triceps extension
  '1732': 'Extensión de tríceps en zancada al frente con mancuernas', // dumbbell forward lunge triceps extension
  '1659': 'Curl martillo sobre fitball con mancuernas', // dumbbell hammer curl on exercise ball
  '0312': 'Curl martillo con mancuernas (variante)', // dumbbell hammer curl v. 2
  '2402': 'Curl martillo con mancuernas (con soporte para brazos)', // dumbbell hammer curls (with arm blaster)
  '1664': 'Curl alto con mancuernas', // dumbbell high curl
  '0315': 'Curl de bíceps inclinado con mancuernas', // dumbbell incline biceps curl
  '0317': 'Curl inclinado con mancuernas (variante)', // dumbbell incline curl v. 2
  '0320': 'Curl martillo inclinado con mancuernas', // dumbbell incline hammer curl
  '1618': 'Press martillo inclinado sobre fitball con mancuernas', // dumbbell incline hammer press on exercise ball
  '0322': 'Curl de bíceps interno inclinado con mancuernas', // dumbbell incline inner biceps curl
  '1619': 'Press martillo inclinado a una mano con mancuerna', // dumbbell incline one arm hammer press
  '1620': 'Press martillo inclinado a una mano sobre fitball con mancuerna', // dumbbell incline one arm hammer press on exercise ball
  '1733': 'Extensión a dos manos inclinado con mancuernas', // dumbbell incline two arm extension
  '1734': 'Patadas de tríceps sobre fitball con mancuernas', // dumbbell kickbacks on exercise ball
  '1660': 'Curl de bíceps arrodillado sobre fitball con mancuernas', // dumbbell kneeling bicep curl exercise ball
  '1658': 'Zancada con curl de bíceps y mancuernas', // dumbbell lunge with bicep curl
  '0337': 'Extensión tumbado con mancuerna (cruzando la cara)', // dumbbell lying extension (across face)
  '1729': 'Extensión alterna tumbado con mancuernas', // dumbbell lying alternate extension
  '0338': 'Press de codos tumbado con mancuernas', // dumbbell lying elbow press
  '0344': 'Extensión de tríceps tumbado a una mano con pronación y mancuerna', // dumbbell lying one arm pronated triceps extension
  '0346': 'Extensión de tríceps tumbado a una mano con supinación y mancuerna', // dumbbell lying one arm supinated triceps extension
  '1735': 'Extensión tumbado a un brazo con mancuerna', // dumbbell lying single extension
  '1661': 'Curl de bíceps tumbado boca arriba con mancuernas', // dumbbell lying supine biceps curl
  '1662': 'Curl tumbado agarre abierto con mancuernas', // dumbbell lying wide curl
  '0353': 'Curl concentrado a una mano con mancuerna (sobre fitball)', // dumbbell one arm concentration curl (on stability ball)
  '1736': 'Press francés a una mano sobre fitball con mancuerna', // dumbbell one arm french press on exercise ball
  '1663': 'Curl martillo en banco Scott a una mano con mancuerna', // dumbbell one arm hammer preacher curl
  '1621': 'Press martillo a una mano sobre fitball con mancuerna', // dumbbell one arm hammer press on exercise ball
  '1665': 'Curl boca abajo a una mano con mancuerna', // dumbbell one arm prone curl
  '1666': 'Curl martillo boca abajo a una mano con mancuerna', // dumbbell one arm prone hammer curl
  '1414': 'Curl en banco Scott invertido a una mano con mancuerna', // dumbbell one arm reverse preacher curl
  '1667': 'Curl araña invertido a una mano con mancuerna', // dumbbell one arm reverse spider curl
  '1668': 'Curl de bíceps sentado a una mano sobre fitball con mancuerna', // dumbbell one arm seated bicep curl on exercise ball
  '1669': 'Curl martillo sentado a una mano con mancuerna', // dumbbell one arm seated hammer curl
  '1670': 'Curl de pie a una mano con mancuerna', // dumbbell one arm standing curl
  '1671': 'Curl martillo de pie a una mano con mancuerna', // dumbbell one arm standing hammer curl
  '0362': 'Extensión de tríceps a una mano con mancuerna (en banco)', // dumbbell one arm triceps extension (on bench)
  '1672': 'Curl Zottman en banco Scott a una mano con mancuerna', // dumbbell one arm zottman preacher curl
  '0365': 'Curl de muñeca neutro sobre banco con mancuerna', // dumbbell over bench neutral wrist curl
  '0366': 'Curl de muñeca neutro sobre banco a una mano con mancuerna', // dumbbell over bench one arm neutral wrist curl
  '1623': 'Press inclinado con palmas enfrentadas con mancuernas (variante)', // dumbbell palms in incline bench press
  '0370': 'Curl martillo en banco Scott con mancuerna', // dumbbell peacher hammer curl
  '1673': 'Curl en banco Scott sobre fitball con mancuerna', // dumbbell preacher curl over exercise ball
  '0373': 'Extensión de tríceps con pronación con mancuernas', // dumbbell pronate-grip triceps extension
  '0374': 'Curl inclinado boca abajo con mancuernas', // dumbbell prone incline curl
  '1674': 'Curl martillo inclinado boca abajo con mancuernas', // dumbbell prone incline hammer curl
  '0384': 'Curl en banco Scott invertido con mancuerna', // dumbbell reverse preacher curl
  '1675': 'Curl araña invertido con mancuerna', // dumbbell reverse spider curl
  '1676': 'Curl martillo sentado alterno sobre fitball con mancuernas', // dumbbell seated alternate hammer curl on exercise ball
  '0389': 'Extensión sentado en banco con mancuernas', // dumbbell seated bench extension
  '1730': 'Patada alterna sentado inclinado con mancuernas', // dumbbell seated bent over alternate kickback
  '1737': 'Extensión de tríceps sentado inclinado con mancuernas', // dumbbell seated bent over triceps extension
  '1677': 'Curl de bíceps sentado con mancuernas', // dumbbell seated bicep curl
  '0390': 'Curl de bíceps sentado con mancuernas (sobre fitball)', // dumbbell seated biceps curl (on stability ball)
  '3547': 'Curl de bíceps a press de hombros sentado con mancuernas', // dumbbell seated biceps curl to shoulder press
  '0391': 'Curl sentado con mancuernas', // dumbbell seated curl
  '1678': 'Curl martillo sentado con mancuernas', // dumbbell seated hammer curl
  '0393': 'Curl de bíceps interno sentado con mancuernas', // dumbbell seated inner biceps curl
  '0394': 'Patada de tríceps sentado con mancuernas', // dumbbell seated kickback
  '0397': 'Curl de muñeca neutro sentado con mancuernas', // dumbbell seated neutral wrist curl
  '1679': 'Curl de bíceps sentado a una mano con pierna elevada sobre fitball', // dumbbell seated one arm bicep curl on exercise ball with leg raised
  '0398': 'Patada de tríceps sentado a una mano con mancuerna', // dumbbell seated one arm kickback
  '0402': 'Curl en banco Scott sentado con mancuernas', // dumbbell seated preacher curl
  '0403': 'Curl concentrado sentado agarre invertido con mancuerna', // dumbbell seated revers grip concentration curl
  '1738': 'Extensión de tríceps sobre la cabeza sentado agarre invertido a una mano con mancuerna', // dumbbell seated reverse grip one arm overhead tricep extension
  '2188': 'Extensión de tríceps sentado con mancuernas', // dumbbell seated triceps extension
  '3560': 'Curl martillo y press alterno de pie con mancuernas', // dumbbell standing alternate hammer curl and press
  '1739': 'Patada de tríceps alterna de pie con mancuernas', // dumbbell standing alternating tricep kickback
  '1740': 'Extensión de tríceps de pie inclinado a una mano con mancuerna', // dumbbell standing bent over one arm triceps extension
  '1741': 'Extensión de tríceps de pie inclinado a dos manos con mancuernas', // dumbbell standing bent over two arm triceps extension
  '0416': 'Curl de bíceps de pie con mancuernas', // dumbbell standing biceps curl
  '0418': 'Curl concentrado de pie con mancuernas', // dumbbell standing concentration curl
  '2321': 'Curl de bíceps interno de pie con mancuernas (variante)', // dumbbell standing inner biceps curl v. 2
  '0420': 'Patada de tríceps de pie con mancuernas', // dumbbell standing kickback
  '0421': 'Curl concentrado de pie a una mano con mancuerna', // dumbbell standing one arm concentration curl
  '0422': 'Curl de pie a una mano con mancuerna (sobre banco inclinado)', // dumbbell standing one arm curl (over incline bench)
  '1680': 'Curl de pie a una mano sobre banco inclinado con mancuerna (variante)', // dumbbell standing one arm curl over incline bench
  '0423': 'Extensión de pie a una mano con mancuerna', // dumbbell standing one arm extension
  '0425': 'Curl invertido de pie a una mano con mancuerna', // dumbbell standing one arm reverse curl
  '0428': 'Curl en banco Scott de pie con mancuernas', // dumbbell standing preacher curl
  '0429': 'Curl invertido de pie con mancuernas', // dumbbell standing reverse curl
  '0430': 'Extensión de tríceps de pie con mancuernas', // dumbbell standing triceps extension
  '2293': 'Curl Zottman en banco Scott de pie con mancuernas', // dumbbell standing zottman preacher curl
  '1684': 'Subida al cajón a una pierna con curl de bíceps y mancuernas', // dumbbell step up single leg balance with bicep curl
  '0436': 'Press Tate con mancuernas', // dumbbell tate press
  '1742': 'Patada de tríceps a una pierna con mancuernas', // dumbbell tricep kickback with stork stance
  '1743': 'Press de banca con giro con mancuernas', // dumbbell twisting bench press
  '5201': 'Curl de bíceps de camarero con mancuerna', // dumbbell waiter biceps curl
  '0439': 'Curl Zottman con mancuernas', // dumbbell zottman curl
  '2294': 'Curl Zottman en banco Scott con mancuernas', // dumbbell zottman preacher curl
  '2189': 'Extensión de tríceps sentado con mancuernas (variante)', // dumbbells seated triceps extension
  '3287': 'Fondos de codos', // elbow dips
  '1744': 'Fondos sobre fitball', // exercise ball dip
  '1745': 'Estiramiento de tríceps sentado sobre fitball', // exercise ball seated triceps stretch
  '1746': 'Extensión de tríceps boca arriba sobre fitball', // exercise ball supine triceps extension
  '1747': 'Press francés sobre fitball con barra Z', // ez bar french press on exercise ball
  '1748': 'Extensión de tríceps tumbado agarre cerrado tras la cabeza con barra Z', // ez bar lying close grip triceps extension behind head
  '1682': 'Curl concentrado sentado agarre cerrado con barra Z', // ez bar seated close grip concentration curl
  '1749': 'Press francés de pie con barra Z', // ez bar standing french press
  '1627': 'Curl en banco Scott agarre cerrado con barra Z', // ez barbell close grip preacher curl
  '0446': 'Curl agarre cerrado con barra Z', // ez barbell close-grip curl
  '0447': 'Curl con barra Z', // ez barbell curl
  '0448': 'Press declinado agarre cerrado a la cara con barra Z', // ez barbell decline close grip face press
  '2186': 'Extensión de tríceps declinado con barra Z', // ez barbell decline triceps extension
  '0449': 'Extensión de tríceps inclinado con barra Z', // ez barbell incline triceps extension
  '0450': 'Press de banca JM con barra Z', // ez barbell jm bench press
  '0451': 'Curl agarre invertido con barra Z', // ez barbell reverse grip curl
  '0452': 'Curl en banco Scott agarre invertido con barra Z', // ez barbell reverse grip preacher curl
  '1458': 'Curl sentado con barra Z', // ez barbell seated curls
  '0453': 'Extensión de tríceps sentado con barra Z', // ez barbell seated triceps extension
  '0454': 'Curl araña con barra Z', // ez barbell spider curl
  '1628': 'Curl araña con barra Z (variante)', // ez barbell spider curl
  '2404': 'Curl de bíceps con barra Z (con soporte para brazos)', // ez-bar biceps curl (with arm blaster)
  '2432': 'Press de banca agarre cerrado con barra Z', // ez-bar close-grip bench press
  '2741': 'Curl de bíceps de pie agarre abierto con barra Z', // ez-barbell standing wide grip biceps curl
  '3302': 'Pino', // handstand
  '0471': 'Flexiones en pino', // handstand push-up
  '3289': 'Fondos imposibles', // impossible dips
  '0490': 'Flexiones inclinadas agarre cerrado', // incline close-grip push-up
  '0525': 'Cargada invertida con kettlebell desde colgado', // kettlebell bottoms up clean from the hang position
  '0526': 'Cargada alterna colgado con dos kettlebells', // kettlebell double alternating hang clean
  '0575': 'Curl de bíceps en máquina', // lever bicep curl
  '1615': 'Curl en banco Scott agarre martillo en máquina', // lever hammer grip preacher curl
  '0591': 'Fondos de tríceps pronados en máquina', // lever overhand triceps dip
  '1614': 'Curl en banco Scott en máquina (variante)', // lever preacher curl v. 2
  '1616': 'Curl en banco Scott agarre invertido en máquina', // lever reverse grip preacher curl
  '1451': 'Fondos sentado en máquina', // lever seated dip
  '0607': 'Extensión de tríceps en máquina', // lever triceps extension
  '1701': 'Flexiones agarre cerrado con balón medicinal', // medicine ball close grip push up
  '1750': 'Lanzamiento de pecho boca arriba con balón medicinal', // medicine ball supine chest throw
  '2328': 'Flexiones agarre cerrado sobre fitball', // narrow push-up on exercise ball
  '0636': 'Curl martillo con barra olímpica', // olympic barbell hammer curl
  '0637': 'Extensión de tríceps con barra olímpica', // olympic barbell triceps extension
  '0639': 'Fondos a una mano', // one arm dip
  '0643': 'Estiramiento de tríceps sobre la cabeza', // overhead triceps stretch
  '0660': 'Flexiones agarre cerrado sobre mancuernas', // push-up close-grip off dumbbell
  '1467': 'Flexiones sobre antebrazos', // push-up on lower arms
  '3123': 'Curl de bíceps sentado con banda elástica', // resistance band seated biceps curl
  '0672': 'Fondos inversos', // reverse dip
  '0717': 'Flexiones laterales', // side push-up
  '2142': 'Esquí ergómetro', // ski ergometer
  '1683': 'Curl de bíceps en multipower', // smith machine bicep curl
  '1625': 'Press de banca declinado agarre cerrado en multipower', // smith machine decline close grip bench press
  '1752': 'Extensión de tríceps inclinado en multipower', // smith machine incline tricep extension
  '3291': 'Press stalder', // stalder press
  '1753': 'Fondos entre tres bancos', // three bench dip
  '0814': 'Fondos de tríceps', // triceps dip
  '0812': 'Fondos de tríceps (piernas en banco)', // triceps dip (bench leg)
  '0813': 'Fondos de tríceps (entre bancos)', // triceps dip (between benches)
  '0815': 'Fondos de tríceps en el suelo', // triceps dips floor
  '0816': 'Press de tríceps', // triceps press
  '0817': 'Estiramiento de tríceps', // triceps stretch
  '0830': 'Fondos en banco con peso', // weighted bench dip
  '0847': 'Curl de bíceps sentado con peso (sobre fitball)', // weighted seated bicep curl (on stability ball)
  '0853': 'Curl de pie con peso', // weighted standing curl
  '1754': 'Fondos entre tres bancos con peso', // weighted three bench dips
  '1755': 'Fondos de tríceps con peso', // weighted tricep dips
  '1767': 'Fondos de tríceps con peso en paralelas altas', // weighted triceps dip on high parallel bars
  '1016': 'Curl de muñeca con banda', // band wrist curl
  '1411': 'Curl de muñeca pronado sobre banco con barra', // barbell palms down wrist curl over a bench
  '1412': 'Curl de muñeca supinado sobre banco con barra', // barbell palms up wrist curl over a bench
  '1415': 'Curl de muñeca neutro sentado a una mano con mancuerna', // dumbbell one arm seated neutral wrist curl
  '1421': 'Flexión modificada sobre antebrazos', // modified push up to lower arms
  '1426': 'Curl de muñeca sentado en multipower', // smith seated wrist curl
  '1428': 'Círculos de muñeca', // wrist circles
  '1437': 'Flexión de dedos con mancuernas', // dumbbell finger curls
  '1441': 'Curl de muñeca invertido sobre banco a una mano con mancuerna', // dumbbell over bench one arm reverse wrist curl
  '2288': 'Agarre de fuerza en máquina', // lever gripper hands
  '2705': 'Pronación tumbado en el suelo con mancuerna', // dumbbell lying pronation on floor
  '2706': 'Supinación tumbado en el suelo con mancuerna', // dumbbell lying supination on floor
  '0994': 'Curl de muñeca invertido con banda', // band reverse wrist curl
  '0079': 'Curl de muñeca invertido con barra (variante)', // barbell revers wrist curl v. 2
  '0104': 'Curl de muñeca de pie por detrás con barra', // barbell standing back wrist curl
  '0125': 'Curl de muñeca con barra (variante)', // barbell wrist curl v. 2
  '0210': 'Curl de muñeca invertido en polea', // cable reverse wrist curl
  '0224': 'Curl de muñeca de pie por detrás en polea', // cable standing back wrist curl
  '0347': 'Pronación tumbado con mancuerna', // dumbbell lying pronation
  '0349': 'Supinación tumbado con mancuerna', // dumbbell lying supination
  '0358': 'Curl de muñeca invertido a una mano con mancuerna', // dumbbell one arm reverse wrist curl
  '0367': 'Curl de muñeca sobre banco a una mano con mancuerna', // dumbbell over bench one arm wrist curl
  '0368': 'Curl de muñeca invertido sobre banco con mancuerna', // dumbbell over bench revers wrist curl
  '0369': 'Curl de muñeca sobre banco con mancuerna', // dumbbell over bench wrist curl
  '0399': 'Rotación sentado a una mano con mancuerna', // dumbbell seated one arm rotate
  '0401': 'Curl de muñeca supinado sentado con mancuerna', // dumbbell seated palms up wrist curl
  '0455': 'Flexión de dedos con barra', // finger curls
  '0518': 'Cargada alterna desde colgado con kettlebell', // kettlebell alternating hang clean
  '0721': 'Estiramiento lateral de muñeca', // side wrist pull stretch
  '0771': 'Curl de muñeca de pie por detrás en multipower', // smith standing back wrist curl
  '0854': 'Apriete de manos de pie con peso', // weighted standing hand squeeze
  '0859': 'Rodillo de muñeca', // wrist rollerer

  // --- legs ---
  '0043': 'Sentadilla completa con barra', // barbell full squat
  '0046': 'Sentadilla hack con barra', // barbell hack squat
  '0069': 'Sentadilla sobre la cabeza con barra', // barbell overhead squat
  '0127': 'Sentadilla Zercher con barra', // barbell zercher squat
  '0054': 'Zancadas con barra', // barbell lunge
  '0114': 'Subidas al cajón con barra', // barbell step-up
  '0044': 'Buenos días con barra', // barbell good morning
  '0088': 'Elevación de gemelos sentado con barra', // barbell seated calf raise
  '1409': 'Puente de glúteo con barra', // barbell glute bridge
  '0336': 'Zancadas con mancuernas', // dumbbell lunge
  '0381': 'Zancadas hacia atrás con mancuernas', // dumbbell rear lunge
  '0431': 'Subidas al cajón con mancuernas', // dumbbell step-up
  '1760': 'Sentadilla goblet con mancuerna', // dumbbell goblet squat
  '0291': 'Sentadilla con mancuernas', // dumbbell bench squat
  '0585': 'Extensión de cuádriceps en máquina', // lever leg extension
  '0586': 'Curl femoral tumbado en máquina', // lever lying leg curl
  '0599': 'Curl femoral sentado en máquina', // lever seated leg curl
  '0582': 'Curl femoral arrodillado en máquina', // lever kneeling leg curl
  '0605': 'Elevación de gemelos de pie en máquina', // lever standing calf raise
  '0597': 'Abducción de cadera sentado en máquina', // lever seated hip abduction
  '0598': 'Aducción de cadera sentado en máquina', // lever seated hip adduction
  '2286': 'Extensión de cadera en máquina', // lever hip extension v. 2
  '2287': 'Prensa de piernas alterna en máquina', // lever alternate leg press
  '0739': 'Prensa de piernas 45°', // sled 45в° leg press
  '0743': 'Sentadilla hack en trineo', // sled hack squat
  '0760': 'Prensa de piernas en multipower', // smith leg press
  '0755': 'Sentadilla hack en multipower', // smith hack squat
  '0168': 'Aducción de cadera en polea', // cable hip adduction
  '0228': 'Extensión de cadera de pie en polea', // cable standing hip extension
  '0130': 'Extensión de cadera en banco', // bench hip extension
  '0710': 'Abducción de cadera tumbado de lado', // side hip abduction
  '1460': 'Zancadas andando', // walking lunge
  '0549': 'Swing con kettlebell', // kettlebell swing
  '0553': 'Press militar a dos manos con kettlebell', // kettlebell two arm military press
  '0523': 'Press Arnold con kettlebell', // kettlebell arnold press
  '0534': 'Sentadilla goblet con kettlebell', // kettlebell goblet squat
  '0284': 'Elevación de gemelos burro', // donkey calf raise
  '3305': 'Thruster con barra', // barbell thruster
  '1756': 'Peso muerto a una pierna con barra', // barbell single leg deadlift
  '1757': 'Peso muerto a una pierna con mancuerna', // dumbbell single leg deadlift
  '0432': 'Peso muerto piernas rectas con mancuernas', // dumbbell stiff leg deadlift
  '1000': 'Elevación de tibiales a una pierna con banda', // band single leg reverse calf raise
  '1253': 'Elevación de gemelos burro en máquina', // lever donkey calf raise
  '1368': 'Círculos de tobillo', // ankle circles
  '1369': 'Elevación de gemelos con banda bajo los pies', // band two legs calf raise - (band under both legs) v. 2
  '1370': 'Elevación de gemelos en el suelo con barra', // barbell floor calf raise
  '1371': 'Elevación de gemelos sentado con barra (variante)', // barbell seated calf raise
  '1372': 'Elevación de gemelos de pie con barra', // barbell standing calf raise
  '1373': 'Elevación de gemelos de pie sin peso', // bodyweight standing calf raise
  '1374': 'Salto desde cajón con apoyo a una pierna', // box jump down with one leg stabilization
  '1375': 'Elevación de gemelos de pie en polea', // cable standing calf raise
  '1376': 'Elevación de gemelos de pie a una pierna en polea', // cable standing one leg calf raise
  '1377': 'Estiramiento de gemelos con las manos en la pared', // calf stretch with hands against wall
  '1378': 'Estiramiento de gemelos con cuerda', // calf stretch with rope
  '1379': 'Elevación de gemelos sentado con mancuernas', // dumbbell seated calf raise
  '1380': 'Elevación de gemelos sentado a una pierna con mancuerna y agarre neutro', // dumbbell seated one leg calf raise - hammer grip
  '1381': 'Elevación de gemelos sentado a una pierna con mancuerna y palma arriba', // dumbbell seated one leg calf raise - palm up
  '1382': 'Elevación de gemelos contra la pared con fitball', // exercise ball on the wall calf raise
  '1383': 'Elevación de gemelos en máquina hack', // hack calf raise
  '1384': 'Elevación de gemelos a una pierna en máquina hack', // hack one leg calf raise
  '1385': 'Elevación de gemelos sentado en prensa de piernas', // lever seated squat calf raise on leg press machine
  '1386': 'Elevación de gemelos burro a una pierna', // one leg donkey calf raise
  '1387': 'Elevación de gemelos a una pierna en el suelo', // one leg floor calf raise
  '1388': 'Estiramiento de peroneos', // peroneals stretch
  '1389': 'Estiramiento del tibial posterior', // posterior tibialis stretch
  '1390': 'Estiramiento de gemelos sentado', // seated calf stretch (male)
  '1391': 'Press de gemelos en prensa de piernas', // sled calf press on leg press
  '1392': 'Press de gemelos a una pierna en prensa de piernas', // sled one leg calf press on leg press
  '1393': 'Elevación de gemelos a una pierna en el suelo en multipower', // smith one leg floor calf raise
  '1394': 'Elevación de tibiales en multipower (variante)', // smith reverse calf raises
  '1395': 'Elevación de gemelos sentado a una pierna en multipower', // smith seated one leg calf raise
  '1396': 'Elevación de puntas en multipower', // smith toe raise
  '1397': 'Gemelos de pie', // standing calves
  '1398': 'Estiramiento de gemelos de pie', // standing calves calf stretch
  '1407': 'Estiramiento de gemelos empujando contra la pared', // calf push stretch with hands against wall
  '1490': 'Elevación de gemelos de pie en un escalón', // standing calf raise (on a staircase)
  '1708': 'Estiramiento de gemelos tumbado asistido', // assisted lying calves stretch
  '2289': 'Press de gemelos en máquina', // lever calf press
  '2315': 'Elevación de gemelos rotatoria en máquina', // lever rotary calf
  '2334': 'Press de gemelos tumbado en trineo', // sled lying calf press
  '2335': 'Press de gemelos sentado en máquina', // lever seated calf press
  '3240': 'Elevación de gemelos contra la pared con fitball y pelota entre las rodillas', // exercise ball on the wall calf raise (tennis ball between knees)
  '3241': 'Elevación de gemelos contra la pared con fitball y pelota entre los tobillos', // exercise ball on the wall calf raise (tennis ball between ankles)
  '0999': 'Elevación de gemelos a una pierna con banda', // band single leg calf raise
  '0108': 'Elevación de gemelos de pie a una pierna con barra', // barbell standing leg calf raise
  '0111': 'Elevación de gemelos con balanceo a una pierna y barra', // barbell standing rocking leg calf raise
  '0257': 'Estiramiento de rodilla en círculos', // circles knee stretch
  '0400': 'Elevación de gemelos sentado a una pierna con mancuerna', // dumbbell seated one leg calf raise
  '0409': 'Elevación de gemelos a una pierna con mancuerna', // dumbbell single leg calf raise
  '0417': 'Elevación de gemelos de pie con mancuernas', // dumbbell standing calf raise
  '0594': 'Elevación de gemelos sentado en máquina', // lever seated calf raise
  '0727': 'Elevación de gemelos a una pierna sobre una mancuerna', // single leg calf raise (on a dumbbell)
  '0738': 'Press de gemelos en prensa de 45°', // sled 45в° calf press
  '0742': 'Elevación de gemelos inclinado en trineo', // sled forward angled calf raise
  '0763': 'Elevación de tibiales en multipower', // smith reverse calf raises
  '0773': 'Elevación de gemelos de pie a una pierna en multipower', // smith standing leg calf raise
  '0833': 'Elevación de gemelos burro con peso', // weighted donkey calf raise
  '1001': 'Sentadilla split a una pierna con banda', // band single leg split squat
  '1003': 'Sentadilla y remo con banda', // band squat row
  '1004': 'Sentadilla con banda', // band squat
  '1008': 'Subidas al cajón con banda', // band step-up
  '1009': 'Peso muerto piernas rectas con banda', // band stiff leg deadlift
  '1023': 'Peso muerto piernas rectas con espalda recta y banda', // band straight back stiff leg deadlift
  '1408': 'Elevación de cadera con banda', // band hip lift
  '1410': 'Zancadas laterales con barra', // barbell lateral lunge
  '1416': 'Rotación de tren inferior boca abajo a una pierna con fitball', // exercise ball one leg prone lower body rotation
  '1417': 'Curl femoral con patada diagonal a una pierna con fitball', // exercise ball one legged diagonal kick hamstring curl
  '1418': 'Rodillas al pecho abrazadas', // hug keens to chest
  '1419': 'Estiramiento de cruz', // iron cross stretch
  '1420': 'Sentadilla con salto de rodillas con barra', // kneeling jump squat
  '1422': 'Inclinación de pelvis a puente', // pelvic tilt into bridge
  '1423': 'Hiperextensión inversa en banco plano', // reverse hyper on flat bench
  '1424': 'Estiramiento de glúteos sentado', // seated glute stretch
  '1425': 'Prensa de piernas 45° a una pierna en trineo', // sled 45 degrees one leg press
  '1427': 'Abductor de cadera con pierna recta', // straight leg outer hip abductor
  '1433': 'Sentadilla frontal en multipower (agarre de cargada)', // smith front squat (clean grip)
  '1434': 'Sentadilla con barra baja en multipower', // smith low bar squat
  '1435': 'Sentadilla con barra baja', // barbell low bar squat
  '1436': 'Sentadilla con barra alta', // barbell high bar squat
  '1461': 'Sentadilla completa con barra (vista trasera)', // barbell full squat (back pov)
  '1462': 'Sentadilla completa con barra (vista lateral)', // barbell full squat (side pov)
  '1463': 'Prensa de piernas 45° en trineo (vista lateral)', // sled 45° leg press (side pov)
  '1464': 'Prensa de piernas 45° en trineo (vista trasera)', // sled 45в° leg press (back pov)
  '1466': 'Elevación de cadera con giro', // twist hip lift
  '1472': 'Salto hacia delante', // forward jump
  '1473': 'Salto hacia atrás', // backward jump
  '1476': 'Sentadilla a una pierna', // one leg squat
  '1489': 'Sentadilla sissy', // sissy squat
  '1494': 'Postura de mariposa de yoga', // butterfly yoga pose
  '1511': 'Estiramiento de isquiotibiales', // hamstring stretch
  '1512': 'Estiramiento en cuadrupedia', // all fours squad stretch
  '1545': 'Sentadilla Zercher completa con barra', // barbell full zercher squat
  '1548': 'Estiramiento de pierna extendida en silla', // chair leg extended stretch
  '1559': 'Estiramiento de flexores de cadera con fitball', // exercise ball hip flexor stretch
  '1560': 'Estiramiento de isquiotibiales sentado con fitball', // exercise ball seated hamstring stretch
  '1564': 'Estiramiento de flexores de cadera y cuádriceps intermedio', // intermediate hip flexor and quad stretch
  '1576': 'Estiramiento de isquiotibiales con pierna elevada', // leg up hamstring stretch
  '1582': 'Postura del dedo gordo reclinado con cuerda', // reclining big toe pose with rope
  '1585': 'Estiramiento del corredor', // runners stretch
  '1587': 'Secuencia de postura sentado con piernas abiertas', // seated wide angle pose sequence
  '1599': 'Estiramiento de isquiotibiales y gemelos de pie con correa', // standing hamstring and calf stretch with strap
  '1604': 'El mejor estiramiento del mundo', // world greatest stretch
  '1685': 'Sentadilla con alcance por encima de la cabeza', // squat to overhead reach
  '1686': 'Sentadilla con alcance y giro por encima de la cabeza', // squat to overhead reach with twist
  '1705': 'Sentadilla sobre bosu', // squat on bosu ball
  '1709': 'Estiramiento de glúteos tumbado asistido', // assisted lying glutes stretch
  '1710': 'Estiramiento de glúteo y piriforme tumbado asistido', // assisted lying gluteus and piriformis stretch
  '1712': 'Estiramiento de aductores tumbado de lado asistido', // assisted side lying adductor stretch
  '1713': 'Estiramiento de cuádriceps boca abajo asistido', // assisted prone lying quads stretch
  '1759': 'Sentadilla a una pierna (pistol)', // single leg squat (pistol) male
  '1766': 'Curl femoral inverso autoasistido (variante)', // self assisted inverse leg curl
  '1774': 'Puente lateral con abducción de cadera', // side bridge hip abduction
  '1775': 'Plancha lateral con aducción de cadera', // side plank hip adduction
  '2202': 'Estiramiento de cadera con rodillo', // roller hip stretch
  '2205': 'Estiramiento de cadera y dorsal con rodillo', // roller hip lat stretch
  '2368': 'Sentadillas split', // split squats
  '2400': 'Curl femoral inverso en máquina de jalón', // inverse leg curl (on pull-up cable machine)
  '2459': 'Volteo de neumático', // tire flip
  '2567': 'Estiramiento del piriforme sentado', // seated piriformis stretch
  '2571': 'Estiramiento de rana con balanceo', // rocking frog stretch
  '2611': 'Prensa de piernas horizontal a una pierna en máquina', // lever horizontal one leg press
  '2796': 'Subidas al cajón con zancada y mancuernas', // dumbbell step-up lunge
  '2798': 'Sentadilla con salto, paso y zancada atrás con barra', // barbell squat jump step rear lunge
  '2803': 'Sentadilla asistida con mancuernas', // dumbbell supported squat
  '2805': 'Peso muerto a una pierna con mancuerna y apoyo en cajón', // dumbbell single leg deadlift with stepbox support
  '2808': 'Pull through sumo con mancuerna', // dumbbell sumo pull through
  '2810': 'Sentadilla split con barra', // barbell split squat v. 2
  '2812': 'Sentadilla split con subida al cajón y mancuernas', // dumbbell step-up split squat
  '3006': 'Abducción de cadera sentado con banda elástica', // resistance band seated hip abduction
  '3007': 'Extensión de piernas con banda elástica', // resistance band leg extension
  '3013': 'Puente de glúteos bajo en el suelo', // low glute bridge on floor
  '3132': 'Cuclillas profundas con apoyo', // potty squat with support
  '3142': 'Sentadilla sumo en multipower', // smith sumo squat
  '3193': 'Elevación de glúteo e isquiotibial', // glute-ham raise
  '3194': 'Sentadilla Frankenstein con barra', // frankenstein squat
  '3195': 'Curl femoral tumbado a una y dos piernas en máquina', // lever lying two-one leg curl
  '3212': 'Toques de pie básicos', // basic toe touch (male)
  '3214': 'Toques de pie en círculo con brazos abiertos', // arms apart circular toe touch (male)
  '3215': 'Toques de pie en círculo con manos entrelazadas al revés', // hands reversed clasped circular toe touch (male)
  '3218': 'Toques de pie en círculo con manos entrelazadas', // hands clasped circular toe touch (male)
  '3235': 'Curl femoral inverso asistido en polea', // cable assisted inverse leg curl
  '3236': 'Empuje de cadera de rodillas con banda elástica', // resistance band hip thrusts on knees (female)
  '3281': 'Sentadilla completa en multipower', // smith full squat
  '3433': 'Pataleo de nadador', // swimmer kicks v. 2 (male)
  '3470': 'Zancadas al frente', // forward lunge (male)
  '3523': 'Puente de glúteos a dos piernas en banco', // glute bridge two legs on bench (male)
  '3533': 'Cuádriceps', // quads
  '3543': 'Sentadilla con caída y salto sin peso', // bodyweight drop jump squat
  '3552': 'Pies rápidos', // quick feet v. 2
  '3561': 'Puente de glúteos con marcha', // glute bridge march
  '3562': 'Puente de glúteos a dos piernas en banco con barra', // barbell glute bridge two legs on bench (male)
  '3582': 'Zancadas con salto', // lunge with jump
  '3635': 'Zancada al frente contralateral con mancuernas', // dumbbell contralateral forward lunge
  '3639': 'Giro tumbado con rodillas flexionadas', // bent knee lying twist (male)
  '3642': 'Zancadas con estiramiento y peso', // weighted stretch lunge
  '3643': 'Sentadilla cosaca con peso', // weighted cossack squats (male)
  '3644': 'Zancadas con balanceo y peso', // weighted lunge with swing
  '3645': 'Puente a una pierna con la otra extendida', // single leg bridge with outstretched leg
  '3662': 'Flexión de pike a cobra', // pike-to-cobra push-up
  '3667': 'Aducción de cadera tumbado de lado', // side lying hip adduction (male)
  '3769': 'Sentadilla con reverencia', // curtsey squat
  '3888': 'Arrancada a una mano con mancuerna', // dumbbell one arm snatch
  '0016': 'Estiramiento de isquiotibiales boca abajo asistido', // assisted prone hamstring
  '0020': 'Tabla de equilibrio', // balance board
  '0980': 'Extensión de cadera inclinado con banda', // band bent-over hip extension
  '0984': 'Rotación interna de cadera tumbado con banda', // band lying hip internal rotation
  '0987': 'Sentadilla split a una pierna con banda y apoyo a una mano', // band one arm single leg split squat
  '0991': 'Pull through con banda', // band pull through
  '0996': 'Rotación interna de cadera sentado con banda', // band seated hip internal rotation
  '0024': 'Sentadilla frontal al banco con barra', // barbell bench front squat
  '0026': 'Sentadilla al banco con barra', // barbell bench squat
  '0028': 'Cargada y press con barra', // barbell clean and press
  '0029': 'Sentadilla frontal con agarre de cargada y barra', // barbell clean-grip front squat
  '0039': 'Sentadilla al pecho con barra', // barbell front chest squat
  '0051': 'Sentadilla Jefferson con barra', // barbell jefferson squat
  '0053': 'Sentadilla con salto y barra', // barbell jump squat
  '0058': 'Elevación tumbado con barra (sobre la cadera)', // barbell lying lifting (on hip)
  '0063': 'Sentadilla con pies juntos y barra', // barbell narrow stance squat
  '0066': 'Peso muerto lateral a una mano con barra', // barbell one arm side deadlift
  '0068': 'Sentadilla a una pierna con barra', // barbell one leg squat
  '0078': 'Zancadas hacia atrás con barra', // barbell rear lunge
  '0077': 'Zancadas hacia atrás con barra (variante)', // barbell rear lunge v. 2
  '0090': 'Buenos días sentado con barra', // barbell seated good morning
  '0098': 'Sentadilla split lateral con barra', // barbell side split squat
  '0097': 'Sentadilla split lateral con barra (variante)', // barbell side split squat v. 2
  '0099': 'Sentadilla split a una pierna con barra', // barbell single leg split squat
  '0101': 'Sentadilla rápida con barra', // barbell speed squat
  '0102': 'Sentadilla de rodillas con barra', // barbell squat (on knees)
  '0115': 'Buenos días piernas rectas con barra', // barbell stiff leg good morning
  '0124': 'Sentadilla con pies abiertos y barra', // barbell wide squat
  '0196': 'Pull through en polea con cuerda', // cable pull through (with rope)
  '0295': 'Cargada con mancuernas', // dumbbell clean
  '0339': 'Curl femoral tumbado con mancuerna', // dumbbell lying femoral
  '0371': 'Sentadilla pliométrica con mancuernas', // dumbbell plyo squat
  '0410': 'Sentadilla split a una pierna con mancuernas', // dumbbell single leg split squat
  '0411': 'Sentadilla a una pierna con mancuernas', // dumbbell single leg squat
  '0413': 'Sentadilla de pie con mancuernas', // dumbbell squat
  '0434': 'Peso muerto piernas rectas con mancuernas (variante)', // dumbbell straight leg deadlift
  '0459': 'Pataleo alterno', // flutter kicks
  '0496': 'Curl femoral inverso (con apoyo en banco)', // inverse leg curl (bench support)
  '0514': 'Sentadilla con salto', // jump squat
  '0513': 'Sentadilla con salto (variante)', // jump squat v. 2
  '0533': 'Sentadilla frontal con kettlebell', // kettlebell front squat
  '0535': 'Cargada desde colgado con kettlebell', // kettlebell hang clean
  '0536': 'Zancada con paso de kettlebell', // kettlebell lunge pass through
  '0544': 'Sentadilla pistola con kettlebell', // kettlebell pistol squat
  '0551': 'Levantamiento turco con kettlebell (estilo sentadilla)', // kettlebell turkish get up (squat style)
  '0555': 'Sentado con patada al frente', // kick out sit
  '0613': 'Estiramiento de cuádriceps tumbado de lado', // lying (side) quads stretch
  '0624': 'Sentado con marcha (contra la pared)', // march sit (wall)
  '0628': 'Paso del monstruo', // monster walk
  '0642': 'Flexión con patada de pierna hacia fuera', // outside leg kick push-up
  '0648': 'Cargada de potencia', // power clean
  '0661': 'Flexión con patada de pierna hacia dentro', // push-up inside leg kick
  '0668': 'Puente declinado hacia atrás', // rear decline bridge
  '0675': 'Hiperextensión inversa sobre fitball', // reverse hyper extension (on stability ball)
  '0697': 'Curl femoral inverso autoasistido', // self assisted inverse leg curl
  '0696': 'Curl femoral inverso autoasistido en el suelo', // self assisted inverse leg curl (on floor)
  '0730': 'Deslizamiento en plataforma a una pierna', // single leg platform slide
  '0740': 'Prensa de piernas 45° abierta en trineo', // sled 45в° leg wide press
  '0741': 'Sentadilla hack cerrada en trineo', // sled closer hack squat
  '0744': 'Sentadilla tumbado en trineo', // sled lying squat
  '0749': 'Buenos días con rodillas flexionadas en multipower', // smith bent knee good morning
  '0750': 'Sentadilla a la silla en multipower', // smith chair squat
  '0768': 'Sentadilla split a una pierna en multipower', // smith single leg split squat
  '0769': 'Zancadas de sprint en multipower', // smith sprint lunge
  '0770': 'Sentadilla en multipower', // smith squat
  '0776': 'Tirón de arrancada', // snatch pull
  '0778': 'Flexión con desplazamiento en araña', // spider crawl push up
  '0786': 'Jerk en sentadilla con barra', // squat jerk
  '0795': 'Curl femoral de pie a una pierna', // standing single leg curl
  '0809': 'Sentadilla split en suspensión', // suspended split squat
  '0811': 'Peso muerto con barra hexagonal', // trap bar deadlift
  '0851': 'Sentadilla sissy con peso', // weighted sissy squat
  '0852': 'Sentadilla con peso', // weighted squat

  // --- core ---
  '0472': 'Elevación de piernas colgado', // hanging leg raise
  '0689': 'Elevación de piernas sentado', // seated leg raise
  '2802': 'Elevación de piernas con giro', // twisted leg raise
  '0274': 'Abdominales en el suelo', // crunch floor
  '0267': 'Abdominales con brazos extendidos', // crunch (hands overhead)
  '0277': 'Abdominales declinado', // decline crunch
  '0735': 'Abdominales completos', // sit-up v. 2
  '0001': 'Abdominales 3/4', // 3/4 sit-up
  '0687': 'Giro ruso', // russian twist
  '0846': 'Giro ruso con peso', // weighted russian twist
  '0175': 'Abdominales arrodillado en polea', // cable kneeling crunch
  '0226': 'Abdominales de pie en polea', // cable standing crunch
  '0212': 'Abdominales sentado en polea', // cable seated crunch
  '0242': 'Abdominales invertidos en polea', // cable tuck reverse crunch
  '0222': 'Inclinaciones laterales en polea', // cable side bend
  '0223': 'Abdominales laterales en polea', // cable side crunch
  '0276': 'Dead bug', // dead bug
  '0630': 'Escaladores', // mountain climber
  '1160': 'Burpee', // burpee
  '0857': 'Rueda abdominal', // wheel rollerout
  '0796': 'Rueda abdominal de pie', // standing wheel rollerout
  '0084': 'Rueda abdominal con barra', // barbell rollerout
  '0128': 'Cuerdas de batalla', // battling ropes
  '2133': 'Paseo del granjero', // farmers walk
  '0003': 'Bicicleta de aire', // air bike
  '2141': 'Caminar en elíptica', // walk elliptical cross trainer
  '2311': 'Caminar en escalera mecánica', // walking on stepmill
  '1002': 'Elevación de piernas rectas tumbado con banda', // band lying straight leg raise
  '1005': 'Abdominales de pie con banda', // band standing crunch
  '1007': 'Abdominales de pie con giro y banda', // band standing twisting crunch
  '1011': 'Giro sentado con banda', // band seated twist
  '1014': 'Abdominales en V con banda', // band v-up
  '1015': 'Press Pallof vertical con banda', // band vertical pallof press
  '1452': 'Abdominales sentado en máquina', // lever seated crunch
  '1468': 'Toque de pie en cangrejo con giro', // crab twist toe touch
  '1471': 'Gusano', // inchworm
  '1495': 'Abdominales oblicuos', // oblique crunch v. 2
  '1496': 'Golpeo con mazo', // sledge hammer
  '1687': 'Paso atrás con alcance por encima de la cabeza', // posterior step to overhead reach
  '1688': 'Zancada con giro', // lunge with twist
  '1707': 'Giro boca abajo sobre fitball', // prone twist on stability ball
  '1714': 'Estiramiento del recto femoral boca abajo asistido', // assisted prone rectus femoris stretch
  '1758': 'Abdominales completos asistidos', // assisted sit-up
  '1761': 'Elevación de rodillas oblicua colgado', // hanging oblique knee raise
  '1764': 'Elevación de cadera y piernas colgado', // hanging leg hip raise
  '2204': 'Sierra corporal con rueda', // roller body saw
  '2206': 'Abdominales invertidos con rueda', // roller reverse crunch
  '2297': 'Abdominales sobre fitball con manos en la nuca', // stability ball crunch (full range hands behind head)
  '2312': 'Codo a rodilla tumbado', // lying elbow to knee
  '2329': 'Giro de columna', // spine twist
  '2333': 'Balanceo de brazos colgado con piernas rectas', // arm slingers hanging straight legs
  '2355': 'Balanceo de brazos colgado con rodillas flexionadas', // arm slingers hanging bent knee legs
  '2371': 'Giro ruso con peso (variante)', // weighted russian twist v. 2
  '2399': 'Giro sentado en polea', // cable seated twist
  '2429': 'Abdominales rana', // frog crunch
  '2466': 'Puente con escaladores cruzados', // bridge - mountain climber (cross body)
  '2799': 'Elevación alterna de piernas sentado con barra', // barbell sitted alternate leg raise
  '2800': 'Elevación alterna de piernas sentado con barra (variante)', // barbell sitted alternate leg raise (female)
  '2801': 'Elevación de piernas con giro (variante)', // twisted leg raise (female)
  '2963': 'Elevación de piernas rectas en silla romana', // captains chair straight leg raise
  '3016': 'Curl abdominal', // curl-up
  '3119': 'Cuclillas profundas', // potty squat
  '3147': 'Inclinación de pelvis', // pelvic tilt
  '3201': 'Abdominales muy cortos', // quarter sit-up
  '3202': 'Abdominales cortos', // half sit-up (male)
  '3203': 'Abdominales cortos con manos en la nuca', // prisoner half sit-up (male)
  '3204': 'Abdominales completos con brazos por encima de la cabeza', // arms overhead full sit-up (male)
  '3213': 'Toques de pie a los lados', // side-to-side toe touch (male)
  '3239': 'Plancha arrodillado con toque de hombro', // kneeling plank tap shoulder (male)
  '3296': 'Palanca frontal', // front lever
  '3298': 'Plancha abierta', // straddle planche
  '3299': 'Plancha completa', // full planche
  '3300': 'Plancha inclinada', // lean planche
  '3301': 'Plancha rana', // frog planche
  '3303': 'Bandera humana', // flag
  '3314': 'Maltesa abierta', // straddle maltese
  '3315': 'Maltesa completa', // full maltese
  '3419': 'L-sit en el suelo', // l-sit on floor
  '3420': 'V-sit en el suelo', // v-sit on floor
  '3640': 'Abdominales tocando rodillas', // knee touch crunch
  '3663': 'Plancha invertida con elevación de pierna', // reverse plank with leg lift
  '3665': 'Plancha power point', // power point plank
  '3670': 'Abdominales completos declinado con peso', // weighted decline sit-up
  '3679': 'Abdominales completos con brazos cruzados', // sit-up with arms on chest
  '3698': 'Gusano (variante)', // inchworm v. 2
  '3699': 'Toque de hombro en plancha', // shoulder tap
  '3760': 'Abdominales sentado en máquina (variante)', // lever seated crunch v. 2
  '0002': 'Inclinaciones laterales a 45°', // 45° side bend
  '0006': 'Toques alternos de talón', // alternate heel touchers
  '0011': 'Elevación de rodillas colgado asistida', // assisted hanging knee raise
  '0010': 'Elevación de rodillas colgado asistida con lanzamiento', // assisted hanging knee raise with throw down
  '0012': 'Elevación de piernas tumbado asistida con lanzamiento lateral', // assisted lying leg raise with lateral throw down
  '0013': 'Elevación de piernas tumbado asistida con lanzamiento', // assisted lying leg raise with throw down
  '0014': 'Giro ruso con movimiento asistido', // assisted motion russian twist
  '0969': 'Abdominales en V alternos con banda', // band alternating v-up
  '0971': 'Rueda abdominal asistida con banda', // band assisted wheel rollerout
  '0972': 'Abdominales en bicicleta con banda', // band bicycle crunch
  '0979': 'Press Pallof horizontal con banda', // band horizontal pallof press
  '0981': 'Abdominales completos en navaja con banda', // band jack knife sit-up
  '0985': 'Abdominales arrodillado con giro y banda', // band kneeling twisting crunch
  '0992': 'Abdominales completos con empuje de banda', // band push sit-up
  '0071': 'Abdominales completos con press de barra', // barbell press sit-up
  '0083': 'Rueda abdominal desde banco con barra', // barbell rollerout from bench
  '0094': 'Giro sentado con barra', // barbell seated twist
  '0096': 'Inclinaciones laterales con barra', // barbell side bent v. 2
  '0103': 'Rueda abdominal de pie con barra', // barbell standing ab rollerout
  '0112': 'Giro de pie con barra', // barbell standing twist
  '0138': 'Levantamiento de cadera desde sentado', // bottoms-up
  '0870': 'Elevación de glúteos', // butt-ups
  '0174': 'Volteo de judo en polea', // cable judo flip
  '0873': 'Abdominales invertidos tumbado en polea', // cable reverse crunch
  '0211': 'Giro ruso sobre fitball en polea', // cable russian twists (on stability ball)
  '0221': 'Inclinaciones laterales sobre bosu en polea', // cable side bend crunch (bosu ball)
  '0874': 'Abdominales de pie en polea con cuerda', // cable standing crunch (with rope attachment)
  '0230': 'Elevación de pie en polea', // cable standing lift
  '0243': 'Giro en polea', // cable twist
  '0862': 'Giro en polea (arriba-abajo)', // cable twist (up-down)
  '0260': 'Abdominales en capullo', // cocoons
  '0262': 'Abdominales cruzados', // cross body crunch
  '0271': 'Abdominales sobre fitball', // crunch (on stability ball)
  '0272': 'Abdominales sobre fitball con brazos extendidos', // crunch (on stability ball, arms straight)
  '0282': 'Abdominales completos declinado', // decline sit-up
  '0407': 'Inclinaciones laterales con mancuerna', // dumbbell side bend
  '0443': 'Codo a rodilla', // elbow-to-knee
  '0456': 'Abdominales con piernas flexionadas', // flexion leg sit up (bent knee)
  '0457': 'Abdominales con brazos rectos', // flexion leg sit up (straight arm)
  '0464': 'Plancha frontal con giro', // front plank with twist
  '0467': 'Dominada gorila', // gorilla chin
  '0469': 'Abdominales con rodillas hacia fuera', // groin crunch
  '0473': 'Pike colgado', // hanging pike
  '0474': 'Elevación de cadera con piernas rectas colgado', // hanging straight leg hip raise
  '0475': 'Elevación de piernas rectas colgado', // hanging straight leg raise
  '0476': 'Elevación de cadera y piernas rectas con giro colgado', // hanging straight twisting leg hip raise
  '0484': 'Elevación de cadera con rodillas flexionadas', // hip raise (bent knee)
  '0491': 'Elevación de cadera y piernas rectas en banco inclinado', // incline leg hip raise (leg straight)
  '0495': 'Abdominales completos con giro en banco inclinado', // incline twisting sit-up
  '0507': 'Abdominales completos en navaja', // jackknife sit-up
  '0508': 'Abdominales completos Janda', // janda sit-up
  '0517': 'Molino avanzado con kettlebell', // kettlebell advanced windmill
  '0524': 'Bent press con kettlebell', // kettlebell bent press
  '0530': 'Molino doble con kettlebell', // kettlebell double windmill
  '0532': 'Ocho con kettlebell', // kettlebell figure 8
  '0554': 'Molino con kettlebell', // kettlebell windmill
  '0562': 'Rotación landmine 180', // landmine 180
  '0570': 'Recogida de piernas en banco plano', // leg pull in flat bench
  '0583': 'Giro arrodillado en máquina', // lever kneeling twist
  '0595': 'Abdominales sentado en máquina con apoyo de pecho', // lever seated crunch (chest pad)
  '0600': 'Abdominales sentado con elevación de piernas en máquina', // lever seated leg raise crunch
  '0620': 'Elevación de piernas tumbado en banco plano', // lying leg raise flat bench
  '0865': 'Elevación de cadera y piernas tumbado', // lying leg-hip raise
  '0634': 'Abdominales negativos', // negative crunch
  '0635': 'Abdominales oblicuos en el suelo', // oblique crunches floor
  '0640': 'Golpe con balón medicinal a una mano', // one arm slam (with medicine ball)
  '0641': 'Abdominales Otis', // otis up
  '0650': 'Recogida de piernas sobre fitball', // pull-in (on stability ball)
  '0664': 'Flexión a plancha lateral', // push-up to side plank
  '0872': 'Abdominales invertidos', // reverse crunch
  '0691': 'Abdominales laterales sentado (contra la pared)', // seated side crunch (wall)
  '0705': 'Puente lateral', // side bridge v. 2
  '0709': 'Elevación lateral de cadera en paralelas', // side hip (on parallel bars)
  '0756': 'Elevación de cadera en multipower', // smith hip raise
  '0777': 'Hechicero', // spell caster
  '0805': 'Extensión abdominal en suspensión', // suspended abdominal fallout
  '0807': 'Abdominales invertidos en suspensión', // suspended reverse crunch
  '0871': 'Abdominales encogido', // tuck crunch
  '0826': 'Elevación de piernas rectas en paralelas', // vertical leg raise (on parallel bars)
  '0832': 'Abdominales con peso', // weighted crunch
  '0866': 'Elevación de cadera y piernas colgado con peso', // weighted hanging leg-hip raise
  '0840': 'Abdominales sobre fitball con peso por encima de la cabeza', // weighted overhead crunch (on stability ball)
  '0845': 'Giro ruso con piernas levantadas y peso', // weighted russian twist (legs up)
  '0849': 'Giro sentado con peso sobre fitball', // weighted seated twist (on stability ball)
  '0850': 'Inclinaciones laterales con peso sobre fitball', // weighted side bend (on stability ball)
  '0858': 'Sprints', // wind sprints

  // --- cardio ---

  // --- neck ---
  '1403': 'Estiramiento lateral de cuello', // neck side stretch
  '0716': 'Estiramiento de cuello con empuje lateral', // side push neck stretch
  '1201': 'Burpee con mancuernas', // dumbbell burpee
  '2138': 'Bicicleta estática a ritmo de carrera', // stationary bike run v. 3
  '2331': 'Bicicleta elíptica', // cycle cross trainer
  '2612': 'Salto con comba', // jump rope
  '3219': 'Saltos en tijera', // scissor jumps (male)
  '3220': 'Saltos a horcajadas', // astride jumps (male)
  '3221': 'Media sentadilla', // half knee bends (male)
  '3222': 'Salto en media sentadilla', // semi squat jump (male)
  '3223': 'Salto de estrella', // star jump (male)
  '3224': 'Salto en tijera', // jack jump (male)
  '3318': 'Balanceo 360', // swing 360
  '3360': 'Paso del oso', // bear crawl
  '3361': 'Saltos de patinador', // skater hops
  '3636': 'Rodillas altas contra la pared', // high knee against wall
  '3637': 'Carrera con rueda', // wheel run
  '3638': 'Empuje y carrera', // push to run
  '3655': 'Zancada caminando con rodillas altas', // walking high knees lunge
  '3656': 'Carrera de zancada corta', // short stride run
  '3666': 'Caminata en cinta inclinada', // walking on incline treadmill
  '3671': 'Paso de esquí', // ski step
  '3672': 'Paso adelante y atrás', // back and forth step
  '0501': 'Burpee con tijeras', // jack burpee
  '0685': 'Carrera', // run
  '0684': 'Carrera con equipo', // run (equipment)
  '0798': 'Bicicleta estática a ritmo suave', // stationary bike walk
}
