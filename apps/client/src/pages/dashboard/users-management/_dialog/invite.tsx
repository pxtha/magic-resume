import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "@lingui/macro";
import { Plus } from "@phosphor-icons/react";
import { GroupDataDto, inviteGroupSchema } from "@reactive-resume/dto";
import {
  Button,
  Combobox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input
} from "@reactive-resume/ui";
import { cn } from "@reactive-resume/utils";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useInviteGroup } from "@/client/services/group/invite";
import { useDialog } from "@/client/stores/dialog";

const formSchema = inviteGroupSchema;

type FormValues = z.infer<typeof formSchema>;

export const InviteDialog = () => {
  const { isOpen, payload, close } = useDialog<GroupDataDto[]>("invite");

  const { inviteGroup, loading: inviteLoading } = useInviteGroup();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      groupId: "",
      email: ""
    },
  });

  useEffect(() => {
    if (isOpen) onReset();
  }, [isOpen, payload]);

  const onSubmit = async (values: FormValues) => {
    // if (!user?.userPlus) return;

    await inviteGroup({ groupId: values.groupId, email: values.email });

    close();
  };

  const onReset = () => {
    form.reset({ groupId: "", email: "" });
  };

  if (!payload) return <></>

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
                    Invite memeber into your group
                  </h2>
                </div>
              </DialogTitle>
              <DialogDescription>
                {t`Start building your group by adding member.`}
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <FormField
                name="groupId"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t`Groups`}</FormLabel>
                    <div className="w-full">
                      <Combobox
                        {...field}
                        value={field.value}
                        onValueChange={field.onChange}
                        options={payload.item?.map(v => ({ label: v.group.name, value: v.groupId })) ?? []}
                      />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t`Find member`}</FormLabel>
                    <FormControl>
                      <Input placeholder="john.doe@example.com" {...field} />
                    </FormControl>
                    <FormDescription>{t`You can also enter your username.`}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Form >
            <DialogFooter>
              <div className="flex items-center justify-end w-full">
                <Button
                  type="submit"
                  disabled={inviteLoading}
                  className={cn("rounded-r-none")}
                >
                  {t`Invite`}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent >
    </Dialog >
  );
};
