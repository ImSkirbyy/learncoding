import { Course, CourseId, Lesson, Unit } from '../types';
import { python } from './python';
import { javascript } from './javascript';
import { luau } from './luau';
import { java } from './java';
import { cpp } from './cpp';
import { arduino } from './arduino';
import { japanese, kana } from './japanese';

export const courses: Course[] = [python, javascript, luau, java, cpp, arduino, japanese, kana];

export const isLanguage = (c: Course) => c.kind === 'language';

export function getCourse(id: CourseId): Course {
  return courses.find((c) => c.id === id) ?? python;
}

export interface LessonRef {
  course: Course;
  unit: Unit;
  unitIndex: number;
  lesson: Lesson;
  /** Position im gesamten Kurs. */
  index: number;
}

export function flatLessons(course: Course): LessonRef[] {
  const out: LessonRef[] = [];
  course.units.forEach((unit, unitIndex) =>
    unit.lessons.forEach((lesson) => out.push({ course, unit, unitIndex, lesson, index: out.length })),
  );
  return out;
}

export function findLesson(lessonId: string): LessonRef | undefined {
  for (const c of courses) {
    const hit = flatLessons(c).find((l) => l.lesson.id === lessonId);
    if (hit) return hit;
  }
  return undefined;
}
