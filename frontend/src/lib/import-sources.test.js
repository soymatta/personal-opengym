import { describe, it, expect } from 'vitest'
import {
  parseCSV, detectSource, matchExercise, parseWhen,
  parseWorkoutCSV, parseBodyweight, parseImport, mergeImport,
} from './import-csv.js'

// Headers exactly as the apps write them (see import-effort.test.js for the trimmed set).
const HEVY = 'title,start_time,end_time,exercise_title,set_index,set_type,weight_kg,reps,rpe'
const STRONG = 'Date,Workout Name,Exercise Name,Set Order,Weight,Reps,Seconds,RPE'
const FITNOTES = 'Date,Exercise,Category,Weight,Reps,Distance,Distance Unit,Time'
const FITNOTES_IOS = 'Date,Exercise,Kind,Weight,Weight Unit,Reps'

const csv = rows => rows.join('\n')
const parse = (text, opts) => parseWorkoutCSV(text, opts)

describe('reading a CSV file', () => {
  it('keeps commas inside quotes and unescapes doubled quotes', () => {
    expect(parseCSV('a,b\n"x, y",z\n"He said ""hi""",w')).toEqual([
      ['a', 'b'], ['x, y', 'z'], ['He said "hi"', 'w'],
    ])
  })

  it('takes CRLF, a BOM and blank lines without inventing empty rows', () => {
    expect(parseCSV('\ufeffa,b\r\n1,2\r\n\r\n')).toEqual([['a', 'b'], ['1', '2']])
  })
})

describe('naming the app the file came from', () => {
  it('recognises the four mainstream exporters', () => {
    expect(detectSource(HEVY.split(','))).toBe('Hevy')
    expect(detectSource(STRONG.split(','))).toBe('Strong')
    expect(detectSource(FITNOTES.split(','))).toBe('FitNotes')
    expect(detectSource(FITNOTES_IOS.split(','))).toBe('FitNotes (iOS)')
  })

  it('returns null rather than guessing at an unknown header', () => {
    expect(detectSource(['Date', 'Thing'])).toBeNull()
  })
})

describe('matching a foreign exercise name to the dataset', () => {
  it('resolves the names the exporters actually write', () => {
    expect(matchExercise('Bench Press (Barbell)')).toBe('0025')
    expect(matchExercise('Squat (Barbell)')).toBe('0043')
    expect(matchExercise('Lat Pulldown')).toBe('2330')      // the curated alias
    // A qualifier the alias table does not carry stops it firing: the bag is then
    // "cable lat pulldown", and the closest dataset name that contains all three words
    // is a different lat pulldown. Same movement, so the sets still land on the back.
    expect(matchExercise('Lat Pulldown (Cable)')).toBe('0197')
  })

  it('expands the shorthand before matching', () => {
    expect(matchExercise('BB Bench Press')).toBe('0025')
    expect(matchExercise('OHP')).toBe('0091')
  })

  it('leaves a name it cannot place to the user instead of guessing', () => {
    expect(matchExercise('Zercher Zotz Machine Thing')).toBeNull()
    expect(matchExercise('')).toBeNull()
  })
})

describe('reading a date out of another app', () => {
  it('reads the ISO, two long-form and the numeric spellings', () => {
    expect(parseWhen('2020-12-30 18:51:52')).toEqual({ d: '2020-12-30', t: 18 * 3600000 + 51 * 60000 })
    expect(parseWhen('22 Dec 2025, 08:00')).toEqual({ d: '2025-12-22', t: 8 * 3600000 })
    expect(parseWhen('Dec 22, 2025')).toEqual({ d: '2025-12-22', t: null })
    expect(parseWhen('2024-03-07')).toEqual({ d: '2024-03-07', t: null })
  })

  it('reads an ambiguous numeric date day-first, and a US one correctly', () => {
    // FitNotes/Strong/Hevy write unambiguous dates, so a bare "07/03" came from a
    // spreadsheet — European, i.e. day first.
    expect(parseWhen('07/03/2024').d).toBe('2024-03-07')
    expect(parseWhen('13/03/2024').d).toBe('2024-03-13')
    // …but a day that cannot be a month settles it, whichever way round it was written.
    expect(parseWhen('03/13/2024').d).toBe('2024-03-13')
  })

  it('gives up on something that is not a date', () => {
    expect(parseWhen('later')).toBeNull()
    expect(parseWhen('')).toBeNull()
  })
})

