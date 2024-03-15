import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "@lingui/macro";
import { X } from "@phosphor-icons/react";
import { defaultProject, projectSchema } from "@reactive-resume/schema";
import {
  Badge,
  BadgeInput,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  RichInput,
} from "@reactive-resume/ui";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AiActions } from "@/client/components/ai-actions";

import { SectionDialog } from "../sections/shared/section-dialog";
import { URLInput } from "../sections/shared/url-input";

const formSchema = projectSchema;

type FormValues = z.infer<typeof formSchema>;

export const ProjectsDialog = () => {
  const form = useForm<FormValues>({
    defaultValues: defaultProject,
    resolver: zodResolver(formSchema),
  });

  const [pendingKeyword, setPendingKeyword] = useState("");

  return (
    <SectionDialog<FormValues>
      id="projects"
      form={form}
      defaultValues={defaultProject}
      pendingKeyword={pendingKeyword}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t`Name`}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="size"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t`Team size`}</FormLabel>
              <FormControl>
                <Input {...field} type="number" onChange={(e) => field.onChange(parseInt(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="date"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t`Date or Date Range`}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={t`March 2023 - Present`} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="responsibilities"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t`Responsibilities`}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={t`Senior Developer, Team Leader...`} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="programmingLanguage"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t`Programming Languages`}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={t`C#, VBA, JavaScript...`} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="tools"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t`Tools`}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={t`Visual Studio, NetBeans, JIRA...`} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />


        <FormField
          name="platform"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t`Platform, server and database`}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={t`Windows, Java EE, MySQL...`} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="technologies"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t`Used technologies`}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={t`WinForms, NAnt, CCNet...`} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="summary"
          control={form.control}
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel>{t`Summary`}</FormLabel>
              <FormControl>
                <RichInput
                  {...field}
                  content={field.value}
                  onChange={(value) => field.onChange(value)}
                  footer={(editor) => (
                    <AiActions value={editor.getText()} onChange={editor.commands.setContent} />
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

      </div>
    </SectionDialog>
  );
};
