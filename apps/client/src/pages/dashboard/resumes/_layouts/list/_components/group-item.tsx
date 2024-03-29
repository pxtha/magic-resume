import { t } from "@lingui/macro";
import {
  DotsThreeVertical,
  Folder,
  FolderOpen,
  PencilSimple,
  TrashSimple
} from "@phosphor-icons/react";
import { GroupDto } from "@reactive-resume/dto";
import {
  Button,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  HoverCard,
  HoverCardTrigger
} from "@reactive-resume/ui";
import dayjs from "dayjs";
import { useLocation, useNavigate } from "react-router-dom";

import { useDialog } from "@/client/stores/dialog";

import { BaseListItem } from "./base-item";

type Props = {
  group: GroupDto;
};

export const GroupListItem = ({ group }: Props) => {
  const navigate = useNavigate();
  const pathname = useLocation().pathname;
  const { open } = useDialog<GroupDto>("group");

  const lastUpdated = dayjs().to(group.updatedAt);

  const onOpen = () => {
    const pathName = `${pathname}/${group.id}`
    navigate({
      pathname: pathName
    })
  };

  const onUpdate = () => {
    open("update", { id: "group", item: group });
  };

  const onDelete = () => {
    open("delete", { id: "group", item: group });
  };

  const dropdownMenu = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="aspect-square">
        <Button size="icon" variant="ghost">
          <DotsThreeVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={(event) => {
            event.stopPropagation();
            onOpen();
          }}
        >
          <FolderOpen size={14} className="mr-2" />
          {t`Open`}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(event) => {
            event.stopPropagation();
            onUpdate();
          }}
        >
          <PencilSimple size={14} className="mr-2" />
          {t`Rename`}
        </DropdownMenuItem>
        <ContextMenuSeparator />
        <DropdownMenuItem
          className="text-error"
          onClick={(event) => {
            event.stopPropagation();
            onDelete();
          }}
        >
          <TrashSimple size={14} className="mr-2" />
          {t`Delete`}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <ContextMenu>
      <ContextMenuTrigger className="even:bg-secondary/20">
        <HoverCard>
          <HoverCardTrigger>
            <BaseListItem
              onClick={onOpen}
              className="group"
              start={<Folder />}
              title={group.name}
              description={t`Last updated ${lastUpdated}`}
              end={dropdownMenu}
            />
          </HoverCardTrigger>
        </HoverCard>
      </ContextMenuTrigger>

      <ContextMenuContent>
        <ContextMenuItem onClick={onOpen}>
          <FolderOpen size={14} className="mr-2" />
          {t`Open`}
        </ContextMenuItem>
        <ContextMenuItem onClick={onUpdate}>
          <PencilSimple size={14} className="mr-2" />
          {t`Rename`}
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={onDelete} className="text-error">
          <TrashSimple size={14} className="mr-2" />
          {t`Delete`}
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