describe('units across a whole file', () => {
  it('converts a file written entirely in pounds', () => {
    const p = parse(csv(['Date,Exercise,Weight (lbs),Reps', '2026-01-12,Bench Press,100,5']), { unit: 'kg' })
    expect(p.fileUnit).toBe('lb')
    expect(p.converted).toBe(true)
    expect(p.workouts[0].entries[0].sets[0].w).toBe(45.4)
  })

  it('converts per row when one file mixes kg and lb', () => {
    // FitNotes writes the unit next to every set; taking such a file over as-is used to
    // turn "100 lb" into 100 kg.
    const p = parse(csv([
      'Date,Exercise,Weight,Weight Unit,Reps',
      '2026-01-12,Bench Press,100,lb,5',
      '2026-01-12,Bench Press,100,kg,5',
    ]), { unit: 'kg' })
    expect(p.mixedUnits).toBe(true)
    expect(p.converted).toBe(true)
    expect(p.workouts[0].entries[0].sets.map(s => s.w)).toEqual([45.4, 100])
  })

  it('leaves a file alone when it already speaks the profile unit', () => {
    const p = parse(csv(['Date,Exercise,Weight (kg),Reps', '2026-01-12,Bench Press,100,5']), { unit: 'kg' })
    expect(p.converted).toBe(false)
    expect(p.workouts[0].entries[0].sets[0].w).toBe(100)
  })
})

describe('an exercise the dataset does not have', () => {
  it('is created once, with the body part the file states', () => {
    const p = parse(csv([
      'Date,Exercise,Category,Weight,Reps',
      '2026-01-12,Some Machine Thing,chest,40,12',
      '2026-01-13,Some Machine Thing,chest,45,10',
    ]))
    expect(p.created).toBe(1)
    expect(p.customEx).toHaveLength(1)
    expect(p.customEx[0]).toMatchObject({ custom: true, bp: 'chest', eq: 'custom' })
    expect(p.unmatchedNames).toEqual(['Some Machine Thing'])
    // counting rows there made three exercises read as five: matched counts lifts, not rows
    expect(p.matched).toBe(0)
    // and matchedSets counts the rows that landed on a library lift, so none of these
    expect(p.matchedSets).toBe(0)
    expect(p.sets).toBe(2)
  })

  it('counts the distinct library lifts a file used, not the rows behind them', () => {
    const p = parse(csv([
      'Date,Exercise,Weight (kg),Reps',
      '2026-01-12,Bench Press (Barbell),60,10',
      '2026-01-12,Bench Press (Barbell),70,8',
      '2026-01-12,Squat (Barbell),100,5',
      '2026-01-13,Bench Press (Barbell),70,8',
    ]))
    expect(p.matched).toBe(2)
    expect(p.matchedSets).toBe(4)
    expect(p.sets).toBe(4)
    expect(p.workouts).toHaveLength(2)
    expect(p.from).toBe('2026-01-12')
    expect(p.to).toBe('2026-01-13')
  })
})

