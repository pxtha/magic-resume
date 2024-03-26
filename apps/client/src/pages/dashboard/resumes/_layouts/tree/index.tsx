import { sortByDate } from "@reactive-resume/utils";
import { AnimatePresence, motion } from "framer-motion";

import { useResumes } from "@/client/services/resume";

import { useGroups } from "@/client/services/group/groups";
import { BaseListItem } from "../list/_components/base-item";
import { CreateGroupListItem } from "../list/_components/create-group";
import { CreateResumeListItem } from "../list/_components/create-item";
import { GroupListItem } from "../list/_components/group-item";
import { ImportResumeListItem } from "../list/_components/import-item";
import { ResumeListItem } from "../list/_components/resume-item";
import { Separator } from "@reactive-resume/ui";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import get from "lodash.get"
import { GroupDataDto } from "@reactive-resume/dto";
export const TreeView = () => {
    const params = useParams()["*"]?.split("/") ?? [];
    const lastId = params[params.length - 1];
    const firstId = params[0];

    const { groups, loading: groupLoading } = useGroups();
    const { resumes, loading: resumeLoading, refetch } = useResumes(lastId);
    const groupFilter = groups?.filter(v => v.groupId === firstId);

    const subGroup = get(groupFilter, "0.children", []) as GroupDataDto[]

    useEffect(() => {
        refetch();
    }, [lastId])

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


            {subGroup && (
                <AnimatePresence>
                    <Separator className="opacity-50" />

                    {subGroup
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
