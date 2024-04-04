import { useUserInGroup } from "@/client/services/group/manage-user";
import { t } from "@lingui/macro";
import {
    ScrollArea
} from "@reactive-resume/ui";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { InviteUser } from "./_components/invite-user";
import { SectionListUser } from "./_components/section-list-user";

export const UsersManagementPage = () => {
    return (
        <>
            <Helmet>
                <title>
                    {t`Users Management`}
                </title>
            </Helmet>

            <div className="space-y-4">
                <motion.h1
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-4xl font-bold tracking-tight"
                >
                    {t`Users Management`}
                </motion.h1>

                <ScrollArea hideScrollbar className="h-[calc(100vh-140px)] lg:h-[calc(100vh-88px)]">
                    <div className="space-y-6">
                        <InviteUser />
                        <SectionListUser />
                    </div>
                </ScrollArea>
            </div>
        </>
    );
};
