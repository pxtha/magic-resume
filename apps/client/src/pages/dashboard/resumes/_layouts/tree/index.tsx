import { sortByDate } from "@reactive-resume/utils";
import { AnimatePresence, motion } from "framer-motion";
import { t } from "@lingui/macro";

import { GroupDataDto, ResumeDto } from "@reactive-resume/dto";
import { Separator } from "@reactive-resume/ui";
import { useLoaderData, useParams } from "react-router-dom";
import { CreateGroupListItem } from "../list/_components/create-group";
import { CreateResumeListItem } from "../list/_components/create-item";
import { GroupListItem } from "../list/_components/group-item";
import { ImportResumeListItem } from "../list/_components/import-item";
import { ResumeListItem } from "../list/_components/resume-item";
import { Breadcrums } from "../list/_components/breadcrums";
import { Breadcrum } from "@/client/router/loaders/group";

type LoaderDataTreeView = {
    resumes: ResumeDto[],
    groups: GroupDataDto[],
    breadcrum: Breadcrum[]
}

export const TreeView = () => {
    const loaderData = useLoaderData() as LoaderDataTreeView;
    const { groups, resumes, breadcrum } = loaderData

    return (
        <div className="grid gap-y-2">
            <Breadcrums breadcrums={breadcrum} />
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

            {resumes.length > 0 && (
                <>
                    <Separator className="opacity-50" />
                    <div className="font-bold text-base">
                        {t`Resumes`}
                    </div>
                    <AnimatePresence>
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
                </>
            )}

            {groups.length > 0 && (
                <>
                    <Separator className="opacity-50" />
                    <div className="font-bold text-base">
                        {t`Groups`}
                    </div>
                    <AnimatePresence>
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
                </>
            )}
        </div>
    );
};
