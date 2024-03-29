import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "@lingui/macro";
import { MagicWand, Plus } from "@phosphor-icons/react";
import { GroupDto, createGroupSchema } from "@reactive-resume/dto";
import { idSchema } from "@reactive-resume/schema";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Tooltip
} from "@reactive-resume/ui";
import { cn, generateRandomName } from "@reactive-resume/utils";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useCreateGroup, useDeleteGroup, useUpdateGroup } from "@/client/services/group";
import { useUser } from "@/client/services/user";
import { useDialog } from "@/client/stores/dialog";
import { useLocation, useNavigate } from "react-router-dom";

const formSchema = createGroupSchema.extend({ id: idSchema.optional() });

type FormValues = z.infer<typeof formSchema>;

export const GroupDialog = () => {
  const { isOpen, mode, payload, close } = useDialog<GroupDto>("group");
  const { user } = useUser();
  const { pathname } = useLocation();
  const groupId = pathname.split("/").reverse()[0];
  const navigate = useNavigate();

  const isCreate = mode === "create";
  const isUpdate = mode === "update";
  const isDelete = mode === "delete";

  const { createGroup, loading: createLoading } = useCreateGroup();
  const { updateGroup, loading: updateLoading } = useUpdateGroup();
  const { deleteGroup, loading: deleteLoading } = useDeleteGroup();

  const loading = createLoading || updateLoading || deleteLoading;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", parentGroup: null },
  });

  useEffect(() => {
    if (isOpen) onReset();
  }, [isOpen, payload]);

  const callback = () => navigate(pathname, { replace: true });

  const onSubmit = async (values: FormValues) => {
    if (!user?.userPlus) return;

    if (isCreate) {
      await createGroup({ name: values.name, parentGroup: groupId === "all" ? null : groupId });
    }

    if (isUpdate) {
      if (!payload.item?.id) return;

      await updateGroup({
        ...payload.item,
        name: values.name,
      });
    }

    if (isDelete) {
      if (!payload.item?.id) return;

      await deleteGroup({ id: payload.item?.id });
    }

    callback();
    close();
  };

  const onReset = () => {
    if (isCreate) form.reset({ name: "" });
    if (isUpdate)
      form.reset({ id: payload.item?.id, name: payload.item?.name, parentGroup: payload.item?.parentGroup });
    if (isDelete)
      form.reset({ id: payload.item?.id, name: payload.item?.name, parentGroup: payload.item?.parentGroup });
  };

  const onGenerateRandomName = () => {
    const name = generateRandomName();
    form.setValue("name", name);
  };

  if (isDelete) {
    return (
      <AlertDialog open={isOpen} onOpenChange={close}>
        <AlertDialogContent>
          <Form {...form}>
            <form>
              <AlertDialogHeader>
                <AlertDialogTitle>{t`Are you sure you want to delete your group?`}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t`This action cannot be undone. This will permanently delete your group and cannot be recovered.`}
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>{t`Cancel`}</AlertDialogCancel>
                <AlertDialogAction variant="error" onClick={form.handleSubmit(onSubmit)}>
                  {t`Delete`}
                </AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>
                <div className="flex items-center space-x-2.5">
                  <Plus />
                  <h2>
                    {isCreate && t`Create a new group`}
                    {isUpdate && t`Update an existing group`}
                  </h2>
                </div>
              </DialogTitle>
              <DialogDescription>
                {isCreate && t`Start building your group by giving it a name.`}
                {isUpdate && t`Changed your mind about the name? Give it a new one.`}
              </DialogDescription>
            </DialogHeader>

            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t`Name`}</FormLabel>
                  <FormControl>
                    <div className="flex items-center justify-between gap-x-2">
                      <Input {...field} className="flex-1" />

                      {(isCreate) && (
                        <Tooltip content={t`Generate a random name for your group`}>
                          <Button
                            size="icon"
                            type="button"
                            variant="outline"
                            onClick={onGenerateRandomName}
                          >
                            <MagicWand />
                          </Button>
                        </Tooltip>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <div className="flex items-center justify-between w-full">
                <DialogDescription className="font-bold">
                  {!user?.userPlus && t`You must be plus member to create group`}
                </DialogDescription>
                <Button
                  type="submit"
                  disabled={loading}
                  className={cn(isCreate && "rounded-r-none")}
                >
                  {isCreate && t`Create`}
                  {isUpdate && t`Save Changes`}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
