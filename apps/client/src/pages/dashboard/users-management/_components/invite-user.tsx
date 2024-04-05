import { t } from "@lingui/macro";
import { Plus } from "@phosphor-icons/react";
import { GroupDataDto } from "@reactive-resume/dto";
import { KeyboardShortcut } from "@reactive-resume/ui";

import { useDialog } from "@/client/stores/dialog";

import { useAllGroups } from "@/client/services/group/groups";
import { BaseListItem } from "./base-item";

export const InviteUser = () => {
  const { open } = useDialog<GroupDataDto[]>("invite");
  const { groups } = useAllGroups();

  return (
    <BaseListItem
      start={<Plus size={18} />}
      onClick={() => open("create", { id: "invite", item: groups })}
      title={
        <>
          <span>{t`Invite user to group`}</span>
          {/* eslint-disable-next-line lingui/no-unlocalized-strings */}
          <KeyboardShortcut className="ml-2">^V</KeyboardShortcut>
        </>
      }
      description={t`Start building a group`}
    />
  );
};
