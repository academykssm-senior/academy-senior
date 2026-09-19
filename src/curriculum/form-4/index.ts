import { additionalMathematics } from "@/curriculum/form-4/additional-mathematics";
import { bahasaMelayu } from "@/curriculum/form-4/bahasa-melayu";
import { biology } from "@/curriculum/form-4/biology";
import { chemistry } from "@/curriculum/form-4/chemistry";
import { english } from "@/curriculum/form-4/english";
import { mathematics } from "@/curriculum/form-4/mathematics";
import { physics } from "@/curriculum/form-4/physics";
import { sejarah } from "@/curriculum/form-4/sejarah";
import type { SubjectManifest } from "@/types/curriculum";

/**
 * Form 4 subject registry in display order.
 * Form 5 will use the same SubjectManifest shape later.
 */
export const FORM_4_SUBJECTS: readonly SubjectManifest[] = [
  bahasaMelayu,
  english,
  mathematics,
  additionalMathematics,
  sejarah,
  biology,
  chemistry,
  physics,
];