describe('body weight from Apple Health', () => {
  const HEALTH = `<?xml version="1.0"?><HealthData locale="en_GB">
<Record type="HKQuantityTypeIdentifierBodyMass" sourceName="Watch" unit="kg" creationDate="2026-01-12 07:30:00 +0000" startDate="2026-01-12 07:30:00 +0000" endDate="2026-01-12 07:30:00 +0000" value="82.5"/>
<Record type="HKQuantityTypeIdentifierStepCount" startDate="2026-01-12 07:30:00 +0000" value="900"/>
<Record type="HKQuantityTypeIdentifierBodyMass" unit="kg" startDate="2026-01-13 07:35:00 +0000" value="82.1"/>
</HealthData>`

  it('pulls the weigh-ins out of the XML and ignores the step counts', () => {
    const p = parseBodyweight(HEALTH, { unit: 'kg' })
    expect(p.kind).toBe('bodyweight')
    expect(p.source).toBe('Apple Health')
    expect(p.bodyweight.map(b => [b.d, b.w])).toEqual([['2026-01-12', 82.5], ['2026-01-13', 82.1]])
    expect(p.converted).toBe(false)
  })

  it('converts a Health file written in pounds', () => {
    const p = parseBodyweight(
      '<Record type="HKQuantityTypeIdentifierBodyMass" unit="lb" startDate="2026-01-12 07:30:00 +0000" value="180"/>',
      { unit: 'kg' })
    expect(p.fileUnit).toBe('lb')
    expect(p.converted).toBe(true)
    expect(p.bodyweight[0].w).toBe(81.6)
  })

  it('keeps the last weigh-in of a day, not the first', () => {
    const p = parseBodyweight([
      'Date,Weight (kg)',
      '2026-01-12 07:00,82.9',
      '2026-01-12 20:00,82.0',
    ].join('\n'), { unit: 'kg' })
    expect(p.bodyweight).toEqual([{ d: '2026-01-12', w: 82, t: expect.any(Number) }])
  })

  it('refuses a file with no weight column', () => {
    expect(parseBodyweight('Date,Exercise,Reps\n2026-01-12,Bench Press,10').error).toBe('unrecognised')
    expect(parseBodyweight('just one line').error).toBe('empty')
  })
})

describe('sniffing a dropped file', () => {
  it('reads Health XML, a workout export and a weight-only CSV for what they are', () => {
    expect(parseImport('<Record type="HKQuantityTypeIdentifierBodyMass" unit="kg" startDate="2026-01-12 07:30:00 +0000" value="82"/>').kind)
      .toBe('bodyweight')
    expect(parseImport(csv(['Date,Exercise,Weight (kg),Reps', '2026-01-12,Bench Press,60,10'])).kind)
      .toBe('workouts')
    expect(parseImport('Date,Weight (kg)\n2026-01-12,82.5').kind).toBe('bodyweight')
  })

  it('reports a file it cannot read at all', () => {
    expect(parseImport('nonsense\nmore nonsense').error).toBe('unrecognised')
  })
})

describe('merging an import into the state', () => {
  const empty = () => ({ workouts: [], bodyweight: [], customEx: [], exWeights: {} })

  it('imports twice without duplicating a day, and seeds the weight suggestions', () => {
    const parsed = parse(csv([
      'Date,Exercise,Weight (kg),Reps',
      '2026-01-12,Bench Press (Barbell),60,10',
      '2026-01-13,Squat (Barbell),100,5',
    ]), { unit: 'kg' })

    const S = empty()
    expect(mergeImport(S, parsed)).toEqual({ added: 2, skipped: 0 })
    expect(S.workouts.map(w => w.d)).toEqual(['2026-01-12', '2026-01-13'])
    expect(S.exWeights['0025']).toEqual({ w: 60, d: '2026-01-12' })
    expect(S.exWeights['0043']).toEqual({ w: 100, d: '2026-01-13' })

    // A day already in the log wins: re-importing a file never rewrites history.
    expect(mergeImport(S, parsed)).toEqual({ added: 0, skipped: 2 })
    expect(S.workouts).toHaveLength(2)
  })

  it('merges weigh-ins by date and keeps only the customs the file actually used', () => {
    const parsed = parse(csv([
      'Date,Exercise,Category,Weight (kg),Reps',
      '2026-01-12,Some Machine Thing,chest,40,12',
    ]), { unit: 'kg' })
    const S = empty()
    S.bodyweight = [{ d: '2026-01-11', w: 83, t: 0 }]

    expect(mergeImport(S, parseBodyweight('Date,Weight (kg)\n2026-01-11,83\n2026-01-12,82.5'))).toEqual({ added: 1, skipped: 1 })
    expect(S.bodyweight.map(b => b.d)).toEqual(['2026-01-11', '2026-01-12'])

    mergeImport(S, parsed)
    expect(S.customEx).toHaveLength(1)
    expect(S.customEx[0].bp).toBe('chest')
  })
})
