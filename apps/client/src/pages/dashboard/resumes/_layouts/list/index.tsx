import { sortByDate } from "@reactive-resume/utils";
import { AnimatePresence, motion } from "framer-motion";

import { useResumes } from "@/client/services/resume";

import { BaseListItem } from "./_components/base-item";
import { CreateResumeListItem } from "./_components/create-item";
import { ImportResumeListItem } from "./_components/import-item";
import { ResumeListItem } from "./_components/resume-item";
import { CreateGroupListItem } from "./_components/create-group";
import { useGroups } from "@/client/services/group/groups";
import { GroupListItem } from "./_components/group-item";
import { Separator } from "@reactive-resume/ui";
import { useEffect } from "react";

export const ListView = () => {
  const { groups, loading: groupLoading } = useGroups();
  const { resumes, loading: resumeLoading, refetch } = useResumes();


  useEffect(() => { refetch() }, [])
  
  return (
    <div className="grid gap-y-2">
      <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }}>
        <CreateGroupListItem />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }}>
        <CreateResumeListItem />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
      >
        <ImportResumeListItem />
      </motion.div>

      {(resumeLoading || groupLoading) &&
        [...Array(4)].map((_, i) => (
          <div
            key={i}
            className="duration-300 animate-in fade-in"
            style={{ animationFillMode: "backwards", animationDelay: `${i * 300}ms` }}
          >
            <BaseListItem className="bg-secondary/40" />
          </div>
        ))}

      {resumes && (
        <AnimatePresence>
          <Separator className="opacity-50" />
          {resumes
            .sort((a, b) => sortByDate(a, b, "updatedAt"))
            .map((resume, index) => (
              <motion.div
                key={resume.id}
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0, transition: { delay: (index + 2) * 0.1 } }}
                exit={{ opacity: 0, filter: "blur(8px)", transition: { duration: 0.5 } }}
              >
                <ResumeListItem resume={resume} />
              </motion.div>
            ))}
        </AnimatePresence>
      )}

      {groups && (
        <AnimatePresence>
          <Separator className="opacity-50" />
          {groups
            .sort((a, b) => sortByDate(a, b, "updatedAt"))
            .map((value, index) => (
              <motion.div
                key={value.groupId}
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0, transition: { delay: (index + 2) * 0.1 } }}
                exit={{ opacity: 0, filter: "blur(8px)", transition: { duration: 0.5 } }}
              >
                <GroupListItem group={value.group} />
              </motion.div>
            ))}
        </AnimatePresence>
      )}
    </div>
  );
};
