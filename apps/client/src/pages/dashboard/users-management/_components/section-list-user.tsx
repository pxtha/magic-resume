import { useInviteGroup } from "@/client/services/group/invite";
import { useUserInGroup } from "@/client/services/group/manage-user";
import { Trash } from "@phosphor-icons/react";
import { IColumnType, Table, buttonVariants } from "@reactive-resume/ui";
import { cn } from "@reactive-resume/utils";

interface IData {
    email: string;
    name: string;
    joinedAt: string;
    id: string
}

export const SectionListUser = () => {
    const { inviteGroup: removeUserInGroup } = useInviteGroup();
    const { users } = useUserInGroup();

    const onRemove = async (email: string, groupId: string) => {
        await removeUserInGroup({
            email,
            groupId
        })
    }

    const columns: IColumnType<IData>[] = [
        {
            key: "email",
            title: "Email",
            width: 200,
        },
        {
            key: "name",
            title: "Group name",
            width: 200,
        },
        {
            key: "joinedAt",
            title: "Joined date",
            width: 200,
        },
        {
            key: "action",
            title: "Action",
            width: 200,
            render: (_, item) => (
                <button onClick={() => onRemove(item.email, item.id)} className={cn(buttonVariants({ size: "icon", variant: "ghost", className: "transform-none" }))}><Trash /></button>
            ),
        },
    ];


    return <Table data={users} columns={columns} />;
}