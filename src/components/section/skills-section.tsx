/* eslint-disable @next/next/no-img-element */
import BlurFade from "@/components/magicui/blur-fade";
import { getSkillIcon } from "@/lib/skill-icons";
import type { SkillItem } from "@/lib/types";

const BLUR_FADE_DELAY = 0.04;

// Groups keep the order in which they first appear in the (ordered) list.
// Skills without a group sit together without a heading.
function groupSkills(skills: SkillItem[]) {
  const groups = new Map<string, SkillItem[]>();
  for (const skill of skills) {
    const list = groups.get(skill.group);
    if (list) {
      list.push(skill);
    } else {
      groups.set(skill.group, [skill]);
    }
  }
  return [...groups];
}

export default function SkillsSection({ skills }: { skills: SkillItem[] }) {
  const grouped = groupSkills(skills);

  return (
    <div className="flex min-h-0 flex-col gap-y-4">
      <BlurFade delay={BLUR_FADE_DELAY * 9}>
        <h2 className="text-xl font-bold">Skills</h2>
      </BlurFade>
      <div className="flex flex-col gap-5">
        {grouped.map(([group, items], groupIndex) => {
          const before = grouped
            .slice(0, groupIndex)
            .reduce((total, [, earlier]) => total + earlier.length, 0);
          return (
            <div key={group || "ungrouped"} className="flex flex-col gap-2">
              {group && (
                <BlurFade delay={BLUR_FADE_DELAY * 10 + before * 0.05}>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {group}
                  </h3>
                </BlurFade>
              )}
              <div className="flex flex-wrap gap-2">
                {items.map((skill, index) => {
                  const Icon = getSkillIcon(skill.icon);
                  return (
                    <BlurFade
                      key={skill.id}
                      delay={BLUR_FADE_DELAY * 10 + (before + index) * 0.05}
                    >
                      <div className="border bg-background border-border ring-2 ring-border/20 rounded-xl h-8 w-fit px-4 flex items-center gap-2">
                        {Icon ? (
                          <Icon className="size-4 rounded overflow-hidden object-contain" />
                        ) : skill.iconUrl ? (
                          <img
                            src={skill.iconUrl}
                            alt=""
                            className="size-4 rounded overflow-hidden object-contain"
                          />
                        ) : null}
                        <span className="text-foreground text-sm font-medium">
                          {skill.name}
                        </span>
                      </div>
                    </BlurFade>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
