import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "@lingui/macro";
import { cmcSkillSchema, cmcSubSkillSchema, defaultCmcSkill, defaultSkill, defaultSubCmcSkill, skillSchema } from "@reactive-resume/schema";
import {
  Badge,
  BadgeInput,
  Button,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Label,
  Slider,
} from "@reactive-resume/ui";
import { AnimatePresence, motion } from "framer-motion";
import React, { InputHTMLAttributes, useCallback, useEffect, useMemo, useState } from "react";
import { ControllerRenderProps, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { X, PlusCircle } from "@phosphor-icons/react";

import { SectionDialog } from "../sections/shared/section-dialog";

const formSchema = cmcSkillSchema;

type FormValues = z.infer<typeof formSchema>;

export const CmcSkillsDialog = () => {
  const form = useForm<FormValues>({
    defaultValues: defaultCmcSkill,
    resolver: zodResolver(formSchema),
  });

  const [pendingKeyword, setPendingKeyword] = useState("");
  const [pendingLevelKeyword, setPendingLevelKeyword] = useState("");

  const onBlur = (event: React.FocusEvent<HTMLInputElement>, fieldValue: ControllerRenderProps<FormValues, "levelOfKeywords">, index: number) => {
    const { value } = event.target
    fieldValue.value[index] = value
    fieldValue.onChange([...fieldValue.value])
  }
  return (
    <SectionDialog<FormValues>
      id="cmcSkills"
      form={form}
      defaultValues={defaultCmcSkill}
      pendingKeyword={pendingKeyword}
    >
      <FormField
        name="name"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t`Group skill`}</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />


      <FormField
        name="keywords"
        control={form.control}
        render={({ field }) => (
          <div className="space-y-3 sm:col-span-2">
            <FormItem>
              <FormLabel>{t`Skill`}</FormLabel>
              <FormControl>
                <BadgeInput {...field} setPendingKeyword={setPendingKeyword} />
              </FormControl>
              <FormDescription>
                {t`You can add multiple skill by pressing enter and set level for them`}
              </FormDescription>
              <FormMessage />
            </FormItem>


            <FormField
              name="levelOfKeywords"
              control={form.control}
              render={({ field: fieldLevel }) => (
                <div className="space-y-3 sm:col-span-2">
                  {field.value.map((item, index) => {
                    return <div className="grid grid-cols-12 gap-4 items-center" key={item}>
                      <Label className="col-span-3 border p-3">{item}</Label>
                      <div className="col-span-8">
                        <BadgeInput {...fieldLevel} setPendingKeyword={setPendingLevelKeyword} index={index} onBlur={(e) => onBlur(e, fieldLevel, index)} />
                      </div>
                      <X size={12} weight="bold"
                        onClick={() => {
                          field.onChange(field.value.filter((v) => item !== v));

                          const tmp = fieldLevel.value.slice(0, index).concat(fieldLevel.value.slice(index + 1))
                          fieldLevel.onChange(tmp);
                          setPendingLevelKeyword("");
                        }} />
                    </div>
                  })}
                </div>
              )}
            />
          </div>
        )}
      />
    </SectionDialog >
  );
};
