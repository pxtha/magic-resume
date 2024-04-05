import { t } from "@lingui/macro";
import { Plus } from "@phosphor-icons/react";
import { GroupDto } from "@reactive-resume/dto";
import { KeyboardShortcut } from "@reactive-resume/ui";

import { useDialog } from "@/client/stores/dialog";

import { BaseListItem } from "./base-item";

export const CreateGroupListItem = () => {
  const { open } = useDialog<GroupDto>("group");

  return (
    <BaseListItem
      start={<Plus size={18} />}
      onClick={() => open("create")}
      title={
        <>
          <span>{t`Create a new group`}</span>
          {/* eslint-disable-next-line lingui/no-unlocalized-strings */}
          <KeyboardShortcut className="ml-2">^M</KeyboardShortcut>
        </>
      }
      description={t`Start building from scratch`}
    />
  );
};
